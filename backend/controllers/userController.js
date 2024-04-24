//imports
const User = require("../models/User");
const bycrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const jwtSecret = process.env.JWT_CODE;

//token generete
const genereteToken = ({ id }) => {
  return jwt.sign({ id }, jwtSecret, { expiresIn: "7d" });
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
      token: genereteToken(user._id),
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
    token: genereteToken(user._id),
  });
};
module.exports = {
  register,
  login,
};
