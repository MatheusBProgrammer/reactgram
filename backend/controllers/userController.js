//imports
const User = require("../models/User");
const bycrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const jwtSecret = process.env.JWT_CODE;

//token generate
const generateToken = ({ id }) => {
  return jwt.sign({ id }, jwtSecret, { expiresIn: "7d" }); //{id:id}
};

const register = async (req, res) => {
  const { name, email, password, profileImage, bio } = req.body;

  const userExist = await User.findOne({ email });

  if (userExist) {
    return res.status(422).json({ msg: "Já existe um usuário com esse email" });
  }

  //Generate password hash

  const salt = await bycrypt.genSalt(); // gera uma salt
  const passwordHash = await bycrypt.hash(password, salt); // cria um hash misturando a senha com a salt criada

  //Create User
  try {
    const user = await User.create({
      name,
      email,
      password: passwordHash,
      profileImage,
      bio,
    });
    if (!user) {
      res.status(422).json({
        erros: "houve um erro, por favor tente novamente mais tarde!",
      });
      return;
    }
    res.status(201).json({
      _id: user._id,
      token: generateToken({ id: user._id }),
    });
  } catch (e) {
    return res.json(e);
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  //check if user exists
  if (!user) {
    res.status(404).json({ errors: ["Usuário não encontrado"] });
    return;
  }

  //check if user password matches
  if (!(await bycrypt.compare(password, user.password))) {
    res.status(404).json({ errors: ["Senha inválida"] });
    return;
  }

  //return user and token
  res.status(201).json({
    _id: user._id,
    profileImage: user.profileImage,
    token: generateToken({ id: user._id }),
  });
};

const getCurrentUser = async (req, res) => {
  const user = req.user;
  res.status(200).json(user);
};

const updateUser = async (req, res) => {
  const { name, password, bio } = req.body;

  let profileImage = null;

  try {
    // Verificar se há um arquivo de imagem na requisição
    if (req.file) {
      // Se sim, atribuir o nome do arquivo à variável profileImage
      profileImage = req.file.filename;
    }

    // Obter o usuário atual da requisição a partir do objeto req
    const reqUser = req.user;

    // Buscar o usuário no banco de dados pelo seu ID e excluir o campo de senha do retorno
    const user = await User.findById(reqUser._id).select("-password");

    // Verificar se foi fornecido um novo nome para o usuário
    if (name) {
      // Se sim, atualizar o nome do usuário
      user.name = name;
    }

    // Verificar se foi fornecida uma nova senha para o usuário
    if (password) {
      // Se sim, gerar um novo hash de senha utilizando bcrypt
      const salt = await bycrypt.genSalt();
      const passwordHash = await bycrypt.hash(password, salt);

      // Atualizar a senha do usuário com o novo hash
      user.password = passwordHash;
    }

    // Verificar se foi fornecida uma nova imagem de perfil para o usuário
    if (profileImage) {
      // Se sim, atualizar a imagem de perfil do usuário
      user.profileImage = profileImage;
    }

    // Verificar se foi fornecida uma nova biografia para o usuário
    if (bio) {
      // Se sim, atualizar a biografia do usuário
      user.bio = bio;
    }

    // Salvar as alterações feitas no usuário no banco de dados
    await user.save();

    // Responder à requisição com o usuário atualizado
    res.status(200).json(user);
  } catch (e) {
    // Se ocorrer um erro durante o processo, responder com um status 400 e uma mensagem de erro
    res.status(400).json({ error: e.message });
  }
};

const getUserById = async (req, res) => {
  const { id } = req.params;

  try {
    const user = await User.findById(id).select("-password");

    if (!user) {
      res.status(404).json({ errors: "Usuário não encontrado" });
      return;
    }

    res.status(200).json(user);
    return;
  } catch (e) {
    return res.status(404).json({ errors: e.message });
  }
};
module.exports = {
  register,
  login,
  getCurrentUser,
  updateUser,
  getUserById,
};
