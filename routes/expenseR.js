const express = require("express");
const expenseController = require("../controller/expenseC");
const userAuthentication = require("../middlewares/authentication");

const router = express.Router();
router.get(
  "/getExp",
  userAuthentication.authenticate,
  expenseController.getExpense
);
router.post(
  "/postExp",
  userAuthentication.authenticate,
  expenseController.postExpense
);
router.delete("/deleteExp/:expId", expenseController.deleteExpense);

module.exports = router;
