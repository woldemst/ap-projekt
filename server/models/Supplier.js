const mongoose = require("mongoose");

const supplierShema = new mongoose.Schema({
    title: { type: String },
    contactMail: { type: String },
    phone: { type: String },
    createdAt: { type: String },
    isActive: { type: Boolean },
});

module.exports = mongoose.model("Supplier", supplierShema);
