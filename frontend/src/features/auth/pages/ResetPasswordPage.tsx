import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import { CheckCircle } from "lucide-react";

import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import { useResetPassword } from "../hooks/useAuth";

// ─── Validation schema ──────────────────────────────────────────────────────

const resetPasswordSchema = z
  .object({
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string().min(6, "Password must be at least 6 characters"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;

// ─── Component ────────────────────────────────────────────────────────────────

export default function ResetPasswordPage() {
  const { token } = useParams<{ token: string }>();

  const resetMutation = useResetPassword();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
  });

  const onSubmit = (data: ResetPasswordFormData) => {
    if (!token) {
      alert("Invalid or missing reset token.");
      return;
    }
    resetMutation.mutate({ token, newPassword: data.password });
  };

  // ─── SUCCESS STATE ──────────────────────────────────────────────────────────

  if (resetMutation.isSuccess) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 py-10">
        <div className="w-full max-w-md">
          <div className="rounded-2xl shadow-xl p-8 border text-center">
            <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
              <CheckCircle size={32} className="text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
              Password Reset Successfully!
            </h2>
            <p className="mt-3 text-sm text-slate-500 dark:text-slate-400">
              Your password has been updated. You can now log in with your new password.
            </p>
            <Link
              to="/login"
              className="mt-7 inline-flex w-full items-center justify-center rounded-xl bg-orange-500 px-6 py-3 text-sm font-semibold text-white transition-all duration-200 hover:bg-orange-600 hover:shadow-lg"
            >
              Sign in
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // ─── MAIN RENDER ─────────────────────────────────────────────────────────────

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-md">
        <div className="rounded-2xl shadow-xl p-8 border">
          <div className="mb-6">
            <p className="text-3xl font-semibold">Reset your password</p>
            <p className="mt-4 text-sm">
              Enter a new password for your account.
            </p>
          </div>

          {!token ? (
            <div className="rounded-2xl border border-red-200 bg-red-50/60 p-8 text-center shadow-sm">
              <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-red-100">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-7 w-7 text-red-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 9v3m0 4h.01M5.07 19h13.86c1.54 0 2.5-1.67 1.73-3L13.73 4c-.77-1.33-2.69-1.33-3.46 0L3.34 16c-.77 1.33.19 3 1.73 3z"
                  />
                </svg>
              </div>

              <h2 className="text-xl font-semibold text-slate-900 dark:text-white">
                Invalid or Expired Reset Link
              </h2>

              <p className="mt-3 text-sm leading-6 text-slate-500 dark:text-slate-400">
                This password reset link is no longer valid. It may have expired or has
                already been used.
              </p>

              <Link
                to="/forgot-password"
                className="mt-7 inline-flex items-center justify-center rounded-xl bg-orange-500 px-6 py-3 text-sm font-semibold text-white transition-all duration-200 hover:bg-orange-600 hover:shadow-lg"
              >
                Request a New Reset Link
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <Input
                label="New password"
                type="password"
                placeholder="••••••••"
                {...register("password")}
                error={errors.password?.message}
              />

              <Input
                label="Confirm password"
                type="password"
                placeholder="••••••••"
                {...register("confirmPassword")}
                error={errors.confirmPassword?.message}
              />

              <Button type="submit" loading={resetMutation.isPending}>
                Reset Password
              </Button>
            </form>
          )}

          {/* ── BACKEND ERROR (en rouge) ── */}
          {resetMutation.isError && axios.isAxiosError(resetMutation.error) && (
            <div className="mt-4 rounded-xl border border-red-200 bg-red-50 p-3">
              <p className="text-sm text-red-600">
                {resetMutation.error.response?.data?.message ||
                  "Password reset failed. Please try again."}
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