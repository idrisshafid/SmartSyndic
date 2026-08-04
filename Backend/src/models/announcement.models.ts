import { pool } from "../database/db";
import { Announcement } from "../types/announcement.types";

// ======================================
// Get All Announcements By Residence
// ======================================
export const getAll = async (
  residence_id: string,
  pagination?: {
    page?: number;  limit?: number;})
    : Promise<Announcement[]> => {

  const page =  pagination?.page || 1;
  
  const limit = pagination?.limit || 10;

  const offset =  (page - 1) * limit;

  const result =   await pool.query(`
      
    SELECT *  FROM announcements   
    WHERE residence_id = $1
      ORDER BY
      is_pinned DESC,  created_at DESC
      LIMIT $2 OFFSET $3
      `,
      [ residence_id , limit , offset  ]  );

     return result.rows;      };

// ======================================
// Get Announcement By ID
// ======================================
export const getById = async (
  id:string  ) :Promise<Announcement | null> => {

  const result =  await pool.query(
    `SELECT *   FROM announcements
      WHERE id = $1`,      [ id    ]);

  return result.rows[0] || null;
    };

// ======================================
// Create Announcement
// ======================================
export const create = async (
 data: Announcement
):Promise<Announcement> => {

 const result =         await pool.query(`

    INSERT INTO announcements(
   residence_id,
   title,
   content,
   syndic_id,
   is_pinned )
 
   VALUES($1,$2,$3,$4,$5)
 
   RETURNING *`,
 [
   data.residence_id,
   data.title,
   data.content,
   data.syndic_id,
   data.is_pinned ?? false
 ]);
return result.rows[0];   };

// ======================================
// Update Announcement
// ======================================
export const update = async (id: string,
 data:Partial<Announcement>)
 :Promise<Announcement | null> => {

 const result = await pool.query(`

 UPDATE announcements   SET

 title = COALESCE($1,title),

 content = COALESCE($2,content),

 updated_at = NOW()

 WHERE id = $3

 RETURNING * `
 
 , [data.title,data.content,id]    );

 return result.rows[0] || null;

};



// ======================================
// Delete Announcement
// ======================================
export const remove = async (
 id:string
):Promise<Announcement | null> => {

 const result =  await pool.query(
 
    ` DELETE FROM announcements
 WHERE id = $1     RETURNING *    `,
 
 [id]   );
 
 return result.rows[0] || null;         };


// ======================================
// Toggle Pin
// ======================================
export const togglePin = async (
 id:string
):Promise<Announcement | null> => {

 const result =   await pool.query(
    
    ` UPDATE announcements

 SET
 is_pinned = NOT is_pinned,
 updated_at = NOW()

 WHERE id = $1      RETURNING *  `,
 
 [id]      );

 return result.rows[0] || null;

};

export const getResidenceIdByOwnerId = async (ownerId: string) => {
  const result = await pool.query(
    `
    SELECT DISTINCT a.residence_id
    FROM apartments a
    INNER JOIN owner_apartments oa
      ON oa.apartment_id = a.id
    WHERE oa.owner_id = $1
    `,
    [ownerId]
  );

  return result.rows[0]?.residence_id ?? null;
};