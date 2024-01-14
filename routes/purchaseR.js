const express = require("express");
const userAuthentication = require("../middlewares/authentication");
const purchaseController = require("../controller/purchaseC");
const router = express.Router();

router.get(
  "/purchase/premiummembership",
  userAuthentication.authenticate,
  purchaseController.purchasePremium
);

router.post(
  "/purchase/update-transaction-status-success",
  userAuthentication.authenticate,
  purchaseController.updateTransactionStatusSuccess
);
router.post(
  "/purchase/update-transaction-status-failed",
  userAuthentication.authenticate,
  purchaseController.updateTransactionStatusFailed
);

module.exports = router;
