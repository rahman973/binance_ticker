var express = require("express");
var router = express.Router();

router.use("/auth", require("./Auth"));
router.use("/health", require("./Health"));
module.exports = router;
