/*
Este middleware realiza a autenticação do usuário por meio de tokens JWT (JSON Web Tokens).
Quando uma requisição é feita a uma rota protegida, este middleware verifica se o token JWT é fornecido
no cabeçalho de autorização da requisição. Se o token for válido, o middleware decodifica o token, 
busca o usuário associado a ele no banco de dados e define o objeto req.user com as informações do usuário autenticado.
Caso o token seja inválido ou não fornecido, o middleware retorna uma resposta de erro.
*/

// Importações necessárias
const User = require("../models/User"); // Modelo de usuário
const jwt = require("jsonwebtoken"); // Biblioteca JWT para autenticação
const jwtSecret = process.env.JWT_CODE; // Chave secreta JWT do ambiente

// Middleware de autenticação do token e definição do req.user
const authGuard = async (req, res, next) => {
  try {
    const authHeader = req.headers["authorization"]; // Obtém o cabeçalho de autorização
    if (!authHeader) {
      // Verifica se o cabeçalho de autorização existe
      return res
        .status(401)
        .json({ errors: "Acesso negado - Token não fornecido" });
    }

    const token = authHeader.split(" ")[1]; // Extrai o token do cabeçalho de autorização
    if (!token) {
      // Verifica se o token existe
      return res
        .status(401)
        .json({ errors: "Acesso negado - Token não fornecido" });
    }

    const verified = jwt.verify(token, jwtSecret); // Verifica se o token é válido
    req.user = await User.findById(verified.id).select("-password"); // Busca o usuário pelo ID contido no token
    next(); // Chama o próximo middleware na cadeia
  } catch (error) {
    // Retorna um erro caso o token seja inválido ou ocorra qualquer erro durante a autenticação
    res.status(401).json({ errors: "Acesso negado - Token inválido" });
  }
};

module.exports = authGuard; // Exporta o middleware de guarda de autenticação
