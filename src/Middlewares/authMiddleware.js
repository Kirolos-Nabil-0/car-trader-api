import { validationResult, body } from "express-validator";
import jwt from "jsonwebtoken";
import { PrismaClient } from "@prisma/client";
import dotenv from "dotenv";

dotenv.config();
let JWT_SECRET = process.env.JWT_SECRET;
let prisma = new PrismaClient();

let validateRegistration = [
  body("username").notEmpty().withMessage("Username is required"),
  body("password")
    .notEmpty()
    .withMessage("Password is required")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters"),
  async (req, res, next) => {
    let errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];

let validateLogin = [
  body("username").notEmpty().withMessage("Username is required"),
  body("password").notEmpty().withMessage("Password is required"),
  async (req, res, next) => {
    let errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];

let isAdmin = (req, res, next) => {
  let user = req.user;
  console.log(user);
  if (!user || user.rule !== "admin") {
    return res.status(403).json({ error: "Forbidden - Admin access required" });
  }

  next();
};

// authMiddleware.js

let authenticateUser = async (req, res, next) => {
  try {
    let token = req.headers.authorization;

    if (!token) {
      req.user = null;
      res.status(401);
      return res.json({ error: "Unauthorized - No token provided" });
    }

    // Remove "Bearer " prefix from the token
    token = token.replace("Bearer ", "");
    console.log(token);

    const claim = jwt.verify(token, JWT_SECRET);
    const user = await prisma.user.findUnique({
      where: {
        id: claim.id,
      },
    });

    if (!user) {
      req.user = null;
      res.status(401);
      return res.json({ error: "Unauthorized - User not found" });
    }

    req.user = user;
    return next();
  } catch (error) {
    res.status(401).json({ error: error.message });
  }
};

export { validateRegistration, validateLogin, authenticateUser, isAdmin };
