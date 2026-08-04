import { pool } from "../database/db";
import {
  Residence, CreateResidenceInput,
  UpdateResidenceInput, } from "../types/residence.types";

  //ADD photo for residence

export const addPhoto = async (residenceId:string,
   photoUrl:string , public_id: string)=>{
  
    const result = await pool.query( `
        INSERT INTO residence_photos
              (residence_id, photo_url , public_id)
                      VALUES($1,$2 , $3) RETURNING * `,

[residenceId, photoUrl  , public_id]);

return result.rows[0]; };

export const getPhotobyid= async(photoid : string) => {

const result = await pool.query(`
    SELECT *
    FROM residence_photos
    WHERE id = $1 ` , [photoid]) ;
   return result.rows[0];
};

//Delete photo for residence
export const deletePhoto = async (
  photoId: string
) => {
  const result = await pool.query(
    ` DELETE FROM residence_photos
    WHERE id = $1
    RETURNING *`,
    [photoId]);

  return result.rows[0];
};
//Get all photos of one residence
export const getPhotos = async( residenceId:string ) 
: Promise<any>=>{
const result=await pool.query( `
SELECT * FROM residence_photos WHERE residence_id=$1 
ORDER BY sort_order `, [residenceId] );
return result.rows; };

// Get all residences of one syndic
export const getAll = async (
  syndic_id: string, page: number = 1, limit: number = 10

 ) =>{
  const offset = (page - 1) * limit;
  const result = await pool.query(
     ` SELECT * FROM residences
    WHERE syndic_id = $1 
    ORDER BY created_at DESC
    LIMIT $2
    OFFSET $3
    `,
    [syndic_id, limit, offset]
  );

  const countResult = await pool.query( `
    SELECT COUNT(*) AS total
    FROM residences
    WHERE syndic_id = $1 `,
    [syndic_id]
  );

  return {
    residences: result.rows,
    total: Number(countResult.rows[0].total),
    page,
    limit,
  };
              };

  export const getAllPublic = async (
  page: number = 1,
  limit: number = 10
) => {

  const offset = (page - 1) * limit;

  const result = await pool.query(
    `
    SELECT *
    FROM residences
    WHERE is_active = TRUE
    ORDER BY created_at DESC
    LIMIT $1
    OFFSET $2
    `,
    [limit, offset]
  );
  const countResult = await pool.query(
    `SELECT COUNT(*) AS total
    FROM residences
    WHERE is_active = TRUE
    `
  ); return {
    residences: result.rows,
    total: Number(countResult.rows[0].total),
    page,
    limit,
  };
};
// Get residence by id 
export const getById = async (
  id: string
): Promise<Residence | undefined> => {
  const result = await pool.query(
    ` SELECT *
    FROM residences
    WHERE id = $1`, [id]);
  return result.rows[0];
};

//Create residence

export const create = async (
  data: CreateResidenceInput): Promise<Residence> => {
  const result = await pool.query(`
    INSERT INTO residences
    (
      syndic_id,
      name,
      description,
      address,
      city,
      postal_code,
      latitude,
      longitude
    )
    VALUES
    (
      $1,$2,$3,$4,$5,$6,$7,$8
    )
    RETURNING *`,
    [
      data.syndic_id,
      data.name,
      data.description,
      data.address,
      data.city,
      data.postal_code,
      data.latitude,
      data.longitude,
    ]
  );

  return result.rows[0];
};

//Update residence
export const update = async (
  id: string,
  data: UpdateResidenceInput
): Promise<Residence | undefined> => {
  const result = await pool.query(
    `
    UPDATE residences
    SET
    name = COALESCE($1, name),
    description = COALESCE($2, description),
    address = COALESCE($3, address),
    city = COALESCE($4, city),
    postal_code = COALESCE($5, postal_code),
    latitude = COALESCE($6, latitude),
    longitude = COALESCE($7, longitude)
     WHERE id=$8
      RETURNING *
    `,
    [
      data.name,
      data.description,
      data.address,
      data.city,
      data.postal_code,
      data.latitude,
      data.longitude,
      id,
    ]
  );

  return result.rows[0];
};

// Delete residence
export const deleteResidence = async (
  id: string): Promise<boolean> => {
  const result = await pool.query(
    `
    DELETE FROM residences
    WHERE id=$1
    `,
    [id]
  );
  return result.rowCount === 1;
};
// Verify ownership
export const checkOwnership = async (
  residenceId: string,
  syndicId: string
): Promise<boolean> =>
   {
  const result = await pool.query(
    `
    SELECT id
    FROM residences
    WHERE id=$1
      AND syndic_id=$2
    `,
    [residenceId, syndicId]
  );
  return result.rowCount === 1;                 };
  //Add service to residence
export const addService = async (
  residenceId: string,
  serviceName: string,
  iconName?: string
) => {
  const result = await pool.query(
    `
    INSERT INTO residence_services
    (residence_id, service_name,  icon_name   )
    VALUES ( $1,$2,$3) RETURNING *`,
    [residenceId, serviceName, iconName ?? null,]
  );

  return result.rows[0];
};
//Get Residences Services
export const getServices = async (
  residenceId: string
) => {  const result = await pool.query(
    ` SELECT *
    FROM residence_services
    WHERE residence_id=$1
    ORDER BY service_name`,[residenceId] );
  return result.rows;
};
//Delete service
export const deleteService = async (
  serviceId: string) => {const result = await pool.query(
    `DELETE FROM residence_services
    WHERE id=$1`, [serviceId]
  );
  return result.rowCount ==1; };