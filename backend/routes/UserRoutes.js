const express = require("express");
const router = express.Router();

//controller
const { register } = require("../controllers/userController");

// Middlewares
const validate = require("../middlewares/handleValidation");
const { userCreateValidation } = require("../middlewares/userValidations");
//routes
router.post("/register", userCreateValidation(), validate, register);

module.exports = router;
