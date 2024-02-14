import { Router } from "express";
import { PrismaClient } from "@prisma/client";
import { authenticateUser } from "../Middlewares/authMiddleware.js";
import { register, login } from "../controllers/auth.js";
import {
  CreateOneRegion,
  GetAllRegions,
  GetOneRegion,
  UpdateOneRegion,
  DeleteOneRegion,
} from "../controllers/RegionControllers.js";
import {
  createOneMake,
  getAllMakes,
  getOneMake,
  updateOneMake,
  deleteOneMake,
} from "../controllers/makeControllers.js";
import {
  createOneCar,
  getAllCars,
  getOneCar,
  updateOneCar,
  deleteOneCar,
  getCarsByRegion,
  getCarsByMake,
  getCarsByRegionAndMake,
} from "../controllers/carControllers.js";
import {
  SendMessage,
  GetMessagesBySenderId,
  DeleteMessage,
  UpdateMessageContent,
} from "../controllers/messageControllers.js";

const router = Router();
const prisma = new PrismaClient();

// Auth routes
router.post("/register", register);
router.post("/login", login);
router.get("/me", authenticateUser, (req, res) => {
  let cookieValue = req.cookies.token;
  res.json({ message: "You are authenticated", cookieValue, user: req.user });
});
router.get("/logout", (req, res) => {
  req.user = null;
  res.clearCookie("token").json({ message: "Logged out" });
});
router.get("/users", async (req, res) => {
  const users = await prisma.user.findMany();
  res.json({ users });
});

// Region routes
router.post("/regions", CreateOneRegion);
router.get("/regions", GetAllRegions);
router.get("/regions/:id", GetOneRegion);
router.put("/regions/:id", UpdateOneRegion);
router.delete("/regions/:id", DeleteOneRegion);

// Make routes
router.post("/makes", createOneMake);
router.get("/makes", getAllMakes);
router.get("/makes/:id", getOneMake);
router.put("/makes/:id", updateOneMake);
router.delete("/makes/:id", deleteOneMake);

// Car routes
router.post("/cars", createOneCar);
router.get("/cars", getAllCars);
router.get("/cars/:id", getOneCar);
router.get("/cars/region/:regionId", getCarsByRegion);
router.get("/cars/make/:makeId", getCarsByMake);
router.get("/cars/region/:regionId/make/:makeId", getCarsByRegionAndMake);
router.get("/cars/user/:userId", async (req, res) => {
  const { userId } = req.params;
  const cars = await prisma.car.findMany({
    where: {
      userId: userId,
    },
  });
  res.status(200).json({ cars });
});
router.patch("/cars/:id", updateOneCar);
router.delete("/cars/:id", deleteOneCar);
router.delete("/cars/", async (req, res) => {
  const cars = await prisma.car.deleteMany();
  res.json({ cars });
});

// Message routes
router.post("/messages", SendMessage);
router.get("/messages/sender/:senderId", GetMessagesBySenderId);
router.get("/messages/car/:carId", async (req, res) => {
  const { carId } = req.params;
  const messages = await prisma.message.findMany({
    where: {
      carId: carId,
    },
  });
  res.status(200).json({ messages });
});
router.delete("/messages/:messageId", DeleteMessage);
router.put("/messages/:messageId", UpdateMessageContent);

router.get("/img/:imageId", async (req, res) => {
  const { imageId } = req.params;
  const image = await prisma.image.findUnique({
    where: {
      id: imageId,
    },
  });
  res.json({ image });
});

export default router;
