
export const PATHS = {
  // Public
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  FORGOT_PASSWORD: '/forgot-password',
  RESET_PASSWORD: '/reset-password/:token',
  RESIDENCES: '/residences',
  RESIDENCE_DETAIL: '/residences/:id',
  APARTMENTS: '/apartments',
  APARTMENT_DETAIL: '/apartments/:apartmentId',
  BOOKING: '/apartments/:apartmentId/book',

  // Admin
  ADMIN: {
    ROOT: '/admin',
    DASHBOARD: '/admin/dashboard',
    RESIDENCES: '/admin/residences',
    APARTMENTS: '/admin/apartments',
    CHARGES: '/admin/charges',
    INCIDENTS: '/admin/incidents',
  },

  // Syndic
  SYNDIC: {
    ROOT: '/syndic',
    DASHBOARD: '/syndic/dashboard',
    RESIDENCES: '/syndic/residences',
    RESIDENCE_CREATE: '/syndic/residences/create',
    RESIDENCE_EDIT: '/syndic/residences/:id/edit',
    RESIDENCE_SETUP: '/syndic/residences/:id/setup',
    RESIDENCE_PHOTOS: '/syndic/residences/:id/photos',
    APARTMENTS: '/syndic/apartments',
    APARTMENT_CREATE: '/syndic/residences/:residenceId/apartments/new',
    APARTMENT_EDIT: '/syndic/apartments/:apartmentId/edit',
    OWNERS: '/syndic/owners',
    OWNER_CREATE: '/syndic/owners/new',
    OWNER_DETAIL: '/syndic/owners/:id',
    CHARGES: '/syndic/charges',
    CHARGE_CREATE: '/syndic/charges/create',
    INCIDENTS: '/syndic/incidents',
    INCIDENT_DETAIL: '/syndic/incidents/:id',
    RESERVATIONS: '/syndic/reservations',
    RESERVATION_DETAIL: '/syndic/reservations/:id',
  },

  // Owner
  OWNER: {
    ROOT: '/owner',
    MY_CHARGES: '/owner/my-charges',
    INCIDENTS: '/owner/incidents',
    INCIDENT_CREATE: '/owner/incidents/new',
    INCIDENT_DETAIL: '/owner/incidents/:id',
    INCIDENT_EDIT: '/owner/incidents/:id/edit',
  },
} as const;