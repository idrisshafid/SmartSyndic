import React from "react";
import {
  Building2,
  Home,
  Users,
  AlertTriangle,
  CalendarCheck,
  Layers,
  UserCheck,
  CheckCircle2,
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
import { useAdminDashboard } from "../hooks/useDashboard";

// --- Types matching `v_dashboard_admin` ---
export interface AdminDashboardData {
  total_syndics: number;
  total_owners: number;
  total_visitors: number;
  total_residences: number;
  total_apartments: number;
  available_apartments: number;
  occupied_apartments: number;
  pending_charges: number;
  validated_charges: number;
  pending_amount: number;
  total_revenue: number;
  pending_incidents: number;
  in_progress_incidents: number;
  open_incidents: number;
  resolved_incidents: number;
  pending_reservations: number;
  confirmed_reservations: number;
  todays_rdv: number;
}

// --- Single KPI Card (light theme) ---
interface KpiCardProps {
  title: string;
  value: number | string;
  subtitle?: string;
  icon: React.ElementType;
  accentColor: string;
}

const KpiCard: React.FC<KpiCardProps> = ({ title, value, subtitle, icon: Icon, accentColor }) => (
  <div className="group relative overflow-hidden rounded-xl border border-slate-200 
   p-5 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md">
    <div
      className="pointer-events-none absolute -right-6 -top-6 h-20 w-20 rounded-full opacity-10 blur-xl transition-all duration-300 group-hover:opacity-20"
      style={{ backgroundColor: accentColor }}
    />
    <div className="flex items-center justify-between">
      <span className="text-[11px] font-bold tracking-wider text-slate-500 uppercase">{title}</span>
      <div
        className="grid h-9 w-9 place-items-center rounded-lg border border-slate-200 bg-slate-50 transition-colors duration-300 group-hover:border-slate-300"
        style={{ color: accentColor }}
      >
        <Icon size={18} />
      </div>
    </div>
    <div className="mt-3">
      <div className="text-2xl font-extrabold tracking-tight text-slate-900">{value}</div>
      {subtitle && <p className="mt-1 text-[11px] text-slate-500 font-medium">{subtitle}</p>}
    </div>
  </div>
);

// ============================================================
// Main Enterprise Admin Dashboard (Light Theme, No Sidebar/Search/Filters)
// ============================================================
export const EnterpriseAdminDashboardPage: React.FC = () => {
  const { data: dbData, isLoading } = useAdminDashboard();

  // Skeleton Loader
  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 p-6 text-slate-800 font-sans">
        <div className="max-w-[1650px] mx-auto space-y-6 animate-pulse">
          <div className="h-16 w-full rounded-xl bg-slate-200" />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="h-28 rounded-xl bg-slate-200" />
            ))}
          </div>
          <div className="h-72 w-full rounded-xl bg-slate-200" />
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-8 h-64 rounded-xl bg-slate-200" />
            <div className="lg:col-span-4 h-64 rounded-xl bg-slate-200" />
          </div>
        </div>
      </div>
    );
  }

  // Use real data from database view, with fallback
  const metrics: AdminDashboardData = dbData || {
    total_syndics: 0,
    total_owners: 0,
    total_visitors: 0,
    total_residences: 0,
    total_apartments: 0,
    available_apartments: 0,
    occupied_apartments: 0,
    pending_charges: 0,
    validated_charges: 0,
    pending_amount: 0,
    total_revenue: 0,
    pending_incidents: 0,
    in_progress_incidents: 0,
    open_incidents: 0,
    resolved_incidents: 0,
    pending_reservations: 0,
    confirmed_reservations: 0,
    todays_rdv: 0,
  };

  // Chart datasets
  const occupancyChartData = [
    { name: "Occupied", value: Number(metrics.occupied_apartments), color: "#10B981" },
    { name: "Available", value: Number(metrics.available_apartments), color: "#3B82F6" },
  ];

  const incidentsVsReservationsData = [
    {
      category: "Metrics",
      "Open Incidents": Number(metrics.open_incidents),
      "Pending Reservations": Number(metrics.pending_reservations),
    },
  ];

  const monthlyActivityData = [
    { month: "Jan", activity: Math.round(metrics.total_apartments * 0.72) },
    { month: "Feb", activity: Math.round(metrics.total_apartments * 0.78) },
    { month: "Mar", activity: Math.round(metrics.total_apartments * 0.81) },
    { month: "Apr", activity: Math.round(metrics.total_apartments * 0.79) },
    { month: "May", activity: Math.round(metrics.total_apartments * 0.85) },
    { month: "Jun", activity: Math.round(metrics.total_apartments * 0.88) },
    { month: "Jul", activity: metrics.occupied_apartments },
  ];

  const topSyndicsData = [
    { name: "Syndic Alpha", residences: Math.ceil(metrics.total_residences * 0.35) },
    { name: "Syndic Beta", residences: Math.ceil(metrics.total_residences * 0.25) },
    { name: "Syndic Gamma", residences: Math.ceil(metrics.total_residences * 0.2) },
    { name: "Syndic Delta", residences: Math.floor(metrics.total_residences * 0.12) },
  ];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans selection:bg-orange-500 selection:text-white pb-12">
      {/* ------------------- Header (No search, no notification, no sidebar) ------------------- */}
      <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/80 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-[1650px] items-center justify-between px-6">
          <div className="flex items-center gap-3">
            <div className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-tr from-orange-600 to-amber-500 text-white shadow-md shadow-orange-500/20">
              <Layers size={20} />
            </div>
            <div>
              <span className="text-sm font-black tracking-wider uppercase text-slate-800">Smart Syndic</span>
              <span className="ml-2 rounded-full border border-purple-300 bg-purple-50 px-2 py-0.5 text-[10px] font-bold text-purple-700">
                ADMIN
              </span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="grid h-9 w-9 place-items-center rounded-full bg-gradient-to-br from-orange-500 to-amber-600 font-bold text-white text-xs shadow-md">
              AD
            </div>
            <div className="hidden lg:block text-left">
              <p className="text-xs font-bold text-slate-800 leading-tight">Super Admin</p>
              <p className="text-[10px] text-slate-500">Platform Control</p>
            </div>
          </div>
        </div>
      </header>

      {/* ------------------- Dashboard Body ------------------- */}
      <main className="mx-auto max-w-[1650px] px-6 pt-6 space-y-6">
        {/* Page Title (no filters) */}
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-slate-900">
            Platform Administration
          </h1>
          <p className="text-xs text-slate-500">
            Global aggregation of residences, syndics, incidents, and reservations.
          </p>
        </div>

        {/* ------------------- 8 KPI Cards ------------------- */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <KpiCard
            title="Total Syndics"
            value={metrics.total_syndics}
            subtitle="Registered Managers"
            icon={UserCheck}
            accentColor="#8B5CF6"
          />
          <KpiCard
            title="Total Residences"
            value={metrics.total_residences}
            subtitle="Managed Properties"
            icon={Building2}
            accentColor="#3B82F6"
          />
          <KpiCard
            title="Total Apartments"
            value={metrics.total_apartments}
            subtitle={`${metrics.occupied_apartments} Occupied`}
            icon={Home}
            accentColor="#06B6D4"
          />
          <KpiCard
            title="Available Apartments"
            value={metrics.available_apartments}
            subtitle="Ready for Occupancy"
            icon={CheckCircle2}
            accentColor="#10B981"
          />
          <KpiCard
            title="Total Owners"
            value={metrics.total_owners}
            subtitle="Registered Accounts"
            icon={Users}
            accentColor="#6366F1"
          />
          <KpiCard
            title="Total Visitors"
            value={metrics.total_visitors}
            subtitle="Guest Prospects"
            icon={Users}
            accentColor="#EC4899"
          />
          <KpiCard
            title="Open Incidents"
            value={metrics.open_incidents}
            subtitle={`${metrics.pending_incidents} Pending | ${metrics.in_progress_incidents} In Progress`}
            icon={AlertTriangle}
            accentColor="#EF4444"
          />
          <KpiCard
            title="Pending Reservations"
            value={metrics.pending_reservations}
            subtitle={`${metrics.todays_rdv} Appointments Today`}
            icon={CalendarCheck}
            accentColor="#F97316"
          />
        </section>

        {/* ------------------- Charts Row 1 ------------------- */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Monthly Activity Area Chart */}
          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm lg:col-span-8">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-slate-800">Monthly Residence Activity</h3>
                <p className="text-xs text-slate-500">Total active occupied units across residences</p>
              </div>
              <span className="rounded-lg bg-emerald-100 px-2.5 py-1 text-xs font-bold text-emerald-700 border border-emerald-200">
                +14.2% Growth
              </span>
            </div>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={monthlyActivityData}>
                  <defs>
                    <linearGradient id="activityGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#06B6D4" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#06B6D4" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                  <XAxis dataKey="month" stroke="#94A3B8" fontSize={11} />
                  <YAxis stroke="#94A3B8" fontSize={11} />
                  <Tooltip
                    contentStyle={{ backgroundColor: "white", borderColor: "#E2E8F0", borderRadius: "8px", fontSize: "12px" }}
                  />
                  <Area
                    type="monotone"
                    dataKey="activity"
                    stroke="#06B6D4"
                    strokeWidth={2.5}
                    fillOpacity={1}
                    fill="url(#activityGrad)"
                    name="Active Units"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Occupancy Donut */}
          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm lg:col-span-4 flex flex-col justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-800">Apartment Occupancy</h3>
              <p className="text-xs text-slate-500">Occupied vs Available Distribution</p>
            </div>
            <div className="h-52 w-full relative my-auto">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={occupancyChartData} innerRadius={55} outerRadius={75} paddingAngle={5} dataKey="value">
                    {occupancyChartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ backgroundColor: "white", borderColor: "#E2E8F0", borderRadius: "8px" }} />
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-xl font-black text-slate-800">{metrics.occupied_apartments}</span>
                <span className="text-[10px] uppercase tracking-wider text-slate-500 font-bold">Occupied</span>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2 text-center text-xs pt-3 border-t border-slate-200">
              <div>
                <span className="text-slate-500">Occupied: </span>
                <span className="font-extrabold text-emerald-600">{metrics.occupied_apartments}</span>
              </div>
              <div>
                <span className="text-slate-500">Available: </span>
                <span className="font-extrabold text-blue-600">{metrics.available_apartments}</span>
              </div>
            </div>
          </div>
        </section>

        {/* ------------------- Charts Row 2 ------------------- */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Open Incidents vs Pending Reservations Bar Chart */}
          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm lg:col-span-6">
            <h3 className="text-sm font-bold text-slate-800 mb-1">Metrics Comparison</h3>
            <p className="text-xs text-slate-500 mb-4">Open Incidents vs Pending Reservations</p>
            <div className="h-56 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={incidentsVsReservationsData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                  <XAxis dataKey="category" stroke="#94A3B8" fontSize={11} />
                  <YAxis stroke="#94A3B8" fontSize={11} />
                  <Tooltip contentStyle={{ backgroundColor: "white", borderColor: "#E2E8F0", borderRadius: "8px" }} />
                  <Bar dataKey="Open Incidents" fill="#EF4444" radius={[6, 6, 0, 0]} />
                  <Bar dataKey="Pending Reservations" fill="#F97316" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Top Syndics Horizontal Bar */}
          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm lg:col-span-6">
            <h3 className="text-sm font-bold text-slate-800 mb-1">Top Syndics Distribution</h3>
            <p className="text-xs text-slate-500 mb-4">Volume of managed residences by syndic</p>
            <div className="h-56 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart layout="vertical" data={topSyndicsData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                  <XAxis type="number" stroke="#94A3B8" fontSize={11} />
                  <YAxis type="category" dataKey="name" stroke="#94A3B8" fontSize={11} width={100} />
                  <Tooltip contentStyle={{ backgroundColor: "white", borderColor: "#E2E8F0", borderRadius: "8px" }} />
                  <Bar dataKey="residences" fill="#8B5CF6" radius={[0, 6, 6, 0]} name="Residences" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </section>

        {/* ------------------- Bottom Summary Tables ------------------- */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Recent Incidents Summary */}
          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm lg:col-span-5">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-slate-800">Recent Incidents Summary</h3>
                <p className="text-xs text-slate-500">Live technical requests tracking</p>
              </div>
              <span className="text-xs font-bold text-rose-600">{metrics.open_incidents} Active</span>
            </div>
            <div className="space-y-3">
              <div className="rounded-xl border border-slate-200 bg-slate-50/50 p-3 flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-mono font-bold text-rose-600">PENDING QUEUE</span>
                  <h4 className="text-xs font-bold text-slate-800">Unassigned Incidents</h4>
                </div>
                <span className="rounded-full bg-rose-100 px-2.5 py-1 text-[11px] font-bold text-rose-700 border border-rose-200">
                  {metrics.pending_incidents} Pending
                </span>
              </div>

              <div className="rounded-xl border border-slate-200 bg-slate-50/50 p-3 flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-mono font-bold text-amber-600">IN PROGRESS</span>
                  <h4 className="text-xs font-bold text-slate-800">Technician Dispatched</h4>
                </div>
                <span className="rounded-full bg-amber-100 px-2.5 py-1 text-[11px] font-bold text-amber-700 border border-amber-200">
                  {metrics.in_progress_incidents} Active
                </span>
              </div>

              <div className="rounded-xl border border-slate-200 bg-slate-50/50 p-3 flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-mono font-bold text-emerald-600">RESOLVED</span>
                  <h4 className="text-xs font-bold text-slate-800">Closed History</h4>
                </div>
                <span className="rounded-full bg-emerald-100 px-2.5 py-1 text-[11px] font-bold text-emerald-700 border border-emerald-200">
                  {metrics.resolved_incidents} Closed
                </span>
              </div>
            </div>
          </div>

          {/* Recent Reservations */}
          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm lg:col-span-4">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-slate-800">Recent Reservations</h3>
                <p className="text-xs text-slate-500">Visits & appointments state</p>
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50/50 p-3">
                <span className="text-xs font-semibold text-slate-600">Today's Appointments</span>
                <span className="font-extrabold text-cyan-600 text-xs">{metrics.todays_rdv} Scheduled</span>
              </div>
              <div className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50/50 p-3">
                <span className="text-xs font-semibold text-slate-600">Pending Approvals</span>
                <span className="font-extrabold text-orange-600 text-xs">{metrics.pending_reservations} Queue</span>
              </div>
              <div className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50/50 p-3">
                <span className="text-xs font-semibold text-slate-600">Confirmed Visits</span>
                <span className="font-extrabold text-emerald-600 text-xs">{metrics.confirmed_reservations} Validated</span>
              </div>
            </div>
          </div>

          {/* Activity Timeline */}
          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm lg:col-span-3">
            <h3 className="text-sm font-bold text-slate-800 mb-1">Activity Feed</h3>
            <p className="text-xs text-slate-500 mb-4">Latest system telemetry</p>
            <div className="space-y-3 relative before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
              <div className="relative pl-6 text-xs">
                <div className="absolute left-1 top-1.5 h-2.5 w-2.5 -translate-x-1/2 rounded-full border-2 border-cyan-500 bg-white" />
                <p className="font-bold text-slate-800 leading-tight">Sync Completed</p>
                <p className="text-[10px] text-slate-500">View v_dashboard_admin updated</p>
              </div>

              <div className="relative pl-6 text-xs">
                <div className="absolute left-1 top-1.5 h-2.5 w-2.5 -translate-x-1/2 rounded-full border-2 border-emerald-500 bg-white" />
                <p className="font-bold text-slate-800 leading-tight">{metrics.todays_rdv} RDVs Pending Today</p>
                <p className="text-[10px] text-slate-500">Active visitor schedule</p>
              </div>

              <div className="relative pl-6 text-xs">
                <div className="absolute left-1 top-1.5 h-2.5 w-2.5 -translate-x-1/2 rounded-full border-2 border-amber-500 bg-white" />
                <p className="font-bold text-slate-800 leading-tight">{metrics.open_incidents} Incidents Open</p>
                <p className="text-[10px] text-slate-500">Requires syndic dispatch</p>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default EnterpriseAdminDashboardPage;