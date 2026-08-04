import { type RouteObject } from "react-router-dom";


import RoleGuard from "@/components/guards/RoleGuard";

import AdminLayout from "@/layouts/AdminLayout";

import AdminDashboardPage from "@/features/dashboard/pages/Admindashboardpage";

import ResidencesPage from "@/features/residences/pages/SyndicResidencesPage";
import ApartmentsPage from "@/features/apartments/pages/Apartmentspage";

import ChargesPage from "@/features/charges/pages/chargespage";
import IncidentsPage from "@/features/incidents/pages/Incidentspage";


export const adminRoutes: RouteObject[] = [
  {
    element: (

        <RoleGuard allowedRoles={["admin"]}>
          <AdminLayout />
        </RoleGuard>

    ),

    children: [
      {   path: "/admin/dashboard",    element: <AdminDashboardPage />, },

      { path: "/admin/residences",   element: <ResidencesPage />,},

      { path: "/admin/apartments",  element: <ApartmentsPage />,},

      {   path: "/admin/charges",  element: <ChargesPage />,},

      {  path: "/admin/incidents",    element: <IncidentsPage />,},

    ],
  },
];