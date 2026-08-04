export function getResidenceDetailPath(
  role: string | undefined,
  residenceId: string
) {
  switch (role) {
    case "syndic":
      return `/syndic/residences/${residenceId}`;

    case "owner":
      return `/owner/residences/${residenceId}`;

    case "admin":
      return `/admin/residences/${residenceId}`;

    default:
      return `/residences/${residenceId}`;
  }
}

export function getResidencesPath(role?:  string | undefined) {
  switch (role) {
    case "syndic":
      return "/syndic/residences";
    case "owner":
      return "/owner/residences";
    case "admin":
      return "/admin/residences";
    default:
      return "/residences";}}

      export function getApartmentDetailPath(
  role: string | undefined, apartmentId: string) {
  switch (role) {
    case "syndic":
      return `/syndic/apartments/${apartmentId}`;
    case "owner":
      return `/owner/apartments/${apartmentId}`;
    case "admin":
      return `/admin/apartments/${apartmentId}`;
    default:
      return `/apartments/${apartmentId}`;
  }
}