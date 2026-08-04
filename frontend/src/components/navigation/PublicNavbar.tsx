import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { Menu, X } from "lucide-react";
import ThemeToggle from "@/components/ui/ThemeToggle";
import { useAuthStore } from "@/stores/auth.store";
import logo from "@/assets/Logo.png"

// ─── Liens de navigation ────────────────────────────────────────────────────

// ─── Composant ──────────────────────────────────────────────────────────────

export default function PublicNavbar() {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const user = useAuthStore((state) => state.user);
  const toggleMobile = () => setIsMobileOpen(!isMobileOpen);

  // ✅ Vérification correcte de l'authentification
  const isAuthenticated = user && user.role != null;
  const prefix = user?.role ? `/${user.role}` : "";

const navLinks = [
  { name: "Accueil", href: "/"},
  { name: "Résidences", href: `${prefix}/residences` },
  { name: "Appartements", href: `${prefix}/apartments` },
];

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/95 backdrop-blur-sm transition-colors dark:border-slate-700 dark:bg-slate-900/95">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2.5 group">
          <div className="flex h-13 w-13 items-center justify-center rounded-xl
          text-white shadow-lg  transition-transform group-hover:scale-105">
            <img
      src={logo}
      alt="SGC Logo"
      className="h-13 w-auto flex items-center"
    />
          </div>
          <span className="text-lg font-semibold tracking-tight text-slate-900 dark:text-white">
            Smart Syndic
          </span>
        </Link>

        {/* Navigation Desktop */}
        <nav className="hidden items-center gap-1 md:flex">
          {navLinks.map((link) => (
            <NavLink
              key={link.name}
              to={link.href}
              className={({ isActive }) =>
                `rounded-lg px-3.5 py-2 text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-orange-50 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400"
                    : "text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white"
                }`
              }
            >
              {link.name}
            </NavLink>
          ))}
        </nav>

        {/* Droite : Thème + Connexion / Inscription (si non authentifié) */}
        <div className="hidden items-center gap-3 md:flex">
          <ThemeToggle />
          {!isAuthenticated && (
            <>
              <Link
            to="/login"
             className="rounded-xl px-5 py-2.5 text-sm font-medium text-white-700 bg-orange-500 
             shadow-sm transition-all duration-200 hover:-translate-y-0.5 
          hover:bg-slate-800 hover:shadow-lg active:translate-y-0"
                 >
              Log in
            </Link>

          <Link
            to="/register"
         className="rounded-xl bg-green-700 px-5 py-2.5 text-sm font-semibold text-white
          shadow-sm transition-all duration-200 hover:-translate-y-0.5 
          hover:bg-slate-800 hover:shadow-lg active:translate-y-0"
             >
           Get Started
         </Link>
            </>
          )}
        </div>

        {/* Menu Mobile */}
        <button
          onClick={toggleMobile}
          className="flex h-10 w-10 items-center justify-center rounded-lg text-slate-700 transition hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800 md:hidden"
          aria-label="Ouvrir le menu"
        >
          {isMobileOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Navigation Mobile */}
      {isMobileOpen && (
        <div className="border-t border-slate-200 bg-white px-4 py-4 dark:border-slate-700 dark:bg-slate-900 md:hidden">
          <nav className="flex flex-col space-y-3">
            {navLinks.map((link) => (
              <NavLink
                key={link.name}
                to={link.href}
                onClick={toggleMobile}
                className={({ isActive }) =>
                  `rounded-lg px-3.5 py-2.5 text-sm font-medium transition-colors ${
                    isActive
                      ? "bg-orange-50 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400"
                      : "text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white"
                  }`
                }
              >
                {link.name}
              </NavLink>
            ))}
            <div className="flex flex-col gap-2 pt-4 border-t border-slate-200 dark:border-slate-700">
              <ThemeToggle />
              {!isAuthenticated && (
                <>
                  <Link
                    to="/login"
                    onClick={toggleMobile}
                    className="rounded-lg px-4 py-2.5 text-center text-sm font-medium text-slate-700 transition hover:bg-slate-100 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white"
                  >
                    Log In
                  </Link>
                  <Link
                    to="/register"
                    onClick={toggleMobile}
                    className="rounded-lg bg-orange-500 px-4 py-2.5 text-center text-sm font-semibold text-white shadow-sm shadow-orange-500/20 transition hover:bg-orange-600 hover:shadow-orange-500/30"
                  >
                    Register
                  </Link>
                </>
              )}
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}