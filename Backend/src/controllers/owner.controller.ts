import { Request, Response } from "express";
import * as ownerService from "../services/owner.services";

// ===============================
// GET /owners
// ===============================
export const getAll = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const owners = await ownerService.getAll(req.user.id);
    return res.status(200).json({
      success: true,
      data: owners,
    });
  } catch (error: any) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// ===============================
// GET /owners/:id
// ===============================
export const getById = async (req: Request<{ id: string }>, res: Response) => {
  try {
    const owner = await ownerService.getById(req.params.id);
    return res.status(200).json({
      success: true,
      data: owner,
    });
  } catch (error: any) {
    return res.status(404).json({
      success: false,
      message: error.message,
    });
  }
};

// ===============================
// POST /owners
// ===============================
export const create = async (req: Request, res: Response) => {
  try {
    const owner = await ownerService.createOwner(req.body);
    return res.status(201).json({
      success: true,
      message: "Owner created successfully",
      data: owner,
    });
  } catch (error: any) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// ===============================
// POST /owners/:id/apartments/:aptId
// ===============================
export const assignApartment = async (
  req: Request<{ aptId: string; id: string }>,
  res: Response
) => {
  try {
    const result = await ownerService.assignApartment(
      req.params.aptId,
      req.params.id
    );
    return res.status(201).json({
      success: true,
      message: "Apartment assigned successfully",
      data: result,
    });
  } catch (error: any) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// ===============================
// DELETE /owners/:id/apartments
// (unassign apartment)
// ===============================
export const unassignApartment = async (
  req: Request<{ id: string; aptId: string }>,
  res: Response
) => {
  try {
    const result = await ownerService.unassignApartment(req.params.id, req.params.aptId);
    return res.status(200).json({
      success: true,
      message: result.message,
    });
  } catch (error: any) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// ===============================
// GET /owners/:id/apartments
// ===============================
export const getApartments = async (
  req: Request<{ id: string }>,
  res: Response
) => {
  try {
    const apartments = await ownerService.getApartments(req.params.id);
    return res.status(200).json({
      success: true,
      data: apartments,
    });
  } catch (error: any) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};