import { PoolClient } from "pg";
import { pool } from "../database/db";
import { User } from "../types/user.types";

// ===================================
// Get all owners of a syndic
// ===================================
export const getAll = async (syndicId: string) => {
  const result = await pool.query(
    ` SELECT DISTINCT u.*
      FROM users u
      JOIN owner_apartments oa ON oa.owner_id = u.id
      JOIN apartments a ON a.id = oa.apartment_id
      JOIN residences r ON r.id = a.residence_id 
      WHERE r.syndic_id = $1 AND u.role = 'owner' 
      ORDER BY u.first_name`,
    [syndicId]
  );
  return result.rows;
};

// ===================================
// Get owner by id
// ===================================
export const getById = async (id: string) => {
  const result = await pool.query(
    `SELECT * FROM users WHERE id = $1 AND role = 'owner'`,
    [id]
  );
  return result.rows[0];
};

// ===================================
// Find owner by email
// ===================================
export const findByEmail = async (email: string) => {
  const result = await pool.query(
    `SELECT * FROM users WHERE email = $1 AND role = 'owner'`,
    [email]
  );
  return result.rows[0];
};

// ===================================
// Create owner
// ===================================
export const create = async (data: User) => {
  const result = await pool.query(
    ` INSERT INTO users (email, password, first_name, last_name, phone, country, role)
      VALUES ($1, $2, $3, $4, $5, $6, 'owner')
      RETURNING *`,
    [
      data.email,
      data.password,
      data.first_name,
      data.last_name,
      data.phone ?? null,
      data.country ?? null,
    ]
  );
  return result.rows[0];
};

// ===================================
// Apartments of one owner (FIXED: returns array)
// ===================================
export const getApartments = async (ownerId: string) => {
  const result = await pool.query(
    ` SELECT
        a.*,
        r.name AS residence_name,
        r.city
      FROM owner_apartments oa
      JOIN apartments a ON a.id = oa.apartment_id
      JOIN residences r ON r.id = a.residence_id
      WHERE oa.owner_id = $1 AND oa.is_active = TRUE
      ORDER BY a.apartment_number`,
    [ownerId]
  );
  return result.rows; // ✅ was rows[0] → fixed
};

// ===================================
// Assign apartment (transaction)
// ===================================
export const assignApartment = async (
  client: PoolClient,
  apartment_id: string,
  owner_id: string
) => {
  // First, check if already assigned
  const check = await client.query(
    `SELECT id FROM owner_apartments WHERE apartment_id = $1 AND is_active = TRUE`,
    [apartment_id]
  );
  if (check.rows.length > 0) {
    throw new Error("Apartment is already assigned to another owner");
  }

  const result = await client.query(
    ` INSERT INTO owner_apartments (apartment_id, owner_id, is_active)
      VALUES ($1, $2, TRUE)
      RETURNING *`,
    [apartment_id, owner_id]
  );
  return result.rows[0];
};

// ===================================
// Update apartment status to 'occupied'
// ===================================
export const updateApartmentStatus = async (
  client: PoolClient,
  apartment_id: string
) => {
  await client.query(
    ` UPDATE apartments
      SET status = 'occupied', updated_at = NOW()
      WHERE id = $1`,
    [apartment_id]
  );
};

// ===================================
// Get apartment_id assigned to owner (for unassign)
// ===================================
export const getAssignedApartmentId = async (owner_id: string) => {
  const result = await pool.query(
    ` SELECT apartment_id
      FROM owner_apartments
      WHERE owner_id = $1 AND is_active = TRUE`,
    [owner_id]
  );
  return result.rows[0]?.apartment_id ?? null;
};

// ===================================
// Remove assignment (soft delete or hard delete)
// ===================================
// ─── Remove assignment by owner + apartment ───
export const removeAssignmentByIds = async (
  client: PoolClient,
  owner_id: string,
  apartment_id: string
) => {
  const result = await client.query(
    `DELETE FROM owner_apartments
     WHERE owner_id = $1 AND apartment_id = $2
     RETURNING *`,
    [owner_id, apartment_id]
  );
  return result.rows[0] || null;
};
// ===================================
// Make apartment available (unassign)
// ===================================
export const makeApartmentAvailable = async (
  client: PoolClient,
  apartment_id: string
) => {
  await client.query(
    ` UPDATE apartments
      SET status = 'available', updated_at = NOW()
      WHERE id = $1`,
    [apartment_id]
  );
};

// ===================================
// Get owners by residence
// ===================================
export const getOwnersByResidence = async (residenceId: string) => {
  const result = await pool.query(
    ` SELECT u.*
      FROM users u
      JOIN owner_apartments oa ON u.id = oa.owner_id
      JOIN apartments a ON oa.apartment_id = a.id
      JOIN residences r ON a.residence_id = r.id
      WHERE r.id = $1 AND oa.is_active = TRUE AND u.role = 'owner'
      ORDER BY u.first_name`,
    [residenceId]
  );
  return result.rows;
};