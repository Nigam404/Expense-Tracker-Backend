const express = require("express");
const signController = require("../controller/signC");
const router = express.Router();

router.post("/signup", signController.signUp);
router.post("/login", signController.login);

module.exports = router;
