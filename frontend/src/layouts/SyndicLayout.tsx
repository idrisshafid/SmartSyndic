// SyndicLayout.tsx
import { Outlet , Navigate } from "react-router-dom";
import SyndicSidebar from "@/components/navigation/SyndicSidebar";
import Navbar from "@/components/navigation/Navbar";
import { useAuthStore } from "@/stores/auth.store";

export default function SyndicLayout() {
  const user = useAuthStore((state) => state.user);

  // If the user is logged out / no longer exists,
  // redirect to the public home page.
  if (!user) {
    return <Navigate to="/" replace />;
  }

  return (
    
    <div className="flex min-h-screen bg-slate-50 text-slate-900 transition-colors 
    duration-300 dark:bg-slate-950 dark:text-slate-100">
      <SyndicSidebar />
      <div className="flex flex-1 flex-col">
        <Navbar />
        <div className="flex-1 p-5">
          <Outlet />
        </div>
      </div>
    </div>
  );
}