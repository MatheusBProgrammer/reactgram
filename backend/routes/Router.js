const express = require("express");
const router = express();

//home
router.get("/", (req, res) => {
  res.send("Sucessful");
});

//routes
router.use("/api/users", require("./UserRoutes"));

module.exports = router;
