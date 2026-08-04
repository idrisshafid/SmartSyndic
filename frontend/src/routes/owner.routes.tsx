import { type RouteObject } from 'react-router-dom';
import OwnerLayout from '@/layouts/OwnerLayout';
import MyChargesPage from '@/features/charges/pages/Mychargespage';
import IncidentsPage from '@/features/incidents/pages/Incidentspage';
import IncidentDetailPage from '@/features/incidents/pages/Detailincidentpage';
import BookingPage from '@/features/reservations/pages/BookingPage';
import ResidenceDetailPage from '@/features/residences/pages/PublicDetailResidence';
import PublicResidencesPage from '@/features/residences/pages/ResidencesPage';
import ApartmentDetailsPage from '@/features/apartments/pages/ApartmentDetailsPage';
import ApartmentsSearchPage from '@/features/apartments/pages/Apartmentspage';
import CreateIncidentPage from '@/features/incidents/pages/CreateIncidentPage';
import EditIncidentPage from '@/features/incidents/pages/EditIncidentPage';
import HomePage from '@/features/home/homepage';
import AnnouncementsPage from '@/features/announcements/pages/GetAllannouncements';
import NotificationsPage from '@/features/notifications/pages/notificationspage';

export const ownerRoutes: RouteObject[] = [
  { path:'owner',
    element: (
        <OwnerLayout />
    ),
    children: [
       { index: true, element: <HomePage /> }, 
      // Public-like routes but under owner layout – they will have the owner sidebar/navbar
      { path: 'residences', element: <PublicResidencesPage /> },
      { path: 'residences/:id', element: <ResidenceDetailPage /> },
      
      { path: 'apartments/:apartmentId', element: <ApartmentDetailsPage /> },
      { path: 'apartments', element: <ApartmentsSearchPage /> },
      { path: 'apartments/:apartmentId/book', element: <BookingPage /> },
      
      // Owner specific
      { path: "my-charges", element: <MyChargesPage /> },

      // Incidents
      { path: 'incidents', element: <IncidentsPage /> },
      { path: 'incidents/new', element: <CreateIncidentPage /> },
      { path: 'incidents/:id', element: <IncidentDetailPage /> },
      { path: 'incidents/:id/edit', element: <EditIncidentPage /> },
      {path:'apartments/:apartmentId/book',element:<BookingPage/>} ,
       //announcements
        {path:'announcements/',element:<AnnouncementsPage/>} ,
          {path:'notifications' , element:<NotificationsPage/>},    

    ],
  },
];