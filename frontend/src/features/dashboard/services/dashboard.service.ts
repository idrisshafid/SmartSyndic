import api from "@/config/api";


// ----- Admin dashboard -----
export const getAdminDashboard = async () => {
  const response = await api.get(`/dashboard/admin`);
  return response.data.data; // the view row object
};

export const getSyndicDashboard = async (
  syndicId: string
) => {
  const response = await api.get(`/dashboard/${syndicId}`);
  return response.data.data; 
};
