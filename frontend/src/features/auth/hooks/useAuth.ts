
import { useMutation  ,   useQuery   ,   useQueryClient} from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { login, logout,me , register , Forgotpassword ,Resetpassword ,getUserById}  
from "../services/auth.services";
import { PATHS } from "@/routes/paths";

import {useAuthStore   } from  "@/stores/auth.store";

import type {LoginData , RegisterData , ForgotpasswordData} from "../types/auth.types";


export const useUser = (id: string) => {
  return useQuery({
    queryKey: ["user", id],
    queryFn: () => getUserById(id),
    enabled: !!id,
    retry: false,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};
// =================================
// LOGIN HOOK
// =================================
// ✅ import centralized paths

export const useLogin = () => {
  const setAuth = useAuthStore((state) => state.setAuth);
  const navigate = useNavigate();

  return useMutation({
    mutationFn: (data: LoginData) => login(data),

    onSuccess: (response) => {
      // response should contain { user, token }
      const { user, token } = response.data;

      // Save to store
      setAuth(user, token);

      // Redirect based on role
      switch (user.role) {
        case "admin":
          navigate(PATHS.ADMIN.DASHBOARD); // "/admin/dashboard"
          break;
        case "syndic":
          navigate(PATHS.SYNDIC.DASHBOARD); // "/syndic/dashboard"
          break;
        case "owner":
          navigate(PATHS.OWNER.ROOT); // "/owner"
          break;
      }
    },

    onError: (error) => {
      console.error("Login error:", error);
    },
  });
};

// =================================
// REGISTER HOOK
// =================================

export const useRegister = () => {
  const setAuth = useAuthStore((state) => state.setAuth);
  const navigate = useNavigate();

  return useMutation({
    mutationFn: (data: RegisterData) => register(data),

    onSuccess: (response) => {
      // response should contain { user, token } (same structure as login)
      const { user, token } = response.data;

      // Save to store (auto‑login after registration)
      setAuth(user, token);

      // Redirect based on role (same as login)
      switch (user.role) {
        case "admin":
          navigate(PATHS.ADMIN.DASHBOARD);
          break;
        case "syndic":
          navigate(PATHS.SYNDIC.DASHBOARD);
          break;
        case "owner":
          navigate(PATHS.OWNER.ROOT);
          break;
        default:
          navigate(PATHS.HOME);
      }
    },

    onError: (error) => {
      console.error("Registration failed", error);
    },
  });
};


// =================================
// LOGOUT HOOK
// =================================

export const useLogout = () => {

const queryClient =  useQueryClient();

const logoutStore = useAuthStore(state=>state.logout);

return useMutation({

mutationFn:   ()   =>    logout(),

onSuccess : () => {

 logoutStore();

 queryClient.clear() ;   


}

});   };

// =================================
// CURRENT USER
// =================================

export const useCurrentUser = () => {

return useQuery({

queryKey  : [  "current-user"  ]   ,

queryFn:   ()=>me()      ,                 });

};

//=============================================
//FORGET PASSWORD
//============================================
export const useForgotPassword = () => {

  return useMutation({

  mutationFn: (data: ForgotpasswordData) =>Forgotpassword(data) ,

  });
};
//=============================================
//RESET PASSWORD
//============================================
export const useResetPassword = () => {
  return useMutation({
    mutationFn: (data: { token: string; newPassword: string }) =>
      Resetpassword(data),
  });
};