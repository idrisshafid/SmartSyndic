import { Request, Response } from "express";
import * as residenceService from "../services/residenceService.services";

//Ajouter
export const addService = async (
  req: Request<{ id: string }>,
  res: Response
) => {

  try {

    const result =
      await residenceService.addService(
        req.params.id,
        req.body.service_name,
        req.body.icon_name
      );

    return res.status(201).json({
      success: true,
      data: result,
    });

  } catch (error: any) {

    return res.status(400).json({
      success: false,
      message: error.message,
    });

  }

};
//Lire
export const getServices = async (
  req : Request<{ id: string }>,
  res : Response
) => {

  try {

    const result =
      await residenceService.getServices(
        req.params.id
      );

    return res.status(200).json({
      success: true,
      data: result,
    });

  } catch (error: any) {

    return res.status(400).json({
      success: false,
      message: error.message,
    });

  }

};
//Supprimer
export const deleteService = async (
  req: Request <{ serviceId: string }>,
  res : Response
) => {

  try {

    const result =
      await residenceService.deleteService(
        req.params.serviceId
      );

    return res.status(200).json({
      success: true,
      data: result,
    });

  } catch (error: any) {

    return res.status(400).json({
      success: false,
      message: error.message,
    });

  }

};