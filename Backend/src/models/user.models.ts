import { pool } from "../database/db";
import {UserRole} from "../types/user.types"

export const findByEmail = async (email: string) => {
  const result = await pool.query(
    "SELECT * FROM users WHERE email = $1",
    [email]  );
  return result.rows[0];
};

export const findById = async (id: string) => {
  const result = await pool.query(
    "SELECT * FROM users WHERE id = $1",
    [id]
  );
  return result.rows[0];
};
 //declare type AS USER TABLE
type CreateUserInput = {
 email: string;
  password: string;
  first_name: string;
  last_name: string;
  phone ?: number;
  role : UserRole;
  country ? : string;
};
export const create = async (data: CreateUserInput) => {
  const result = await pool.query(
    `INSERT INTO users 
    (email, password, first_name, last_name, phone , role, country)
    VALUES ($1, $2, $3, $4, $5, $6 , $7)
    RETURNING *`,
    [
      data.email,
      data.password,
      data.first_name,
      data.last_name,
      data.phone ,
      data.role,
      data.country || null,
    ]
  );

  return result.rows[0];
};
//reset token
export const updateResetToken = async (
  id: string,
  token: string | null,
  expires: Date | null,  ) => {
  const result = await pool.query(
    `UPDATE users
     SET reset_token = $1,
         reset_token_expires = $2
     WHERE id = $3
     RETURNING *`,
    [token, expires, id]
  );

  return result.rows[0];
};

export const findByResetToken = async (token: string) => {
  const result = await pool.query(
    `SELECT *
     FROM users
     WHERE reset_token = $1
       LIMIT 1`,
    [token]
  );

  return result.rows[0];
};

export const updatePassword = async (
  id: string,
  password: string ) => {
  const result = await pool.query(
    `UPDATE users
     SET password = $1,
         reset_token = NULL,
         reset_token_expires = NULL,
         updated_at = NOW()
     WHERE id = $2
     RETURNING *`,
    [password, id]
  );

  return result.rows[0];
};

export const revokeToken = async( token:string , expiresAt:Date)=>{

const result = await pool.query( `
INSERT INTO revoked_tokens
(token,expires_at)

VALUES($1,$2)

RETURNING *
`, [ token ,  expiresAt  ]);

return result.rows[0];  };



export const deactivateUser = async (id: string) => {
  const result = await pool.query(
    `UPDATE users
     SET is_active = FALSE,
         updated_at = NOW()
     WHERE id = $1
     RETURNING *`,
    [id]
  );

  return result.rows[0];
};
export const updateAvatar = async (id: string, url: string) => {
  const result = await pool.query(
    `UPDATE users
     SET avatar_url = $1,
         updated_at = NOW()
     WHERE id = $2
     RETURNING *`,
    [url, id]
  );

  return result.rows[0];
};