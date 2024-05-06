const express = require("express");
const router = express.Router();

//controller
const {
  register,
  login,
  getCurrentUser,
  updateUser,
} = require("../controllers/userController");

// Middlewares
const validate = require("../middlewares/handleValidation");
const {
  userCreateValidation,
  loginValidation,
  userUpdateValidation,
} = require("../middlewares/userValidations");
const authGuard = require("../middlewares/authGuard");
const imageUpload = require("../middlewares/imageUpload");

//routes
router.post(
  "/register",
  userCreateValidation(),
  validate,
  imageUpload.single("profileImage"),
  register
);
router.post("/login", loginValidation(), validate, login);
router.get("/profile", authGuard, getCurrentUser);
router.put(
  "/",
  authGuard,
  userUpdateValidation(),
  validate,
  imageUpload.single("profileImage"),
  updateUser
);

module.exports = router;
