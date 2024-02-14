import dotenv from "dotenv";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { PrismaClient } from "@prisma/client";
import { hashPassword, comparePasswords } from "../services/utils.js";
import cookie from "cookie";
import {
  validateRegistration,
  validateLogin,
} from "../Middlewares/authMiddleware.js";
const prisma = new PrismaClient();
dotenv.config();
const JWT_SECRET = process.env.JWT_SECRET;

const register = [
  validateRegistration, // Use the validation middleware
  async (req, res) => {
    const { username, password } = req.body;
    const hashedPassword = await hashPassword(password);
    try {
      const user = await prisma.user.create({
        data: {
          username,
          password: hashedPassword,
        },
      });
      res.status(201).json({ user });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
];

const login = [
  validateLogin, // Use the validation middleware
  async (req, res) => {
    try {
      const { username, password } = req.body;
      const user = await prisma.user.findUnique({
        where: {
          username,
        },
      });
      if (!user) {
        return res.status(404).json({ error: "User does not exist" });
      }
      const validPassword = await comparePasswords(password, user.password);
      if (!validPassword) {
        return res.status(400).json({ error: "Invalid Password" });
      }
      const token = jwt.sign({ id: user.id }, JWT_SECRET);
      res.cookie("token", token, {
        httpOnly: true,
      });
      res.status(200).json({ user, token });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
];

export { register, login };
