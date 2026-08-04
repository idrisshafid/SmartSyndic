import axios from "axios";
import { useAuthStore } from "@/stores/auth.store";

// =====================================
// AXIOS INSTANCE
// =====================================

const api = axios.create({
  
     baseURL : import.meta.env.VITE_API_URL,

    headers:  {   "Content-Type": "application/json",  },
});

// =====================================
// REQUEST INTERCEPTOR
// Ajouter automatiquement le JWT
// =====================================
api.interceptors.request.use(
  (config) => {
    // Get token from store
    const token = useAuthStore.getState().token;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    } else {
      // Fallback: read from localStorage
      const stored = localStorage.getItem("auth-storage");
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          const tokenFromStorage = parsed.state?.token;
          if (tokenFromStorage) {
            config.headers.Authorization = `Bearer ${tokenFromStorage}`;
          }
        } catch  { /* ignore */ }
      }
    }
    console.log("🔑 Token attached:", config.headers.Authorization ? "✅ Yes" : "❌ No");
    return config;
  },
  (error) => Promise.reject(error)
);


// =====================================
// RESPONSE INTERCEPTOR
// Gérer automatiquement les erreurs 401
// =====================================

api.interceptors.response.use(

  (response) => response) ;

export default api;