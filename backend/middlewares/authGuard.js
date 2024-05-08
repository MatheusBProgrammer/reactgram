// Importa o modelo de usuário
const User = require("../models/User");

// Importa a biblioteca jwt para autenticação
const jwt = require("jsonwebtoken");

// Obtém a chave secreta JWT do ambiente
const jwtSecret = process.env.JWT_CODE;

// Middleware de autenticação do token e definição do req.user
const authGuard = async (req, res, next) => {
  // Obtém o cabeçalho de autorização da requisição
  const authHeader = req.headers["authorization"];

  // Extrai o token do cabeçalho de autorização
  const token = authHeader && authHeader.split(" ")[1]; // separa o token em duas parte e pega a segunda

  // Verifica se o token existe
  if (!token) return res.status(401).json({ errors: "Acesso negado" });

  // Verifica se o token é válido
  try {
    // Verifica o token usando a chave secreta
    const verified = jwt.verify(token, jwtSecret);

    // Busca o usuário pelo ID contido no token e exclui a senha do resultado
    //define req.user
    req.user = await User.findById(verified.id).select("-password");

    // Chama o próximo middleware na cadeia
    console.log(req.user);
    next();
  } catch (e) {
    // Retorna um erro caso o token seja inválido
    res.status(401).json({ errors: "Token inválido" });
  }
};

// Exporta o middleware de guarda de autenticação
module.exports = authGuard;
