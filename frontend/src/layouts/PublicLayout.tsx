import { Outlet } from 'react-router-dom';
import Navbar from '@/components/navigation/PublicNavbar';
import ChatbotFloating from '@/features/chatbot/components/ChatbotFloating';

export default function PublicLayout() {
  return (
    <div className="min-h-screen mx-6">
      <Navbar />
      <main className="container mx-auto px-4 py-8">
        <Outlet />  <ChatbotFloating/>
      </main>
    </div>
  );
}