const User = require("../models/User.js");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const authController = require("../controllers/auth-controller");

jest.mock("../models/User.js");
jest.mock("bcryptjs");
jest.mock("jsonwebtoken");

function createRes() {
    return {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
    };
}

describe("authController.login", () => {
    beforeEach(() => {
        jest.clearAllMocks();
        process.env.SECRET_KEY = "test-secret";
    });

    it("gibt 400 zurück wenn user nicht gefunden", async () => {
        const req = { body: { email: "a@a.de", password: "123456" } };
        const res = createRes();

        User.findOne.mockResolvedValue(null);

        await authController.login(req, res);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ message: "Ungültige Zugansdaten" });
    });

    it("gibt 400 zurück wenn passwort falsch ist", async () => {
        const req = { body: { email: "a@a.de", password: "falsch" } };
        const res = createRes();

        User.findOne.mockResolvedValue({ email: "a@a.de", password: "hashed" });
        bcrypt.compare.mockResolvedValue(false);

        await authController.login(req, res);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ message: "Ungültige Zugansdaten" });
    });

    it("gibt token und user zurück wenn login erfolgreich ist", async () => {
        const req = { body: { email: "a@a.de", password: "richtig" } };
        const res = createRes();
        const user = {
            _id: "u1",
            name: "Max",
            email: "a@a.de",
            role: "employee",
            password: "hashed",
        };

        User.findOne.mockResolvedValue(user);
        bcrypt.compare.mockResolvedValue(true);
        jwt.sign.mockReturnValue("mock-token");

        await authController.login(req, res);

        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({
            token: "mock-token",
            user: {
                _id: "u1",
                name: "Max",
                email: "a@a.de",
                role: "employee",
            },
            message: "Logged in successfully",
        });
    });
});
