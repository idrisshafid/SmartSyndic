import { Outlet } from 'react-router-dom';
import AdminSidebar from '@/components/navigation/AdminSidebar';
import Navbar from '@/components/navigation/Navbar';

export default function AdminLayout() {
  return (
    <div className="flex min-h-screen ">
      <AdminSidebar />
      <div className="flex-1 flex flex-col">
        <Navbar />
        <main className="p-6 flex-1">
          <Outlet />
        </main>
      </div>
    </div>
  );
}