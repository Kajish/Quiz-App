const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const {
  signup,
  login,
  signout,
  deleteAccount,
} = require("../controllers/auth");

jest.mock("bcrypt");
jest.mock("jsonwebtoken");
jest.mock("../models/user");
jest.mock("../models/token");
jest.mock("joi");
jest.mock("../models/quiz");

describe("Auth Controller", () => {
  let req;
  let res;

  beforeEach(() => {
    req = {
      body: {},
      header: jest.fn(),
      user: { _id: "user_id" },
    };

    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("signup", () => {
    const bcrypt = require("bcrypt");
    const { signup } = require("../controllers/auth");

    jest.mock("bcrypt");

    it("should create a new user and return success message", async () => {
      req.body = {
        username: "testuser",
        email: "test@example.com",
        password: "Testpassword@1",
      };

      bcrypt.hash.mockResolvedValue("hashedPassword");
      require("../models/user").findOne.mockResolvedValue(null);
      require("../models/user").create.mockResolvedValue({});

      await signup(req, res);

      expect(bcrypt.hash).toHaveBeenCalledWith(req.body.password, 10);
      expect(require("../models/user").findOne).toHaveBeenCalledWith({
        email: req.body.email,
      });
      expect(require("../models/user").create).toHaveBeenCalledWith({
        username: req.body.username,
        email: req.body.email,
        password: "hashedPassword",
      });
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({
        message: "User created successfully",
      });
    });

    it("should return an error if required fields are missing", async () => {
      await signup(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        message: "Please enter your username, email, and password",
      });
    });

    it("should return an error if user already exists", async () => {
      req.body = {
        username: "testuser",
        email: "test@example.com",
        password: "testpassword",
      };

      require("../models/user").findOne.mockResolvedValue({});

      await signup(req, res);

      expect(res.status).toHaveBeenCalledWith(409);
      expect(res.json).toHaveBeenCalledWith({
        message: "User already exists",
      });
    });

    it("should return an error if validation fails", async () => {
      req.body = {
        username: "testuser",
        email: "test@example.com",
        password: "password",
      };

      require("joi").object.mockReturnValue({
        alphanum: jest.fn().required.mockReturnThis(),
        email: jest.fn().required.mockReturnThis(),
        password: jest.fn().required.mockReturnThis(),
        validate: jest.fn().mockReturnValue({
          error: { details: [{ message: "Validation Error" }] },
        }),
      });

      await signup(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ message: "Validation Error" });
    });

    it("should return an error if an error occurs while signing up", async () => {
      req.body = {
        username: "testuser",
        email: "test@example.com",
        password: "testpassword",
      };

      bcrypt.hash.mockRejectedValue(new Error("Hashing Error"));

      await signup(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ message: "An error occurred" });
    });
  });

  describe("login", () => {
    it("should log in a user and return the token and user details", async () => {
      req.body = {
        email: "test@example.com",
        password: "testpassword",
      };

      require("../models/user").findOne.mockResolvedValue({
        _id: "user_id",
        username: "testuser",
        email: "test@example.com",
        password: "hashedPassword",
      });
      bcrypt.compare.mockResolvedValue(true);
      jwt.sign.mockReturnValue("token");
      require("../models/quiz").findOne.mockResolvedValue({});

      await login(req, res);

      expect(require("../models/user").findOne).toHaveBeenCalledWith({
        email: req.body.email,
      });
      expect(bcrypt.compare).toHaveBeenCalledWith(
        req.body.password,
        "hashedPassword"
      );
      expect(jwt.sign).toHaveBeenCalledWith(
        { userId: "user_id" },
        process.env.JWT_SECRET,
        {
          expiresIn: "1h",
        }
      );
      expect(require("../models/quiz").findOne).toHaveBeenCalledWith({
        createdBy: "user_id",
      });
      expect(res.json).toHaveBeenCalledWith({
        username: "testuser",
        userId: "user_id",
        token: "token",
        message: "Successfully logged in for one hour",
      });
    });

    it("should return an error if required fields are missing", async () => {
      await login(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        message: "Please enter your email and password",
      });
    });

    it("should return an error if user does not exist", async () => {
      req.body = {
        email: "test@example.com",
        password: "testpassword",
      };

      require("../models/user").findOne.mockResolvedValue(null);

      await login(req, res);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({
        message: "Invalid email or password",
      });
    });

    it("should return an error if password is invalid", async () => {
      req.body = {
        email: "test@example.com",
        password: "testpassword",
      };

      require("../models/user").findOne.mockResolvedValue({
        _id: "user_id",
        username: "testuser",
        email: "test@example.com",
        password: "hashedPassword",
      });
      bcrypt.compare.mockResolvedValue(false);

      await login(req, res);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({
        message: "Invalid email or password",
      });
    });

    it("should return an error if an error occurs while logging in", async () => {
      req.body = {
        email: "test@example.com",
        password: "testpassword",
      };

      require("../models/user").findOne.mockRejectedValue(
        new Error("User Finding Error")
      );

      await login(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ message: "An error occurred" });
    });
  });

  describe("signout", () => {
    it("should sign out the user and return success message", async () => {
      req.header.mockReturnValue("Bearer token");
      jwt.verify.mockReturnValue({});

      await signout(req, res);

      expect(require("../models/token").create).toHaveBeenCalledWith({
        token: "token",
      });
      expect(res.json).toHaveBeenCalledWith({ message: "Signout successful" });
    });

    it("should return an error if an error occurs while signing out", async () => {
      req.header.mockReturnValue("Bearer token");
      jwt.verify.mockImplementation(() => {
        throw new Error("JWT Verification Error");
      });

      await signout(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        message: "An error occurred while signing out",
      });
    });
  });

  describe("deleteAccount", () => {
    it("should delete the user account and associated data", async () => {
      await deleteAccount(req, res);

      expect(require("../models/user").findByIdAndDelete).toHaveBeenCalledWith(
        "user_id"
      );
      expect(require("../models/quiz").deleteMany).toHaveBeenCalledWith({
        createdBy: "user_id",
      });
      expect(res.json).toHaveBeenCalledWith({
        message: "Account deleted successfully",
      });
    });

    it("should return an error if an error occurs while deleting the account", async () => {
      require("../models/user").findByIdAndDelete.mockRejectedValue(
        new Error("User Deletion Error")
      );

      await deleteAccount(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ message: "An error occurred" });
    });
  });
});
