const express = require("express");
const router = express.Router();

// Importando os controllers
const {
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
} = require("../controllers/PhotoController");

// Importando os middlewares de validação
const { photoInsertValidation } = require("../middlewares/photoValidation");
const authGuard = require("../middlewares/authGuard"); // Middleware para validação de tokens
const validate = require("../middlewares/handleValidation");
const imageUpload = require("../middlewares/imageUpload");

// Rotas

// Rota para inserir uma nova foto
router.post(
  "/",
  authGuard, // Middleware para verificar autenticação (validação de token)
  imageUpload.single("image"), // Middleware para upload de imagens na pasta
  photoInsertValidation(), // Middleware para validar os campos necessários para a inserção de fotos
  validate, // Middleware para exibição de array de erros
  insertPhoto // Função do controller para inserir fotos
);

// Rota para obter todas as fotos
router.get("/", authGuard, getAllPhotos);

// Rota para pesquisar fotos por título
router.get("/search", searchPhotos);

// Rota para obter todas as fotos de um usuário específico
router.get("/user/:id", authGuard, getUserPhotos);

// Rota para obter uma foto pelo seu ID
router.get("/:id", authGuard, getPhotoById);

// Rota para atualizar o título de uma foto do usuário
router.put("/:id", authGuard, updatePhoto);

// Rota para curtir uma foto
router.put("/like/:id", authGuard, likePhoto);

// Rota para descurtir uma foto
router.put("/dislike/:id", authGuard, unlike);

// Rota para adicionar um comentário a uma foto
router.put("/comment/:id", authGuard, commentPhoto);

// Rota para deletar uma foto pelo seu ID
router.delete("/:id", authGuard, deletePhoto);

module.exports = router;
