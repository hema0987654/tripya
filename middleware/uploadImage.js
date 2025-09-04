import { v2 as cloudinary } from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import multer from "multer";
import dotenv from 'dotenv';
dotenv.config();

cloudinary.config({
  cloud_name: "duscvark1",
  api_key: process.env.api_key,
  api_secret: process.env.API_secret,
});


const createUploader = (folderName) => {

  
  const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: async (req, file) => {
      return {
        folder: folderName,        
        format: "png",             
        transformation: [
          { background_removal: "cloudinary_ai" }, 
        ],
      };
    },
  });

  return multer({ storage });
};

const uploadUser = createUploader("user");

export default uploadUser;