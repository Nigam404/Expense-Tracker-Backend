const express = require("express");
const userAuthentication = require("../middlewares/authentication");
const premiumController = require("../controller/premiumC");

const router = express.Router();

router.get("/premium/leaderboard-data", premiumController.getLeaderBoardData);
router.get(
  "/premium/download-report",
  userAuthentication.authenticate,
  premiumController.downloadReport
);
router.get(
  "/premium/get-old-links",
  userAuthentication.authenticate,
  premiumController.getOldLinks
);

module.exports = router;
