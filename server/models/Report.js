const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const reportSchema = new mongoose.Schema({
    title: { type: String, required: true, trim: true },
    description: { type: String, default: "" },
    status: { type: String, enum: ["OK", "DEFECT"], required: true },
    supplierId: { type: Schema.Types.ObjectId, ref: "Supplier", required: true },
    images: { type: [String], default: [] },
    createdByUserId: { type: Schema.Types.ObjectId, ref: "User" },
    createdByName: { type: String, default: "" },
    createdByEmail: { type: String, default: "" },
    updateNotes: { type: String, default: "" },
    updatedByEmail: { type: String, default: "" },
    createdAt: { type: String, default: () => new Date().toISOString() },
});

module.exports = mongoose.model("Report", reportSchema);
