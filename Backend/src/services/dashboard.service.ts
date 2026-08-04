import * as DashboardModel from "../models/dashboard.models" 

export const getSyndicDashboard = 
async(id:string):Promise<any>=>{

const syndic = await DashboardModel.getSyndicById(id);
if (!syndic)
{    throw new Error("Syndic not found");}  
return await DashboardModel.getSyndicDashboard(id);
}

export const getAdminDashboard = 
async():Promise<any>=>{
return await DashboardModel.getAdminDashboard();
}