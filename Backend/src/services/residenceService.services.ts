import * as residenceModel from "../models/residence.models";
//Adding service to residence
export const addService = async (
  residenceId: string, serviceName: string, iconName?: string
) => {
  if (!serviceName) {
    throw new Error("Service name is required");
  }
  return await residenceModel.addService(residenceId, serviceName, iconName);
};
//service Getting
export const getServices = async (
  residenceId: string
) => { return await residenceModel.getServices(
    residenceId ); };
    //Service deletion
export const deleteService = async (
  serviceId: string
) => { const deleted = await residenceModel.deleteService(serviceId);

  if (!deleted) {
    throw new Error("Service not found");}
  return {
    message: "Service deleted successfully",}; };