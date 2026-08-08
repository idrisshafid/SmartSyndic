import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  Building2,
  Menu,
  X,
  Bell,
  Search,
  ChevronDown,
  LogOut,
  Home,
} from "lucide-react";
import { useAuthStore } from "@/stores/auth.store";
import { getApartmentsPath, gethomepath } from "@/utils/navigationApartment";
import { getResidencesPath } from "@/utils/ResidenceNavigation";
import ThemeToggle from "@/components/ui/ThemeToggle";
import { useUnreadCount } from "@/features/notifications/hooks/useNotifications";
import logo from "@/assets/Logo.png";

function extractUnreadCount(payload: unknown): number {
  if (payload == null) return 0;
  if (typeof payload === "number") return payload;

  const root = payload as Record<string, unknown>;

  // { count: number }
  if (typeof root.count === "number") return root.count;

  // { unread_count: number }
  if (typeof root.unread_count === "number") return root.unread_count;

  // { data: number }
  if (typeof root.data === "number") return root.data;

  // { data: { count: number } }
  if (root.data && typeof root.data === "object") {
    const data = root.data as Record<string, unknown>;
    if (typeof data.count === "number") return data.count;
    if (typeof data.unread_count === "number") return data.unread_count;
  }

  return 0;
}

export default function Navbar() {
  const location = useLocation();
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);

  const { data: unreadCountData, isLoading, isError } = useUnreadCount();
  
    const unreadCount = extractUnreadCount(unreadCountData?.unread ?? 0   );

    const navItems = [
    { name: "Residences", href: getResidencesPath(user?.role), icon: Building2 },
    { name: "Apartments", href: getApartmentsPath(user?.role), icon: Home },
  ];

  const [mobileOpen, setMobileOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  const isActive = (href: string) =>
    location.pathname === href || location.pathname.startsWith(href + "/");


  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white transition-colors duration-300 dark:border-slate-800 dark:bg-slate-900">
      <div className="flex h-14 items-center justify-between px-4 sm:px-4">
        {/* Left: Logo + Desktop Nav */}
        <div className="flex items-center gap-8">
          <Link
            to={gethomepath(user?.role)}
            className="flex shrink-0 items-center gap-2.5"
          >
            <div className="flex h-16 w-auto items-center justify-center rounded-lg">
              <img
                src={logo}
                alt="SGC Logo"
                className="h-12 w-auto flex items-center"
              />
            </div>
            {user?.role ==="admin"   || user?.role ==="syndic"   && 
            <p className="text-[13px] font-semibold tracking-tight text-slate-900 dark:text-slate-100">
              Smart Syndic
            </p> }
          </Link>

          <nav className="hidden items-center gap-0.5 lg:flex">
            {navItems.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={`relative flex items-center gap-2 rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
                  isActive(item.href)
                    ? "text-slate-900 dark:text-slate-100"
                    : "text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100"
                }`}
              >
                <item.icon className="h-4 w-4" />
                {item.name}
                {isActive(item.href) && (
                  <span className="absolute inset-x-3 -bottom-[13px] h-0.5 rounded-full bg-orange-500" />
                )}
              </Link>
            ))}
          </nav>
        </div>

        {/* Right */}
        <div className="flex items-center gap-2">
          <button
            className="hidden h-8 w-8 items-center justify-center rounded-md text-slate-500 transition hover:bg-slate-100 hover:text-slate-700 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-200 sm:flex"
            aria-label="Search"
          >
            <Search className="h-4 w-4" />
          </button>

          {/* Notifications + badge */}
          <Link
            to={`/${user?.role}/notifications`}
            className="relative flex h-8 w-8 items-center justify-center rounded-md text-slate-500 transition hover:bg-slate-100 hover:text-slate-700 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-200"
            aria-label={
              unreadCount > 0
                ? `${unreadCount} unread notifications`
                : "Notifications"
            }
          >
            <Bell className="h-5 w-5" />

            {/* Show badge whenever count > 0 (even while refetching) */}
            {!isError && unreadCount > 0 && (
              <span
                className="absolute -right-1 -top-1 z-10 flex h-4 min-w-4 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold leading-none text-white ring-2 ring-white dark:ring-slate-900"
              >
                {unreadCount > 99 ? "99+" : unreadCount}
              </span>
            )}

            {/* Optional: tiny pulse while first load and we don't know yet */}
            {isLoading && unreadCount === 0 && (
              <span className="absolute -right-0.5 -top-0.5 h-2 w-2 rounded-full bg-slate-300 dark:bg-slate-600" />
            )}
          </Link>

          <ThemeToggle />

          {/* Profile */}
          <div className="relative">
            <button
              onClick={() => setProfileOpen(!profileOpen)}
              className="flex items-center gap-2 rounded-md py-1 pl-1 pr-2 transition hover:bg-slate-50 dark:hover:bg-slate-800"
            >
              <div className="flex h-7 w-7 items-center justify-center rounded-full bg-slate-100 text-xs font-semibold text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                {user?.first_name?.charAt(0)?.toUpperCase() ?? "U"}
              </div>
              <ChevronDown className="hidden h-3.5 w-3.5 text-slate-400 sm:block" />
            </button>

            {profileOpen && (
              <>
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setProfileOpen(false)}
                />
                <div className="absolute right-0 z-50 mt-1.5 w-56 overflow-hidden rounded-lg border border-slate-200 bg-white py-1 shadow-lg shadow-slate-200/50 dark:border-slate-700 dark:bg-slate-900 dark:shadow-black/40">
                  <div className="border-b border-slate-100 px-3 py-2.5 dark:border-slate-800">
                    <p className="text-sm font-medium text-slate-900 dark:text-slate-100">
                      {user?.first_name} {user?.last_name}
                    </p>
                    <p className="text-xs capitalize text-slate-500 dark:text-slate-400">
                      {user?.role ?? "Member"}
                    </p>
                  </div>
                  <div className="py-1">
                    <button
                      onClick={() => {
                        setProfileOpen(false);
                        logout?.();
                      }}
                      className="flex w-full items-center gap-2.5 px-3 py-2 text-sm text-slate-600 transition hover:bg-slate-50 hover:text-red-600 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-red-400"
                    >
                      <LogOut className="h-4 w-4" />
                      Sign out
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>

          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="flex h-8 w-8 items-center justify-center rounded-md text-slate-500 transition hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800 lg:hidden"
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="border-t border-slate-100 bg-white transition-colors duration-300 dark:border-slate-800 dark:bg-slate-900 lg:hidden">
          <nav className="flex flex-col gap-0.5 px-3 py-3">
            {navItems.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                onClick={() => setMobileOpen(false)}
                className={`flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium transition ${
                  isActive(item.href)
                    ? "bg-orange-50 text-orange-700 dark:bg-orange-500/20 dark:text-orange-300"
                    : "text-slate-600 hover:bg-slate-50 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-slate-100"
                }`}
              >
                <item.icon className="h-4 w-4" />
                {item.name}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
}