import { pool } from "../database/db";
import { PoolClient } from "pg";
import { payment,} from "../types/payment.types";

// =====================================
// Create Payment
// =====================================
export const create = async (
  client: PoolClient, data: payment ): Promise<payment> => {
  const result = await client.query( ` INSERT INTO payments  (
     charge_id,validated_by, payment_date, payment_method, reference, notes 
     ) VALUES ($1,$2,$3,$4,$5,$6) RETURNING * `,
    [ data.charge_id,
      data.validated_by,
      data.payment_date,
      data.payment_method,
      data.reference,
      data.notes,
    ]
  );

  return result.rows[0];
};

// =====================================
// Get Payment By Charge
// =====================================
export const getByChargeId = async (
  charge_id: string
): Promise<payment | null> => {

  const result = await pool.query( `
    SELECT *
    FROM payments WHERE charge_id=$1`,[charge_id]
  );

  return result.rows[0] || null;
};
// =====================================
// Payment History For Owner
// =====================================
export const getHistoryForOwner = async (
  owner_id: string
): Promise<payment[]> => {

  const result = await pool.query(`
    SELECT p.*
    FROM payments p JOIN charges c
      ON c.id = p.charge_id
     WHERE c.owner_id = $1
    ORDER BY p.payment_date DESC`,
    [owner_id]
  );

  return result.rows;
};