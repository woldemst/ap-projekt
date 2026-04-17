const supplierController = require("../controllers/supplier-controller");
const Supplier = require("../models/Supplier");

jest.mock("../models/Supplier");

describe("supplierController.getSupplierById", () => {
    test("should return 404 if supplier does not exist", async () => {
        const req = {
            params: { id: "missing-id" },
        };

        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };

        Supplier.findById.mockResolvedValue(null);

        await supplierController.getSupplierById(req, res);

        expect(Supplier.findById).toHaveBeenCalledWith("missing-id");
        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({
            error: "Supplier not found",
        });
    });
});
