const express = require("express");

const router = express.Router();

const supplierController = require("../controllers/supplier-controller");
const requireAuth = require("../middleware/auth-middleware");

router.post("/", supplierController.createSupplier);
router.get("/", supplierController.getSuppliers);
router.get("/:id/", supplierController.getSupplierById);
router.patch("/:id/", supplierController.updateById);
router.patch("/:id/activity", supplierController.setActivity);

router.get("/:id/pdf", supplierController.generatePdfById);

module.exports = router;
