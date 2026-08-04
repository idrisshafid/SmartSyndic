import { pool } from "../database/db";
import { Reservation, ReservationStatus } from "../types/reservation.types";

// ======================================
// Get Available Days For Syndic
// ======================================

export const getAvailableDays = async (
  syndic_id: string ) => {

  const result = await pool.query(`
    SELECT * FROM v_available_days 
    WHERE syndic_id = $1 
    ORDER BY appointment_date ASC`,[ syndic_id]);

  return result.rows;
};


export const getSyndicbyapartmentid = async (
  apartment_id: string ):Promise<string> => {

  const result = await pool.query(`SELECT u.id FROM users u
     JOIN residences r ON u.id=r.syndic_id 
      JOIN apartments a ON r.id= a.residence_id
      Where  a.id=$1  AND u.role = 'syndic' ;
      `,[apartment_id]);
       return result.rows[0]?.id || null;
};


// ======================================
// Get Available Slots By Day
// ======================================
export const getSlotsByDay = async (
  syndic_id: string,  date: string) => {

  const result = await pool.query(   `SELECT *
    FROM v_slots_by_day
    WHERE syndic_id = $1
    AND slot_date = $2
    ORDER BY time_slot ASC`,[syndic_id, date] );

  return result.rows;
};

// ======================================
// Create Reservation
// ======================================

export const create = async (
  data: Reservation
): Promise<Reservation> => {

  const result = await pool.query(
    `
    INSERT INTO reservations
    (
      apartment_id,
      syndic_id,
      appointment_date,
      time_slot,
      visitor_name,
      visitor_email,
      visitor_phone,
      message,
      check_in_date,
      check_out_date,
      guests_count,
      notes
    )

    VALUES
    (
      $1,$2,$3,$4,$5,$6,$7,
      $8,$9,$10,$11,$12
    )

    RETURNING *
    `,
    [
      data.apartment_id,
      data.syndic_id,
      data.appointment_date,
      data.time_slot,
      data.visitor_name,
      data.visitor_email,
      data.visitor_phone,
      data.message,
      data.check_in_date,
      data.check_out_date,
      data.guests_count,
      data.notes
    ]
  );

  return result.rows[0];
};


// ======================================
// Get All Reservations By Syndic
// ======================================
export const getAll = async (   syndic_id: string,
  filters?: 
  {
    status?: ReservationStatus;
    apartment_id?: string;
    date?: string;                    }
): Promise<Reservation[]> => {

  let query = `
    SELECT *    FROM reservations
    WHERE syndic_id = $1  `;

  const values: any[] = [syndic_id];
  let index = 2;

  if (filters?.status) {
    query += `    AND status = $${index++}`;
    values.push(filters.status);                     }


  if (filters?.apartment_id) {
    query += `      AND apartment_id = $${index++}`;
    values.push(filters.apartment_id);                      }


  if (filters?.date) {

    query += `   AND appointment_date = $${index++}`;
    values.push(filters.date);                    }

  query +=      `ORDER BY appointment_date ASC`;

  const result =    await pool.query( query,values);

  return result.rows;};


// ======================================
// Get Reservation By ID
// ======================================
export const getById = async (
  id: string
): Promise<Reservation | null> => {

  const result =    await pool.query(`
      SELECT *    FROM reservations
      WHERE id = $1 `,

      [ id ] );
  return result.rows[0] || null;};


// ======================================
// Update Reservation Status
// ======================================
export const updateStatus = async (
  id: string,
  status: ReservationStatus)
  : Promise<Reservation | null> => {

  const result =
    await pool.query(
      `
      UPDATE reservations
      SET
        status = $1,
        updated_at = NOW()
    WHERE id = $2                  RETURNING *
      `,
      [status , id ] );

  return result.rows[0] || null;
};

export const deleteReservation = async (
  id: string
): Promise<Reservation | null> => {
  const result = await pool.query(
    `DELETE FROM reservations
    WHERE id = $1
    RETURNING *`,
    [id]
  );

  return result.rows[0] || null;
};


