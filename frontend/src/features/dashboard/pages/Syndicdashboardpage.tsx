import React from "react";
import {
  Building2,
  Home,
  Users,
  Receipt,
  AlertTriangle,
  CalendarCheck,
  CheckCircle2,
  Clock,
  TrendingUp,
  TrendingDown,
  Wrench,
  ArrowUpRight,
  DollarSign,
  Calendar,
  Check,
  UserPlus,
} from "lucide-react";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { useSyndicDashboard } from "../hooks/useDashboard";

// --- Mock Datasets for Analytics Visuals (complements SQL view totals) ---
const revenueHistory = [
  { month: "Jan", revenue: 42000, charges: 12000 },
  { month: "Feb", revenue: 48000, charges: 15000 },
  { month: "Mar", revenue: 55000, charges: 9000 },
  { month: "Apr", revenue: 51000, charges: 18000 },
  { month: "May", revenue: 62000, charges: 14000 },
  { month: "Jun", revenue: 78000, charges: 11000 },
  { month: "Jul", revenue: 84000, charges: 8500 },
];

const mockResidencesTable = [
  { id: 1, name: "Résidence Les Palmiers", apartments: 42, occupancy: 92, incidents: 2, revenue: "38,500 MAD", pending: "4,200 MAD", status: "Optimal" },
  { id: 2, name: "Atlas Tower A", apartments: 28, occupancy: 85, incidents: 1, revenue: "29,000 MAD", pending: "1,500 MAD", status: "Optimal" },
  { id: 3, name: "Les Jardins de Fès", apartments: 60, occupancy: 78, incidents: 5, revenue: "52,000 MAD", pending: "12,800 MAD", status: "Attention" },
  { id: 4, name: "Oasis Palm Resort", apartments: 18, occupancy: 100, incidents: 0, revenue: "21,000 MAD", pending: "0 MAD", status: "Optimal" },
];

const mockRecentIncidents = [
  { id: "INC-892", title: "Fuite d'eau - Ascenseur Bloc B", residence: "Les Palmiers", priority: "High", status: "In Progress", date: "Aujourd'hui, 08:30" },
  { id: "INC-891", title: "Panne d'éclairage parking S2", residence: "Atlas Tower A", priority: "Medium", status: "Pending", date: "Aujourd'hui, 07:15" },
  { id: "INC-889", title: "Interphone défectueux Apt 14", residence: "Les Jardins de Fès", priority: "Low", status: "In Progress", date: "Hier, 16:45" },
  { id: "INC-885", title: "Porte de garage bloquée", residence: "Oasis Palm", priority: "High", status: "Resolved", date: "29 Jul, 14:20" },
];

const mockSchedule = [
  { time: "09:30 AM", title: "Visite état des lieux - Apt 204", residence: "Les Palmiers", client: "Karim Bennani" },
  { time: "11:00 AM", title: "Réunion AG extraordinaire", residence: "Atlas Tower A", client: "Conseil Syndical" },
  { time: "02:30 PM", title: "Inspection travaux étanchéité", residence: "Les Jardins de Fès", client: "Prestataire Tech" },
  { time: "04:15 PM", title: "Remise des clés - Apt 108", residence: "Oasis Palm", client: "Sanae Tazi" },
];

const mockActivities = [
  { id: 1, type: "incident", title: "Nouvel incident signalé", desc: "Fuite d'eau - Les Palmiers", time: "Il y a 25 min", icon: AlertTriangle, color: "text-rose-500 bg-rose-100" },
  { id: 2, type: "charge", title: "Charge validée", desc: "Cotisation de Juillet (Apt 42 - 1,200 MAD)", time: "Il y a 1h", icon: CheckCircle2, color: "text-emerald-600 bg-emerald-100" },
  { id: 3, type: "reservation", title: "Réservation confirmée", desc: "Visite Apt 301 - Atlas Tower A", time: "Il y a 3h", icon: CalendarCheck, color: "text-blue-600 bg-blue-100" },
  { id: 4, type: "apartment", title: "Nouvel appartement ajouté", desc: "Apt 502 (Etage 5) - Les Jardins", time: "Il y a 5h", icon: Home, color: "text-purple-600 bg-purple-100" },
  { id: 5, type: "owner", title: "Propriétaire enregistré", desc: "M. Youssef El Amrani à Atlas Tower", time: "Hier", icon: UserPlus, color: "text-orange-600 bg-orange-100" },
];

// --- Sparkline Mini Component (light version) ---
const Sparkline = ({ color = "#3B82F6" }: { color?: string }) => (
  <div className="h-8 w-20">
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={[{ v: 4 }, { v: 7 }, { v: 5 }, { v: 9 }, { v: 6 }, { v: 8 }, { v: 10 }]}>
        <Bar dataKey="v" fill={color} radius={[2, 2, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  </div>
);

// --- KPI Card Interface (light theme) ---
interface DashboardKpiCardProps {
  title: string;
  value: string | number;
  description: string;
  icon: React.ElementType;
  trend?: string;
  isPositiveTrend?: boolean;
  accentColor?: string;
}

const DashboardKpiCard: React.FC<DashboardKpiCardProps> = ({
  title,
  value,
  description,
  icon: Icon,
  trend,
  isPositiveTrend = true,
  accentColor = "#3B82F6",
}) => {
  return (
    <div className="group relative overflow-hidden rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md">
      {/* Subtle glow (light) */}
      <div
        className="pointer-events-none absolute -right-6 -top-6 h-20 w-20 rounded-full opacity-10 blur-xl transition-all duration-300 group-hover:opacity-20"
        style={{ backgroundColor: accentColor }}
      />

      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold tracking-wider text-slate-500 uppercase">{title}</span>
        <div
          className="grid h-9 w-9 place-items-center rounded-lg border border-slate-200 bg-slate-50 text-slate-700 transition-colors duration-300 group-hover:border-slate-300"
          style={{ color: accentColor }}
        >
          <Icon size={18} />
        </div>
      </div>

      <div className="mt-3 flex items-baseline justify-between gap-2">
        <div className="text-2xl font-extrabold tracking-tight text-slate-900">{value}</div>
        <Sparkline color={accentColor} />
      </div>

      <div className="mt-2 flex items-center justify-between text-[11px]">
        <span className="text-slate-500">{description}</span>
        {trend && (
          <span
            className={`inline-flex items-center gap-0.5 font-bold ${
              isPositiveTrend ? "text-emerald-600" : "text-rose-600"
            }`}
          >
            {isPositiveTrend ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
            {trend}
          </span>
        )}
      </div>
    </div>
  );
};

// ============================================================
// Main Page Component (Light version)
// ============================================================
export const SyndicDashboardPage: React.FC = () => {
  const { data: dbData, isLoading } = useSyndicDashboard();

  if (isLoading) {
    return (
      <div className="min-h-screen  p-6  font-sans">
        <div className="mx-auto max-w-[1600px] space-y-6 animate-pulse">
          <div className="h-14 w-full rounded-xl bg-slate-200" />
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 lg:grid-cols-5">
            {[...Array(15)].map((_, i) => (
              <div key={i} className="h-32 rounded-xl bg-slate-200" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Aggregate View Data with safe fallbacks
  const data = dbData || {
    syndic_name: "Amine El Mansouri",
    total_residences: 8,
    total_apartments: 148,
    available_apartments: 22,
    occupied_apartments: 126,
    total_owners: 112,
    pending_charges: 14,
    paid_charges: 134,
    pending_amount: 34500,
    total_revenue: 284000,
    pending_incidents: 3,
    in_progress_incidents: 4,
    open_incidents: 7,
    resolved_incidents: 42,
    pending_reservations: 6,
    todays_rdv: 4,
    confirmed_reservations: 28,
  };

  const formatMAD = (val: number) =>
    new Intl.NumberFormat("fr-MA", { style: "currency", currency: "MAD", maximumFractionDigits: 0 }).format(val);

  // Charts data configurations
  const occupancyData = [
    { name: "Occupied", value: Number(data.occupied_apartments), color: "#10B981" },
    { name: "Available", value: Number(data.available_apartments), color: "#3B82F6" },
  ];

  const incidentData = [
    { name: "Pending", value: Number(data.pending_incidents), color: "#EF4444" },
    { name: "In Progress", value: Number(data.in_progress_incidents), color: "#F97316" },
    { name: "Resolved", value: Number(data.resolved_incidents), color: "#10B981" },
  ];

  const reservationData = [
    { name: "Pending", count: Number(data.pending_reservations), fill: "#F97316" },
    { name: "Confirmed", count: Number(data.confirmed_reservations), fill: "#10B981" },
    { name: "Today's RDV", count: Number(data.todays_rdv), fill: "#3B82F6" },
  ];

  return (
    <div className="min-h-screen font-sans selection:bg-orange-500 ">

      {/* Main Container */}
      <main className="mx-auto max-w-[1600px] px-6 pt-6 space-y-8">
        {/* Title Header (without filter buttons) */}
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-extrabold tracking-tight  sm:text-3xl">
              Vue d'ensemble Syndic
            </h1>
            <p className="text-xm ">
              Pilotez vos résidences, recouvrements, interventions et réservations en temps réel.
            </p>
          </div>
          {/* Removed Filter and Rapport buttons as requested */}
        </div>

        {/* 15 KPI Grid (light cards) */}
        <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
          <DashboardKpiCard
            title="Total Résidences"
            value={data.total_residences}
            description="Résidences sous gestion"
            icon={Building2}
            trend="+1 ce mois"
            isPositiveTrend={true}
            accentColor="#8B5CF6"
          />
          <DashboardKpiCard
            title="Total Appartements"
            value={data.total_apartments}
            description="Lots enregistrés"
            icon={Home}
            trend="+12%"
            isPositiveTrend={true}
            accentColor="#3B82F6"
          />
          <DashboardKpiCard
            title="Appartements Dispo"
            value={data.available_apartments}
            description="Prêts à la location"
            icon={CheckCircle2}
            trend="-2 dispo"
            isPositiveTrend={false}
            accentColor="#10B981"
          />
          <DashboardKpiCard
            title="Appartements Occupés"
            value={data.occupied_apartments}
            description="Taux d'occupation 85%"
            icon={Users}
            trend="+5%"
            isPositiveTrend={true}
            accentColor="#F97316"
          />
          <DashboardKpiCard
            title="Total Copropriétaires"
            value={data.total_owners}
            description="Comptes actifs"
            icon={Users}
            accentColor="#6366F1"
          />

          <DashboardKpiCard
            title="Charges en attente"
            value={data.pending_charges}
            description="Factures non réglées"
            icon={Receipt}
            trend="+3 dossiers"
            isPositiveTrend={false}
            accentColor="#EF4444"
          />
          <DashboardKpiCard
            title="Montant En Attente"
            value={formatMAD(Number(data.pending_amount))}
            description="Recouvrement en cours"
            icon={DollarSign}
            trend="-4% vs m-1"
            isPositiveTrend={true}
            accentColor="#F59E0B"
          />
          <DashboardKpiCard
            title="Chiffre d'affaires"
            value={formatMAD(Number(data.total_revenue))}
            description="Revenus validés"
            icon={TrendingUp}
            trend="+18% YTD"
            isPositiveTrend={true}
            accentColor="#10B981"
          />
          <DashboardKpiCard
            title="Incidents Ouverts"
            value={data.open_incidents}
            description="Non résolus"
            icon={AlertTriangle}
            trend="-2 urgents"
            isPositiveTrend={true}
            accentColor="#EF4444"
          />
          <DashboardKpiCard
            title="Incidents En Attente"
            value={data.pending_incidents}
            description="A qualifier"
            icon={Clock}
            accentColor="#F97316"
          />

          <DashboardKpiCard
            title="Incidents En Cours"
            value={data.in_progress_incidents}
            description="Prestataire assigné"
            icon={Wrench}
            accentColor="#3B82F6"
          />
          <DashboardKpiCard
            title="Incidents Résolus"
            value={data.resolved_incidents}
            description="Clôturés ce mois"
            icon={Check}
            trend="+14 clôturés"
            isPositiveTrend={true}
            accentColor="#10B981"
          />
          <DashboardKpiCard
            title="Réservations En Attente"
            value={data.pending_reservations}
            description="Demandes de visite"
            icon={Calendar}
            accentColor="#EC4899"
          />
          <DashboardKpiCard
            title="RDV Aujourd'hui"
            value={data.todays_rdv}
            description="Plannings du jour"
            icon={CalendarCheck}
            trend="4 confirmés"
            isPositiveTrend={true}
            accentColor="#06B6D4"
          />
          <DashboardKpiCard
            title="Réservations Confirmées"
            value={data.confirmed_reservations}
            description="Validées globalement"
            icon={CheckCircle2}
            accentColor="#10B981"
          />
        </section>

        {/* Analytics Section 1: Charts Row */}
        <section className="grid grid-cols-1 gap-6 lg:grid-cols-12">
          {/* Revenue Evolution (AreaChart) */}
          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm lg:col-span-8">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-slate-800">Évolution du Chiffre d'Affaires (MAD)</h3>
                <p className="text-xs text-slate-500">Revenus vs Charges mensuelles sur l'année</p>
              </div>
              <span className="rounded-lg bg-emerald-100 px-2.5 py-1 text-xs font-bold text-emerald-700 border border-emerald-200">
                +18.4%
              </span>
            </div>
            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={revenueHistory}>
                  <defs>
                    <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#F97316" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#F97316" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="colorCharges" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                  <XAxis dataKey="month" stroke="#94A3B8" fontSize={11} />
                  <YAxis stroke="#94A3B8" fontSize={11} />
                  <Tooltip
                    contentStyle={{ backgroundColor: "white", borderColor: "#E2E8F0", borderRadius: "8px", fontSize: "12px" }}
                  />
                  <Area type="monotone" dataKey="revenue" stroke="#F97316" strokeWidth={2} fillOpacity={1} fill="url(#colorRevenue)" name="Revenus MAD" />
                  <Area type="monotone" dataKey="charges" stroke="#3B82F6" strokeWidth={2} fillOpacity={1} fill="url(#colorCharges)" name="Charges MAD" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Charges Stacked Bar */}
          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm lg:col-span-4">
            <h3 className="text-sm font-bold text-slate-800">Répartition des Charges</h3>
            <p className="text-xs text-slate-500 mb-4">Mises en paiement vs En attente</p>
            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={[{ name: "Charges", Validated: Number(data.paid_charges), Pending: Number(data.pending_charges) }]}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                  <XAxis dataKey="name" stroke="#94A3B8" fontSize={11} />
                  <YAxis stroke="#94A3B8" fontSize={11} />
                  <Tooltip contentStyle={{ backgroundColor: "white", borderColor: "#E2E8F0", borderRadius: "8px" }} />
                  <Bar dataKey="Validated" stackId="a" fill="#10B981" radius={[0, 0, 4, 4]} name="Validées" />
                  <Bar dataKey="Pending" stackId="a" fill="#EF4444" radius={[4, 4, 0, 0]} name="En Attente" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </section>

        {/* Analytics Section 2: Donut, Pie & Horizontal Bar */}
        <section className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {/* Donut Chart: Occupancy */}
          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <h3 className="text-sm font-bold text-slate-800">Occupation des Lots</h3>
            <p className="text-xs text-slate-500 mb-2">Disponibilité immédiate</p>
            <div className="h-56 w-full relative">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={occupancyData} innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                    {occupancyData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ backgroundColor: "white", borderColor: "#E2E8F0", borderRadius: "8px" }} />
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-2xl font-black text-slate-800">{data.occupied_apartments}</span>
                <span className="text-[10px] uppercase text-slate-500">Occupés</span>
              </div>
            </div>
          </div>

          {/* Pie Chart: Incidents */}
          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <h3 className="text-sm font-bold text-slate-800">Statut des Incidents</h3>
            <p className="text-xs text-slate-500 mb-2">Traitements de maintenance</p>
            <div className="h-56 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={incidentData} outerRadius={80} dataKey="value" label>
                    {incidentData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ backgroundColor: "white", borderColor: "#E2E8F0", borderRadius: "8px" }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Horizontal Bar: Reservations */}
          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <h3 className="text-sm font-bold text-slate-800">Réservations & RDV</h3>
            <p className="text-xs text-slate-500 mb-4">Volume des demandes</p>
            <div className="h-56 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart layout="vertical" data={reservationData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                  <XAxis type="number" stroke="#94A3B8" fontSize={11} />
                  <YAxis type="category" dataKey="name" stroke="#94A3B8" fontSize={11} width={80} />
                  <Tooltip contentStyle={{ backgroundColor: "white", borderColor: "#E2E8F0", borderRadius: "8px" }} />
                  <Bar dataKey="count" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </section>

        {/* Data Tables & Feeds Section */}
        <section className="grid grid-cols-1 gap-6 lg:grid-cols-12">
          {/* Residence Performance Table */}
          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm lg:col-span-8">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-slate-800">Performance des Résidences</h3>
                <p className="text-xs text-slate-500">Suivi détaillé par copropriété</p>
              </div>
              <button className="text-xs text-orange-600 hover:underline flex items-center gap-1 font-semibold">
                Voir tout <ArrowUpRight size={14} />
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="border-b border-slate-200 bg-slate-50 text-slate-500 uppercase font-mono">
                  <tr>
                    <th className="py-3 px-3">Résidence</th>
                    <th className="py-3 px-3">Apparts</th>
                    <th className="py-3 px-3">Occupation</th>
                    <th className="py-3 px-3">Incidents</th>
                    <th className="py-3 px-3">Revenus</th>
                    <th className="py-3 px-3">Impayés</th>
                    <th className="py-3 px-3">Statut</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {mockResidencesTable.map((res) => (
                    <tr key={res.id} className="hover:bg-slate-50 transition">
                      <td className="py-3 px-3 font-bold text-slate-800">{res.name}</td>
                      <td className="py-3 px-3 text-slate-600">{res.apartments}</td>
                      <td className="py-3 px-3">
                        <span className="text-emerald-600 font-semibold">{res.occupancy}%</span>
                      </td>
                      <td className="py-3 px-3 text-slate-600">{res.incidents}</td>
                      <td className="py-3 px-3 font-semibold text-slate-800">{res.revenue}</td>
                      <td className="py-3 px-3 text-rose-600">{res.pending}</td>
                      <td className="py-3 px-3">
                        <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-700 border border-emerald-200">
                          {res.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Activity Feed */}
          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm lg:col-span-4">
            <h3 className="text-sm font-bold text-slate-800 mb-1">Fil d'Activité</h3>
            <p className="text-xs text-slate-500 mb-4">Événements récents en direct</p>
            <div className="space-y-4">
              {mockActivities.map((act) => {
                const IconComponent = act.icon;
                return (
                  <div key={act.id} className="flex gap-3 text-xs">
                    <div className={`grid h-8 w-8 shrink-0 place-items-center rounded-lg ${act.color}`}>
                      <IconComponent size={16} />
                    </div>
                    <div className="flex-1">
                      <p className="font-bold text-slate-800 leading-tight">{act.title}</p>
                      <p className="text-slate-500 text-[11px]">{act.desc}</p>
                      <span className="text-[10px] text-slate-400 font-mono">{act.time}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Schedule & Recent Incidents Section */}
        <section className="grid grid-cols-1 gap-6 lg:grid-cols-12">
          {/* Recent Incidents */}
          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm lg:col-span-7">
            <h3 className="text-sm font-bold text-slate-800 mb-1">Incidents Récents</h3>
            <p className="text-xs text-slate-500 mb-4">Dernières requêtes d'intervention</p>
            <div className="space-y-2">
              {mockRecentIncidents.map((inc) => (
                <div key={inc.id} className="flex items-center justify-between rounded-lg border border-slate-200 bg-slate-50/50 p-3 hover:border-slate-300 transition">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-[10px] text-orange-600 font-bold">{inc.id}</span>
                      <h4 className="text-xs font-bold text-slate-800">{inc.title}</h4>
                    </div>
                    <p className="text-[11px] text-slate-500 mt-0.5">{inc.residence} • {inc.date}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`rounded px-2 py-0.5 text-[10px] font-bold ${
                      inc.priority === "High" ? "bg-rose-100 text-rose-700" : "bg-amber-100 text-amber-700"
                    }`}>
                      {inc.priority}
                    </span>
                    <span className="rounded bg-slate-200 px-2 py-0.5 text-[10px] font-semibold text-slate-700">
                      {inc.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Today's Schedule */}
          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm lg:col-span-5">
            <h3 className="text-sm font-bold text-slate-800 mb-1">Planning du Jour</h3>
            <p className="text-xs text-slate-500 mb-4">Rendez-vous et visites programmées</p>
            <div className="space-y-3 relative before:absolute before:left-3 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
              {mockSchedule.map((item, idx) => (
                <div key={idx} className="relative pl-7 text-xs">
                  <div className="absolute left-1.5 top-1.5 h-3 w-3 -translate-x-1/2 rounded-full border-2 border-orange-500 bg-white" />
                  <span className="font-mono text-[10px] font-bold text-orange-600">{item.time}</span>
                  <h4 className="font-bold text-slate-800 leading-tight">{item.title}</h4>
                  <p className="text-[11px] text-slate-500">{item.residence} — <span className="text-slate-700">{item.client}</span></p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      {/* Floating Action Bar - REMOVED (the four buttons) */}
      {/* Previously had a fixed bottom bar with +Résidence, +Appartement, +Incident, +Charge - all removed */}

    </div>
  );
};

export default SyndicDashboardPage;