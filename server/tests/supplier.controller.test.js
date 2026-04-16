const supplierController = require("../controllers/supplier-controller");

describe("supplierController.getSupplierById", () => {
    test("gibt 404 zurück wenn Lieferant nicht gefunden", async () => {
        const req = {
            params: { id: "69ba8ce0a5b2fd580db289d8" },
        };

        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };

        await supplierController.getSupplierById(req, res);

        expect(Supplier.findById).toHaveBeenCalledWith("69ba8ce0a5b2fd580db289d8");
        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({
            error: "Lieferant nicht gefunden",
        });
    });
});
