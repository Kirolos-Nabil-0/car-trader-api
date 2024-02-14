import { PrismaClient } from "@prisma/client";
import { authenticateUser, isAdmin } from "../Middlewares/authMiddleware.js";
import {
  validateCreateRegion,
  validateUpdateRegion,
} from "../Middlewares/regionMiddlewares.js";

const prisma = new PrismaClient();

const CreateOneRegion = [
  authenticateUser,
  isAdmin,
  validateCreateRegion,

  async (req, res) => {
    const { name } = req.body;
    try {
      const make = await prisma.Region.create({
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

const GetAllRegions = async (req, res) => {
  try {
    const makes = await prisma.Region.findMany();
    res.json({ makes });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const GetOneRegion = async (req, res) => {
  const { id } = req.params;
  try {
    const make = await prisma.Region.findUnique({
      where: {
        id: String(id),
      },
    });
    res.json({ make });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const UpdateOneRegion = [
  authenticateUser,
  isAdmin,
  validateUpdateRegion,

  async (req, res) => {
    const { id } = req.params;
    const { name } = req.body;
    try {
      const make = await prisma.Region.update({
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

const DeleteOneRegion = [
  authenticateUser,
  isAdmin,
  validateUpdateRegion,

  async (req, res) => {
    const { id } = req.params;
    try {
      const make = await prisma.Region.delete({
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

export {
  CreateOneRegion,
  GetAllRegions,
  GetOneRegion,
  UpdateOneRegion,
  DeleteOneRegion,
};
