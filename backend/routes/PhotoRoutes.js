const express = require("express");
const router = express.Router();

//controllers
const { insertPhoto, deletePhoto } = require("../controllers/PhotoController");
//middlewares
const { photoInsertValidation } = require("../middlewares/photoValidation");
const authGuard = require("../middlewares/authGuard"); //validação de tokens
const validate = require("../middlewares/handleValidation");
const imageUpload = require("../middlewares/imageUpload");
//routes

router.post(
  "/",
  authGuard, //checagem de token e definição do req.user
  imageUpload.single("image"), //multer para upload de imagens na pasta
  photoInsertValidation(), //validações dos campos necessários
  validate, //exibição do array de erros
  insertPhoto //função para inserção de fotos
);

router.delete("/:id", authGuard, deletePhoto);
module.exports = router;
