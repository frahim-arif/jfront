import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Users,
  UserCheck,
  UserX,
  Clock,
  CreditCard,
  ShieldCheck,
  Award,
  BriefcaseBusiness,
  MapPin,
  LogOut,
  ArrowRight,
  RefreshCw,
  Banknote,
  Wallet,
  TrendingUp,
  CheckCircle,
  AlertCircle,
  Eye,
  X,
  Smartphone,
  Receipt,
  IndianRupee,
  CalendarDays,
  Building2,
  BadgeCheck,
  CircleDollarSign,
  UserRound,
} from "lucide-react";

const API_URL = "https://jbackend-h963.onrender.com";

const formatMoney = (value) => {
  const amount = Number(value || 0);

  return amount.toLocaleString("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  });
};

const formatDate = (value) => {
  if (!value) return "—";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return "—";

  return date.toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const getPaymentStatusClass = (status) => {
  if (status === "VERIFIED") {
    return "border-emerald-200 bg-emerald-50 text-emerald-700";
  }

  if (status === "REJECTED") {
    return "border-red-200 bg-red-50 text-red-700";
  }

  return "border-amber-200 bg-amber-50 text-amber-700";
};

const getPayoutStatusClass = (status) => {
  if (status === "PAID") {
    return "border-emerald-200 bg-emerald-50 text-emerald-700";
  }

  return "border-amber-200 bg-amber-50 text-amber-700";
};

const StatCard = ({
  title,
  value,
  icon: Icon,
  gradient,
  iconBg,
  subtitle,
}) => {
  return (
    <div className="group relative overflow-hidden border border-slate-200 bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
      <div
        className={`absolute inset-x-0 top-0 h-1 bg-gradient-to-r ${gradient}`}
      />

      <div className="absolute -right-8 -top-8 h-24 w-24 rounded-full bg-slate-50 opacity-60 transition-transform duration-500 group-hover:scale-150" />

      <div className="relative flex items-start justify-between gap-4">
        <div className="min-w-0">
          <p className="text-xs font-bold uppercase tracking-wider text-slate-500">
            {title}
          </p>

          <h3 className="mt-2 truncate text-2xl font-black text-slate-900">
            {value}
          </h3>

          {subtitle && (
            <p className="mt-1 text-xs font-medium text-slate-500">
              {subtitle}
            </p>
          )}
        </div>

        <div
          className={`flex h-12 w-12 shrink-0 items-center justify-center ${iconBg} shadow-sm`}
        >
          <Icon size={22} />
        </div>
      </div>
    </div>
  );
};

const SectionTitle = ({
  icon: Icon,
  title,
  subtitle,
  gradient = "from-emerald-500 to-teal-500",
}) => {
  return (
    <div className="mb-5 flex items-center gap-3">
      <div
        className={`flex h-10 w-10 shrink-0 items-center justify-center bg-gradient-to-br ${gradient} text-white shadow-md`}
      >
        <Icon size={20} />
      </div>

      <div>
        <h2 className="text-lg font-black text-slate-900">{title}</h2>

        {subtitle && (
          <p className="text-xs font-medium text-slate-500">{subtitle}</p>
        )}
      </div>
    </div>
  );
};

export default function DimapurDashboard() {
  const navigate = useNavigate();

  const [stats, setStats] = useState(null);
  const [revenue, setRevenue] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");
  const [selectedPayment, setSelectedPayment] = useState(null);

  const adminUser = JSON.parse(
    localStorage.getItem("adminUser") || "null"
  );

  const fetchDashboard = async (showRefresh = false) => {
    try {
      const token = localStorage.getItem("adminToken");

      if (!token) {
        navigate("/admin/login");
        return;
      }

      if (adminUser?.role !== "dimapur_admin") {
        navigate("/admin/dashboard");
        return;
      }

      if (showRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      setError("");

      const headers = {
        Authorization: `Bearer ${token}`,
      };

      const [statsResponse, revenueResponse] = await Promise.all([
        fetch(`${API_URL}/admin/dimapur/stats`, {
          headers,
        }),
        fetch(`${API_URL}/admin/dimapur/revenue`, {
          headers,
        }),
      ]);

      if (!statsResponse.ok || !revenueResponse.ok) {
        const failedResponse = !statsResponse.ok
          ? statsResponse
          : revenueResponse;

        let errorMessage = "Failed to load dashboard";

        try {
          const errorData = await failedResponse.json();
          errorMessage =
            errorData?.message ||
            errorData?.error ||
            errorMessage;
        } catch {
          // ignore JSON parse error
        }

        if (
          failedResponse.status === 401 ||
          failedResponse.status === 403
        ) {
          localStorage.removeItem("adminToken");
          localStorage.removeItem("adminUser");

          navigate("/admin/login");
          return;
        }

        throw new Error(errorMessage);
      }

      const statsData = await statsResponse.json();
      const revenueData = await revenueResponse.json();

      if (!statsData?.success && statsData?.success !== undefined) {
        throw new Error(
          statsData?.message || "Unable to load worker statistics"
        );
      }

      if (
        !revenueData?.success &&
        revenueData?.success !== undefined
      ) {
        throw new Error(
          revenueData?.message || "Unable to load revenue data"
        );
      }

      setStats(statsData);
      setRevenue(revenueData);
    } catch (err) {
      console.error("DIMAPUR DASHBOARD ERROR:", err);

      setError(err?.message || "Something went wrong");

      if (
        err?.message?.toLowerCase().includes("token") ||
        err?.message?.toLowerCase().includes("authorization") ||
        err?.message?.toLowerCase().includes("admin")
      ) {
        localStorage.removeItem("adminToken");
        localStorage.removeItem("adminUser");
        navigate("/admin/login");
      }
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    localStorage.removeItem("adminUser");
    navigate("/admin/login");
  };

  const recentPayments = revenue?.recentPayments || [];

  const monthlyBreakdown = revenue?.monthlyBreakdown || [];

  const totalWorkers = stats?.totalWorkers || 0;
  const activeWorkers = stats?.activeWorkers || 0;
  const pendingWorkers = stats?.pendingWorkers || 0;
  const blockedWorkers = stats?.blockedWorkers || 0;
  const paidWorkers = stats?.paidWorkers || 0;
  const pendingPayment = stats?.pendingPayment || 0;

  const pendingVerification = stats?.pendingVerification || 0;
  const verifiedWorkers = stats?.verifiedWorkers || 0;
  const kycVerifiedWorkers = stats?.kycVerifiedWorkers || 0;
  const skillVerifiedWorkers = stats?.skillVerifiedWorkers || 0;
  const underReview = stats?.underReview || 0;

  const expertWorkers = stats?.expertWorkers || 0;
  const skilledWorkers = stats?.skilledWorkers || 0;
  const semiSkilledWorkers = stats?.semiSkilledWorkers || 0;
  const helperWorkers = stats?.helperWorkers || 0;

  const totalJobs = revenue?.jobs?.totalJobs || 0;
  const assignedJobs = revenue?.jobs?.assignedJobs || 0;
  const workingJobs = revenue?.jobs?.workingJobs || 0;
  const completedJobs = revenue?.jobs?.completedJobs || 0;
  const totalJobValue = revenue?.jobs?.totalJobValue || 0;

  const totalClientPayment = revenue?.payment?.total || 0;
  const thisMonthPayment = revenue?.payment?.thisMonth || 0;
  const thisYearPayment = revenue?.payment?.thisYear || 0;
  const pendingClientPayment = revenue?.payment?.pending || 0;
  const pendingClientPaymentCount =
    revenue?.payment?.pendingCount || 0;

  const totalCommission = revenue?.commission?.total || 0;
  const thisMonthCommission =
    revenue?.commission?.thisMonth || 0;
  const thisYearCommission =
    revenue?.commission?.thisYear || 0;

  const workerShare = revenue?.workerShare?.total || 0;
  const workerShareThisMonth =
    revenue?.workerShare?.thisMonth || 0;
  const workerShareThisYear =
    revenue?.workerShare?.thisYear || 0;

  const workerPaid = revenue?.workerPayout?.paid || 0;
  const workerPaidCount =
    revenue?.workerPayout?.paidCount || 0;

  const workerPending = revenue?.workerPayout?.pending || 0;
  const workerPendingCount =
    revenue?.workerPayout?.pendingCount || 0;

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50">
        <div className="flex min-h-screen items-center justify-center">
          <div className="border border-slate-200 bg-white px-8 py-7 text-center shadow-xl">
            <div className="mx-auto mb-4 flex h-14 w-14 animate-pulse items-center justify-center bg-gradient-to-br from-emerald-500 to-teal-600 text-white">
              <BriefcaseBusiness size={28} />
            </div>

            <h2 className="text-lg font-black text-slate-900">
              Loading Dimapur Dashboard
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Please wait...
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      {/* HEADER */}
      <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/95 shadow-sm backdrop-blur">
        <div className="mx-auto max-w-[1600px] px-4 py-3 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center bg-gradient-to-br from-emerald-600 via-teal-600 to-cyan-600 text-white shadow-lg">
                <MapPin size={23} />
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-xl font-black tracking-tight text-slate-900">
                    JobHIR
                  </h1>

                  <span className="border border-emerald-200 bg-emerald-50 px-2 py-0.5 text-[10px] font-black uppercase tracking-wider text-emerald-700">
                    Dimapur Admin
                  </span>
                </div>

                <p className="text-xs font-medium text-slate-500">
                  Dimapur, Nagaland • Administration Dashboard
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <div className="hidden border border-slate-200 bg-slate-50 px-3 py-2 sm:block">
                <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  Logged in as
                </p>
                <p className="text-xs font-bold text-slate-700">
                  {adminUser?.username || "Dimapur Admin"}
                </p>
              </div>

              <button
                onClick={() => fetchDashboard(true)}
                disabled={refreshing}
                className="inline-flex items-center gap-2 border border-slate-200 bg-white px-4 py-2.5 text-sm font-bold text-slate-700 shadow-sm transition hover:border-emerald-300 hover:bg-emerald-50 hover:text-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                <RefreshCw
                  size={16}
                  className={refreshing ? "animate-spin" : ""}
                />
                <span className="hidden sm:inline">Refresh</span>
              </button>

              <button
                onClick={handleLogout}
                className="inline-flex items-center gap-2 border border-red-200 bg-red-50 px-4 py-2.5 text-sm font-bold text-red-600 transition hover:bg-red-100"
              >
                <LogOut size={16} />
                <span className="hidden sm:inline">Logout</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-[1600px] px-4 py-6 sm:px-6 lg:px-8">
        {/* ERROR */}
        {error && (
          <div className="mb-6 flex items-start gap-3 border border-red-200 bg-red-50 p-4 text-red-700 shadow-sm">
            <AlertCircle className="mt-0.5 shrink-0" size={20} />

            <div className="flex-1">
              <p className="font-bold">Dashboard Error</p>
              <p className="mt-1 text-sm">{error}</p>
            </div>

            <button
              onClick={() => setError("")}
              className="text-red-500 hover:text-red-700"
            >
              <X size={18} />
            </button>
          </div>
        )}

        {/* HERO */}
        <section className="relative mb-8 overflow-hidden border border-emerald-800 bg-gradient-to-r from-slate-950 via-emerald-950 to-teal-900 p-6 text-white shadow-xl sm:p-8">
          <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-emerald-400/10" />
          <div className="absolute -bottom-32 right-40 h-72 w-72 rounded-full bg-cyan-400/10" />

          <div className="relative flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <div className="mb-3 inline-flex items-center gap-2 border border-emerald-400/30 bg-emerald-400/10 px-3 py-1.5 text-xs font-bold text-emerald-200">
                <BadgeCheck size={14} />
                ADMIN CONTROL CENTER
              </div>

              <h2 className="text-3xl font-black tracking-tight sm:text-4xl">
                Dimapur Dashboard
              </h2>

              <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-300">
                Manage Dimapur workers, jobs, client QR payments,
                commission and worker payouts from one place.
              </p>
            </div>

            <Link
              to="/admin/dimapur/workers"
              className="inline-flex shrink-0 items-center justify-center gap-2 border border-emerald-400 bg-emerald-500 px-5 py-3 text-sm font-black !text-white shadow-lg transition hover:bg-emerald-400"
            >
              <Users size={18} className="!text-white" />
              <span className="!text-white">Manage Workers</span>
              <ArrowRight size={17} className="!text-white" />
            </Link>
          </div>
        </section>

        {/* WORKER OVERVIEW */}
        <section className="mb-8">
          <SectionTitle
            icon={Users}
            title="Worker Overview"
            subtitle="Dimapur registered workforce"
            gradient="from-blue-600 to-cyan-500"
          />

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <StatCard
              title="Total Workers"
              value={totalWorkers}
              icon={Users}
              gradient="from-blue-500 to-cyan-500"
              iconBg="bg-blue-50 text-blue-600"
            />

            <StatCard
              title="Active Workers"
              value={activeWorkers}
              icon={UserCheck}
              gradient="from-emerald-500 to-teal-500"
              iconBg="bg-emerald-50 text-emerald-600"
            />

            <StatCard
              title="Pending Workers"
              value={pendingWorkers}
              icon={Clock}
              gradient="from-amber-400 to-orange-500"
              iconBg="bg-amber-50 text-amber-600"
            />

            <StatCard
              title="Blocked Workers"
              value={blockedWorkers}
              icon={UserX}
              gradient="from-red-500 to-rose-500"
              iconBg="bg-red-50 text-red-600"
            />

            <StatCard
              title="Paid Workers"
              value={paidWorkers}
              icon={CreditCard}
              gradient="from-violet-500 to-purple-600"
              iconBg="bg-violet-50 text-violet-600"
            />

            <StatCard
              title="Pending Payment"
              value={pendingPayment}
              icon={Wallet}
              gradient="from-orange-500 to-red-500"
              iconBg="bg-orange-50 text-orange-600"
            />

            <StatCard
              title="Pending Verification"
              value={pendingVerification}
              icon={ShieldCheck}
              gradient="from-cyan-500 to-blue-600"
              iconBg="bg-cyan-50 text-cyan-600"
            />

            <StatCard
              title="Verified Workers"
              value={verifiedWorkers}
              icon={CheckCircle}
              gradient="from-green-500 to-emerald-600"
              iconBg="bg-green-50 text-green-600"
            />
          </div>
        </section>

        {/* VERIFICATION */}
        <section className="mb-8">
          <SectionTitle
            icon={ShieldCheck}
            title="Worker Verification"
            subtitle="KYC, skills and experience verification"
            gradient="from-violet-600 to-fuchsia-500"
          />

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <StatCard
              title="KYC Verified"
              value={kycVerifiedWorkers}
              icon={ShieldCheck}
              gradient="from-emerald-500 to-green-600"
              iconBg="bg-emerald-50 text-emerald-600"
            />

            <StatCard
              title="Skill Verified"
              value={skillVerifiedWorkers}
              icon={Award}
              gradient="from-violet-500 to-purple-600"
              iconBg="bg-violet-50 text-violet-600"
            />

            <StatCard
              title="Under Review"
              value={underReview}
              icon={Clock}
              gradient="from-amber-400 to-orange-500"
              iconBg="bg-amber-50 text-amber-600"
            />

            <StatCard
              title="Expert Workers"
              value={expertWorkers}
              icon={Award}
              gradient="from-pink-500 to-rose-600"
              iconBg="bg-pink-50 text-pink-600"
            />
          </div>

          <div className="mt-4 grid grid-cols-2 gap-4 lg:grid-cols-4">
            <div className="border border-violet-100 bg-violet-50 p-4">
              <p className="text-xs font-bold text-violet-500">
                EXPERT
              </p>
              <p className="mt-1 text-xl font-black text-violet-800">
                {expertWorkers}
              </p>
            </div>

            <div className="border border-blue-100 bg-blue-50 p-4">
              <p className="text-xs font-bold text-blue-500">
                SKILLED
              </p>
              <p className="mt-1 text-xl font-black text-blue-800">
                {skilledWorkers}
              </p>
            </div>

            <div className="border border-amber-100 bg-amber-50 p-4">
              <p className="text-xs font-bold text-amber-500">
                SEMI-SKILLED
              </p>
              <p className="mt-1 text-xl font-black text-amber-800">
                {semiSkilledWorkers}
              </p>
            </div>

            <div className="border border-slate-200 bg-slate-100 p-4">
              <p className="text-xs font-bold text-slate-500">
                HELPER
              </p>
              <p className="mt-1 text-xl font-black text-slate-800">
                {helperWorkers}
              </p>
            </div>
          </div>
        </section>

        {/* WORK OVERVIEW */}
        <section className="mb-8">
          <SectionTitle
            icon={BriefcaseBusiness}
            title="Dimapur Work Overview"
            subtitle="Jobs and work activity"
            gradient="from-orange-500 to-amber-400"
          />

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
            <StatCard
              title="Total Jobs"
              value={totalJobs}
              icon={BriefcaseBusiness}
              gradient="from-blue-500 to-indigo-600"
              iconBg="bg-blue-50 text-blue-600"
            />

            <StatCard
              title="Assigned Jobs"
              value={assignedJobs}
              icon={UserCheck}
              gradient="from-violet-500 to-purple-600"
              iconBg="bg-violet-50 text-violet-600"
            />

            <StatCard
              title="Working Jobs"
              value={workingJobs}
              icon={TrendingUp}
              gradient="from-orange-500 to-amber-500"
              iconBg="bg-orange-50 text-orange-600"
            />

            <StatCard
              title="Completed Jobs"
              value={completedJobs}
              icon={CheckCircle}
              gradient="from-emerald-500 to-green-600"
              iconBg="bg-emerald-50 text-emerald-600"
            />

            <StatCard
              title="Total Job Value"
              value={formatMoney(totalJobValue)}
              icon={IndianRupee}
              gradient="from-cyan-500 to-teal-600"
              iconBg="bg-cyan-50 text-cyan-600"
            />
          </div>
        </section>

        {/* CLIENT PAYMENT */}
        <section className="mb-8">
          <SectionTitle
            icon={CircleDollarSign}
            title="Client Payment"
            subtitle="QR payment collection from Dimapur jobs"
            gradient="from-emerald-600 to-green-500"
          />

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <StatCard
              title="Total Client Payment"
              value={formatMoney(totalClientPayment)}
              icon={Banknote}
              gradient="from-emerald-500 to-teal-500"
              iconBg="bg-emerald-50 text-emerald-600"
            />

            <StatCard
              title="This Month"
              value={formatMoney(thisMonthPayment)}
              icon={CalendarDays}
              gradient="from-blue-500 to-cyan-500"
              iconBg="bg-blue-50 text-blue-600"
            />

            <StatCard
              title="This Year"
              value={formatMoney(thisYearPayment)}
              icon={TrendingUp}
              gradient="from-violet-500 to-purple-600"
              iconBg="bg-violet-50 text-violet-600"
            />

            <StatCard
              title="Pending Payment"
              value={formatMoney(pendingClientPayment)}
              icon={Clock}
              gradient="from-amber-400 to-orange-500"
              iconBg="bg-amber-50 text-amber-600"
              subtitle={`${pendingClientPaymentCount} pending payment(s)`}
            />
          </div>
        </section>

        {/* COMMISSION */}
        <section className="mb-8">
          <SectionTitle
            icon={Receipt}
            title="JobHIR Commission"
            subtitle="10% platform commission"
            gradient="from-fuchsia-600 to-pink-500"
          />

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <StatCard
              title="Total Commission"
              value={formatMoney(totalCommission)}
              icon={Receipt}
              gradient="from-fuchsia-500 to-pink-600"
              iconBg="bg-fuchsia-50 text-fuchsia-600"
            />

            <StatCard
              title="This Month Commission"
              value={formatMoney(thisMonthCommission)}
              icon={CalendarDays}
              gradient="from-pink-500 to-rose-500"
              iconBg="bg-pink-50 text-pink-600"
            />

            <StatCard
              title="This Year Commission"
              value={formatMoney(thisYearCommission)}
              icon={TrendingUp}
              gradient="from-purple-500 to-violet-600"
              iconBg="bg-purple-50 text-purple-600"
            />
          </div>
        </section>

        {/* WORKER PAYOUT */}
        <section className="mb-8">
          <SectionTitle
            icon={Wallet}
            title="Worker Share & Payout"
            subtitle="90% worker share and payout status"
            gradient="from-cyan-600 to-blue-500"
          />

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <StatCard
              title="Worker Share"
              value={formatMoney(workerShare)}
              icon={Wallet}
              gradient="from-cyan-500 to-teal-500"
              iconBg="bg-cyan-50 text-cyan-600"
            />

            <StatCard
              title="Worker Paid"
              value={formatMoney(workerPaid)}
              icon={CheckCircle}
              gradient="from-emerald-500 to-green-600"
              iconBg="bg-emerald-50 text-emerald-600"
              subtitle={`${workerPaidCount} payout(s)`}
            />

            <StatCard
              title="Worker Pending"
              value={formatMoney(workerPending)}
              icon={Clock}
              gradient="from-amber-400 to-orange-500"
              iconBg="bg-amber-50 text-amber-600"
              subtitle={`${workerPendingCount} payout(s)`}
            />

            <StatCard
              title="Worker Share This Year"
              value={formatMoney(workerShareThisYear)}
              icon={TrendingUp}
              gradient="from-indigo-500 to-blue-600"
              iconBg="bg-indigo-50 text-indigo-600"
            />
          </div>

          <div className="mt-4 border border-cyan-100 bg-gradient-to-r from-cyan-50 to-blue-50 p-4">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-cyan-600">
                  Worker Share This Month
                </p>

                <p className="mt-1 text-2xl font-black text-slate-900">
                  {formatMoney(workerShareThisMonth)}
                </p>
              </div>

              <div className="flex h-12 w-12 items-center justify-center bg-white text-cyan-600 shadow-sm">
                <Wallet size={23} />
              </div>
            </div>
          </div>
        </section>

        {/* MONTHLY REVENUE */}
        <section className="mb-8">
          <SectionTitle
            icon={TrendingUp}
            title="Monthly Revenue Report"
            subtitle="Client payment, JobHIR commission and worker share"
            gradient="from-indigo-600 to-purple-600"
          />

          <div className="overflow-hidden border border-slate-200 bg-white shadow-sm">
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-900 text-left">
                    <th className="px-5 py-4 text-xs font-black uppercase tracking-wider text-white">
                      Month
                    </th>

                    <th className="px-5 py-4 text-right text-xs font-black uppercase tracking-wider text-emerald-300">
                      Client Payment
                    </th>

                    <th className="px-5 py-4 text-right text-xs font-black uppercase tracking-wider text-pink-300">
                      JobHIR 10%
                    </th>

                    <th className="px-5 py-4 text-right text-xs font-black uppercase tracking-wider text-cyan-300">
                      Worker 90%
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {monthlyBreakdown.length > 0 ? (
                    monthlyBreakdown.map((row, index) => (
                      <tr
                        key={`${row.year}-${row.month}-${index}`}
                        className="border-b border-slate-100 transition hover:bg-slate-50"
                      >
                        <td className="px-5 py-4 text-sm font-bold text-slate-800">
                          {row.monthName || row.month}
                          {row.year ? ` ${row.year}` : ""}
                        </td>

                        <td className="px-5 py-4 text-right text-sm font-black text-emerald-700">
                          {formatMoney(row.payment)}
                        </td>

                        <td className="px-5 py-4 text-right text-sm font-black text-pink-700">
                          {formatMoney(row.commission)}
                        </td>

                        <td className="px-5 py-4 text-right text-sm font-black text-cyan-700">
                          {formatMoney(row.workerAmount)}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan="4"
                        className="px-5 py-10 text-center text-sm font-medium text-slate-500"
                      >
                        No monthly revenue data available.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* RECENT QR PAYMENTS */}
        <section className="mb-8">
          <SectionTitle
            icon={Receipt}
            title="Recent QR Payments"
            subtitle="Latest client payments for Dimapur jobs"
            gradient="from-emerald-500 to-cyan-500"
          />

          {recentPayments.length === 0 ? (
            <div className="border border-slate-200 bg-white p-10 text-center shadow-sm">
              <div className="mx-auto flex h-14 w-14 items-center justify-center bg-slate-100 text-slate-400">
                <Receipt size={25} />
              </div>

              <h3 className="mt-4 text-base font-black text-slate-800">
                No QR Payments Found
              </h3>

              <p className="mt-1 text-sm text-slate-500">
                Dimapur client payments will appear here.
              </p>
            </div>
          ) : (
            <div className="overflow-hidden border border-slate-200 bg-white shadow-sm">
              {/* DESKTOP TABLE */}
              <div className="hidden overflow-x-auto lg:block">
                <table className="min-w-full">
                  <thead>
                    <tr className="border-b border-slate-200 bg-gradient-to-r from-slate-950 via-emerald-950 to-teal-900">
                      <th className="px-5 py-4 text-left text-xs font-black uppercase tracking-wider text-white">
                        Client / Job
                      </th>

                      <th className="px-5 py-4 text-left text-xs font-black uppercase tracking-wider text-white">
                        Worker
                      </th>

                      <th className="px-5 py-4 text-left text-xs font-black uppercase tracking-wider text-white">
                        Amount
                      </th>

                      <th className="px-5 py-4 text-left text-xs font-black uppercase tracking-wider text-white">
                        UTR
                      </th>

                      <th className="px-5 py-4 text-left text-xs font-black uppercase tracking-wider text-white">
                        Payment
                      </th>

                      <th className="px-5 py-4 text-left text-xs font-black uppercase tracking-wider text-white">
                        Payout
                      </th>

                      <th className="px-5 py-4 text-center text-xs font-black uppercase tracking-wider text-white">
                        Details
                      </th>
                    </tr>
                  </thead>

                  <tbody>
                    {recentPayments.map((payment, index) => (
                      <tr
                        key={
                          payment._id ||
                          payment.merchantOrderId ||
                          index
                        }
                        className="border-b border-slate-100 transition hover:bg-emerald-50/40"
                      >
                        <td className="px-5 py-4">
                          <div className="flex items-start gap-3">
                            <div className="flex h-10 w-10 shrink-0 items-center justify-center bg-emerald-100 text-emerald-700">
                              <UserRound size={18} />
                            </div>

                            <div className="min-w-0">
                              <p className="font-black text-slate-800">
                                {payment.clientName || "Unknown Client"}
                              </p>

                              <p className="mt-0.5 max-w-[240px] truncate text-xs text-slate-500">
                                {payment.jobTitle || "Job"}
                              </p>

                              <p className="mt-1 text-[11px] text-slate-400">
                                {formatDate(payment.createdAt)}
                              </p>
                            </div>
                          </div>
                        </td>

                        <td className="px-5 py-4">
                          <p className="text-sm font-bold text-slate-700">
                            {payment.workerName || "Not assigned"}
                          </p>
                        </td>

                        <td className="px-5 py-4">
                          <p className="text-base font-black text-slate-900">
                            {formatMoney(payment.amount)}
                          </p>
                        </td>

                        <td className="px-5 py-4">
                          <span className="border border-slate-200 bg-slate-50 px-2 py-1 font-mono text-xs font-bold text-slate-700">
                            {payment.utrNumber || "—"}
                          </span>
                        </td>

                        <td className="px-5 py-4">
                          <span
                            className={`inline-flex border px-2.5 py-1 text-[11px] font-black ${getPaymentStatusClass(
                              payment.paymentStatus
                            )}`}
                          >
                            {payment.paymentStatus || "PENDING"}
                          </span>
                        </td>

                        <td className="px-5 py-4">
                          <span
                            className={`inline-flex border px-2.5 py-1 text-[11px] font-black ${getPayoutStatusClass(
                              payment.workerPayoutStatus
                            )}`}
                          >
                            {payment.workerPayoutStatus || "PENDING"}
                          </span>
                        </td>

                        <td className="px-5 py-4 text-center">
                          <button
                            onClick={() =>
                              setSelectedPayment(payment)
                            }
                            className="inline-flex items-center gap-2 border border-emerald-200 bg-emerald-50 px-3 py-2 text-xs font-black text-emerald-700 transition hover:bg-emerald-600 hover:text-white"
                          >
                            <Eye size={15} />
                            View
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* MOBILE / TABLET CARDS */}
              <div className="grid gap-4 p-4 lg:hidden">
                {recentPayments.map((payment, index) => (
                  <div
                    key={
                      payment._id ||
                      payment.merchantOrderId ||
                      index
                    }
                    className="border border-slate-200 bg-white p-4 shadow-sm"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex min-w-0 items-start gap-3">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center bg-emerald-100 text-emerald-700">
                          <UserRound size={18} />
                        </div>

                        <div className="min-w-0">
                          <h3 className="truncate font-black text-slate-900">
                            {payment.clientName ||
                              "Unknown Client"}
                          </h3>

                          <p className="mt-1 truncate text-xs text-slate-500">
                            {payment.jobTitle || "Job"}
                          </p>
                        </div>
                      </div>

                      <p className="shrink-0 text-lg font-black text-slate-900">
                        {formatMoney(payment.amount)}
                      </p>
                    </div>

                    <div className="mt-4 grid grid-cols-2 gap-3">
                      <div className="border border-slate-100 bg-slate-50 p-3">
                        <p className="text-[10px] font-bold uppercase text-slate-400">
                          Worker
                        </p>

                        <p className="mt-1 truncate text-xs font-bold text-slate-700">
                          {payment.workerName || "Not assigned"}
                        </p>
                      </div>

                      <div className="border border-slate-100 bg-slate-50 p-3">
                        <p className="text-[10px] font-bold uppercase text-slate-400">
                          UTR
                        </p>

                        <p className="mt-1 truncate font-mono text-xs font-bold text-slate-700">
                          {payment.utrNumber || "—"}
                        </p>
                      </div>
                    </div>

                    <div className="mt-3 flex flex-wrap gap-2">
                      <span
                        className={`border px-2.5 py-1 text-[10px] font-black ${getPaymentStatusClass(
                          payment.paymentStatus
                        )}`}
                      >
                        Payment:{" "}
                        {payment.paymentStatus || "PENDING"}
                      </span>

                      <span
                        className={`border px-2.5 py-1 text-[10px] font-black ${getPayoutStatusClass(
                          payment.workerPayoutStatus
                        )}`}
                      >
                        Payout:{" "}
                        {payment.workerPayoutStatus || "PENDING"}
                      </span>
                    </div>

                    <div className="mt-4 flex items-center justify-between gap-3 border-t border-slate-100 pt-3">
                      <p className="text-[11px] text-slate-400">
                        {formatDate(payment.createdAt)}
                      </p>

                      <button
                        onClick={() =>
                          setSelectedPayment(payment)
                        }
                        className="inline-flex items-center gap-2 border border-emerald-200 bg-emerald-50 px-3 py-2 text-xs font-black text-emerald-700"
                      >
                        <Eye size={15} />
                        View Details
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </section>

        {/* PAYMENT SUMMARY */}
        <section className="mb-8">
          <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
            <div className="border border-emerald-200 bg-gradient-to-br from-emerald-50 via-white to-teal-50 p-5 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center bg-emerald-600 text-white">
                  <CircleDollarSign size={21} />
                </div>

                <div>
                  <p className="text-xs font-black uppercase tracking-wider text-emerald-600">
                    Client Collection
                  </p>

                  <p className="text-xl font-black text-slate-900">
                    {formatMoney(totalClientPayment)}
                  </p>
                </div>
              </div>

              <div className="mt-5 grid grid-cols-2 gap-3">
                <div className="border border-emerald-100 bg-white p-3">
                  <p className="text-[10px] font-bold text-slate-400">
                    MONTH
                  </p>
                  <p className="mt-1 text-sm font-black text-emerald-700">
                    {formatMoney(thisMonthPayment)}
                  </p>
                </div>

                <div className="border border-emerald-100 bg-white p-3">
                  <p className="text-[10px] font-bold text-slate-400">
                    YEAR
                  </p>
                  <p className="mt-1 text-sm font-black text-emerald-700">
                    {formatMoney(thisYearPayment)}
                  </p>
                </div>
              </div>
            </div>

            <div className="border border-pink-200 bg-gradient-to-br from-pink-50 via-white to-fuchsia-50 p-5 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center bg-pink-600 text-white">
                  <Receipt size={21} />
                </div>

                <div>
                  <p className="text-xs font-black uppercase tracking-wider text-pink-600">
                    JobHIR Commission
                  </p>

                  <p className="text-xl font-black text-slate-900">
                    {formatMoney(totalCommission)}
                  </p>
                </div>
              </div>

              <div className="mt-5 border border-pink-100 bg-white p-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-500">
                    Commission Rate
                  </span>

                  <span className="text-sm font-black text-pink-700">
                    10%
                  </span>
                </div>
              </div>
            </div>

            <div className="border border-cyan-200 bg-gradient-to-br from-cyan-50 via-white to-blue-50 p-5 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center bg-cyan-600 text-white">
                  <Wallet size={21} />
                </div>

                <div>
                  <p className="text-xs font-black uppercase tracking-wider text-cyan-600">
                    Worker Share
                  </p>

                  <p className="text-xl font-black text-slate-900">
                    {formatMoney(workerShare)}
                  </p>
                </div>
              </div>

              <div className="mt-5 flex items-center justify-between border border-cyan-100 bg-white p-3">
                <span className="text-xs font-bold text-slate-500">
                  Worker Share Rate
                </span>

                <span className="text-sm font-black text-cyan-700">
                  90%
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* WORKER MANAGEMENT */}
        <section className="mb-8">
          <div className="overflow-hidden border border-blue-200 bg-gradient-to-r from-blue-950 via-indigo-950 to-slate-950 p-6 text-white shadow-xl">
            <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center bg-blue-500 text-white shadow-lg">
                  <Users size={23} />
                </div>

                <div>
                  <h2 className="text-xl font-black">
                    Dimapur Worker Management
                  </h2>

                  <p className="mt-1 max-w-2xl text-sm leading-6 text-slate-300">
                    View workers, verify KYC, update skill level,
                    check payment status and manage active workers.
                  </p>
                </div>
              </div>

              <Link
                to="/admin/dimapur/workers"
                className="inline-flex shrink-0 items-center justify-center gap-2 border border-blue-400 bg-blue-600 px-5 py-3 text-sm font-black !text-white transition hover:bg-blue-500"
              >
                <Users size={17} className="!text-white" />
                <span className="!text-white">
                  Open Worker Management
                </span>
                <ArrowRight
                  size={17}
                  className="!text-white"
                />
              </Link>
            </div>
          </div>
        </section>

        {/* FOOTER INFO */}
        <div className="border-t border-slate-200 pt-5">
          <div className="flex flex-col gap-2 text-xs text-slate-400 sm:flex-row sm:items-center sm:justify-between">
            <p>
              JobHIR • Dimapur Admin Dashboard
            </p>

            <div className="flex items-center gap-2">
              <MapPin size={13} />
              <span>Dimapur, Nagaland</span>
            </div>
          </div>
        </div>
      </main>

      {/* PAYMENT DETAIL MODAL */}
      {selectedPayment && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/70 p-4 backdrop-blur-sm"
          onClick={() => setSelectedPayment(null)}
        >
          <div
            className="max-h-[92vh] w-full max-w-3xl overflow-y-auto border border-slate-200 bg-white shadow-2xl"
            onClick={(event) => event.stopPropagation()}
          >
            {/* MODAL HEADER */}
            <div className="sticky top-0 z-10 bg-gradient-to-r from-slate-950 via-emerald-950 to-teal-900 px-5 py-5 text-white sm:px-6">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-3">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center bg-emerald-500">
                    <Receipt size={22} />
                  </div>

                  <div>
                    <h2 className="text-lg font-black">
                      Payment Details
                    </h2>

                    <p className="mt-0.5 text-xs text-slate-300">
                      Client QR payment information
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => setSelectedPayment(null)}
                  className="flex h-9 w-9 items-center justify-center border border-white/20 bg-white/10 text-white transition hover:bg-white/20"
                >
                  <X size={19} />
                </button>
              </div>
            </div>

            <div className="space-y-6 p-5 sm:p-6">
              {/* AMOUNT */}
              <div className="border border-emerald-200 bg-gradient-to-r from-emerald-50 to-teal-50 p-5">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="text-xs font-black uppercase tracking-wider text-emerald-600">
                      Payment Amount
                    </p>

                    <p className="mt-1 text-3xl font-black text-slate-900">
                      {formatMoney(selectedPayment.amount)}
                    </p>
                  </div>

                  <span
                    className={`inline-flex w-fit border px-3 py-2 text-xs font-black ${getPaymentStatusClass(
                      selectedPayment.paymentStatus
                    )}`}
                  >
                    {selectedPayment.paymentStatus || "PENDING"}
                  </span>
                </div>
              </div>

              {/* CLIENT */}
              <div>
                <div className="mb-3 flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center bg-blue-100 text-blue-600">
                    <UserRound size={16} />
                  </div>

                  <h3 className="text-sm font-black text-slate-900">
                    Client Information
                  </h3>
                </div>

                <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                  <div className="border border-slate-200 bg-slate-50 p-4">
                    <p className="text-[10px] font-black uppercase text-slate-400">
                      Name
                    </p>

                    <p className="mt-1 text-sm font-bold text-slate-800">
                      {selectedPayment.clientName || "—"}
                    </p>
                  </div>

                  <div className="border border-slate-200 bg-slate-50 p-4">
                    <p className="text-[10px] font-black uppercase text-slate-400">
                      Phone
                    </p>

                    <p className="mt-1 flex items-center gap-1.5 text-sm font-bold text-slate-800">
                      <Smartphone size={14} />
                      {selectedPayment.clientPhone || "—"}
                    </p>
                  </div>

                  <div className="border border-slate-200 bg-slate-50 p-4">
                    <p className="text-[10px] font-black uppercase text-slate-400">
                      Email
                    </p>

                    <p className="mt-1 truncate text-sm font-bold text-slate-800">
                      {selectedPayment.clientEmail || "—"}
                    </p>
                  </div>
                </div>
              </div>

              {/* JOB */}
              <div>
                <div className="mb-3 flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center bg-violet-100 text-violet-600">
                    <BriefcaseBusiness size={16} />
                  </div>

                  <h3 className="text-sm font-black text-slate-900">
                    Job Information
                  </h3>
                </div>

                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <div className="border border-slate-200 bg-slate-50 p-4">
                    <p className="text-[10px] font-black uppercase text-slate-400">
                      Job Title
                    </p>

                    <p className="mt-1 text-sm font-bold text-slate-800">
                      {selectedPayment.jobTitle || "—"}
                    </p>
                  </div>

                  <div className="border border-slate-200 bg-slate-50 p-4">
                    <p className="text-[10px] font-black uppercase text-slate-400">
                      Worker
                    </p>

                    <p className="mt-1 text-sm font-bold text-slate-800">
                      {selectedPayment.workerName ||
                        "Not assigned"}
                    </p>
                  </div>
                </div>
              </div>

              {/* PAYMENT */}
              <div>
                <div className="mb-3 flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center bg-cyan-100 text-cyan-600">
                    <CreditCard size={16} />
                  </div>

                  <h3 className="text-sm font-black text-slate-900">
                    Payment Information
                  </h3>
                </div>

                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <div className="border border-slate-200 bg-slate-50 p-4">
                    <p className="text-[10px] font-black uppercase text-slate-400">
                      Payment Method
                    </p>

                    <p className="mt-1 text-sm font-bold text-slate-800">
                      {selectedPayment.paymentMethod || "QR"}
                    </p>
                  </div>

                  <div className="border border-slate-200 bg-slate-50 p-4">
                    <p className="text-[10px] font-black uppercase text-slate-400">
                      UTR Number
                    </p>

                    <p className="mt-1 break-all font-mono text-sm font-bold text-slate-800">
                      {selectedPayment.utrNumber || "—"}
                    </p>
                  </div>

                  <div className="border border-slate-200 bg-slate-50 p-4">
                    <p className="text-[10px] font-black uppercase text-slate-400">
                      Payment Created
                    </p>

                    <p className="mt-1 text-sm font-bold text-slate-800">
                      {formatDate(selectedPayment.createdAt)}
                    </p>
                  </div>

                  <div className="border border-slate-200 bg-slate-50 p-4">
                    <p className="text-[10px] font-black uppercase text-slate-400">
                      Verified At
                    </p>

                    <p className="mt-1 text-sm font-bold text-slate-800">
                      {formatDate(selectedPayment.verifiedAt)}
                    </p>
                  </div>
                </div>
              </div>

              {/* DISTRIBUTION */}
              <div>
                <div className="mb-3 flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center bg-pink-100 text-pink-600">
                    <IndianRupee size={16} />
                  </div>

                  <h3 className="text-sm font-black text-slate-900">
                    Amount Distribution
                  </h3>
                </div>

                <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                  <div className="border border-slate-200 bg-slate-50 p-4">
                    <p className="text-[10px] font-black uppercase text-slate-400">
                      Client Paid
                    </p>

                    <p className="mt-1 text-lg font-black text-slate-900">
                      {formatMoney(selectedPayment.amount)}
                    </p>
                  </div>

                  <div className="border border-pink-200 bg-pink-50 p-4">
                    <p className="text-[10px] font-black uppercase text-pink-500">
                      JobHIR Commission
                    </p>

                    <p className="mt-1 text-lg font-black text-pink-700">
                      {formatMoney(
                        selectedPayment.commissionAmount
                      )}
                    </p>

                    <p className="mt-1 text-[10px] font-bold text-pink-500">
                      {selectedPayment.commissionRate ?? 10}%
                    </p>
                  </div>

                  <div className="border border-cyan-200 bg-cyan-50 p-4">
                    <p className="text-[10px] font-black uppercase text-cyan-500">
                      Worker Share
                    </p>

                    <p className="mt-1 text-lg font-black text-cyan-700">
                      {formatMoney(
                        selectedPayment.workerAmount
                      )}
                    </p>

                    <p className="mt-1 text-[10px] font-bold text-cyan-500">
                      90%
                    </p>
                  </div>
                </div>
              </div>

              {/* PAYOUT */}
              <div>
                <div className="mb-3 flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center bg-amber-100 text-amber-600">
                    <Wallet size={16} />
                  </div>

                  <h3 className="text-sm font-black text-slate-900">
                    Worker Payout
                  </h3>
                </div>

                <div className="flex flex-col gap-3 border border-slate-200 bg-slate-50 p-4 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="text-[10px] font-black uppercase text-slate-400">
                      Payout Status
                    </p>

                    <span
                      className={`mt-2 inline-flex border px-3 py-1.5 text-xs font-black ${getPayoutStatusClass(
                        selectedPayment.workerPayoutStatus
                      )}`}
                    >
                      {selectedPayment.workerPayoutStatus ||
                        "PENDING"}
                    </span>
                  </div>

                  <div>
                    <p className="text-[10px] font-black uppercase text-slate-400">
                      Worker Paid At
                    </p>

                    <p className="mt-1 text-sm font-bold text-slate-700">
                      {formatDate(
                        selectedPayment.workerPaidAt
                      )}
                    </p>
                  </div>
                </div>
              </div>

              {/* VERIFIED BY */}
              <div className="border border-slate-200 bg-white p-4">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <p className="text-[10px] font-black uppercase text-slate-400">
                      Payment ID
                    </p>

                    <p className="mt-1 break-all font-mono text-xs font-bold text-slate-700">
                      {selectedPayment._id || "—"}
                    </p>
                  </div>

                  <div>
                    <p className="text-[10px] font-black uppercase text-slate-400">
                      Verified By
                    </p>

                    <p className="mt-1 text-xs font-bold text-slate-700">
                      {selectedPayment.verifiedBy
                        ? typeof selectedPayment.verifiedBy ===
                          "object"
                          ? selectedPayment.verifiedBy.username ||
                            selectedPayment.verifiedBy._id ||
                            "Admin"
                          : selectedPayment.verifiedBy
                        : "Not verified yet"}
                    </p>
                  </div>
                </div>
              </div>

              <button
                onClick={() => setSelectedPayment(null)}
                className="w-full border border-slate-300 bg-slate-900 px-5 py-3 text-sm font-black text-white transition hover:bg-slate-800"
              >
                Close Details
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}