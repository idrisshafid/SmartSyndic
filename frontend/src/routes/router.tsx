import { createBrowserRouter } from "react-router-dom";

import LoginPage from "@/features/auth/pages/loginpage";
import HomePage from "@/features/home/homepage";
import DetailResidencePage from "@/features/residences/pages/PublicDetailResidence"

import ProtectedRoute from "@/components/guards/protectedroutes";
import RegisterPage from "@/features/auth/pages/registerpage";
import PublicResidencesPage from "@/features/residences/pages/ResidencesPage";
import CreateResidencePage from "@/features/residences/pages/CreateResidencePage";
import EditResidencePage from "@/features/residences/pages/EditResidencePage";
import SyndicResidenceDetailPage from "@/features/residences/pages/DetailResidence" ;
import Syndicresidencespage from "@/features/residences/pages/SyndicResidencesPage";

import ResidencePhotosPage from "@/features/residences/pages/Residencephotospage";
import RoleGuard from "@/components/guards/RoleGuard";

import ResidenceSetupPage from "@/features/residences/pages/ResidenceSetupPage";
import ForgotPasswordPage from "@/features/auth/pages/forgotpasswordpage";
import CreateApartmentWizardPage from "@/features/apartments/pages/CreateApartmentWizardPage";
import ApartmentsPage from "@/features/apartments/pages/Apartmentspage";

import EditApartmentWizardPage from "@/features/apartments/pages/EditApartmentPage";
import ApartmentDetailsPage from "@/features/apartments/pages/ApartmentDetailsPage";
import CreateOwnerForm from "@/features/owners/pages/CreateOwnerForm";
import OwnersPage from "@/features/owners/pages/OwnersPage";
import OwnerDetailPage from "@/features/owners/pages/OwnerDetailPage.tsx";
import CreateChargePage from "@/features/charges/pages/createchargepage";
import ChargesPage from "@/features/charges/pages/chargespage";
import MyChargesPage from "@/features/charges/pages/Mychargespage";
import CreatePaymentPage from "@/features/charges/pages/creatpayment";
import BookingPage from "@/features/reservations/pages/BookingPage";
import SyndicReservationsPage from "@/features/reservations/pages/SyndicReservationsPage";
import ReservationDetailPage from "@/features/reservations/pages/Reservationdetailpage";
import CreateIncidentPage from "@/features/incidents/pages/CreateIncidentPage";
import IncidentsPage from "@/features/incidents/pages/Incidentspage";
import IncidentDetailPage from "@/features/incidents/pages/Detailincidentpage";
import EditIncidentPage from "@/features/incidents/pages/EditIncidentPage"
import SyndicDashboardPage from "@/features/dashboard/pages/Syndicdashboardpage";
import AdminDashboardPage from "@/features/dashboard/pages/Admindashboardpage";



const router = createBrowserRouter([


  {path:"/dashboard",element:<SyndicDashboardPage/>} ,
{path:"/dashboard/admin",element:<AdminDashboardPage/>} ,

  {path:"/incidents",element: <IncidentsPage />},
{path:"/incidents/new",element: <CreateIncidentPage />},
{path:"/incidents/:id",element: <IncidentDetailPage />},
{ path: "/incidents/:id/edit",  element: <EditIncidentPage />} ,

  {path:"/Reservations",element: <SyndicReservationsPage />},
{path:"/Reservations/:id",element: <ReservationDetailPage />},
{ path: "/apartments/:apartmentId/book", element: <BookingPage />,},

 { path: "/create-payment", element: <CreatePaymentPage />,},
 { path: "/my-charges", element: <MyChargesPage />,},
  {path: "/charges/create" ,  element: < CreateChargePage/>  },
  {path: "/charges", element: <ChargesPage />,},   {  element: <ProtectedRoute />, } ,


   {path:"/owners/new" , element:<CreateOwnerForm />} ,
   {path:"/Owners/" , element:<OwnersPage/>} ,
    {path:"/Owners/:id" , element:<OwnerDetailPage/>} ,
   
    {   path: "/login" ,  element: <LoginPage />  },
   {   path: "/register" ,  element:<RegisterPage/>  },
   {  path:"/forgot-password" ,    element:<ForgotPasswordPage/>  },
    { path:"/" , element:<HomePage/> },

{ path: "/apartments/:apartmentId/edit", element: <EditApartmentWizardPage /> } , 

{ path: "/apartments/:apartmentId", element: <ApartmentDetailsPage />,} ,

   { path: "/residences/:residenceId/apartments/new",  element: < CreateApartmentWizardPage /> } ,
    
{ path: "/apartments", element: <ApartmentsPage /> },

  { path:"/residences",        element:<PublicResidencesPage/>  },

    {path : "/residences/syndic" , element :  <Syndicresidencespage/>} ,
   
   {  path:"/residences/:id/",  element:<DetailResidencePage/> },

{path :"/residences/:id/photos" , element : <RoleGuard allowedRoles={["syndic"]}> 
< ResidencePhotosPage />                         </RoleGuard>  },

{ path:"/residences/create",

 element:  <RoleGuard allowedRoles={["syndic"]}>   <CreateResidencePage/>      </RoleGuard>} ,
  {
    path:"/residences/:id/setup",

    element:     <RoleGuard allowedRoles={["syndic"]}>   <ResidenceSetupPage/>
    
         </RoleGuard>  
  } ,

  {
    path:"/residences/:id/edit",   element:  <RoleGuard allowedRoles={["syndic"]}>       <EditResidencePage/>
              
              </RoleGuard>    
  } ,

  {path:"/residences/:id/detail",     element:    <SyndicResidenceDetailPage/>             } ,

  
  
]);


export default router;