const mongoose = require("mongoose");

const reportShema = new mongoose.Schema({
    title: { type: String },
    description: { type: String },
    status: { type: String },
    supplierId: { type: mongoose.Schema.Types.ObjectId },
    images: { type: [String], default: [] },
    createdAt: { type: String },
});

module.exports = mongoose.model("Report", reportShema);
