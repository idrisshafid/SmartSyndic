import { Outlet , Navigate} from 'react-router-dom';
import OwnerSidebar from '@/components/navigation/OwnerSidebar';
import Navbar from '@/components/navigation/Navbar';
import { useAuthStore } from "@/stores/auth.store";

export default function OwnerLayout() {
   const user = useAuthStore((state) => state.user);

  // If the user is logged out / no longer exists,
  // redirect to the public home page.
  if (!user) {
    return <Navigate to="/" replace />;
  }

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