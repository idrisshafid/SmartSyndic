export function getApartmentsPath(role?: string) {
  switch (role) {
    case "syndic":
      return "/syndic/apartments";
    case "owner":
      return "/owner/apartments";
    case "admin":
      return "/admin/apartments";
    default:
      return "/apartments";
  }
}
// src/utils/bookingNavigation.ts

export function getBookingPath(
  apartmentId: string,
  role?: string
) {
  switch (role) {
    case "owner":
      return `/owner/apartments/${apartmentId}/book`;
      case "syndic":
      return `/syndic/apartments/${apartmentId}/book`;

    default:
      return `/apartments/${apartmentId}/book`;
  }
}

export function getApartmentDetailPath(
  apartmentId: string ,
  role: string | undefined 
) {
  switch (role) {
    case "owner":
      return `/owner/apartments/${apartmentId}`;

    case "syndic":
      return `/syndic/apartments/${apartmentId}`;

      case "admin":
      return `/admin/apartments/${apartmentId}`;

    default:
      return `/apartments/${apartmentId}`;
  }
}
export function gethomepath(
  role?: string
) {
  switch (role) {
    case "owner":
      return `/owner`;

    case "syndic":
      return `/syndic/home`;
      
      case "admin":
      return `/admin`;

    default:
      return `/`;
  }
}