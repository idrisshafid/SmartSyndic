import { type RouteObject } from 'react-router-dom';
import HomePage from '@/features/home/homepage';
import PublicResidencesPage from '@/features/residences/pages/ResidencesPage';
import DetailResidencePage from '@/features/residences/pages/PublicDetailResidence';
import BookingPage from '@/features/reservations/pages/BookingPage';
import ApartmentDetailsPage from '@/features/apartments/pages/ApartmentDetailsPage';
import ApartmentsSearchPage from '@/features/apartments/pages/Apartmentspage';
import LoginPage from '@/features/auth/pages/loginpage';
import RegisterPage from '@/features/auth/pages/registerpage';
import ForgotPasswordPage from '@/features/auth/pages/forgotpasswordpage';
import PublicLayout from '@/layouts/PublicLayout';
import ResetPasswordPage from '@/features/auth/pages/ResetPasswordPage';
import { PATHS } from './paths';
import ChatbotFloating from '@/features/chatbot/components/ChatbotFloating';

export const publicRoutes: RouteObject[] = [
  {
    element: <PublicLayout />,
    children: [
      { index: true, element: <HomePage /> },
      {path:'/chatbot',element:<ChatbotFloating/>} ,
      {path: PATHS.RESET_PASSWORD, element: <ResetPasswordPage/>},
      { path: PATHS.RESIDENCES, element: <PublicResidencesPage /> },
      { path: PATHS.RESIDENCE_DETAIL, element: <DetailResidencePage /> },
      { path: PATHS.APARTMENTS, element: <ApartmentsSearchPage /> },
      { path: PATHS.APARTMENT_DETAIL, element: <ApartmentDetailsPage /> },
      { path: PATHS.BOOKING, element: <BookingPage /> },
      { path: PATHS.LOGIN, element: <LoginPage /> },
      { path: PATHS.REGISTER, element: <RegisterPage /> },
      { path: PATHS.FORGOT_PASSWORD, element: <ForgotPasswordPage /> },
    ],
  },
];