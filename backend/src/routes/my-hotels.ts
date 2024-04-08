import express, { Request, Response } from "express";
import multer from "multer";
import cloudinary from "cloudinary";
import Hotel, { HotelType } from "../models/hotel";
import verifyToken from "../middleware/auth";
import { body } from "express-validator";

const router = express.Router();

const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
});

//api/my-hotels
router.post(
  "/",
  verifyToken,
  [
    body("name").notEmpty().withMessage("Name is Required"),
    body("city").notEmpty().withMessage("City is Required"),
    body("country").notEmpty().withMessage("Country is Required"),
    body("description").notEmpty().withMessage("Description is Required"),
    body("type").notEmpty().withMessage("Hotel Type  is Required"),
    body("pricePerNight")
      .notEmpty()
      .isNumeric()
      .withMessage("Price per Night is Required"),
    body("facilities").notEmpty().isArray().withMessage("Name is Required"),
    
  ],
  upload.array("imageFiles", 6),
  async (req: Request, res: Response) => {
    try {
      const imageFiles = req.files as Express.Multer.File[];
      // console.log("req.body = ",req.body)
      const newHotel: HotelType = req.body;
      // console.log("Hotel Type or new hotel ",newHotel)

      // uplaod image to cloudinary
      const uplaodPromises = imageFiles.map(async (image) => {
        const b64 = Buffer.from(image.buffer).toString("base64");
        let dataURI = "data:" + image.mimetype + ";base64," + b64;
        const res = await cloudinary.v2.uploader.upload(dataURI);

        return res.url;
      });

      // if uplaod was successful, add the url to the new hotel
      const imageUrls = await Promise.all(uplaodPromises);
      newHotel.imageUrls = imageUrls;
      newHotel.lastUpdated = new Date();
      newHotel.userId = req.userId;

      // save the new hotel in our database
      const hotel = new Hotel(newHotel);
      await hotel.save();
      // return a 201 status
      res.status(201).send(hotel);
    } catch (error) {
      console.log("Error crreating hotel : ", error);
      res.status(500).json({ message: "Something went wrong" });
    }
  }
);

export default router;
