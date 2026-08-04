import { pool } from "../database/db";
import { User } from "../types/user.types";

// ======================================
// Get All Syndics
// ======================================
export const getAllSyndics = async (

  pagination?: {
     page?: number ; 
     limit?: number;}    ): Promise<User[]> => {

  const page =   pagination?.page || 1;

  const limit =  pagination?.limit || 10;

  const offset =  (page - 1) * limit;

  const result = await pool.query(  `SELECT 
      id,
      first_name,
      last_name,
      email,
      phone,
      role,
      is_active,
      created_at
    FROM users
    WHERE role = 'syndic'
    ORDER BY created_at DESC
    LIMIT $1 OFFSET $2`,    [ limit, offset]);

  return result.rows;         };

// ======================================
// Create Syndic Account
// ======================================
export const createSyndic = async (
  data: User
): Promise<User> => {

  const result = await pool.query( `

    INSERT INTO users
    (
      first_name,
      last_name,
      email,
      password,
      phone,
      role,
      is_active
    )VALUES(
      $1,$2,$3,$4,$5,'syndic',TRUE)
    RETURNING *`,[
      data.first_name,
      data.last_name,
      data.email,
      data.password,
      data.phone] );

  return result.rows[0]; };

// ======================================
// Toggle Syndic Active Status
// ======================================
export const toggleStatus = async (
  id: string,
  is_active: boolean
): Promise<User | null> => {

  const result = await pool.query(`
    UPDATE users
    SET
      is_active = $1,
      updated_at = NOW()

    WHERE id = $2
    AND role = 'syndic'
    RETURNING *
    `,
    [ is_active,id]    );
  return result.rows[0] || null;
};
// ======================================
// Find User By Email
// ======================================
export const getUserByEmail = async (
  email:string
):Promise<User | null> => {

  const result = await pool.query(`
    
    SELECT *  FROM users WHERE email=$1 `,  [email]     );

   return result.rows[0] || null;
};