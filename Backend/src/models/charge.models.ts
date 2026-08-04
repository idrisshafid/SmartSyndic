import { pool } from "../database/db";
import {
  Charge,
  CreateChargeInput,UpdateChargeStatusInput, ChargeFilters,
 } from "../types/charge.types";
// ======================================
// Get All Charges (avec filtres)
// ======================================
export const getAll = async (
  filters: ChargeFilters) :  Promise  <Charge[]>    => {

  let  query  = ` SELECT * FROM charges WHERE 1=1  `;

  const values: any[] = []  ;       let index = 1;

  if (filters.owner_id) {
    query  +=      `  AND owner_id = $${index++}  `;
    values.push(filters.owner_id);}

  if (filters.syndic_id) {
    query += `  AND syndic_id = $${index++}  `;
    values.push(filters.syndic_id);  }

  if (filters.apartment_id) {
    query += `  AND apartment_id = $${index++}  `;
    values.push(filters.apartment_id);}

  if (filters.status) {
    query += `  AND status = $${index++}  `;
    values.push(filters.status);
  }
  query += `  ORDER BY due_date ASC  `;

  const result = await pool.query(query, values);
  return result.rows; };
// ======================================
// Get Charge By ID
// ======================================
export const getById = async (
  id: string ): Promise<Charge | null> => {
  const result = await 
  pool.query(`SELECT * FROM charges WHERE id = $1`,[id]);
  return result.rows[0] || null;};
// ======================================
// Create Charge
// ======================================
export const create = async (
  data: CreateChargeInput ): Promise<Charge> => {
  const result = await pool.query(`
      INSERT INTO charges( syndic_id, owner_id,apartment_id,
        title,
        description,
        amount,
       due_date
      )VALUES($1,$2,$3,$4,$5,$6,$7) RETURNING *`,
    [
      data.syndic_id,
      data.owner_id,
      data.apartment_id,
      data.title,
      data.description,
      data.amount,
      data.due_date,
    ] );
  return result.rows[0];};
// ======================================
// Update Charge Status
// ======================================
export const updateStatus = async (
  id: string,
status: UpdateChargeStatusInput["status"]):
 Promise<Charge | null> => {
  const result = await pool.query(`
      UPDATE charges SET
        status = $1, updated_at = NOW()  
         WHERE id = $2 RETURNING * `,
    [status, id]);
  return result.rows[0] || null;};
// ======================================
// Delete Charge (optionnel)
// ======================================
export const remove = async (
  id: string
): Promise<Charge | null> => {
  const result = await pool.query(`
      DELETE FROM charges WHERE id = $1 RETURNING *`,[id]);
  return result.rows[0] || null;
};