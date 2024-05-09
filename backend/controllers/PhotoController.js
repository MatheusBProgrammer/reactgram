const Photo = require("../models/Photo");
const mongoose = require("mongoose");
const User = require("../models/User");
const fs = require("fs");
const path = require("path");

// Função para inserir uma nova foto no banco de dados
const insertPhoto = async (req, res) => {
  try {
    const { title } = req.body;
    const image = req.file.filename;

    const reqUser = req.user;
    const user = await User.findById(reqUser._id);

    if (!user) {
      return res.status(404).json({ error: "Usuário não encontrado" });
    }

    const newPhoto = await Photo.create({
      image,
      title,
      userId: user._id,
      userName: user.name,
    });

    res.status(200).json({ newPhoto });
  } catch (error) {
    res
      .status(500)
      .json({ error: "Erro ao inserir a foto", details: error.message });
  }
};

// Função para remover uma foto do banco de dados e do sistema de arquivos
const deletePhoto = async (req, res) => {
  try {
    const { id } = req.params;
    const reqUser = req.user;

    const photo = await Photo.findById(id);

    if (!photo) {
      return res.status(404).json({ errors: "Foto não encontrada" });
    }

    if (!photo.userId.equals(reqUser._id)) {
      return res
        .status(403)
        .json({ errors: "Você não tem permissão para excluir esta foto" });
    }

    await Photo.findByIdAndDelete(photo._id);

    const filePath = path.join(
      __dirname,
      "..",
      "uploads",
      "photos",
      photo.image
    );

    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    return res.status(200).json({ message: "Foto excluída com sucesso" });
  } catch (error) {
    res
      .status(500)
      .json({ error: "Erro ao excluir a foto", details: error.message });
  }
};

// Função para obter todas as fotos
const getAllPhotos = async (req, res) => {
  try {
    const photos = await Photo.find({})
      .sort([["createdAt", -1]])
      .exec();
    res.status(200).json(photos);
  } catch (error) {
    res
      .status(500)
      .json({ error: "Erro ao obter as fotos", details: error.message });
  }
};

// Função para obter todas as fotos de um usuário específico
const getUserPhotos = async (req, res) => {
  try {
    const { id } = req.params;
    const photos = await Photo.find({ userId: id })
      .sort([["createdAt", -1]])
      .exec();
    res.status(200).json(photos);
  } catch (error) {
    res.status(500).json({
      error: "Erro ao obter as fotos do usuário",
      details: error.message,
    });
  }
};

// Função para obter uma foto pelo seu ID
const getPhotoById = async (req, res) => {
  try {
    const { id } = req.params;
    const photo = await Photo.findById(id);
    if (!photo) {
      return res.status(404).json({ errors: "Foto não encontrada" });
    }
    res.status(200).json(photo);
  } catch (error) {
    res
      .status(500)
      .json({ error: "Erro ao obter a foto", details: error.message });
  }
};

const updatePhoto = async (req, res) => {
  const { id } = req.params;
  const { title } = req.body;

  const reqUser = req.user;

  const photo = await Photo.findById(id);

  //check if photo exists
  if (!photo) {
    res.status(404).json({
      errors: "Ocorreu um erro, por favor tente novamente mais tarde",
    });
    return;
  }
  //check if photo belongs to current user
  if (!photo.userId.equals(reqUser._id)) {
    res.status(422).json({
      errors: ["Ocorreu um erro, por favor tente novamente mais tarde"],
    });
  }

  if (!title) {
    res.status(404).json({ errors: ["Ocorreu um erro"] });
  }

  photo.title = title;

  await photo.save();

  res.status(200).json({ photo, message: "Foto atualizada com sucesso" });
};

const likePhoto = async (req, res) => {
  const { id } = req.params;

  const reqUser = req.user;

  const photo = await Photo.findById(id);
  //check if photo belongs to current user
  if (!photo) {
    res.status(422).json({
      errors: ["Foto não encontrada"],
    });
    return;
  }

  //check if user already liked the photo
  if (photo.likes.includes(reqUser._id)) {
    res.status(422).json({ errors: ["A foto já foi curtida pelo usuário "] });
    return;
  }

  // Put user id in likesArray

  photo.likes.push(reqUser._id);
  photo.save();
  res
    .statur(200)
    .json({ photoId: id, userId: reqUser._id, message: "A foto foi curtida" });
};
module.exports = {
  insertPhoto,
  deletePhoto,
  getAllPhotos,
  getUserPhotos,
  getPhotoById,
  updatePhoto,
  likePhoto,
};
