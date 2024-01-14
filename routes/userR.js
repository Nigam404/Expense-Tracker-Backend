const express = require("express");
const userController = require("../controller/userC");
const userAuthentication = require("../middlewares/authentication");

const router = express.Router();

router.get("/getuser", userAuthentication.authenticate,userController.getUser);
router.post(
  "/update-total-expense",
  userAuthentication.authenticate,
  userController.updateTotalExpense
);

router.post(
  "/subtract-total-expense",
  userAuthentication.authenticate,
  userController.subtractTotalExpense
);

module.exports = router;
