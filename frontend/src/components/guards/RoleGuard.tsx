import { Navigate, useLocation } from "react-router-dom";
import { useAuthStore } from "@/stores/auth.store";

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: Array<"admin" | "syndic" | "owner" | undefined>;
}

export default function ProtectedRoute({
  children,
  allowedRoles,
}: ProtectedRouteProps) {
  const user = useAuthStore((state) => state.user);
  const location = useLocation();

  // Not authenticated
  if (!user) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  // Authenticated but role not allowed
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    switch (user.role) {
      case "admin":
        return <Navigate to="/admin/dashboard" replace />;

      case "syndic":
        return <Navigate to="/syndic/dashboard" replace />;

      case "owner":
        return <Navigate to="/owner/" replace />;

      default:
        return <Navigate to="/login" replace />;
    }
  }

  return <>{children}</>;
}