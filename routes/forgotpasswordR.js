const express = require("express");
const forgotpasswordController = require("../controller/forgotpaswordC");
const userAuthentication = require("../middlewares/authentication");

const router = express.Router();


router.post(
  "/password/forgotpassword",
  forgotpasswordController.forgotPassword
);
router.get(
  "/password/resetpassword/:UUID",
  forgotpasswordController.resetPassword
);
router.get("/password/update/:UUID", forgotpasswordController.updatePassword);

module.exports = router;
