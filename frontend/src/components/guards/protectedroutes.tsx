import { Navigate, Outlet } from "react-router-dom";

import { useAuthStore } from "@/stores/auth.store";


interface ProtectedRouteProps {

  allowedRoles?: string[];}

export default function ProtectedRoute({
  allowedRoles
}: ProtectedRouteProps) {


  const  { isAuthenticated  ,   user  } = useAuthStore();

  // 1. Pas connecté
  if (!isAuthenticated) {

    return (
      <Navigate 
        to="/login" 
        replace 
      />
    );

  }

  // 2. Vérifier le rôle

  if (
    allowedRoles &&
    !allowedRoles.includes(user?.role || "")
  ) {

    return (
      <Navigate
        to="/unauthorized"
        replace  />);}
  // 3. Autorisé
 
  return <Outlet />;}