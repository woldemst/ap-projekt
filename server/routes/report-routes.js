const express = require("express");

const router = express.Router();

const reportController = require("../controllers/report-controller");

router.post("/supplier/:supplierId", reportController.createReport);

module.exports = router;
