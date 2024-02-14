import { PrismaClient } from "@prisma/client";
import { validationResult, body, param } from "express-validator";
import { authenticateUser, isAdmin } from "./authMiddleware.js";

const prisma = new PrismaClient();

const validateCreateCar = [
  body("name").notEmpty().withMessage("Name is required"),
  body("img").notEmpty().withMessage("Image URL is required"),
  body("makeId").notEmpty().withMessage("Make ID is required"),
  body("regionId").notEmpty().withMessage("Region ID is required"),
  async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];

const validateUpdateCar = [
  param("id").isInt().withMessage("Invalid Car ID"),
  body("name").notEmpty().withMessage("Name is required"),
  body("img").notEmpty().withMessage("Image URL is required"),
  body("makeId").notEmpty().withMessage("Make ID is required"),
  body("regionId").notEmpty().withMessage("Region ID is required"),
  async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];

export { validateCreateCar, validateUpdateCar };
