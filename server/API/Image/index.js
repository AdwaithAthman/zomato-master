// Libraries
import express from "express";
import multer from "multer";
import dotenv from "dotenv";

// Database model
import { ImageModel } from "../../database/allModels";

//upload to s3
import { s3Upload } from "../../Utils/AWS/s3";

const Router = express.Router();

// Multer config
const storage = multer.memoryStorage();
const upload = multer({ storage });

// dotenv config
dotenv.config();

/*
Route       /image
Desc        Uploads given image to S3 bucket and saves the file link to MongoDB
Params      none
Access      Public
Method      POST
*/
Router.post("/", upload.single("file"), async (req, res) => {
  try {
    const file = req.file;

    // S3 bucket options
    const bucketOptions = {
      Bucket: "zomato-master-clone",
      Key: file.originalname,
      Body: file.buffer,
      ContentType: file.mimetype,
      ACL: "public-read",
    };

    const uploadParams = {
      Bucket: bucketOptions.Bucket,
      Key: bucketOptions.Key,
      Body: bucketOptions.Body,
      ContentType: bucketOptions.ContentType,
      ACL: bucketOptions.ACL,
    };

    const uploadImage = await s3Upload(uploadParams);
    // Manually construct the Location, Key and Bucket values
    const Location = `https://${bucketOptions.Bucket}.s3.${process.env.AWS_S3_REGION}.amazonaws.com/${bucketOptions.Key}`;
    const Bucket = bucketOptions.Bucket;
    const Key = bucketOptions.Key;

    return res.status(200).json({ uploadImage, Location, Bucket, Key });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

export default Router;
