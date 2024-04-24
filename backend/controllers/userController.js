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

  try {
    const user = await User.create({
      name,
      email,
      password,
      profileImage,
      bio,
    });
    return res.json(user);
  } catch (e) {
    return res.json(e);
  }
};
module.exports = {
  register,
};
