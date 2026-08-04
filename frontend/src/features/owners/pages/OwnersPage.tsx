import { useEffect } from "react";
import { Link } from "react-router-dom";
import { Plus, Users, AlertCircle } from "lucide-react";
import { useOwners } from "../hooks/owner.hooks";
import OwnerCard from "../components/OwnerCard";
import type { Owner } from "../types/owner.types";

export default function OwnersPage() {
  const { data, isLoading, isError, error, refetch } = useOwners();

  useEffect(() => {
    refetch();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const owners = (data?.data ?? []) as Owner[];

  return (
    <div className="min-h-screen px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-8 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Owners</h1>
            <p className="mt-1 text-sm">
              Manage all property owners linked to your residences.
            </p>
          </div>
          <Link
            to="/syndic/owners/new"
            className="inline-flex items-center gap-2 rounded-xl bg-orange-500 px-5 py-2.5 text-sm font-semibold text-white shadow-sm shadow-orange-200/50 transition hover:bg-orange-600 hover:shadow-orange-300/50"
          >
            <Plus size={18} />
            Add Owner
          </Link>
        </div>

        {/* Content */}
        {isLoading ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div
                key={i}
                className="rounded-2xl p-6 shadow-sm border"
              >
                <div className="flex items-start gap-4">
                  <div className="h-14 w-14 animate-pulse rounded-full" />
                  <div className="flex-1 space-y-2">
                    <div className="h-4 w-3/4 animate-pulse rounded" />
                    <div className="h-3 w-1/2 animate-pulse rounded" />
                  </div>
                </div>
                <div className="mt-4 space-y-2">
                  <div className="h-3 w-full animate-pulse rounded" />
                  <div className="h-3 w-2/3 animate-pulse rounded" />
                </div>
                <div className="mt-4 flex flex-wrap gap-2">
                  <div className="h-6 w-16 animate-pulse rounded-full" />
                  <div className="h-6 w-16 animate-pulse rounded-full" />
                </div>
                <div className="mt-4 h-9 w-full animate-pulse rounded-xl" />
              </div>
            ))}
          </div>
        ) : isError ? (
          <div className="flex flex-col items-center justify-center rounded-3xl border p-12 text-center">
            <AlertCircle size={40} />
            <h2 className="mt-4 text-lg font-semibold">
              Couldn't load owners
            </h2>
            <p className="mt-1 max-w-sm text-sm">
              {error instanceof Error ? error.message : "An unknown error occurred."}
            </p>
          </div>
        ) : owners.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-3xl border-2 border-dashed p-16 text-center">
            <Users size={48} />
            <h2 className="mt-4 text-xl font-semibold">
              No owners yet
            </h2>
            <p className="mt-1 max-w-sm text-sm">
              Start by adding your first owner. They'll appear here once created.
            </p>
            <Link
              to="/syndic/owners/new"
              className="mt-6 inline-flex items-center gap-2 rounded-xl bg-orange-500 px-6 py-2.5 text-sm font-semibold text-white shadow-sm shadow-orange-200/50 transition hover:bg-orange-600 hover:shadow-orange-300/50"
            >
              <Plus size={18} />
              Add Owner
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-4">
            {owners.map((owner) => (
              <OwnerCard key={owner.id} owner={owner} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}