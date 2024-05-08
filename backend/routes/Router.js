const express = require("express");
const router = express();

//routes
router.use("/api/users", require("./UserRoutes"));
router.use("/api/photos", require("./PhotoRoutes"));
module.exports = router;
