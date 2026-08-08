// src/utils/incidentNavigation.ts
type UserRole = "owner" | "syndic" | "admin" | undefined;

export const incidentNavigation = {
  list(role: UserRole):string {
    switch (role) {
      case "owner":
        return "/owner/incidents";

      case "syndic":
        return "/syndic/incidents";
              case "admin":
        return "/admin/incidents";
      
      default:
        return "/";

    }
  },

  create(role: UserRole) {
    switch (role) {
      case "owner":
        return "/owner/incidents/new";

      case "syndic":
        return "/syndic/incidents/new";
        default:
      return "/";

    }
  },

  detail(id: string, role: UserRole) {
    switch (role) {
      case "owner":
        return `/owner/incidents/${id}`;

      case "syndic":
        return `/syndic/incidents/${id}`;

      case "admin":
        return `/admin/incidents/${id}`;
        default:
      return "/";

    }
  },

  edit(id: string, role: UserRole) {
    switch (role) {
      case "syndic":
        return `/syndic/incidents/${id}/edit`;

       case "owner":
        return `/owner/incidents/${id}/edit`;  
        default:
      return "/";
    }
  },
};