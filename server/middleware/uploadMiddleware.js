const path = require("path");
const fs = require("fs");
const multer = require("multer");

const reportImageDir = path.join(__dirname, "../uploads/reports/images");

if (!fs.existsSync(reportImageDir)) {
    fs.mkdirSync(reportImageDir, { recursive: true });
}

const storage = multer.diskStorage({
    destination: (_req, _file, cb) => {
        cb(null, reportImageDir);
    },

    filename: (_req, file, cb) => {
        const originalExtension = path.extname(file.originalname || "").toLowerCase();
        const extension = originalExtension || ".jpg";

        cb(null, `report_${Date.now()}_${Math.round(Math.random() * 1_000_000)}${extension}`);
    },
});

exports.uploadReportImages = multer({ storage }).array("images", 5);
