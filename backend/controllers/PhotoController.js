const Photo = require("../models/Photo");
const mongoose = require("mongoose");
const User = require("../models/User");
const fs = require("fs");
const path = require("path");
//Insert a Photo, with an user related to it
const insertPhoto = async (req, res) => {
  const { title } = req.body;
  //arquivo que vem modificado pelo multer
  const image = req.file.filename;

  const reqUser = req.user;
  const user = await User.findById(reqUser._id);

  const newPhoto = await Photo.create({
    image,
    title,
    userId: user._id, //define o id pelo id passado pelo reqUser
    userName: user.name, //
  });

  if (!newPhoto) {
    return res.status(404).json({ error: "Não foi possível inserir a foto" });
  }

  res.status(200).json({ newPhoto });
};

//remove photo from db
const deletePhoto = async (req, res) => {
  const { id } = req.params;
  const reqUser = req.user;

  try {
    const photo = await Photo.findById(id);

    //check if photo exists
    if (!photo) {
      res.status(404).json({ errors: "Foto não encontrada" });
      return;
    }

    //check if photo belongs to current user
    if (!photo.userId.equals(reqUser._id)) {
      res.status(402).json({ errors: "Por favor, tente novamente mais tarde" });
      return;
    }

    await Photo.findByIdAndDelete(photo._id);
    // Construct the file path
    const filePath = path.join(
      __dirname,
      "..",
      "uploads",
      "photos",
      photo.image
    );

    // Check if the file exists before attempting to delete it
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath); // Delete the file
    }
    return res
      .status(200)
      .json({ id: photo._id, message: "Foto excluida com sucesso" });
  } catch (e) {
    return res.status(404).json({ errors: e.message });
  }
};

module.exports = {
  insertPhoto,
  deletePhoto,
};
