const multer = require("multer");
const path = require("path");

// Configuração de armazenamento de imagens usando o multer.diskStorage
const imageStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Define a pasta de destino da imagem
    let folder = "";

    // Verifica se a URL da requisição inclui "users"
    if (req.baseUrl.includes("users")) {
      folder = "users"; // Se sim, define a pasta como "users"
    } else {
      folder = "photos"; // Caso contrário, define como "photos"
    }

    // Chama o callback (cb) com o caminho da pasta de destino
    cb(null, `uploads/${folder}`);
  },
  filename: (req, file, cb) => {
    // Define o nome do arquivo
    // Gera um nome único para o arquivo usando a data atual e a extensão original do arquivo
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

// Configuração do middleware multer para upload de imagens
const imageUpload = multer({
  storage: imageStorage, // Define o armazenamento de imagens
  fileFilter: (req, file, cb) => {
    // Filtra os arquivos
    // Verifica se a extensão do arquivo corresponde a png ou jpg
    if (!file.originalname.match(/\.(png|jpg)$/)) {
      // Se não corresponder, retorna um erro
      return cb(
        new Error("Por favor, envie apenas fotos nos formatos JPG ou PNG")
      );
    }
    // Caso contrário, prossegue com o upload
    cb(null, true);
  },
});

module.exports = imageUpload; // Exporta o middleware de upload de imagem
