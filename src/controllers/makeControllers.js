import { PrismaClient } from "@prisma/client";
import {
  validateCreateMake,
  validateUpdateMake,
} from "../Middlewares/MakeMiddlewares.js";

import { authenticateUser, isAdmin } from "../Middlewares/authMiddleware.js";
const prisma = new PrismaClient();

const createOneMake = [
  authenticateUser,
  isAdmin,
  validateCreateMake,

  async (req, res) => {
    const { name } = req.body;
    try {
      const make = await prisma.make.create({
        data: {
          name,
        },
      });
      res.status(201).json({ make });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
];

const getAllMakes = async (req, res) => {
  try {
    const makes = await prisma.make.findMany();
    res.json({ makes });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getOneMake = async (req, res) => {
  const { id } = req.params;
  try {
    const make = await prisma.make.findUnique({
      where: {
        id: String(id),
      },
    });
    res.json({ make });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updateOneMake = [
  authenticateUser,
  isAdmin,
  validateUpdateMake,

  async (req, res) => {
    const { id } = req.params;
    const { name } = req.body;
    try {
      const make = await prisma.make.update({
        where: {
          id: String(id),
        },
        data: {
          name,
        },
      });
      res.json({ make });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
];

const deleteOneMake = [
  authenticateUser,
  isAdmin,

  async (req, res) => {
    const { id } = req.params;
    try {
      const make = await prisma.make.delete({
        where: {
          id: String(id),
        },
      });
      res.json({ make });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
];

export { createOneMake, getAllMakes, getOneMake, updateOneMake, deleteOneMake };
