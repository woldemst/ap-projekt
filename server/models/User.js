const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    name: { type: String },
    email: { type: String },
    passeord: { type: String },
    role: "admin" | "employee",
});

module.exports = mongoose.model("Report", userSchema);
