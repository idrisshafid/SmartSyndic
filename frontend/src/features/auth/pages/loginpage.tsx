import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";

import { loginSchema , type LoginFormData }  from "../schema/login.schema";

import axios from "axios";

import { useLogin } from "../hooks/useAuth";
import {SyndicIllustration} from "../components/SyndicIllustration"
import { Link } from "react-router-dom";


export default function LoginPage() {

   const loginMutation = useLogin();

   const {  register  , handleSubmit , formState: { errors },  } = 

      useForm<LoginFormData>({resolver: zodResolver(loginSchema),  });
    
   const onSubmit = (data: LoginFormData) => {

      loginMutation.mutate(data);            };

  return (
    
    <div className="min-h-screen 
    
      flex justify-between items-center justify-center px-6 ">

       <SyndicIllustration/>   
      <div className="w-full max-w-md mx-2">

        <div className="rounded-3xl shadow-2xl p-8 border-2 border-orange-500">

          {/* Header */}

          <div className="mb-8">

            <p className="text-3xl   font-semibold    ">

            Sign in to your account  </p>

          </div>

          {/* Form */}
  
          <form
            onSubmit = { handleSubmit ( onSubmit ) }
            className = "px-1  space-y-5"  >

            <Input 
              label="Email Address"
              type="email"
              placeholder="email@example.com"
              {...register( "email" )}
              error={errors.email?.message }  /> 
              
            <Input
              label="Password"
              type="password"
              placeholder="••••••••"
              {...register( "password" )}
              error={errors.password?.message} 
            />

            <div className="flex items-center justify-between text-sm">

              <label className="flex items-center gap-2 text-slate-600">

                <input
                  type="checkbox"
                  className="rounded border-slate-300 accent-orange-500"    />

                    Remember me       </label>

                    <Link to="/forgot-password">
              <button
                type="button"
                className="text-orange-500 hover:text-orange-600 font-medium">
                Forgot password?
              </button>
                           </Link>
            </div>
              
              
            <Button
              type="submit"
              loading= {loginMutation.isPending}  >
              Sign In
            </Button>

          </form>

          {/* Error */}

        {loginMutation.isError && axios.isAxiosError(loginMutation.error) && (

            <div className="mt-6 rounded-xl border border-red-100 bg-red-50 p-4">

              <p className="text-sm font-medium text-red-700">

                {loginMutation.error.response?.data?.message}

                </p>

              </div>

            )}

        </div>

      </div>

    </div>             );  }