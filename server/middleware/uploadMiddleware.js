const path = require("path");
const fs = require("fs");
const multer = require("multer");

const uploadRoot = path.join(__dirname, "../uploads/");
const getReportDir = (reportId) => path.join(uploadRoot, "reports", String(reportId), "images");



const storage = multer.diskStorage({
    destination: (req, _file, cb) => {
        const reportId = req._id;
        if (!reportId) return cb(new Error("Missing reportId for report upload"));
        const uploadDir = getReportDir(reportId);
        if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });
        cb(null, uploadDir);
    },

    filename: (req, file, cb) => {
        // const originalExtension = path.extname(file.originalname || "").toLowerCase();
        // const extension = originalExtension || ".jpg";

        // cb(null, `report_${Date.now()}_${Math.round(Math.random() * 1_000_000)}${extension}`);

        const reportId = req._id;
        if (!reportId) return cb(new Error("Missing reportId for report upload"));
        const ext = path.extname(file.originalname);
        const index = (req.reportImageIndex = (req.reportImageIndex || 0) + 1);
        const suffix = index === 1 ? "" : `_${index}`;
        cb(null, `report_${reportId}${suffix}${ext}`);
    },
});

const fileFilter = (_req, file, cb) => {
    const allowedMimeTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];

    if (!allowedMimeTypes.includes(file.mimeType)) {
        return cb(new Error("Nur  JPG, JPEG, PNG und WEBP sind erlaubt"));
    }

    cb(null, true);
};
exports.uploadReportImages = multer({ storage }).array("images", 5);
