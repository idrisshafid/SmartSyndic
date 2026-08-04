import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link } from "react-router-dom";
import axios from "axios";
import { Mail } from "lucide-react";

import {
  ForgotpasswordSchema,
  type ForgotpasswordFormData,
} from "../schema/forgetpassword.schema";

import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import { useForgotPassword } from "../hooks/useAuth";

export default function ForgotPasswordPage() {
  const forgotPasswordMutation = useForgotPassword();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotpasswordFormData>({
    resolver: zodResolver(ForgotpasswordSchema),
  });

  const onSubmit = (data: ForgotpasswordFormData) => {
    forgotPasswordMutation.mutate(data);
  };

  // ─── SUCCESS WIZARD ──────────────────────────────────────────────────────────

  if (forgotPasswordMutation.isSuccess) {
    return (
      <div className="flex min-h-screen items-center justify-center px-6">
        <div className="w-full max-w-md">
          <div className="rounded-3xl border-2 border-emerald-200 bg-white p-8 shadow-2xl dark:border-emerald-800 dark:bg-slate-800 text-center">
            <div className="mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-900/30">
              <Mail size={40} className="text-emerald-600 dark:text-emerald-400" />
            </div>

            <h2 className="text-2xl font-bold ">
              Check your inbox
            </h2>

            <p className="mt-3 text-xm leading-relaxed ">
              We&rsquo;ve sent a password reset link to your email address.
              <br />
              Please check your inbox (and spam folder) to continue.
            </p>

            <Link
              to="/login"
              className="mt-7 inline-flex w-full items-center justify-center rounded-xl bg-orange-500 px-6 py-3 text-sm font-semibold text-white transition-all duration-200 hover:bg-orange-600 hover:shadow-lg"
            >
              Back to Sign in
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // ─── FORM ────────────────────────────────────────────────────────────────────

  return (
    <div className="flex min-h-screen items-center justify-center px-6">
      <div className="w-full max-w-md">
        <div className="rounded-3xl border-2 border-orange-400 p-8 shadow-2xl">
          {/* Header */}
          <div className="mb-7">
            <p className="text-3xl font-semibold">Forgot Password</p>
            <p className="pt-5 text-xm leading-relaxed ">
              Enter your email address and we&rsquo;ll send you a password reset link.
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <Input
              label="Email Address"
              type="email"
              placeholder="email@example.com"
              {...register("email")}
              error={errors.email?.message}
            />

            <Button type="submit" loading={forgotPasswordMutation.isPending}>
              Recover your account
            </Button>
          </form>

          {/* Error */}
          {forgotPasswordMutation.isError &&
            axios.isAxiosError(forgotPasswordMutation.error) && (
              <div className="mt-6 rounded-xl border border-red-200 bg-red-50 p-4 dark:border-red-800 dark:bg-red-900/20">
                <p className="text-sm font-medium text-red-700 dark:text-red-400">
                  {forgotPasswordMutation.error.response?.data?.message}
                </p>
              </div>
            )}

          <div className="mt-6 text-center text-sm">
            Remember your password?{" "}
            <Link
              to="/login"
              className="font-semibold text-orange-500 hover:text-orange-600"
            >
              Sign in
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}