const Report = require("../models/Report");

exports.createReport = async (req, res) => {
    try {
        const { title, description, status } = req.body;
        const { supplierId } = req.params;

        const report = await Report.create({
            title,
            description,
            status: !status ? "OK" : "DEFECT",
            supplierId,
            createdAt: new Date(),
        });

        return res.json(report);
    } catch (err) {
        console.error(`Could not create a report ${err.message}`);
        return res.status(500).json({ error: `Could not create a report ${err.message}` });
    }
};
