const reportController = require("../controllers/report-controller");
const Report = require("../models/Report");
const Supplier = require("../models/Supplier");
const User = require("../models/User");

jest.mock("../models/Report");
jest.mock("../models/Supplier");
jest.mock("../models/User");

describe("reportController.createReport", () => {
    test("should return 400 if required fields are missing", async () => {
        const req = {
            body: {
                title: "Kugellager",
                description: "Testbeschreibung",
                status: "OK",
                supplierId: "supplier123",
            },
            files: [{ filename: "image1.jpg" }],
            _id: "report1234",
            user: {
                id: "user123",
            },
        };

        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };

        User.findById.mockResolvedValue({
            _id: "user123",
            title: "Max Mustermann",
            email: "max.mustermann@example.com",
        });

        Supplier.findById.mockResolvedValue({
            _id: "supplier123",
            title: "Musterlieferant",
        });

        Report.create.mockResolvedValue({
            _id: "report1234",
            title: "Kugellager",
            description: "Testbeschreibung",
            supplierId: "supplier123",
            status: "OK",
            images: ["/uploads/reports/report1234/images/image1.jpg"],
            createdByUserId: "user123",
            createdByName: "Max Mustermann",
            createdByEmail: "max.mustermann@example.com",
        });

        await reportController.createReport(req, res);

        expect(User.findById).toHaveBeenCalledWith("user123");
        expect(Supplier.findById).toHaveBeenCalledWith("supplier123");
        expect(Report.create).toHaveBeenCalledWith();
        expect(res.status).toHaveBeenCalledWith(201);
        expect(res.json).toHaveBeenCalledWith();
    });
});
