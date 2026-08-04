import { QueryClient } from "@tanstack/react-query";

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      
      // Les données restent "fraîches" pendant 5 minutes
      staleTime: 1000 * 60 * 5,

      // Réessaie automatiquement 1 fois si la requête échoue
      retry: 1,

      // Ne pas relancer automatiquement au retour sur l'onglet
      refetchOnWindowFocus: false,
    },

    mutations: {
      // Réessaie une mutation une seule fois
      retry: 1,
    },
  },
});