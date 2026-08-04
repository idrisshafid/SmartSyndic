import { type RouteObject } from 'react-router-dom';
import SyndicLayout from '@/layouts/SyndicLayout';
import SyndicDashboardPage from '@/features/dashboard/pages/Syndicdashboardpage';
import Syndicresidencespage from '@/features/residences/pages/SyndicResidencesPage';
import CreateResidencePage from '@/features/residences/pages/CreateResidencePage';
import EditResidencePage from '@/features/residences/pages/EditResidencePage';
import SyndicResidenceDetailPage from '@/features/residences/pages/DetailResidence';
import ResidencePhotosPage from '@/features/residences/pages/Residencephotospage';
import ResidenceSetupPage from '@/features/residences/pages/ResidenceSetupPage';
import CreateApartmentWizardPage from '@/features/apartments/pages/CreateApartmentWizardPage';
import EditApartmentWizardPage from '@/features/apartments/pages/EditApartmentPage';
import ApartmentsPage from '@/features/apartments/pages/Apartmentspage';
import ApartmentDetailsPage from '@/features/apartments/pages/ApartmentDetailsPage';
import CreateOwnerForm from '@/features/owners/pages/CreateOwnerForm';
import OwnersPage from '@/features/owners/pages/OwnersPage';
import OwnerDetailPage from '@/features/owners/pages/OwnerDetailPage.tsx';
import CreateChargePage from '@/features/charges/pages/createchargepage';
import ChargesPage from '@/features/charges/pages/chargespage';
import IncidentsPage from '@/features/incidents/pages/Incidentspage';
import IncidentDetailPage from '@/features/incidents/pages/Detailincidentpage';

import SyndicReservationsPage from '@/features/reservations/pages/SyndicReservationsPage';
import ReservationDetailPage from '@/features/reservations/pages/Reservationdetailpage';
import PublicResidencesPage from '@/features/residences/pages/ResidencesPage';
import HomePage from '@/features/home/homepage';
import ResidenceDetailPage from '@/features/residences/pages/PublicDetailResidence';
import BookingPage from '@/features/reservations/pages/BookingPage';
import CreatePaymentPage from '@/features/charges/pages/creatpayment';
import CreateAnnouncementPage from '@/features/announcements/pages/CreateAnnouncementPage';
import EditAnnouncementPage from '@/features/announcements/pages/editannouncementpage';
import AnnouncementsPage from '@/features/announcements/pages/GetAllannouncements';
import NotificationsPage from '@/features/notifications/pages/notificationspage';

export const syndicRoutes: RouteObject[] = [
  {
    path: 'syndic',
    element: <SyndicLayout />,
    children: [
       { path: 'home', element: <HomePage /> },    
      { index: true, element: <SyndicDashboardPage /> }, // /syndic
      { path: 'dashboard', element: <SyndicDashboardPage /> }, // /syndic/dashboard

      // Residences
      { path: 'residences', element: <PublicResidencesPage /> },
      { path: 'my-residences', element: <Syndicresidencespage /> },
      { path: 'residences/create', element: <CreateResidencePage /> },
      { path: 'residences/:id', element: <ResidenceDetailPage /> },
      { path: 'residences/:id/edit', element: <EditResidencePage /> },
      { path: 'residences/:id/setup', element: <ResidenceSetupPage /> },
      { path: 'residences/:id/photos', element: <ResidencePhotosPage /> },
      {path:'residences/:id/detail' , element:<SyndicResidenceDetailPage/>} ,

      // Apartments
      { path: 'apartments', element: <ApartmentsPage /> },
      { path: 'residences/:residenceId/apartments/new', element: <CreateApartmentWizardPage /> },
      { path: 'apartments/:apartmentId', element: <ApartmentDetailsPage /> },
      { path: 'apartments/:apartmentId/edit', element: <EditApartmentWizardPage /> },

      // Owners
      { path: 'owners', element: <OwnersPage /> },
      { path: 'owners/new', element: <CreateOwnerForm /> },
      { path: 'owners/:id', element: <OwnerDetailPage /> },

      // Charges
      { path: 'charges', element: <ChargesPage /> },
      { path: 'charges/create', element: <CreateChargePage /> },
       //create payment
      { path: "create-payment", element: <CreatePaymentPage />,},

      // Incidents
      { path: 'incidents', element: <IncidentsPage /> },
      { path: 'incidents/:id', element: <IncidentDetailPage /> },

      // Reservations
      { path: 'reservations', element: <SyndicReservationsPage /> },
      { path: 'reservations/:id', element: <ReservationDetailPage /> },
       { path: 'apartments/:apartmentId/book', element: < BookingPage/> },
       //annonces
       {path:'announcements/new' , element:<CreateAnnouncementPage/>},
        {path:'announcements/:id/edit' , element:<EditAnnouncementPage/>},
        {path:'announcements/',element:<AnnouncementsPage/>},
        //notifications
         {path:'notifications' , element:<NotificationsPage/>},        
 
    ],
  },
];