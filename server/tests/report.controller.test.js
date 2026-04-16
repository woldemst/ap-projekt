const reportController = require("../controllers/report-controller");

describe("reportController.createReport", () => {
    test("should return 400 if required fields are missing", async () => {
        const req = {
            body: {
                title: "",
                status: "",
                supplierId: "",
            },
            files: [],
            user: { id: "user123" },
            _id: "report123",
        };

        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };

        await reportController.createReport(req, res);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({
            error: "title, status und supplierId sind erforderlich",
        });
    });
});
