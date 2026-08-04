import { pool } from "../database/db";
import * as ownerModel from "../models/owner.models";
import { sendOwnerCredentials } from "../services/email.services";
import { User } from "../types/user.types";
import crypto from "crypto";
import bcrypt from "bcryptjs";

// ====================================
// Generate random password
// ====================================
const generatePassword = () => {
  return crypto.randomBytes(6).toString("base64").slice(0, 10);
};

// ====================================
// Get all owners (with apartments count maybe? but no)
// ====================================
export const getAll = async (syndicId: string) => {
  return await ownerModel.getAll(syndicId);
};

// ====================================
// Get owner by id
// ====================================
export const getById = async (id: string) => {
  const owner = await ownerModel.getById(id);
  if (!owner) {
    throw new Error("Owner not found");
  }
  return owner;
};

// ====================================
// Get apartments of owner
// ====================================
export const getApartments = async (ownerId: string) => {
  return await ownerModel.getApartments(ownerId);
};

// ====================================
// Create owner
// ====================================
export const createOwner = async (data: User) => {
  const existing = await ownerModel.findByEmail(data.email);
  if (existing) {
    throw new Error("Email already exists");
  }

  const password = generatePassword();
  const hashedPassword = await bcrypt.hash(password, 10);

  const owner = await ownerModel.create({
    ...data,
    password: hashedPassword,
  });

  // Send credentials via email
  await sendOwnerCredentials(owner.email, owner.email, password);
  return owner;
};

// ====================================
// Assign apartment (with transaction)
// ====================================
export const assignApartment = async (
  apartment_id: string,
  owner_id: string
) => {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    // Check if apartment is already assigned (model will throw)
    const assignment = await ownerModel.assignApartment(
      client,
      apartment_id,
      owner_id
    );

    // Update apartment status
    await ownerModel.updateApartmentStatus(client, apartment_id);

    await client.query("COMMIT");
    return assignment;
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
};

// ====================================
// Unassign apartment
// ====================================
export const unassignApartment = async (owner_id: string, apartment_id: string) => {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    // Optional: verify the assignment exists
    const check = await client.query(
      `SELECT * FROM owner_apartments WHERE owner_id = $1 AND apartment_id = $2`,
      [owner_id, apartment_id]
    );
    if (check.rows.length === 0) {
      throw new Error("Assignment not found");
    }

    const deleted = await ownerModel.removeAssignmentByIds(client, owner_id, apartment_id);
    if (!deleted) {
      throw new Error("Could not remove assignment");
    }

    // Update apartment status to 'available'
    await ownerModel.makeApartmentAvailable(client, apartment_id);

    await client.query("COMMIT");
    return { success: true, message: "Apartment unassigned successfully" };
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
};

// ====================================
// Get owners by residence
// ====================================
export const getOwnersByResidence = async (residenceId: string) => {
  return await ownerModel.getOwnersByResidence(residenceId);
};