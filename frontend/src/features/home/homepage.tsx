import { useState } from 'react';
import { motion , AnimatePresence } from "framer-motion";
import Logo from "@/assets/Logo.png"
import {
  Building2, MapPin, 
  Home,
  Search,
  Calendar,
  AlertTriangle,
  CreditCard,
  Camera,
  UserCheck,
  Users,
  CheckCircle2,
  ArrowRight,
  ChevronDown,
  Clock,
  ShieldCheck,
  FileText,

  Sparkles,
  LogIn,
  Star ,
  Bell,
  Settings,
  ExternalLink,
  Building,
  Layers,

  HelpCircle,
  Eye,
} from 'lucide-react';

export default function App() {
  // Hero Preview Active Tab
  const [activeHeroTab, setActiveHeroTab] = useState<'residences' | 'apartments' | 'booking' | 'incidents' | 'syndic'>('residences');

  // Role Explanation Active Tab
  const [activeRole, setActiveRole] = useState<'visitor' | 'owner' | 'syndic'>('visitor');

  // FAQ Accordion State
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  return (
    <div className="min-h-screen font-sans selection:bg-primary/20 transition-colors">
      {/* 1. HERO SECTION */}
<section className="relative overflow-hidden border-b border-border/40">

  <div className="max-w-7xl mx-auto px-2 sm:px-6 lg:px-4 py-10 lg:py-8">
    {/* ─── 1. Text content only (full width, no side-by-side) ─── */}
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="max-w-3xl mx-auto text-center space-y-8"
    >
      {/* Badge */}
      <div className="inline-flex items-center gap-2 px-1.5  rounded-full border
       border-primary/20 bg-primary/5 text-primary text-xs sm:text-sm font-semibold">
        <Sparkles className="w-4 h-4" />
        <span>Next-Generation Residence Ecosystem</span>

                       
      </div>
      <div  className="flex justify-center">
     <img
      src={Logo}
      alt="SGC Logo"
      className="h-33 w-auto "/>    </div>
      {/* Headline — no underline */}
      <h1 className="text-3xl sm:text-3xl lg:text-3xl font-extrabold tracking-tight leading-[1.15]">
        Smart Residence Management for{" "}
        <span className="text-primary">Visitors, Owners & Syndics</span>
      </h1>

      {/* Subtitle */}
      <p className="text-lg sm:text-xl text-muted-foreground font-normal leading-relaxed">
        Connect property browsing, apartment bookings, incident declarations,
        charge ledgers, and syndic management into one seamless platform.
      </p>

      {/* CTAs */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
        <a
          href="/residences"
          className="inline-flex items-center justify-center gap-2.5 px-6 py-3.5 text-base font-bold bg-primary text-primary-foreground rounded-xl shadow-xl shadow-primary/20 hover:shadow-primary/35 hover:scale-[1.02] active:scale-[0.98] transition-all"
        >
          <Building className="w-5 h-5" />
          Explore Residences
          <ArrowRight className="w-4 h-4" />
        </a>
        <a
          href="/apartments"
          className="inline-flex items-center justify-center gap-2 px-6 py-3.5 text-base font-semibold border border-input rounded-xl hover:bg-accent transition-all"
        >
          <Home className="w-5 h-5" />
          Browse Apartments
        </a>
        <a
          href="/login"
          className="inline-flex items-center justify-center gap-2 px-6 py-3.5 text-base font-semibold border border-primary/30 bg-primary/5 text-primary rounded-xl hover:bg-primary/10 transition-all"
        >
          <UserCheck className="w-5 h-5" />
          Portal Login
        </a>
      </div>

      {/* Feature tickers */}
      <div className="pt-6 grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="space-y-1">
          <div className="text-sm font-bold flex items-center justify-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-primary shrink-0" />
            Verified Units
          </div>
          <div className="text-xs text-muted-foreground">Full residence records</div>
        </div>
        <div className="space-y-1">
          <div className="text-sm font-bold flex items-center justify-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-primary shrink-0" />
            Direct Bookings
          </div>
          <div className="text-xs text-muted-foreground">Instant availability</div>
        </div>
        <div className="space-y-1">
          <div className="text-sm font-bold flex items-center justify-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-primary shrink-0" />
            Syndic Control
          </div>
          <div className="text-xs text-muted-foreground">Charges & incidents</div>
        </div>
      </div>
    </motion.div>

    {/* ─── 2. Card mockup AFTER the text ─── */}
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.7, delay: 0.15 }}
      className="mt-14 lg:mt-20 max-w-4xl mx-auto"
    >
      <div className="relative rounded-2xl border border-border shadow-2xl p-4 sm:p-6 backdrop-blur-xl space-y-4 bg-background/80">
        {/* Mockup Header */}
        <div className="flex flex-col gap-3 border-b border-border/60 pb-3">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-red-400/80" />
            <div className="w-3 h-3 rounded-full bg-amber-400/80" />
            <div className="w-3 h-3 rounded-full bg-emerald-400/80" />
            <span className="text-xs font-mono text-muted-foreground ml-2 hidden sm:inline">
              smart-syndic.app/preview
            </span>
          </div>

          <div className="flex items-center gap-1 bg-accent/50 p-1 rounded-xl overflow-x-auto no-scrollbar">
            {(
              [
                { id: "residences", label: "Residences" },
                { id: "apartments", label: "Apartments" },
                { id: "booking", label: "Booking" },
                { id: "incidents", label: "Incidents" },
                { id: "syndic", label: "Syndic" },
              ] as const
            ).map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveHeroTab(tab.id)}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg whitespace-nowrap transition-all ${
                  activeHeroTab === tab.id
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        <div className="min-h-[380px] flex flex-col gap-4 pt-1">
          <AnimatePresence mode="wait">
            {activeHeroTab === "residences" && (
              <motion.div
                key="residences"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
                className="space-y-4 flex-1"
              >
                <div className="flex flex-wrap items-start gap-3">
                  <div className="min-w-0 flex-1 space-y-1">
                    <h3 className="text-base font-bold flex items-center gap-2">
                      <Building2 className="w-4 h-4 text-primary shrink-0" />
                      Grand Horizon Residence
                    </h3>
                    <p className="text-xs text-muted-foreground">
                      32 Apartments · Active Syndic Oversight · Verified Gallery
                    </p>
                  </div>
                  <span className="px-2.5 py-1 text-xs font-semibold bg-emerald-500/10 text-emerald-600 rounded-full border border-emerald-500/20 shrink-0">
                    Active Complex
                  </span>
                </div>

                <div className="relative h-44 rounded-xl overflow-hidden border border-border group">
                  <img
                    src="https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1000&q=80"
                    alt="Grand Horizon Residence"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent flex items-end p-3">
                    <div className="flex flex-wrap items-center gap-2 w-full text-white text-xs">
                      <span className="flex items-center gap-1 font-medium">
                        <MapPin className="w-3.5 h-3.5 shrink-0" />
                        Central Bay District
                      </span>
                      <span className="px-2 py-0.5 rounded bg-black/40 backdrop-blur font-mono">
                        12 Photos
                      </span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 rounded-xl border border-border/80 space-y-1.5">
                    <div className="text-xs text-muted-foreground flex items-center gap-1.5">
                      <UserCheck className="w-3.5 h-3.5 text-primary shrink-0" />
                      <span>Syndic Manager</span>
                    </div>
                    <div className="text-xs font-bold">ImmoSyndic Management</div>
                  </div>
                  <div className="p-3 rounded-xl border border-border/80 space-y-1.5">
                    <div className="text-xs text-muted-foreground flex items-center gap-1.5">
                      <CreditCard className="w-3.5 h-3.5 text-primary shrink-0" />
                      <span>Monthly Charge Ledger</span>
                    </div>
                    <div className="text-xs font-bold text-emerald-600">
                      All Charges Settled
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {activeHeroTab === "apartments" && (
              <motion.div
                key="apartments"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
                className="space-y-4 flex-1"
              >
                <div className="flex flex-wrap items-start gap-3">
                  <div className="min-w-0 flex-1 space-y-1">
                    <h3 className="text-base font-bold flex items-center gap-2">
                      <Home className="w-4 h-4 text-primary shrink-0" />
                      Penthouse Suite 4B
                    </h3>
                    <p className="text-xs text-muted-foreground">
                      2 Bedrooms · 110 m² · Ocean Terrace · Parking Included
                    </p>
                  </div>
                  <span className="px-2.5 py-1 text-xs font-mono font-bold bg-primary/10 text-primary rounded-lg shrink-0">
                    3000 MAD / month
                  </span>
                </div>

                <div className="relative h-44 rounded-xl overflow-hidden border border-border">
                  <img
                    src="https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1000&q=80"
                    alt="Penthouse Apartment"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-black/60 text-white text-xs backdrop-blur font-medium flex items-center gap-1">
                    <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                    Premium Listing
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2 text-xs">
                  <span className="px-2 py-1 rounded border border-border text-muted-foreground">
                    Wifi
                  </span>
                  <span className="px-2 py-1 rounded border border-border text-muted-foreground">
                    Elevator
                  </span>
                  <span className="px-2 py-1 rounded border border-border text-muted-foreground">
                    Terrace
                  </span>
                  <a
                    href="/apartments"
                    className="font-bold text-primary hover:underline flex items-center gap-1 ml-auto"
                  >
                    View Apartment <ArrowRight className="w-3.5 h-3.5" />
                  </a>
                </div>
              </motion.div>
            )}

            {activeHeroTab === "booking" && (
              <motion.div
                key="booking"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
                className="space-y-4 flex-1"
              >
                <div className="flex flex-wrap items-start gap-3">
                  <div className="min-w-0 flex-1 space-y-1">
                    <h3 className="text-base font-bold flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-primary shrink-0" />
                      Instant Visitor Booking System
                    </h3>
                    <p className="text-xs text-muted-foreground">
                      Select stay dates with real-time calendar synchronization
                    </p>
                  </div>
                  <span className="px-2.5 py-1 text-xs font-semibold bg-primary/10 text-primary rounded-full shrink-0">
                    Instant Approval
                  </span>
                </div>

                <div className="p-4 rounded-xl border border-border/80 space-y-3">
                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div className="p-2.5 rounded-lg border border-border space-y-0.5">
                      <div className="text-muted-foreground font-medium">Check-In</div>
                      <div className="font-bold">Aug 12, 2026</div>
                    </div>
                    <div className="p-2.5 rounded-lg border border-border space-y-0.5">
                      <div className="text-muted-foreground font-medium">Check-Out</div>
                      <div className="font-bold">Aug 18, 2026</div>
                    </div>
                  </div>
                  <div className="flex flex-wrap items-center gap-2 text-xs pt-1 border-t border-border/60">
                    <span className="text-muted-foreground">6 Nights Stay Total</span>
                    <span className="font-mono font-bold text-sm">$840.00</span>
                  </div>
                  <a
                    href="/apartments"
                    className="w-full inline-flex items-center justify-center gap-2 py-2.5 rounded-xl bg-primary text-primary-foreground font-bold text-xs shadow hover:opacity-90 transition-opacity"
                  >
                    Proceed to Reserve <ArrowRight className="w-3.5 h-3.5" />
                  </a>
                </div>
              </motion.div>
            )}

            {activeHeroTab === "incidents" && (
              <motion.div
                key="incidents"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
                className="space-y-3 flex-1"
              >
                <div className="space-y-1">
                  <h3 className="text-base font-bold flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0" />
                    Incident Declaration Dispatcher
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    Track resolution status & photo documentation in real-time
                  </p>
                </div>
                <div className="space-y-2">
                  <div className="p-3 rounded-xl border border-border space-y-1.5 text-xs">
                    <div className="font-bold flex flex-wrap items-center gap-1.5">
                      Elevator B Maintenance
                      <span className="px-1.5 py-0.5 text-[10px] rounded bg-emerald-500/10 text-emerald-600 font-semibold">
                        Resolved
                      </span>
                    </div>
                    <div className="text-muted-foreground text-[11px]">
                      Reported by Owner 3A · Photo Verified · Today
                    </div>
                  </div>
                  <div className="p-3 rounded-xl border border-border space-y-1.5 text-xs">
                    <div className="font-bold flex flex-wrap items-center gap-1.5">
                      Garden Lighting Inspection
                      <span className="px-1.5 py-0.5 text-[10px] rounded bg-blue-500/10 text-blue-600 font-semibold">
                        In Progress
                      </span>
                    </div>
                    <div className="text-muted-foreground text-[11px]">
                      Assigned to Technician · Syndic Supervised · Yesterday
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {activeHeroTab === "syndic" && (
              <motion.div
                key="syndic"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
                className="space-y-3 flex-1"
              >
                <div className="space-y-1">
                  <h3 className="text-base font-bold flex items-center gap-2">
                    <Layers className="w-4 h-4 text-primary shrink-0" />
                    Syndic Operations Dashboard
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    Residence charges, photo galleries & appointments
                  </p>
                </div>
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div className="p-3 rounded-xl border border-border space-y-1">
                    <div className="text-muted-foreground text-[11px]">Quarterly Charges</div>
                    <div className="font-mono font-extrabold text-sm text-emerald-600">
                      94% Collected
                    </div>
                    <div className="text-[10px] text-muted-foreground">30 / 32 Units Paid</div>
                  </div>
                  <div className="p-3 rounded-xl border border-border space-y-1">
                    <div className="text-muted-foreground text-[11px]">Upcoming Meeting</div>
                    <div className="font-bold text-xs">Annual Owner Assembly</div>
                    <div className="text-[10px] text-muted-foreground">Aug 20 · 18:00 UTC</div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="pt-3 border-t border-border/60 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <ShieldCheck className="w-4 h-4 text-primary shrink-0" />
              Encrypted & Role-Protected
            </span>
            <a
              href="/login"
              className="text-primary font-bold hover:underline flex items-center gap-1 sm:ml-auto"
            >
              Access Portal <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>
      </div>
    </motion.div>
  </div>
</section>

      {/* 2. SERVICES SECTION */}
      <section id="services" className="py-20 border-b border-border/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
          
          {/* Section Heading */}
          <div className="text-center space-y-4 max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-primary/20 bg-primary/5 text-primary text-xs font-semibold">
              <Building2 className="w-3.5 h-3.5" />
              Comprehensive Platform Capabilities
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
              11 Core Services Built for Modern Property Ecosystems
            </h2>
            <p className="text-muted-foreground text-base sm:text-lg">
              Everything required to explore, manage, book, and maintain residences and individual apartments in one structured platform.
            </p>
          </div>

          {/* 11 Services Grid */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            
            {/* 1. Browse Residences */}
            <motion.div
              whileHover={{ y: -4 }}
              className="p-6 rounded-2xl border border-border/80 shadow-sm hover:shadow-md transition-all space-y-4 flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="w-12 h-12 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
                  <Building2 className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold">Browse Residences</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Explore verified residential complexes with high-definition photos, address maps, unit counts, and active syndic profiles.
                </p>
              </div>
              <div className="pt-3 border-t border-border/60 flex items-center justify-between text-xs">
                <span className="text-muted-foreground font-medium">Directory & Search</span>
                <a href="/residences" className="font-bold text-primary hover:underline flex items-center gap-1">
                  Explore <ArrowRight className="w-3 h-3" />
                </a>
              </div>
            </motion.div>

            {/* 2. Browse Apartments */}
            <motion.div
              whileHover={{ y: -4 }}
              className="p-6 rounded-2xl border border-border/80 shadow-sm hover:shadow-md transition-all space-y-4 flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="w-12 h-12 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
                  <Home className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold">Browse Apartments</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Filter available rental and residential units by room configuration, amenities, square meterage, and rental pricing.
                </p>
              </div>
              <div className="pt-3 border-t border-border/60 flex items-center justify-between text-xs">
                <span className="text-muted-foreground font-medium">Unit Listings</span>
                <a href="/apartments" className="font-bold text-primary hover:underline flex items-center gap-1">
                  Browse <ArrowRight className="w-3 h-3" />
                </a>
              </div>
            </motion.div>

            {/* 3. Residence Details */}
            <motion.div
              whileHover={{ y: -4 }}
              className="p-6 rounded-2xl border border-border/80 shadow-sm hover:shadow-md transition-all space-y-4 flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="w-12 h-12 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
                  <FileText className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold">Residence Details</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Access official building specifications, syndic contacts, shared facility rules, and community announcements in one place.
                </p>
              </div>
              <div className="pt-3 border-t border-border/60 flex items-center justify-between text-xs">
                <span className="text-muted-foreground font-medium">Building Profiles</span>
                <a href="/residences" className="font-bold text-primary hover:underline flex items-center gap-1">
                  View Info <ArrowRight className="w-3 h-3" />
                </a>
              </div>
            </motion.div>

            {/* 4. Apartment Details */}
            <motion.div
              whileHover={{ y: -4 }}
              className="p-6 rounded-2xl border border-border/80 shadow-sm hover:shadow-md transition-all space-y-4 flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="w-12 h-12 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
                  <Search className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold">Apartment Details</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Inspect exact floor plans, room measurements, equipment lists, lease terms, and high-resolution photo galleries.
                </p>
              </div>
              <div className="pt-3 border-t border-border/60 flex items-center justify-between text-xs">
                <span className="text-muted-foreground font-medium">Unit Specs</span>
                <a href="/apartments" className="font-bold text-primary hover:underline flex items-center gap-1">
                  Inspect <ArrowRight className="w-3 h-3" />
                </a>
              </div>
            </motion.div>

            {/* 5. Book Apartments */}
            <motion.div
              whileHover={{ y: -4 }}
              className="p-6 rounded-2xl border border-border/80 shadow-sm hover:shadow-md transition-all space-y-4 flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="w-12 h-12 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
                  <Calendar className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold">Book Apartments</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Instant reservation system for visitors with live calendar syncing, guest information input, and booking confirmations.
                </p>
              </div>
              <div className="pt-3 border-t border-border/60 flex items-center justify-between text-xs">
                <span className="text-muted-foreground font-medium">Visitor Reservation</span>
                <a href="/apartments" className="font-bold text-primary hover:underline flex items-center gap-1">
                  Book Unit <ArrowRight className="w-3 h-3" />
                </a>
              </div>
            </motion.div>

            {/* 6. Manage Charges */}
            <motion.div
              whileHover={{ y: -4 }}
              className="p-6 rounded-2xl border border-border/80 shadow-sm hover:shadow-md transition-all space-y-4 flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="w-12 h-12 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
                  <CreditCard className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold">Manage Charges</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Transparent co-ownership maintenance charge distribution, automated fee ledgers, payment tracking, and receipt generation.
                </p>
              </div>
              <div className="pt-3 border-t border-border/60 flex items-center justify-between text-xs">
                <span className="text-muted-foreground font-medium">Syndic & Owner Ledger</span>
                <a href="/login" className="font-bold text-primary hover:underline flex items-center gap-1">
                  Manage <ArrowRight className="w-3 h-3" />
                </a>
              </div>
            </motion.div>

            {/* 7. Declare Incidents */}
            <motion.div
              whileHover={{ y: -4 }}
              className="p-6 rounded-2xl border border-border/80 shadow-sm hover:shadow-md transition-all space-y-4 flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="w-12 h-12 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
                  <AlertTriangle className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold">Declare Incidents</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Log maintenance issues or building repairs with photo attachments, urgency ratings, and real-time status updates from the syndic.
                </p>
              </div>
              <div className="pt-3 border-t border-border/60 flex items-center justify-between text-xs">
                <span className="text-muted-foreground font-medium">Maintenance Desk</span>
                <a href="/login" className="font-bold text-primary hover:underline flex items-center gap-1">
                  Report Issue <ArrowRight className="w-3 h-3" />
                </a>
              </div>
            </motion.div>

            {/* 8. Manage Appointments */}
            <motion.div
              whileHover={{ y: -4 }}
              className="p-6 rounded-2xl border border-border/80 shadow-sm hover:shadow-md transition-all space-y-4 flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="w-12 h-12 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
                  <Clock className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold">Manage Appointments</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Schedule syndic office hours, owner assemblies, technician site visits, and property viewing appointments effortlessly.
                </p>
              </div>
              <div className="pt-3 border-t border-border/60 flex items-center justify-between text-xs">
                <span className="text-muted-foreground font-medium">Calendar & Meetings</span>
                <a href="/login" className="font-bold text-primary hover:underline flex items-center gap-1">
                  Schedule <ArrowRight className="w-3 h-3" />
                </a>
              </div>
            </motion.div>

            {/* 9. Manage Residences */}
            <motion.div
              whileHover={{ y: -4 }}
              className="p-6 rounded-2xl border border-border/80 shadow-sm hover:shadow-md transition-all space-y-4 flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="w-12 h-12 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
                  <Layers className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold">Manage Residences</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Complete administrative control for syndics to register new residences, configure shared rules, and manage complex portfolios.
                </p>
              </div>
              <div className="pt-3 border-t border-border/60 flex items-center justify-between text-xs">
                <span className="text-muted-foreground font-medium">Syndic Admin</span>
                <a href="/login" className="font-bold text-primary hover:underline flex items-center gap-1">
                  Syndic Hub <ArrowRight className="w-3 h-3" />
                </a>
              </div>
            </motion.div>

            {/* 10. Manage Apartments */}
            <motion.div
              whileHover={{ y: -4 }}
              className="p-6 rounded-2xl border border-border/80 shadow-sm hover:shadow-md transition-all space-y-4 flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="w-12 h-12 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
                  <Settings className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold">Manage Apartments</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Add, edit, or update apartment details, ownership records, availability statuses, and custom pricing rules.
                </p>
              </div>
              <div className="pt-3 border-t border-border/60 flex items-center justify-between text-xs">
                <span className="text-muted-foreground font-medium">Inventory Operations</span>
                <a href="/login" className="font-bold text-primary hover:underline flex items-center gap-1">
                  Unit Admin <ArrowRight className="w-3 h-3" />
                </a>
              </div>
            </motion.div>

            {/* 11. Manage Photos */}
            <motion.div
              whileHover={{ y: -4 }}
              className="p-6 rounded-2xl border border-border/80 shadow-sm hover:shadow-md transition-all space-y-4 flex flex-col justify-between sm:col-span-2 lg:col-span-1"
            >
              <div className="space-y-3">
                <div className="w-12 h-12 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
                  <Camera className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold">Manage Photos</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  High-resolution photo gallery management to showcase exterior building facade, common spaces, and indoor apartment finishes.
                </p>
              </div>
              <div className="pt-3 border-t border-border/60 flex items-center justify-between text-xs">
                <span className="text-muted-foreground font-medium">Media Gallery</span>
                <a href="/login" className="font-bold text-primary hover:underline flex items-center gap-1">
                  Upload & Organize <ArrowRight className="w-3 h-3" />
                </a>
              </div>
            </motion.div>

          </div>

        </div>
      </section>

      {/* 3. PLATFORM EXPLANATION SECTION (ROLES) */}
      <section id="roles" className="py-20 border-b border-border/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          
          {/* Section Header */}
          <div className="text-center space-y-4 max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-primary/20 bg-primary/5 text-primary text-xs font-semibold">
              <Users className="w-3.5 h-3.5" />
              Tailored Workflows
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
              Designed Specifically for Every Role in the Residence
            </h2>
            <p className="text-muted-foreground text-base sm:text-lg">
              Smart Syndic provides dedicated feature sets for Visitors searching or staying, Owners tracking their assets, and Syndics managing entire complexes.
            </p>
          </div>

          {/* Role Switcher Tabs */}
          <div className="flex justify-center">
            <div className="inline-flex p-1.5 rounded-2xl border border-border bg-accent/40 gap-2">
              <button
                onClick={() => setActiveRole('visitor')}
                className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all flex items-center gap-2 ${
                  activeRole === 'visitor' ? 'bg-primary text-primary-foreground shadow-md' : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                <Eye className="w-4 h-4" />
                For Visitors
              </button>

              <button
                onClick={() => setActiveRole('owner')}
                className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all flex items-center gap-2 ${
                  activeRole === 'owner' ? 'bg-primary text-primary-foreground shadow-md' : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                <Home className="w-4 h-4" />
                For Owners
              </button>

              <button
                onClick={() => setActiveRole('syndic')}
                className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all flex items-center gap-2 ${
                  activeRole === 'syndic' ? 'bg-primary text-primary-foreground shadow-md' : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                <Building2 className="w-4 h-4" />
                For Syndics
              </button>
            </div>
          </div>

          {/* Active Role Card View */}
          <div className="max-w-5xl mx-auto">
            <AnimatePresence mode="wait">
              
              {/* VISITOR ROLE */}
              {activeRole === 'visitor' && (
                <motion.div
                  key="visitor"
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -12 }}
                  transition={{ duration: 0.3 }}
                  className="p-8 rounded-3xl border border-border shadow-lg grid md:grid-cols-12 gap-8 items-center"
                >
                  <div className="md:col-span-7 space-y-6">
                    <div className="inline-flex items-center gap-2 text-xs font-mono font-bold text-primary uppercase tracking-wider">
                      Visitor Workflow
                    </div>
                    <h3 className="text-2xl sm:text-3xl font-extrabold">
                      Explore Residences & Book Stays Instantly
                    </h3>
                    <p className="text-muted-foreground text-sm sm:text-base leading-relaxed">
                      Visitors enjoy a transparent, high-definition search engine to discover verified residential complexes and available apartments with zero friction.
                    </p>

                    <ul className="space-y-3 pt-2">
                      <li className="flex items-start gap-3 text-sm">
                        <CheckCircle2 className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                        <div>
                          <strong className="block font-semibold">Explore Residences:</strong>
                          <span className="text-muted-foreground">Filter building complexes by location, photo galleries, and amenities.</span>
                        </div>
                      </li>
                      <li className="flex items-start gap-3 text-sm">
                        <CheckCircle2 className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                        <div>
                          <strong className="block font-semibold">Compare Apartments:</strong>
                          <span className="text-muted-foreground">Inspect floor plans, price rates, and available stay windows.</span>
                        </div>
                      </li>
                      <li className="flex items-start gap-3 text-sm">
                        <CheckCircle2 className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                        <div>
                          <strong className="block font-semibold">Book Easily:</strong>
                          <span className="text-muted-foreground">Select check-in/out dates and receive instant booking confirmations.</span>
                        </div>
                      </li>
                    </ul>

                    <div className="pt-2 flex items-center gap-4">
                      <a
                        href="/apartments"
                        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-primary-foreground font-bold text-sm shadow hover:opacity-90 transition-opacity"
                      >
                        Start Browsing Units <ArrowRight className="w-4 h-4" />
                      </a>
                    </div>
                  </div>

                  <div className="md:col-span-5 relative">
                    <div className="p-4 rounded-2xl border border-border/80 space-y-3">
                      <div className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Visitor Experience Preview</div>
                      <div className="relative h-48 rounded-xl overflow-hidden border border-border">
                        <img
                          src="https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80"
                          alt="Visitor Apartment Search"
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute bottom-2 left-2 right-2 p-2 rounded-lg bg-black/60 backdrop-blur text-white text-xs flex justify-between items-center">
                          <span>Modern Studio 2A</span>
                          <span className="font-bold text-emerald-400">Available Now</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* OWNER ROLE */}
              {activeRole === 'owner' && (
                <motion.div
                  key="owner"
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -12 }}
                  transition={{ duration: 0.3 }}
                  className="p-8 rounded-3xl border border-border shadow-lg grid md:grid-cols-12 gap-8 items-center"
                >
                  <div className="md:col-span-7 space-y-6">
                    <div className="inline-flex items-center gap-2 text-xs font-mono font-bold text-primary uppercase tracking-wider">
                      Owner Workflow
                    </div>
                    <h3 className="text-2xl sm:text-3xl font-extrabold">
                      Monitor Property Info & Track Reservations
                    </h3>
                    <p className="text-muted-foreground text-sm sm:text-base leading-relaxed">
                      Apartment owners gain absolute visibility over their units, co-ownership charges, tenant bookings, and maintenance status.
                    </p>

                    <ul className="space-y-3 pt-2">
                      <li className="flex items-start gap-3 text-sm">
                        <CheckCircle2 className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                        <div>
                          <strong className="block font-semibold">View Apartments:</strong>
                          <span className="text-muted-foreground">Access your assigned units, technical specs, and tenant history.</span>
                        </div>
                      </li>
                      <li className="flex items-start gap-3 text-sm">
                        <CheckCircle2 className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                        <div>
                          <strong className="block font-semibold">Check Reservations:</strong>
                          <span className="text-muted-foreground">Follow active visitor stays, booking schedules, and rental calendar.</span>
                        </div>
                      </li>
                      <li className="flex items-start gap-3 text-sm">
                        <CheckCircle2 className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                        <div>
                          <strong className="block font-semibold">Follow Property Info:</strong>
                          <span className="text-muted-foreground">Receive syndic announcements, meeting invitations, and maintenance reports.</span>
                        </div>
                      </li>
                    </ul>

                    <div className="pt-2 flex items-center gap-4">
                      <a
                        href="/login"
                        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-primary-foreground font-bold text-sm shadow hover:opacity-90 transition-opacity"
                      >
                        Owner Portal Login <LogIn className="w-4 h-4" />
                      </a>
                    </div>
                  </div>

                  <div className="md:col-span-5 relative">
                    <div className="p-4 rounded-2xl border border-border/80 space-y-3">
                      <div className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Owner Overview Preview</div>
                      <div className="p-3 rounded-xl border border-border space-y-2 text-xs">
                        <div className="flex justify-between items-center font-bold">
                          <span>Apartment 4B - Penthouse</span>
                          <span className="text-emerald-600">Occupied</span>
                        </div>
                        <div className="text-muted-foreground">Reservation: Aug 10 - Aug 20</div>
                        <div className="pt-2 border-t border-border flex justify-between text-[11px]">
                          <span>Quarterly Charge</span>
                          <span className="font-bold">Paid ($320)</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* SYNDIC ROLE */}
              {activeRole === 'syndic' && (
                <motion.div
                  key="syndic"
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -12 }}
                  transition={{ duration: 0.3 }}
                  className="p-8 rounded-3xl border border-border shadow-lg grid md:grid-cols-12 gap-8 items-center"
                >
                  <div className="md:col-span-7 space-y-6">
                    <div className="inline-flex items-center gap-2 text-xs font-mono font-bold text-primary uppercase tracking-wider">
                      Syndic Workflow
                    </div>
                    <h3 className="text-2xl sm:text-3xl font-extrabold">
                      Complete Administrative Control & Operations
                    </h3>
                    <p className="text-muted-foreground text-sm sm:text-base leading-relaxed">
                      Professional property syndics get an end-to-end management toolkit for multi-residence operations, finances, and maintenance.
                    </p>

                    <div className="grid sm:grid-cols-2 gap-3 text-xs pt-1">
                      <div className="p-3 rounded-xl border border-border/80 space-y-1">
                        <strong className="block font-bold text-foreground">Manage Residences & Apartments</strong>
                        <span className="text-muted-foreground">Register buildings, configure unit inventories, and update rules.</span>
                      </div>
                      <div className="p-3 rounded-xl border border-border/80 space-y-1">
                        <strong className="block font-bold text-foreground">Manage Photos & Galleries</strong>
                        <span className="text-muted-foreground">Upload, organize, and curate residence and apartment visual media.</span>
                      </div>
                      <div className="p-3 rounded-xl border border-border/80 space-y-1">
                        <strong className="block font-bold text-foreground">Manage Incidents & Work Orders</strong>
                        <span className="text-muted-foreground">Assign repair technicians, verify photo fixes, and close tickets.</span>
                      </div>
                      <div className="p-3 rounded-xl border border-border/80 space-y-1">
                        <strong className="block font-bold text-foreground">Manage Charges & Bookings</strong>
                        <span className="text-muted-foreground">Distribute building fees, track payments, and audit reservation logs.</span>
                      </div>
                    </div>

                    <div className="pt-2 flex items-center gap-4">
                      <a
                        href="/login"
                        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-primary-foreground font-bold text-sm shadow hover:opacity-90 transition-opacity"
                      >
                        Syndic Workspace Login <Building2 className="w-4 h-4" />
                      </a>
                    </div>
                  </div>

                  <div className="md:col-span-5 relative">
                    <div className="p-4 rounded-2xl border border-border/80 space-y-3">
                      <div className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Syndic Command Preview</div>
                      <div className="space-y-2 text-xs">
                        <div className="p-2.5 rounded-lg border border-border flex justify-between items-center">
                          <span>Residence Portfolio</span>
                          <span className="font-bold">4 Buildings</span>
                        </div>
                        <div className="p-2.5 rounded-lg border border-border flex justify-between items-center">
                          <span>Pending Incidents</span>
                          <span className="font-bold text-amber-500">2 Dispatched</span>
                        </div>
                        <div className="p-2.5 rounded-lg border border-border flex justify-between items-center">
                          <span>Fee Ledger Status</span>
                          <span className="font-bold text-emerald-600">96% Collected</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

            </AnimatePresence>
          </div>

        </div>
      </section>

      {/* 4. MARKETING VISUALS SECTION (PRODUCT SHOWCASE) */}
      <section id="showcase" className="py-20 border-b border-border/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
          
          {/* Section Header */}
          <div className="text-center space-y-4 max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-primary/20 bg-primary/5 text-primary text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5" />
              Product Showcase
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
              Designed for Elegance, Speed & Precision
            </h2>
            <p className="text-muted-foreground text-base sm:text-lg">
              Explore actual interface components engineered for seamless residence discovery, apartment viewing, instant booking, and syndic administration.
            </p>
          </div>

          {/* Showcase Cards Grid */}
          <div className="space-y-12">
            
            {/* Showcase 1: Residence Browsing */}
            <div className="p-6 sm:p-8 rounded-3xl border border-border shadow-lg grid lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-5 space-y-4">
                <span className="px-3 py-1 text-xs font-mono font-bold bg-primary/10 text-primary rounded-full">
                  Module 01 • Residence Browsing
                </span>
                <h3 className="text-2xl font-bold">Interactive Residence Directory</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Browse residential complexes with intuitive location filters, verified syndic badges, floor plan highlights, and building photo galleries.
                </p>
                <div className="pt-2 flex items-center gap-3">
                  <a href="/residences" className="text-xs font-bold text-primary hover:underline flex items-center gap-1">
                    Open Residence Search <ArrowRight className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>

              <div className="lg:col-span-7">
                <div className="p-4 rounded-2xl border border-border space-y-3 backdrop-blur">
                  <div className="flex items-center justify-between pb-2 border-b border-border text-xs">
                    <span className="font-bold flex items-center gap-1.5">
                      <Building2 className="w-4 h-4 text-primary" />
                      Residence Directory
                    </span>
                    <div className="flex items-center gap-1">
                      <span className="px-2 py-0.5 rounded bg-accent text-[11px]">All Cities</span>
                      <span className="px-2 py-0.5 rounded bg-primary/10 text-primary font-bold text-[11px]">Active</span>
                    </div>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-3">
                    <div className="rounded-xl border border-border overflow-hidden space-y-2">
                      <div className="h-32 relative">
                        <img
                          src="https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=600&q=80"
                          alt="Residence 1"
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute top-2 left-2 px-2 py-0.5 rounded bg-black/60 text-white text-[10px] backdrop-blur font-mono">
                          24 Units
                        </div>
                      </div>
                      <div className="p-2.5 text-xs space-y-1">
                        <div className="font-bold">Palm Royal Residence</div>
                        <div className="text-muted-foreground text-[11px]">Coastal Avenue • Syndic Managed</div>
                      </div>
                    </div>

                    <div className="rounded-xl border border-border overflow-hidden space-y-2">
                      <div className="h-32 relative">
                        <img
                          src="https://images.unsplash.com/photo-1577495508048-b635879837f1?auto=format&fit=crop&w=600&q=80"
                          alt="Residence 2"
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute top-2 left-2 px-2 py-0.5 rounded bg-black/60 text-white text-[10px] backdrop-blur font-mono">
                          18 Units
                        </div>
                      </div>
                      <div className="p-2.5 text-xs space-y-1">
                        <div className="font-bold">Atlas Park Complex</div>
                        <div className="text-muted-foreground text-[11px]">Metropolitan Boulevard • Verified</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Showcase 2: Apartment Listing & Detail */}
            <div className="p-6 sm:p-8 rounded-3xl border border-border shadow-lg grid lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-7 order-2 lg:order-1">
                <div className="p-4 rounded-2xl border border-border space-y-3 backdrop-blur">
                  <div className="flex items-center justify-between pb-2 border-b border-border text-xs">
                    <span className="font-bold flex items-center gap-1.5">
                      <Home className="w-4 h-4 text-primary" />
                      Apartment Specification View
                    </span>
                    <span className="text-xs font-mono font-bold text-emerald-600">$1,200 / mo</span>
                  </div>

                  <div className="grid sm:grid-cols-12 gap-3">
                    <div className="sm:col-span-5 h-40 rounded-xl overflow-hidden border border-border relative">
                      <img
                        src="https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=600&q=80"
                        alt="Apartment Interior"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="sm:col-span-7 space-y-2 text-xs">
                      <h4 className="font-bold text-sm">Luxury Corner Suite 3C</h4>
                      <p className="text-muted-foreground text-[11px] leading-relaxed">
                        Spacious 2-bedroom unit with modern kitchen appliances, floor-to-ceiling windows, and private balconies.
                      </p>
                      <div className="grid grid-cols-2 gap-2 pt-1 text-[11px]">
                        <div className="p-2 rounded bg-accent/40 border border-border/60">
                          <span className="text-muted-foreground block">Area</span>
                          <span className="font-bold">95 m²</span>
                        </div>
                        <div className="p-2 rounded bg-accent/40 border border-border/60">
                          <span className="text-muted-foreground block">Rooms</span>
                          <span className="font-bold">2 Bed • 2 Bath</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="lg:col-span-5 space-y-4 order-1 lg:order-2">
                <span className="px-3 py-1 text-xs font-mono font-bold bg-primary/10 text-primary rounded-full">
                  Module 02 • Apartment Showcase
                </span>
                <h3 className="text-2xl font-bold">Comprehensive Apartment Specs</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Clear specifications for visitors and owners: room dimensions, equipment inventories, parking rights, and monthly rental terms.
                </p>
                <div className="pt-2">
                  <a href="/apartments" className="text-xs font-bold text-primary hover:underline flex items-center gap-1">
                    Explore Apartment Listings <ArrowRight className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            </div>

            {/* Showcase 3: Booking Flow & Dashboard View */}
            <div className="p-6 sm:p-8 rounded-3xl border border-border shadow-lg grid lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-5 space-y-4">
                <span className="px-3 py-1 text-xs font-mono font-bold bg-primary/10 text-primary rounded-full">
                  Module 03 • Booking & Operations
                </span>
                <h3 className="text-2xl font-bold">Frictionless Reservations & Operations</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Real-time calendar booking for visitors paired with background financial charge tracking and incident management for syndics.
                </p>
                <div className="pt-2">
                  <a href="/login" className="text-xs font-bold text-primary hover:underline flex items-center gap-1">
                    Access Portal Dashboard <ArrowRight className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>

              <div className="lg:col-span-7">
                <div className="p-4 rounded-2xl border border-border space-y-3 backdrop-blur">
                  <div className="grid sm:grid-cols-2 gap-3 text-xs">
                    
                    {/* Booking Card */}
                    <div className="p-3.5 rounded-xl border border-border space-y-2">
                      <div className="flex items-center justify-between font-bold">
                        <span className="flex items-center gap-1.5">
                          <Calendar className="w-3.5 h-3.5 text-primary" />
                          Booking Engine
                        </span>
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-600">Confirmed</span>
                      </div>
                      <div className="text-[11px] text-muted-foreground">Stay: 14 Aug - 20 Aug 2026</div>
                      <div className="p-2 rounded bg-accent/30 flex justify-between font-mono font-bold text-[11px]">
                        <span>Total Paid</span>
                        <span>$720.00</span>
                      </div>
                    </div>

                    {/* Syndic Incident Ticket */}
                    <div className="p-3.5 rounded-xl border border-border space-y-2">
                      <div className="flex items-center justify-between font-bold">
                        <span className="flex items-center gap-1.5">
                          <AlertTriangle className="w-3.5 h-3.5 text-amber-500" />
                          Syndic Dispatch
                        </span>
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-blue-500/10 text-blue-600">Technician Sent</span>
                      </div>
                      <div className="text-[11px] text-muted-foreground">Issue: Gate Sensor Calibration</div>
                      <div className="p-2 rounded bg-accent/30 flex justify-between font-mono font-bold text-[11px]">
                        <span>Urgency</span>
                        <span className="text-amber-500">Normal Priority</span>
                      </div>
                    </div>

                  </div>
                </div>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* 5. WHY CHOOSE SMART SYNDIC (BENEFITS) */}
      <section className="py-20 border-b border-border/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
          
          {/* Section Header */}
          <div className="text-center space-y-4 max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-primary/20 bg-primary/5 text-primary text-xs font-semibold">
              <ShieldCheck className="w-3.5 h-3.5" />
              Core Value Pillars
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
              Why Residence Communities Choose Smart Syndic
            </h2>
            <p className="text-muted-foreground text-base sm:text-lg">
              Eliminate operational confusion, fragmented communications, and lost records with an architecture built explicitly for real-estate workflow clarity.
            </p>
          </div>

          {/* 6 Benefits Grid */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            
            <div className="p-6 rounded-2xl border border-border/80 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
                <Building2 className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold">Organized Management</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Centralize all building documents, residence registries, owner lists, and syndic communications in one organized cloud hub.
              </p>
            </div>

            <div className="p-6 rounded-2xl border border-border/80 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
                <Calendar className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold">Modern Reservation Flow</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Frictionless stay booking for visitors with transparent pricing, instant date availability, and automated confirmation notices.
              </p>
            </div>

            <div className="p-6 rounded-2xl border border-border/80 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
                <Search className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold">Clear Property Browsing</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Rich photo galleries, exact floor plans, and verified apartment specs give visitors and owners complete clarity.
              </p>
            </div>

            <div className="p-6 rounded-2xl border border-border/80 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
                <Bell className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold">Better Communication</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Direct incident reporting, syndic announcement feeds, and meeting schedules keep everyone aligned in real time.
              </p>
            </div>

            <div className="p-6 rounded-2xl border border-border/80 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
                <CreditCard className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold">Easy Admin Work</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Automated charge distribution, fee ledgers, repair dispatching, and appointment tracking save syndics dozens of manual hours.
              </p>
            </div>

            <div className="p-6 rounded-2xl border border-border/80 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
                <Sparkles className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold">Smooth User Experience</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Thoughtfully engineered responsive interface that works naturally across mobile devices, tablets, and desktop displays.
              </p>
            </div>

          </div>

        </div>
      </section>

      {/* 6. FAQ ACCORDION */}
      <section id="faq" className="py-20 border-b border-border/40">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          
          {/* Section Header */}
          <div className="text-center space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-primary/20 bg-primary/5 text-primary text-xs font-semibold">
              <HelpCircle className="w-3.5 h-3.5" />
              Frequently Asked Questions
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
              Got Questions? We Have Answers.
            </h2>
            <p className="text-muted-foreground text-base">
              Practical details about how Smart Syndic connects visitors, apartment owners, and professional syndics.
            </p>
          </div>

          {/* Accordion List */}
          <div className="space-y-4">
            
            {[
              {
                q: "How does Smart Syndic streamline communication between owners and syndics?",
                a: "Smart Syndic provides a unified portal where syndics publish building announcements, schedule general meetings, log charge ledgers, and receive owner incident declarations with photo verification. No more lost emails or fragmented chat groups."
              },
              {
                q: "Can visitors browse residences and book apartments directly?",
                a: "Yes. Visitors can search through verified residence listings, filter available apartments by size, price, and amenities, inspect photo galleries, and place instant reservation requests."
              },
              {
                q: "How are incident declarations reported and resolved?",
                a: "Owners and residents can log an incident directly from their smartphone, attaching photo proof and setting urgency levels. The syndic receives the dispatch alert, assigns a technician, and updates the status to 'In Progress' and 'Resolved'."
              },
              {
                q: "How does syndic charge management and financial tracking work?",
                a: "Syndics can configure quarterly or annual co-ownership charges per residence. The platform tracks payment status for each apartment unit, allowing owners to view their balance and syndics to generate financial overview ledgers."
              },
              {
                q: "Is photo gallery management included for residences and apartments?",
                a: "Yes. Syndics and owners can upload high-resolution photos showcasing exterior facades, common areas (swimming pools, gardens, lobbies), and indoor apartment rooms."
              },
              {
                q: "How do appointments and calendar scheduling function?",
                a: "The integrated calendar allows syndics to set office consultation hours, schedule annual owner assemblies, organize technician inspection visits, and manage property viewing appointments."
              }
            ].map((faq, idx) => {
              const isOpen = openFaqIndex === idx;
              return (
                <div
                  key={idx}
                  className="rounded-2xl border border-border/80 overflow-hidden transition-colors"
                >
                  <button
                    onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                    className="w-full p-5 text-left font-bold text-base sm:text-lg flex items-center justify-between gap-4 hover:bg-accent/40 transition-colors"
                  >
                    <span>{faq.q}</span>
                    <ChevronDown
                      className={`w-5 h-5 text-muted-foreground shrink-0 transition-transform duration-300 ${
                        isOpen ? 'rotate-180 text-primary' : ''
                      }`}
                    />
                  </button>

                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        <div className="p-5 pt-0 text-sm text-muted-foreground leading-relaxed border-t border-border/40">
                          {faq.a}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}

          </div>

        </div>
      </section>

      {/* 7. FINAL CTA SECTION */}
      <section className="py-20 relative overflow-hidden border-b border-border/40">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="p-10 sm:p-14 rounded-3xl border border-primary/20 bg-primary/5 text-center space-y-8 relative shadow-2xl">
            
            <div className="space-y-4 max-w-2xl mx-auto">
              <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
                Ready to Experience Modern Residence Operations?
              </h2>
              <p className="text-muted-foreground text-base sm:text-lg leading-relaxed">
                Explore available residences and apartments today, or log in to access your owner or syndic workspace.
              </p>
            </div>

            {/* CTA Link Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
              <a
                href="/residences"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-7 py-3.5 text-base font-bold bg-primary text-primary-foreground rounded-xl shadow-xl shadow-primary/25 hover:scale-[1.02] active:scale-[0.98] transition-all"
              >
                <Building className="w-5 h-5" />
                Explore Residences
                <ArrowRight className="w-4 h-4" />
              </a>

              <a
                href="/apartments"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-7 py-3.5 text-base font-semibold border border-input rounded-xl hover:bg-accent transition-all"
              >
                <Home className="w-5 h-5" />
                Explore Apartments
              </a>

              <a
                href="/login"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-7 py-3.5 text-base font-bold bg-secondary text-secondary-foreground border border-border rounded-xl hover:bg-secondary/80 transition-all"
              >
                <LogIn className="w-5 h-5" />
                Portal Login
              </a>
            </div>

          </div>
        </div>
      </section>

      {/* 8. FOOTER */}
      <footer className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          
          <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
            
            {/* Brand Column */}
            <div className="col-span-2 space-y-4">
              <a href="/" className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
                  <Building2 className="w-5 h-5" />
                </div>
                <span className="text-lg font-bold tracking-tight">Smart Syndic</span>
              </a>
              <p className="text-xs text-muted-foreground max-w-sm leading-relaxed">
                The all-in-one residence management platform for visitors, apartment owners, and syndics. Streamlining properties, bookings, incidents, and charges.
              </p>
              <div className="text-xs text-muted-foreground pt-2">
                © {new Date().getFullYear()} Smart Syndic. All rights reserved.
              </div>
            </div>

            {/* Quick Navigation Links */}
            <div className="space-y-3">
              <div className="text-xs font-bold uppercase tracking-wider">Explore</div>
              <ul className="space-y-2 text-xs text-muted-foreground">
                <li>
                  <a href="/residences" className="hover:text-foreground font-semibold text-primary transition-colors flex items-center gap-1">
                    <Building className="w-3.5 h-3.5" /> Residences
                  </a>
                </li>
                <li>
                  <a href="/apartments" className="hover:text-foreground font-semibold text-primary transition-colors flex items-center gap-1">
                    <Home className="w-3.5 h-3.5" /> Apartments
                  </a>
                </li>
                <li>
                  <a href="#services" className="hover:text-foreground transition-colors">Services Directory</a>
                </li>
                <li>
                  <a href="#showcase" className="hover:text-foreground transition-colors">Product Showcase</a>
                </li>
              </ul>
            </div>

            {/* Platform Roles Links */}
            <div className="space-y-3">
              <div className="text-xs font-bold uppercase tracking-wider">Workflows</div>
              <ul className="space-y-2 text-xs text-muted-foreground">
                <li>
                  <a href="#roles" className="hover:text-foreground transition-colors">Visitor Experience</a>
                </li>
                <li>
                  <a href="#roles" className="hover:text-foreground transition-colors">Owner Dashboard</a>
                </li>
                <li>
                  <a href="#roles" className="hover:text-foreground transition-colors">Syndic Operations</a>
                </li>
                <li>
                  <a href="#faq" className="hover:text-foreground transition-colors">Incident Dispatch</a>
                </li>
              </ul>
            </div>

            {/* Access & Portal */}
            <div className="space-y-3">
              <div className="text-xs font-bold uppercase tracking-wider">Portal Access</div>
              <ul className="space-y-2 text-xs text-muted-foreground">
                <li>
                  <a href="/login" className="inline-flex items-center gap-1.5 font-bold text-primary hover:underline">
                    <LogIn className="w-3.5 h-3.5" /> Portal Login
                  </a>
                </li>
                <li>
                  <a href="#faq" className="hover:text-foreground transition-colors">Platform FAQ</a>
                </li>
                <li>
                  <a href="/residences" className="hover:text-foreground transition-colors">Browse Portfolio</a>
                </li>
              </ul>
            </div>

          </div>

        </div>
      </footer>

    </div>
  );
}
