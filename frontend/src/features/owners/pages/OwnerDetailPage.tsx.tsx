import { useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Mail,
  Phone,
  MapPin,
  Building2,
  Home,
  CreditCard,
  CheckCircle,
  XCircle,
  Plus,
  Search,
  Loader2,
  Trash2,
  AlertCircle,
} from "lucide-react";
import { useQuery, useQueryClient } from "@tanstack/react-query";

import {
  useOwner,
  useOwnerApartments,
  useAssignApartment,
  useUnassignApartment,
} from "../hooks/owner.hooks";
import { getAllApartment } from "@/features/apartments/services/apartments.service";
import type { Apartment } from "../types/owner.types";
import OwnerFigure from "../components/OwnerFigure";
import { useChargesForOwner, useValidateCharge } from "@/features/charges/hooks/usecharges";
import { ChargeBadge } from "@/features/charges/components/ChargeBadge";
import type { Charge } from "@/features/charges/types/charge.type";

// ─── Stats Card ──────────────────────────────────────────────────────────────
interface StatCardProps {
  label: string;
  value: number;
  icon: React.ReactNode;
  color: "orange" | "green" | "blue" | "red";
}

function StatCard({ label, value, icon, color }: StatCardProps) {
  const colorMap = {
    orange: "bg-orange-50 text-orange-600",
    green: "bg-green-50 text-green-600",
    blue: "bg-blue-50 text-blue-600",
    red: "bg-red-50 text-red-600",
  };
  return (
    <div className="rounded-2xl p-6 shadow-sm border transition hover:shadow-md">
      <div className="flex items-center justify-between">
        <div className={`rounded-full p-2.5 ${colorMap[color]}`}>{icon}</div>
        <span className="text-2xl font-bold">{value}</span>
      </div>
      <p className="mt-1 text-sm">{label}</p>
    </div>
  );
}

// ─── Apartment Card ──────────────────────────────────────────────────────────
interface ApartmentCardProps {
  apartment: Apartment & { residence_name?: string };
  onUnassign: (id: string) => void;
  isUnassigning: boolean;
}

function ApartmentCard({ apartment, onUnassign, isUnassigning }: ApartmentCardProps) {
  const statusColors: Record<string, string> = {
    available: "bg-green-100 text-green-700",
    occupied: "bg-slate-100 text-slate-700",
    maintenance: "bg-amber-100 text-amber-700",
  };

  return (
    <div className="group rounded-2xl p-5 shadow-sm border transition hover:shadow-md">
      <div className="flex items-start justify-between">
        <div>
          <h3 className="text-lg font-semibold">
            Apartment {apartment.apartment_number}
          </h3>
          {apartment.residence_name && (
            <p className="text-sm">{apartment.residence_name}</p>
          )}
          <div className="mt-2 flex flex-wrap items-center gap-3 text-sm">
            {apartment.floor !== undefined && <span>Floor {apartment.floor}</span>}
            {apartment.capacity && <span>• {apartment.capacity} guests</span>}
            <span
              className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${
                statusColors[apartment.status] || "bg-slate-100 text-slate-600"
              }`}
            >
              {apartment.status || "Unknown"}
            </span>
          </div>
        </div>
        <button
          onClick={() => onUnassign(apartment.id)}
          disabled={isUnassigning}
          className="rounded-full p-2 transition hover:bg-red-50 hover:text-red-600 disabled:opacity-50"
        >
          {isUnassigning ? <Loader2 size={16} className="animate-spin" /> : <Trash2 size={16} />}
        </button>
      </div>
    </div>
  );
}

// ─── Assign Apartment Modal ──────────────────────────────────────────────────
interface AssignModalProps {
  isOpen: boolean;
  onClose: () => void;
  ownerId: string;
  onAssign: () => void;
}

function AssignModal({ isOpen, onClose, ownerId, onAssign }: AssignModalProps) {
  const [selected, setSelected] = useState<string>("");
  const [search, setSearch] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { data } = useQuery({
    queryKey: ["apartments", "all"],
    queryFn: getAllApartment,
    enabled: isOpen,
  });
  const assign = useAssignApartment();
  const queryClient = useQueryClient();

  const allApartments: Apartment[] = Array.isArray(data?.data) ? data.data : [];

  const filtered = search.trim()
    ? allApartments.filter((a) =>
        a.apartment_number.toLowerCase().includes(search.trim().toLowerCase())
      )
    : allApartments;

  const handleAssign = async () => {
    if (!selected) return;
    setIsSubmitting(true);
    try {
      await assign.mutateAsync({ ownerId, apartmentId: selected });
      queryClient.invalidateQueries({ queryKey: ["owner-apartments", ownerId] });
      onAssign();
      onClose();
    } catch (error) {
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-3xl p-6 shadow-2xl border">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-bold">Assign Apartment</h3>
          <button onClick={onClose} className="rounded-full p-1 hover:bg-slate-100">
            <XCircle size={20} />
          </button>
        </div>

        <div className="mt-4">
          <div className="relative">
            <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search apartment..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="h-12 w-full rounded-xl border outline-none transition focus:border-orange-500"
            />
          </div>
          <div className="mt-2 max-h-48 overflow-auto rounded-xl border">
            {filtered.length === 0 ? (
              <p className="p-3 text-sm">No apartments found</p>
            ) : (
              filtered.map((apt) => (
                <label
                  key={apt.id}
                  className={`flex cursor-pointer items-center gap-3 px-4 py-2.5 transition hover:bg-orange-50 ${
                    selected === apt.id ? "bg-orange-50" : ""
                  }`}
                >
                  <input
                    type="radio"
                    checked={selected === apt.id}
                    onChange={() => setSelected(apt.id)}
                    className="h-4 w-4 accent-orange-500"
                  />
                  <span className="text-sm">
                    {apt.apartment_number}
                    {apt.floor !== undefined && ` – Floor ${apt.floor}`}
                  </span>
                </label>
              ))
            )}
          </div>
        </div>

        <div className="mt-5 flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 rounded-xl border py-2.5 text-sm font-medium transition hover:bg-slate-50"
          >
            Cancel
          </button>
          <button
            onClick={handleAssign}
            disabled={!selected || isSubmitting}
            className="flex-1 rounded-xl bg-orange-500 py-2.5 text-sm font-semibold text-white transition hover:bg-orange-600 disabled:opacity-50"
          >
            {isSubmitting ? <Loader2 size={16} className="animate-spin mx-auto" /> : "Assign"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Main Page ──────────────────────────────────────────────────────────────
export default function OwnerDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [assignModalOpen, setAssignModalOpen] = useState(false);

  const { data: ownerData, isLoading, isError } = useOwner(id ?? "");
  const { data: apartmentsData, isLoading: apartmentsLoading } = useOwnerApartments(id ?? "");
  const unassign = useUnassignApartment();
  const queryClient = useQueryClient();

  const { data: chargesData, isLoading: chargesLoading, refetch: refetchCharges } =
    useChargesForOwner(id ?? "");
  const validateCharge = useValidateCharge();

  const owner = ownerData?.data;
  const apartments: Apartment[] = Array.isArray(apartmentsData?.data)
    ? apartmentsData.data
    : [];
  const charges: Charge[] = chargesData ?? [];

  const handleUnassign = (apartmentId: string) => {
    if (!id) return;
    if (!window.confirm("Remove this apartment from the owner?")) return;
    unassign.mutate(
      { ownerId: id, apartmentId },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ["owner-apartments", id] });
        },
      }
    );
  };

  const handleAssignSuccess = () => {
    queryClient.invalidateQueries({ queryKey: ["owner-apartments", id] });
  };

  const handleValidateCharge = async (chargeId: string) => {
    if (!window.confirm("Valider cette charge ?")) return;
    try {
      await validateCharge.mutateAsync(chargeId);
      refetchCharges();
    } catch (err) {
      alert(err.message || "Erreur lors de la validation.");
    }
  };

  const handleCreateCharge = () => {
    navigate(`/syndic/charges/create?ownerId=${owner?.id}`);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen px-4 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <div className="mb-8 h-8 w-32 animate-pulse rounded" />
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-4">
            <div className="lg:col-span-1">
              <div className="h-64 animate-pulse rounded-3xl border" />
            </div>
            <div className="lg:col-span-3 space-y-6">
              <div className="grid grid-cols-3 gap-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-24 animate-pulse rounded-2xl border" />
                ))}
              </div>
              <div className="h-64 animate-pulse rounded-2xl border" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (isError || !owner) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <AlertCircle size={48} className="mx-auto" />
          <h2 className="mt-4 text-2xl font-bold">Owner not found</h2>
          <Link to="/syndic/owners" className="mt-4 inline-block rounded-xl bg-orange-500 px-6 py-3 text-white">
            Back to Owners
          </Link>
        </div>
      </div>
    );
  }

  const unpaidCharges = charges.filter((c) => c.status === "pending" || c.status === "overdue").length;
  const paidCharges = charges.filter((c) => c.status === "validated").length;

  return (
    <div className="min-h-screen px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <Link
          to="/syndic/owners"
          className="mb-6 inline-flex items-center gap-2 text-sm font-medium transition"
        >
          <ArrowLeft size={18} />
          Back to Owners
        </Link>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-4">
          {/* Left card – Owner info */}
          <div className="lg:col-span-1">
            <div className="rounded-3xl p-6 shadow-sm border">
              <div className="flex flex-col items-center text-center">
                <OwnerFigure
                  firstName={owner.first_name}
                  lastName={owner.last_name}
                  size="2xl"
                  status={owner.is_active ? "active" : "inactive"}
                  showStatus
                />
                
                <div className="mt-2 space-y-1.5 text-sm">
                  <div className="flex items-center justify-center gap-2">
                    <Mail size={14} />
                    <span>{owner.email}</span>
                  </div>
                  {owner.phone && (
                    <div className="flex items-center justify-center gap-2">
                      <Phone size={14} />
                      <span>{owner.phone}</span>
                    </div>
                  )}
                  {owner.country && (
                    <div className="flex items-center justify-center gap-2">
                      <MapPin size={14} />
                      <span>{owner.country}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-3 space-y-6">
            {/* Stats */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <StatCard
                label="Apartments"
                value={apartments.length}
                icon={<Building2 size={20} />}
                color="orange"
              />
              <StatCard
                label="Unpaid Charges"
                value={unpaidCharges}
                icon={<CreditCard size={20} />}
                color="red"
              />
              <StatCard
                label="Paid Charges"
                value={paidCharges}
                icon={<CheckCircle size={20} />}
                color="green"
              />
            </div>

            {/* Apartments Section */}
            <div className="rounded-3xl p-6 shadow-sm border">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold ">Assigned Apartments</h2>
                <button
                  onClick={() => setAssignModalOpen(true)}
                  className="inline-flex items-center gap-2 rounded-xl bg-orange-500 px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-orange-600"
                >
                  <Plus size={16} />
                  Assign Apartment
                </button>
              </div>

              {apartmentsLoading ? (
                <div className="mt-4 grid gap-4 sm:grid-cols-2">
                  {[1, 2].map((i) => (
                    <div key={i} className="h-24 animate-pulse rounded-xl border" />
                  ))}
                </div>
              ) : apartments.length === 0 ? (
                <div className="mt-6 flex flex-col items-center justify-center rounded-xl border-2 border-dashed py-8 text-center">
                  <Home size={32} />
                  <p className="mt-2 text-sm">No apartments assigned yet</p>
                  <button
                    onClick={() => setAssignModalOpen(true)}
                    className="mt-2 text-sm font-medium text-orange-500 hover:underline"
                  >
                    Assign one now
                  </button>
                </div>
              ) : (
                <div className="mt-4 grid gap-4 sm:grid-cols-2">
                  {apartments.map((apt) => (
                    <ApartmentCard
                      key={apt.id}
                      apartment={apt}
                      onUnassign={handleUnassign}
                      isUnassigning={unassign.status === 'pending'}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* ─── CHARGES SECTION ─── */}
            <div className="rounded-3xl p-6 shadow-sm border">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold">Charges</h2>
                <button
                  onClick={handleCreateCharge}
                  className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-emerald-700"
                >
                  <Plus size={16} />
                  Create Charge
                </button>
              </div>

              {chargesLoading ? (
                <div className="mt-4 space-y-2">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="h-12 animate-pulse rounded-xl border" />
                  ))}
                </div>
              ) : charges.length === 0 ? (
                <div className="mt-6 flex flex-col items-center justify-center rounded-xl border-2 border-dashed py-8 text-center">
                  <CreditCard size={32} />
                  <p className="mt-2 text-sm">No charges yet</p>
                  <button
                    onClick={handleCreateCharge}
                    className="mt-2 text-sm font-medium text-emerald-600 hover:underline"
                  >
                    Create one now
                  </button>
                </div>
              ) : (
                <div className="mt-4 overflow-x-auto">
                  <table className="w-full min-w-[600px] border-collapse text-sm">
                    <thead className="text-xs font-medium uppercase">
                      <tr>
                        <th className="px-4 py-3 text-left">Title</th>
                        <th className="px-4 py-3 text-right">Amount</th>
                        <th className="px-4 py-3 text-left">Due Date</th>
                        <th className="px-4 py-3 text-center">Status</th>
                        <th className="px-4 py-3 text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y">
                      {charges.map((charge) => (
                        <tr key={charge.id} className="transition hover:bg-slate-50/50">
                          <td className="px-4 py-3 font-medium">
                            {charge.title}
                          </td>
                          <td className="px-4 py-3 text-right font-medium">
                            {new Intl.NumberFormat("fr-FR", {
                              minimumFractionDigits: 2,
                              maximumFractionDigits: 2,
                            }).format(charge.amount)} MAD
                          </td>
                          <td className="px-4 py-3">
                            {new Intl.DateTimeFormat("fr-FR", {
                              day: "2-digit",
                              month: "2-digit",
                              year: "numeric",
                            }).format(new Date(charge.due_date))}
                          </td>
                          <td className="px-4 py-3 text-center">
                            <ChargeBadge status={charge.status} />
                          </td>
                          <td className="px-4 py-3 text-right">
                            {charge.status === "pending" && (
                              <button
                                onClick={() => handleValidateCharge(charge.id)}
                                disabled={validateCharge.isPending}
                                className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-3 py-1 text-xs font-medium text-emerald-700 transition hover:bg-emerald-200 disabled:opacity-50"
                              >
                                {validateCharge.isPending ? (
                                  <Loader2 size={12} className="animate-spin" />
                                ) : (
                                  <CheckCircle size={14} />
                                )}
                                Validate
                              </button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Assign Modal */}
        <AssignModal
          isOpen={assignModalOpen}
          onClose={() => setAssignModalOpen(false)}
          ownerId={owner.id}
          onAssign={handleAssignSuccess}
        />
      </div>
    </div>
  );
}