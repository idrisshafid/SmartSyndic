import cloudinary from "../config/cloudinary.config";

export const uploadImage = async (

  file: Express.Multer.File,
  
  folder: string                  ) => {

  const result = await cloudinary.uploader.upload(

    `data:${file.mimetype};base64,${file.buffer.toString("base64")}`,

    {folder}   );

  return {  

    url: result.secure_url,

    public_id: result.public_id,
  

};};

export const CLOUDINARY_FOLDERS = {
  APARTMENTS: "apartments",
  RESIDENCES: "residences",
  INCIDENTS: "incidents",
} as const;

