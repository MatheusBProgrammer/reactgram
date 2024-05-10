const Photo = require("../models/Photo"); // Importa o modelo de Photo
const mongoose = require("mongoose"); // Importa o mongoose
const User = require("../models/User"); // Importa o modelo de User
const fs = require("fs"); // Importa o módulo fs (file system) para manipulação de arquivos
const path = require("path"); // Importa o módulo path para manipulação de caminhos de arquivos

// Função para inserir uma nova foto no banco de dados
const insertPhoto = async (req, res) => {
  try {
    const { title } = req.body; // Extrai o título da requisição
    const image = req.file.filename; // Extrai o nome do arquivo da requisição

    const reqUser = req.user; // Extrai o usuário da requisição
    const user = await User.findById(reqUser._id); // Busca o usuário no banco de dados

    if (!user) {
      // Verifica se o usuário existe
      return res.status(404).json({ error: "Usuário não encontrado" });
    }

    // Cria uma nova foto no banco de dados
    const newPhoto = await Photo.create({
      image,
      title,
      userId: user._id,
      userName: user.name,
    });

    res.status(200).json({ newPhoto }); // Retorna a nova foto criada
  } catch (error) {
    res
      .status(500)
      .json({ error: "Erro ao inserir a foto", details: error.message }); // Retorna um erro em caso de falha
  }
};

// Função para remover uma foto do banco de dados e do sistema de arquivos
const deletePhoto = async (req, res) => {
  try {
    const { id } = req.params; // Extrai o ID da foto da requisição
    const reqUser = req.user; // Extrai o usuário da requisição

    const photo = await Photo.findById(id); // Busca a foto no banco de dados

    if (!photo) {
      // Verifica se a foto existe
      return res.status(404).json({ errors: "Foto não encontrada" });
    }

    if (!photo.userId.equals(reqUser._id)) {
      // Verifica se o usuário é o dono da foto
      return res
        .status(403)
        .json({ errors: "Você não tem permissão para excluir esta foto" });
    }

    await Photo.findByIdAndDelete(photo._id); // Deleta a foto do banco de dados

    const filePath = path.join(
      __dirname,
      "..",
      "uploads",
      "photos",
      photo.image
    ); // Caminho do arquivo no sistema de arquivos

    if (fs.existsSync(filePath)) {
      // Verifica se o arquivo existe
      fs.unlinkSync(filePath); // Deleta o arquivo
    }

    return res.status(200).json({ message: "Foto excluída com sucesso" }); // Retorna sucesso
  } catch (error) {
    res
      .status(500)
      .json({ error: "Erro ao excluir a foto", details: error.message }); // Retorna um erro em caso de falha
  }
};

// Função para obter todas as fotos
const getAllPhotos = async (req, res) => {
  try {
    const photos = await Photo.find({}) // Busca todas as fotos no banco de dados
      .sort([["createdAt", -1]]) // Ordena pela data de criação, decrescente
      .exec();
    res.status(200).json(photos); // Retorna as fotos encontradas
  } catch (error) {
    res
      .status(500)
      .json({ error: "Erro ao obter as fotos", details: error.message }); // Retorna um erro em caso de falha
  }
};

// Função para obter todas as fotos de um usuário específico
const getUserPhotos = async (req, res) => {
  try {
    const { id } = req.params; // Extrai o ID do usuário da requisição
    const photos = await Photo.find({ userId: id }) // Busca todas as fotos do usuário no banco de dados
      .sort([["createdAt", -1]]) // Ordena pela data de criação, decrescente
      .exec();
    res.status(200).json(photos); // Retorna as fotos encontradas
  } catch (error) {
    res.status(500).json({
      error: "Erro ao obter as fotos do usuário",
      details: error.message,
    }); // Retorna um erro em caso de falha
  }
};

// Função para obter uma foto pelo seu ID
const getPhotoById = async (req, res) => {
  try {
    const { id } = req.params; // Extrai o ID da foto da requisição
    const photo = await Photo.findById(id); // Busca a foto no banco de dados
    if (!photo) {
      // Verifica se a foto existe
      return res.status(404).json({ errors: "Foto não encontrada" });
    }
    res.status(200).json(photo); // Retorna a foto encontrada
  } catch (error) {
    res
      .status(500)
      .json({ error: "Erro ao obter a foto", details: error.message }); // Retorna um erro em caso de falha
  }
};

// Função para atualizar o título de uma foto
const updatePhoto = async (req, res) => {
  const { id } = req.params; // Extrai o ID da foto da requisição
  const { title } = req.body; // Extrai o título atualizado da requisição

  const reqUser = req.user; // Extrai o usuário da requisição

  const photo = await Photo.findById(id); // Busca a foto no banco de dados

  // Verifica se a foto existe
  if (!photo) {
    res.status(404).json({
      errors: "Ocorreu um erro, por favor tente novamente mais tarde",
    });
    return;
  }

  // Verifica se a foto pertence ao usuário
  if (!photo.userId.equals(reqUser._id)) {
    res.status(422).json({
      errors: ["Ocorreu um erro, por favor tente novamente mais tarde"],
    });
  }

  // Verifica se foi fornecido um novo título
  if (!title) {
    res.status(404).json({ errors: ["Ocorreu um erro"] });
  }

  // Atualiza o título da foto
  photo.title = title;

  await photo.save(); // Salva a foto atualizada no banco de dados

  res.status(200).json({ photo, message: "Foto atualizada com sucesso" }); // Retorna sucesso
};

// Função para curtir uma foto
const likePhoto = async (req, res) => {
  const { id } = req.params; // Extrai o ID da foto da requisição

  const reqUser = req.user; // Extrai o usuário da requisição

  const photo = await Photo.findById(id); // Busca a foto no banco de dados

  // Verifica se a foto existe
  if (!photo) {
    res.status(422).json({
      errors: ["Foto não encontrada"],
    });
    return;
  }

  // Verifica se o usuário já curtiu a foto
  if (photo.likes.includes(reqUser._id)) {
    res.status(422).json({ errors: ["A foto já foi curtida pelo usuário "] });
    return;
  }

  // Adiciona o ID do usuário ao array de likes
  photo.likes.push(reqUser._id);
  photo.save(); // Salva a foto no banco de dados

  res
    .status(200)
    .json({ photoId: id, userId: reqUser._id, message: "A foto foi curtida" }); // Retorna sucesso
};

// Função para descurtir uma foto
const unlike = async (req, res) => {
  const { id } = req.params; // Extrai o ID da foto da requisição

  const reqUser = req.user; // Extrai o usuário da requisição

  const photo = await Photo.findById(id); // Busca a foto no banco de dados

  // Verifica se a foto existe
  if (!photo) {
    res.status(422).json({
      errors: ["Foto não encontrada"],
    });
    return;
  }

  // Verifica se o usuário já curtiu a foto
  if (!photo.likes.includes(reqUser._id)) {
    res.status(422).json({ errors: ["O usuário não curtiu esta foto"] });
    return;
  }

  const index = photo.likes.indexOf(reqUser._id);
  if (index !== -1) {
    photo.likes.splice(index, 1); // Remove o ID do usuário do array de likes
    await photo.save(); // Salva a foto no banco de dados
    res.status(200).json({
      photoId: id,
      userId: reqUser._id,
      message: "A foto foi descurtida",
    }); // Retorna sucesso
    return;
  } else {
    res.status(404).json({ errors: ["Não foi possível realizar a operação"] }); // Retorna um erro em caso de falha
  }
};

// Função para adicionar um comentário a uma foto
const commentPhoto = async (req, res) => {
  const { id } = req.params; // Extrai o ID da foto da requisição
  const { comment } = req.body; // Extrai o comentário da requisição

  const reqUser = req.user; // Extrai o usuário da requisição

  const user = await User.findById(reqUser._id); // Busca o usuário no banco de dados

  const photo = await Photo.findById(id); // Busca a foto no banco de dados

  if (!photo) {
    // Verifica se a foto existe
    res.status(422).json({ errors: ["Foto não encontrada"] });
    return;
  }

  if (!comment) {
    // Verifica se o comentário foi fornecido
    res.status(422).json({ errors: ["Comentário não definido"] });
    return;
  }

  // Cria o objeto do comentário
  const userComment = {
    comment,
    userName: user.name,
    userImage: user.profileImage,
    userId: user._id,
  };

  // Adiciona o comentário ao array de comentários da foto
  await photo.comments.push(userComment);
  await photo.save(); // Salva a foto no banco de dados

  res.status(200).json({
    comment: userComment,
    message: "O comentário foi adicionado com sucesso",
  }); // Retorna sucesso
};

// Função para pesquisar fotos por título
const searchPhotos = async (req, res) => {
  const { q } = req.query; // Extrai o termo de pesquisa da requisição
  const photos = await Photo.find({ title: new RegExp(q, "i") }).exec(); // Busca fotos cujo título corresponda ao termo de pesquisa

  return res.status(200).json({ photos }); // Retorna as fotos encontradas
};

// Exporta todas as funções para serem utilizadas em outros arquivos
module.exports = {
  insertPhoto,
  deletePhoto,
  getAllPhotos,
  getUserPhotos,
  getPhotoById,
  updatePhoto,
  likePhoto,
  unlike,
  commentPhoto,
  searchPhotos,
};
