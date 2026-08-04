import {pool} from "../database/db";
import {Apartment, CreateApartmentInput , 
  UpdateApartmentInput} from "../types/appartement.types";

import { SearchFilters ,  } from "../types/chatbot.types";

export const getAllApartment = async():Promise<Apartment[]>=> {
  const result = await pool.query(
    `SELECT *
    FROM apartments 

    ORDER BY created_at DESC`, );
  return result.rows;
};

//getAllByResidence
export const getAllByResidence = async (
  residenceId: string
):Promise<Apartment[]>=> {
  const result = await pool.query(
    `SELECT *
    FROM apartments 
    WHERE residence_id = $1
    ORDER BY created_at DESC`, [residenceId]);
  return result.rows;
};

//getById()
export const getById = async (id: string) => {
  const result = await pool.query(    `SELECT *FROM apartments
     WHERE id = $1`,[id] );
  return result.rows[0];
};

//2. create()

export const create = async (data: CreateApartmentInput) => {
  const result = await pool.query(`
    INSERT INTO apartments
    (
      residence_id,
      apartment_number,
      floor,
      surface,
      rooms,
      bedrooms,
      bathrooms,
      capacity,
      description,
      status,
      price_per_night,
      view_type
    )
    VALUES
    (
      $1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12
    )
    RETURNING *
    `,
    [
      data.residence_id,
      data.apartment_number,
      data.floor ?? null,
      data.surface ?? null,
      data.rooms,
      data.bedrooms,
      data.bathrooms,
      data.capacity,
      data.description ?? null,
      data.status ?? "available",
      data.price_per_night ?? null,
      data.view_type ?? null,
    ]
  );

  return result.rows[0]; // 
};
//3. update()
export const update = async (  id: string, data: UpdateApartmentInput) => {

  const result = await pool.query(
    ` UPDATE apartments
SET
  apartment_number = COALESCE($1, apartment_number),
  floor = COALESCE($2, floor),
  surface = COALESCE($3, surface),
  rooms = COALESCE($4, rooms),
  bedrooms = COALESCE($5, bedrooms),
  bathrooms = COALESCE($6, bathrooms),
  capacity = COALESCE($7, capacity),
  description = COALESCE($8, description),
  status = COALESCE($9, status),
  price_per_night = COALESCE($10, price_per_night),
  view_type = COALESCE($11, view_type)
WHERE id = $12
RETURNING *;
    `,
    [
      data.apartment_number,
      data.floor,
      data.surface,
      data.rooms,
      data.bedrooms,
      data.bathrooms,
      data.capacity,
      data.description,
      data.status,
      data.price_per_night,
      data.view_type,
      id,] ); return result.rows[0]; };

      //4. delete()

export const deleteApartment = async (
  id: string
) => { const result = await pool.query(
`
    DELETE FROM apartments
    WHERE id=$1
    `,  [id]);
  return result.rowCount === 1;};
  

//5. getWithFilters()
// Définition des types (à adapter selon vos fichiers de types existants)

export const getWithFilters = async (
  filters: SearchFilters ,
  page: number = 1,
  limit: number = 10
) => {
  const offset = (page - 1) * limit;

  const query = `
    SELECT *
    FROM v_available_apartments
    WHERE
      ($1::int IS NULL OR capacity >= $1)
     AND
      ($2::integer IS NULL OR floor = $2)
      AND
      ($3::text IS NULL OR view_type = $3)
      AND
      ($4::text IS NULL OR city = $4)
      AND
      ($5::integer IS NULL OR bedrooms = $5)
      AND
      ($6::integer IS NULL OR bathrooms = $6)
      AND
      ($7::integer IS NULL OR rooms = $7)
      
    LIMIT $8
    OFFSET $9
  `;

  const values = [
    filters.capacity ?? null,
    filters.floor ?? null,
    filters.view_type ?? null,
    filters.city ?? null,
    filters.bedrooms ?? null,
    filters.bathrooms ?? null,
    filters.rooms ?? null,
    limit,
    offset
  ];

  const result = await pool.query(query, values);
  return result.rows;
};
//=====================================
//             PHOTOS
//=====================================

//  Ajouter une photo (`addPhoto`)

export const addPhoto = async (
  apartmentId: string,
  photoUrl: string,  public_id : string ,
  isPrimary: boolean = false
) => {
  const result = await pool.query(`
    INSERT INTO apartment_photos
    (
      apartment_id,
      photo_url,
       public_id,
      is_primary
    )VALUES ($1,$2,$3,$4)RETURNING *`,
    [apartmentId, photoUrl, public_id,isPrimary] );
  return result.rows[0];
};


//  Récupérer les photos d'un appartement (`getPhotos`)
export const getPhotos = async (
  apartmentId: string ): Promise<any> => {

  const result = await pool.query( `
    SELECT *
    FROM apartment_photos
    WHERE apartment_id = $1
    ORDER BY sort_order ASC `,[
      apartmentId ] );
  return result.rows;       };

//  Supprimer une photo (`deletePhoto`)

export const deletePhoto = async (
  photoId: string
) => {
  const result = await pool.query(
    `DELETE FROM apartment_photos
    WHERE id = $1
    `,
    [ photoId]);
  return result.rowCount === 1;
};

//  Mettre une photo comme principale (`setPrimaryPhoto`)
export const setPrimaryPhoto = async (
  apartmentId: string,
  photoId: string
) => {

  // enlever l'ancienne photo principale
  await pool.query(    `
    UPDATE apartment_photos
    SET is_primary = FALSE
    WHERE apartment_id = $1
    `,
    [apartmentId]
  );
  // mettre la nouvelle comme principale
  const result = await pool.query(
    `
    UPDATE apartment_photos
    SET is_primary = TRUE
    WHERE id = $1
    RETURNING *
    `,
    [ photoId]
  ); return result.rows[0];
};

//GET PHOTO BY ID OF PHOTO
export const getPhotoById = async (photoId: string) => {
  const result = await pool.query(
    `SELECT *
    FROM apartment_photos
    WHERE id = $1 `,[photoId]);

  return result.rows[0];
};

// ==========================
// Add equipment
// ==========================
export const addEquipment = async (
  apartmentId: string,
  equipment: string
) => {const result = await pool.query(`
    INSERT INTO apartment_equipments(
      apartment_id,
      equipment)VALUES( $1, $2)
    RETURNING *
    `,
    [apartmentId, equipment]
); return result.rows[0];};
// ==========================
// Get equipments
// ==========================
export const getEquipments = async (apartmentId: string
) => { const result = await pool.query
  (` SELECT *
    FROM apartment_equipments WHERE
     apartment_id=$1 ORDER BY equipment `,[ apartmentId  ]);

  return result.rows;
};
// ==========================
// Delete equipment
// ==========================
export const deleteEquipment = async (
  equipmentId: string
) => { const result = await pool.query(`
    DELETE FROM apartment_equipments
    WHERE id=$1
    `,[ equipmentId ]
  );return result.rowCount === 1;
};