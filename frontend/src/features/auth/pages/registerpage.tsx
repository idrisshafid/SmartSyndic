import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { Link } from "react-router-dom";

import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import { registerSchema, type RegisterFormData } from "../schema/register.schema";
import { useRegister } from "../hooks/useAuth";

// ─── Role config ─────────────────────────────────────────────────────────────
const ROLES = [
  { value: "syndic", icon: "🏢", label: "Syndic", desc: "Manage residences" },
  { value: "owner", icon: "🏠", label: "Owner", desc: "Own apartments" },
] as const;

// ─── Component ────────────────────────────────────────────────────────────────

export default function RegisterPage() {
  const registerMutation = useRegister();

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  const selectedRole = useWatch({ control, name: "role" });

  const onSubmit = (data: RegisterFormData) => registerMutation.mutate(data);

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-6">
      <div className="w-full max-w-md">
        {/* Card – sans fond ni couleur, juste ombre et bordure */}
        <div className="rounded-2xl shadow-xl p-8 border">
          {/* HEADER */}
          <div className="mb-6">
            <p className="text-3xl font-semibold">Create your account</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
            {/* ── ROLE SELECTOR ── */}
            <div className="space-y-3">
              <p className="text-meduim font-medium text-orange-500">Register As</p>
              <div />

              <div className="grid grid-cols-2 gap-3">
                {ROLES.map((role) => (
                  <label
                    key={role.value}
                    className={`cursor-pointer rounded-2xl border-2 p-4 transition-all ${
                      selectedRole === role.value
                        ? "border-orange-500 bg-orange-500"
                        : "border hover:border-slate-300"
                    }`}
                  >
                    <input
                      type="radio"
                      value={role.value}
                      {...register("role")}
                      className="sr-only"
                    />
                    <div className="text-center">
                      <div className="text-3xl">{role.icon}</div>
                      <p className="mt-2 text-sm font-semibold">{role.label}</p>
                      <p className="text-xs">{role.desc}</p>
                    </div>
                  </label>
                ))}
              </div>

              {errors.role && (
                <p className="text-xs text-red-500">{errors.role.message}</p>
              )}
            </div>

            {/* ── NAME ── */}
            <div className="grid grid-cols-2 gap-3">
              <Input
                label="First name"
                placeholder="Ahmed"
                {...register("first_name")}
                error={errors.first_name?.message}
              />
              <Input
                label="Last name"
                placeholder="Amine"
                {...register("last_name")}
                error={errors.last_name?.message}
              />
            </div>

            <Input
              label="Phone"
              type="tel"
              placeholder="0612345678"
              {...register("phone")}
              error={errors.phone?.message}
            />

            <Input
              label="Country"
              placeholder="Morocco"
              {...register("country")}
              error={errors.country?.message}
            />

            <Input
              label="Email address"
              type="email"
              placeholder="email@example.com"
              {...register("email")}
              error={errors.email?.message}
            />

            <Input
              label="Password"
              type="password"
              placeholder="••••••••"
              {...register("password")}
              error={errors.password?.message}
            />

            <Button type="submit" loading={registerMutation.isPending}>
              Create Account
            </Button>
          </form>

          {/* ── BACKEND ERROR ── */}
          {registerMutation.isError && axios.isAxiosError(registerMutation.error) && (
            <div className="mt-4 rounded-xl border p-3">
              <p className="text-sm">
                {registerMutation.error.response?.data?.message}
              </p>
            </div>
          )}

          <div>
            <br />
            {/* ── FOOTER ── */}
            <p className="mt-6 text-center text-sm">
              Already have an account?{" "}
            </p>
            <p>
              <Link
                to="/login"
                className="font-semibold text-orange-500 hover:text-orange-600 justify-center flex items-center gap-1 text-sm"
              >
                Sign In
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}