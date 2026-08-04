import { pool } from "../database/db";

import * as paymentModel from "../models/payment.models";
import * as chargeModel from "../models/charge.models";
import * as notificationService
from "./notifications.services";

import { payment} from "../types/payment.types";

// =====================================
// Validate Payment
// =====================================
export const validatePayment = async (
  data: payment  )    : Promise<payment> => {
//connect with Database pool
  const client = await pool.connect();
  
  try {    
       await client.query("BEGIN");

    const payment = await paymentModel.create(client, data);

    await client.query(`
      UPDATE charges   
       SET  status='validated'  ,        updated_at=NOW()
      WHERE id=$1 `            ,[data.charge_id] );

    await client.query("COMMIT");


    const charge = await chargeModel.getById(data.charge_id);

if (!charge) {
  throw new Error("Charge not found");
}

await notificationService.notifyUser(
  charge.owner_id,
  "Paiement validé",
  "Votre paiement a été validé.",
  "payment",
  payment.charge_id,
  "charge"
);

return payment;
  
  
  } catch (error) { await client.query("ROLLBACK");

     throw error; } 
//faire tous ces queries dans pool connection et close it
     finally {  client.release();}
};

// =====================================
// Get Payment By Charge
// =====================================
export const getByChargeId = async (
  charge_id: string
): Promise<payment> => {

  const payment = await paymentModel.getByChargeId(charge_id);

  if (!payment) {
    throw new Error("Payment not found");
  }

  return payment;
};

// =====================================
// Payment History For Owner
// =====================================
export const getHistoryForOwner = async (
  owner_id: string
): Promise<payment[]> => {

  return await paymentModel.getHistoryForOwner(owner_id);
};