const express = require("express");
const router = express.Router();

//controllers
const { insertPhoto } = require("../controllers/PhotoController");
//middlewares
const { photoInsertValidation } = require("../middlewares/photoValidation");
const authGuard = require("../middlewares/authGuard"); //validação de tokens
const validate = require("../middlewares/handleValidation");
const imageUpload = require("../middlewares/imageUpload");
//routes

router.post(
  "/",
  authGuard,
  imageUpload.single("image"),
  photoInsertValidation(),
  validate,
  insertPhoto
);
module.exports = router;
