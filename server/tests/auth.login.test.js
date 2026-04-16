const User = require("../models/User.js");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const authController = require("../controllers/auth-controller");

jest.mock("../models/User.js");
jest.mock("bcryptjs");
jest.mock("jsonwebtoken");

const createRes = () => ({
    status: jest.fn().mockReturnThis(),
    json: jest.fn(),
});

describe("authController.login", () => {
    beforeEach(() => {
        jest.clearAllMocks();
        process.env.SECRET_KEY = "test-secret";
    });

    test("should return 200 and token for valid login", async () => {
        const req = {
            body: { email: "a@a.de", password: "richtig" },
        };
        const res = createRes();

        User.findOne.mockResolvedValue({
            _id: "u1",
            name: "Max",
            email: "a@a.de",
            role: "employee",
            password: "hashed",
        });

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
