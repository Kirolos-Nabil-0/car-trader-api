import { PrismaClient } from "@prisma/client";
import { authenticateUser } from "../Middlewares/authMiddleware.js";
import {
  validateCreateCar,
  validateUpdateCar,
} from "../Middlewares/CarMiddlewares.js";
import multer from "multer";
import path from "path";

const prisma = new PrismaClient();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "../server/src/uploads/"); // Update the path accordingly
  },
  filename: (req, file, cb) => {
    const fileExtension = path.extname(file.originalname);
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + "-" + uniqueSuffix + fileExtension);
  },
});

const upload = multer({ storage });

const createOneCar = [
  authenticateUser,
  upload.single("image"),
  async (req, res) => {
    try {
      const { name, makeId, regionId, userId, description, price } = req.body;

      const image = await prisma.image.create({
        data: {
          url: req.file.filename,
        },
      });

      const car = await prisma.car.create({
        data: {
          name,
          user: { connect: { id: userId } },
          region: { connect: { id: regionId } },
          make: { connect: { id: makeId } },
          image: { connect: { id: image.id } },
          description,
          price: parseInt(price),
        },
      });

      res.status(201).json({ car });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
];

const getAllCars = async (req, res) => {
  try {
    const cars = await prisma.car.findMany({
      include: {
        make: true,
        region: true,
        image: true,
      },
    });

    const carsWithImageUrl = cars.map((car) => ({
      ...car,
      imageUrl: car.image ? `/uploads/${car.image.url}` : null,
    }));

    res.json({ cars: carsWithImageUrl });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getOneCar = async (req, res) => {
  const { id } = req.params;
  try {
    const car = await prisma.car.findUnique({
      where: {
        id: String(id),
      },
      include: {
        make: true,
        region: true,
        image: true,
      },
    });

    if (!car) {
      return res.status(404).json({ error: "Car not found" });
    }

    const carWithImageUrl = {
      ...car,
      imageUrl: car.image ? `/uploads/${car.image.url}` : null,
    };

    res.json({ car: carWithImageUrl });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updateOneCar = [
  authenticateUser,
  async (req, res) => {
    const { id } = req.params;
    console.log(req.body);
    const { name, image, makeId, regionId, price, description } = req.body;
    console.log(req.body);
    try {
      let data = {
        name,
        makeId,
        regionId,
        price: parseInt(price),
        description,
      };

      if (image) {
        data.img = Buffer.from(image, "base64");
      }

      const car = await prisma.car.update({
        where: { id: String(id) },
        data,
      });

      res.json({ car });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
];

const deleteOneCar = [
  async (req, res) => {
    const { id } = req.params;
    try {
      const car = await prisma.car.delete({
        where: { id: String(id) },
      });
      res.json({ car });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
];

const getCarsByRegion = async (req, res) => {
  const { regionId } = req.params;
  try {
    const cars = await prisma.car.findMany({
      where: { regionId: regionId },
      include: {
        make: true,
        region: true,
        image: true,
      },
    });

    const carsWithImageUrl = cars.map((car) => ({
      ...car,
      imageUrl: car.image ? `/uploads/${car.image.url}` : null,
    }));

    res.json({ cars: carsWithImageUrl });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getCarsByMake = async (req, res) => {
  const { makeId } = req.params;
  try {
    const cars = await prisma.car.findMany({
      where: { makeId: makeId },
      include: {
        make: true,
        region: true,
        image: true,
      },
    });

    const carsWithImageUrl = cars.map((car) => ({
      ...car,
      imageUrl: car.image ? `/uploads/${car.image.url}` : null,
    }));

    res.json({ cars: carsWithImageUrl });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getCarsByRegionAndMake = async (req, res) => {
  const { regionId, makeId } = req.params;
  try {
    const cars = await prisma.car.findMany({
      where: { regionId: regionId, makeId: makeId },
    });
    res.json({ cars });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export {
  createOneCar,
  getAllCars,
  getOneCar,
  updateOneCar,
  deleteOneCar,
  getCarsByRegion,
  getCarsByMake,
  getCarsByRegionAndMake,
};
