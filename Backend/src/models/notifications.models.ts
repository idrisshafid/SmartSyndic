import { pool } from "../database/db";
import { Notification } from "../types/notification.types";

// ======================================
// Create Notification
// ======================================
export const create = async (data: Notification ): 
Promise<Notification> => {

  const result = await pool.query(    `
    INSERT INTO notifications
    (
      user_id,
      title,
      message,
      type,
      reference_id,
      reference_type
    )
    VALUES
    (
      $1,$2,$3,$4,$5,$6
    )
    RETURNING *
    `,
    [
      data.user_id,
      data.title,
      data.message,
      data.type,
      data.reference_id,
      data.reference_type
    ]
  );
  return result.rows[0];  };

// ======================================
// Mark Notification As Read
// ======================================
export const markRead = async (
  id: string,
  user_id: string
): Promise<Notification | null> => {

  const result = await pool.query(
    ` UPDATE notifications
    SET is_read = TRUE

    WHERE id = $1  AND     user_id = $2
    
    RETURNING * `,
    [ id,  user_id ]             );

  return result.rows[0] || null;
};

// ======================================
// Mark All Notifications As Read
// ======================================
export const markAllRead = async (
  user_id: string
): Promise<void> => {

  await pool.query(
    `
    UPDATE notifications
    SET is_read = TRUE
    WHERE user_id = $1  AND is_read = FALSE
    `,
    [ user_id]  );
};

// ======================================
// Get All Notifications
// ======================================
export const getAll = async (
  user_id: string
): Promise<Notification[]> => {

  const result = await pool.query(`
    SELECT *
    FROM notifications
    WHERE user_id = $1
    ORDER BY created_at DESC
    `, [ user_id]  );

  return result.rows;
};

// ======================================
// Get Unread notification sum
// ======================================
export const getUnreadCount = async (
  user_id: string
): Promise<number> => {

  const result = await pool.query(
    `
    SELECT COUNT(*) AS total
    FROM notifications
    WHERE user_id = $1
      AND is_read = FALSE`,
     [  user_id ]
  );
  return Number(result.rows[0].total);
};


export const deleteAll = async (user_id: string): Promise<void> => {

  await pool.query( `
    DELETE FROM notifications
    WHERE user_id = $1`,  [user_id]);};

export const deleteOne = async (  id: string, user_id: string): Promise<Notification | null> => {

  const result = await pool.query(`
    DELETE FROM notifications
    WHERE id = $1
      AND user_id = $2
    RETURNING *`,  [id, user_id]);

  return result.rows[0] || null;
};