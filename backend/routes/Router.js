/*
Este arquivo define as rotas principais da aplicação, agrupando as rotas relacionadas aos usuários e às fotos.
*/

const express = require("express");
const router = express();

// Rotas relacionadas aos usuários
router.use("/api/users", require("./UserRoutes"));

// Rotas relacionadas às fotos
router.use("/api/photos", require("./PhotoRoutes"));

module.exports = router;
