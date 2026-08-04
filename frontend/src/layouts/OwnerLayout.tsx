import { Outlet } from 'react-router-dom';
import OwnerSidebar from '@/components/navigation/OwnerSidebar';
import Navbar from '@/components/navigation/Navbar';

export default function OwnerLayout() {
  return (
    <div className="flex min-h-screen ">
      <OwnerSidebar />
      <div className="flex-1 flex flex-col">
        <Navbar />
        <main className="p-6 flex-1">
          <Outlet />
        </main>
      </div>
    </div>
  );
}