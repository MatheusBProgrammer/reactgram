const Photo = require("../models/Photo");
const mongoose = require("mongoose");
const User = require("../models/User");

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
    userId: user._id,
    userName: user.name,
  });

  if (!newPhoto) {
    return res.status(404).json({ error: "Não foi possível inserir a foto" });
  }

  res.status(200).json({ newPhoto });
};

module.exports = {
  insertPhoto,
};
