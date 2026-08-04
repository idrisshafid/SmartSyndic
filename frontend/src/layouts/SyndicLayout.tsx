// SyndicLayout.tsx
import { Outlet } from "react-router-dom";
import SyndicSidebar from "@/components/navigation/SyndicSidebar";
import Navbar from "@/components/navigation/Navbar";

export default function SyndicLayout() {
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