const express = require("express");
const router = express();

//routes
router.use("/api/users", require("./UserRoutes"));

module.exports = router;
