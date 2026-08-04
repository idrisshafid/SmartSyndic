import * as chargeModel from "../models/charge.models";
import { Charge, CreateChargeInput, } from "../types/charge.types";

// ======================================
// Create Charge
// ======================================
export const createCharge = async (
  data: CreateChargeInput
): Promise<Charge> => {
    if (data.amount <= 0) {throw new Error("Amount must be greater than 0");}
   return await chargeModel.create(data);
};

// ======================================
// List Charges For Owner
// ======================================
export const listForOwner = async (
  owner_id: string
): Promise<Charge[]> => {
  return await chargeModel.getAll({
    owner_id,
  });
};

// ======================================
// List Charges For Syndic
// ======================================
export const listForSyndic = async (
  syndic_id: string
): Promise<Charge[]> => {
  return await chargeModel.getAll({
    syndic_id,
  });
};

// ======================================
// Mark Overdue Charges
// ======================================
export const markOverdue = async (): Promise<number> => {
  const charges = await chargeModel.getAll({});

  let updated = 0;

  const today = new Date();

  for (const charge of charges) {
    if (
      charge.status === "pending" &&
      new Date(charge.due_date) < today
    ) {
      await chargeModel.updateStatus( charge.id,   "overdue");
      
      updated++;}}

  return updated;
};

// ======================================
// Validate Payment
// ======================================
export const validateCharge = async (
  id: string
): Promise<Charge> => {
  const charge = await chargeModel.getById(id);

  if (!charge) {
    throw new Error("Charge not found");
  }

  return await chargeModel.updateStatus(
    id,  "validated" ) as Charge;
};

// ======================================
// Get Charge By ID
// ======================================
export const getChargeById = async (
  id: string
): Promise<Charge> => {
  const charge = await chargeModel.getById(id);

  if (!charge) {
    throw new Error("Charge not found");
  }

  return charge;
};

////////////////////////////////////
export const deleteCharge = async (id: string): Promise<{ message: string }> => {
  const deleted = await chargeModel.remove(id);
  if (!deleted) {
    throw new Error("Charge not found");
  }
  return { message: "Charge deleted successfully" };
};