import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  RefreshCw,
  LogOut,
  Users,
  BriefcaseBusiness,
  CreditCard,
  Wallet,
  BadgeCheck,
  Clock3,
  Ban,
  UserCheck,
  UserPlus,
  ShieldCheck,
  IndianRupee,
  TrendingUp,
  Banknote,
  ClipboardList,
  AlertCircle,
  CheckCircle2,
  UserRoundCheck,
  CircleDollarSign,
} from "lucide-react";

const API_URL = "https://jbackend-h963.onrender.com";

/* =========================================================
   HELPERS
========================================================= */

const formatMoney = (value) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(Number(value || 0));

/* =========================================================
   COLOR CONFIG
========================================================= */

const accentConfig = {
  blue: {
    border: "border-blue-200",
    top: "bg-blue-500",
    iconBg: "bg-blue-50",
    iconColor: "text-blue-600",
    value: "text-blue-700",
  },

  green: {
    border: "border-emerald-200",
    top: "bg-emerald-500",
    iconBg: "bg-emerald-50",
    iconColor: "text-emerald-600",
    value: "text-emerald-700",
  },

  purple: {
    border: "border-violet-200",
    top: "bg-violet-500",
    iconBg: "bg-violet-50",
    iconColor: "text-violet-600",
    value: "text-violet-700",
  },

  orange: {
    border: "border-orange-200",
    top: "bg-orange-500",
    iconBg: "bg-orange-50",
    iconColor: "text-orange-600",
    value: "text-orange-700",
  },

  red: {
    border: "border-red-200",
    top: "bg-red-500",
    iconBg: "bg-red-50",
    iconColor: "text-red-600",
    value: "text-red-700",
  },

  cyan: {
    border: "border-cyan-200",
    top: "bg-cyan-500",
    iconBg: "bg-cyan-50",
    iconColor: "text-cyan-600",
    value: "text-cyan-700",
  },

  indigo: {
    border: "border-indigo-200",
    top: "bg-indigo-500",
    iconBg: "bg-indigo-50",
    iconColor: "text-indigo-600",
    value: "text-indigo-700",
  },

  pink: {
    border: "border-pink-200",
    top: "bg-pink-500",
    iconBg: "bg-pink-50",
    iconColor: "text-pink-600",
    value: "text-pink-700",
  },
};

/* =========================================================
   STAT CARD
========================================================= */

const StatCard = ({
  icon: Icon,
  title,
  value,
  subtitle,
  accent = "blue",
}) => {
  const color = accentConfig[accent] || accentConfig.blue;

  return (
    <div
      className={`group relative overflow-hidden border ${color.border} bg-white p-5 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-lg`}
    >
      {/* top color line */}
      <div
        className={`absolute left-0 right-0 top-0 h-1 ${color.top}`}
      />

      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <p className="text-sm font-medium text-slate-500">
            {title}
          </p>

          <p
            className={`mt-2 break-words text-2xl font-extrabold tracking-tight ${color.value}`}
          >
            {value}
          </p>

          {subtitle && (
            <p className="mt-1 text-xs text-slate-500">
              {subtitle}
            </p>
          )}
        </div>

        <div
          className={`flex h-12 w-12 shrink-0 items-center justify-center border ${color.border} ${color.iconBg} ${color.iconColor} transition-transform duration-200 group-hover:scale-110`}
        >
          <Icon size={22} strokeWidth={2.2} />
        </div>
      </div>
    </div>
  );
};

/* =========================================================
   SECTION TITLE
========================================================= */

const SectionTitle = ({
  icon: Icon,
  title,
  subtitle,
  accent = "blue",
}) => {
  const color = accentConfig[accent] || accentConfig.blue;

  return (
    <div className="mb-5 flex items-center justify-between gap-4">
      <div className="flex min-w-0 items-center gap-3">
        <div
          className={`flex h-11 w-11 shrink-0 items-center justify-center border ${color.border} bg-white shadow-sm`}
        >
          <Icon
            size={20}
            className={color.iconColor}
            strokeWidth={2.2}
          />
        </div>

        <div className="min-w-0">
          <h2 className="text-lg font-extrabold tracking-tight text-slate-900">
            {title}
          </h2>

          {subtitle && (
            <p className="mt-0.5 text-xs text-slate-500">
              {subtitle}
            </p>
          )}
        </div>
      </div>

      <div
        className={`hidden h-1 w-16 shrink-0 sm:block ${color.top}`}
      />
    </div>
  );
};

/* =========================================================
   DASHBOARD
========================================================= */

export default function AdminDashboard() {
  const navigate = useNavigate();

  const [stats, setStats] = useState(null);
  const [revenue, setRevenue] = useState(null);

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");

  /* =========================================================
     FETCH DASHBOARD
  ========================================================= */

  const fetchDashboard = async (isRefresh = false) => {
    const token = localStorage.getItem("adminToken");

    let adminUser = null;

    try {
      adminUser = JSON.parse(
        localStorage.getItem("adminUser") || "null"
      );
    } catch {
      adminUser = null;
    }

    if (!token) {
      navigate("/admin/login");
      return;
    }

    if (adminUser?.role === "dimapur_admin") {
      navigate("/admin/dimapur");
      return;
    }

    try {
      setError("");

      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      const headers = {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      };

      const [statsResponse, revenueResponse] =
        await Promise.all([
          fetch(`${API_URL}/admin/stats`, {
            method: "GET",
            headers,
          }),

          fetch(`${API_URL}/admin/revenue`, {
            method: "GET",
            headers,
          }),
        ]);

      /* =====================================================
         AUTH ERROR
      ===================================================== */

      if (
        statsResponse.status === 401 ||
        statsResponse.status === 403 ||
        revenueResponse.status === 401 ||
        revenueResponse.status === 403
      ) {
        localStorage.removeItem("adminToken");
        localStorage.removeItem("adminUser");

        navigate("/admin/login");
        return;
      }

      const statsData = await statsResponse.json();
      const revenueData = await revenueResponse.json();

      /* =====================================================
         API ERROR
      ===================================================== */

      if (!statsResponse.ok) {
        throw new Error(
          statsData?.message ||
            "Failed to load worker statistics."
        );
      }

      if (!revenueResponse.ok) {
        throw new Error(
          revenueData?.message ||
            "Failed to load revenue statistics."
        );
      }

      /* =====================================================
         SET DATA
      ===================================================== */

      setStats(
        statsData?.stats ||
          statsData?.data ||
          statsData
      );

      setRevenue(
        revenueData?.revenue ||
          revenueData?.data ||
          revenueData
      );
    } catch (err) {
      console.error("ADMIN DASHBOARD ERROR:", err);

      setError(
        err?.message ||
          "Dashboard data load nahi ho saka. Please try again."
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  /* =========================================================
     INITIAL LOAD
  ========================================================= */

  useEffect(() => {
    const token = localStorage.getItem("adminToken");

    let adminUser = null;

    try {
      adminUser = JSON.parse(
        localStorage.getItem("adminUser") || "null"
      );
    } catch {
      adminUser = null;
    }

    if (!token) {
      navigate("/admin/login");
      return;
    }

    if (adminUser?.role === "dimapur_admin") {
      navigate("/admin/dimapur");
      return;
    }

    fetchDashboard();
  }, [navigate]);

  /* =========================================================
     LOGOUT
  ========================================================= */

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    localStorage.removeItem("adminUser");

    navigate("/admin/login");
  };

  /* =========================================================
     DATA
  ========================================================= */

  let adminUser = null;

  try {
    adminUser = JSON.parse(
      localStorage.getItem("adminUser") || "null"
    );
  } catch {
    adminUser = null;
  }

  const workerStats = stats || {};
  const revenueData = revenue || {};

  const jobs = revenueData.jobs || {};
  const payment = revenueData.payment || {};
  const commission = revenueData.commission || {};
  const workerShare = revenueData.workerShare || {};
  const workerPayout = revenueData.workerPayout || {};

  const monthlyBreakdown = Array.isArray(
    revenueData.monthlyBreakdown
  )
    ? revenueData.monthlyBreakdown
    : [];

  /* =========================================================
     LOADING SCREEN
  ========================================================= */

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50">
        <header className="border-b border-slate-200 bg-white">
          <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center bg-gradient-to-br from-blue-600 via-violet-600 to-cyan-500 text-white shadow-sm">
                <BriefcaseBusiness size={21} />
              </div>

              <div>
                <h1 className="text-xl font-black text-slate-900">
                  JobHIR Admin
                </h1>

                <p className="text-sm text-slate-500">
                  Global Admin Dashboard
                </p>
              </div>
            </div>
          </div>
        </header>

        <main className="flex min-h-[70vh] items-center justify-center px-4">
          <div className="border border-blue-200 bg-white px-8 py-7 text-center shadow-sm">
            <div className="mx-auto flex h-12 w-12 items-center justify-center bg-blue-50 text-blue-600">
              <RefreshCw
                size={23}
                className="animate-spin"
              />
            </div>

            <p className="mt-4 font-semibold text-slate-800">
              Dashboard loading...
            </p>

            <p className="mt-1 text-sm text-slate-500">
              Please wait while we fetch the latest data.
            </p>
          </div>
        </main>
      </div>
    );
  }

  /* =========================================================
     MAIN DASHBOARD
  ========================================================= */

  return (
    <div className="min-h-screen bg-slate-50">
      {/* =====================================================
          HEADER
      ===================================================== */}

      <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/95 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
          {/* BRAND */}
          <div className="flex min-w-0 items-center gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center bg-gradient-to-br from-blue-600 via-violet-600 to-cyan-500 text-white shadow-sm">
              <BriefcaseBusiness
                size={22}
                strokeWidth={2.3}
              />
            </div>

            <div className="min-w-0">
              <h1 className="bg-gradient-to-r from-blue-600 via-violet-600 to-cyan-600 bg-clip-text text-xl font-black text-transparent">
                JobHIR Admin
              </h1>

              <p className="hidden text-sm text-slate-500 sm:block">
                Global Worker Management Dashboard
              </p>
            </div>
          </div>

          {/* ACTIONS */}
          <div className="flex shrink-0 items-center gap-2 sm:gap-3">
            {/* USER */}
            <div className="hidden items-center gap-2 border border-slate-200 bg-slate-50 px-3 py-2 text-sm md:flex">
              <div className="flex h-7 w-7 items-center justify-center bg-violet-100 text-violet-600">
                <Users size={15} />
              </div>

              <div>
                <span className="text-xs text-slate-400">
                  Admin
                </span>

                <p className="font-semibold leading-4 text-slate-800">
                  {adminUser?.username || "Admin"}
                </p>
              </div>
            </div>

            {/* REFRESH */}
            <button
              type="button"
              onClick={() => fetchDashboard(true)}
              disabled={refreshing}
              className="flex items-center gap-2 border border-blue-200 bg-blue-50 px-3 py-2 text-sm font-semibold text-blue-700 transition hover:border-blue-300 hover:bg-blue-100 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <RefreshCw
                size={16}
                className={
                  refreshing ? "animate-spin" : ""
                }
              />

              <span className="hidden sm:inline">
                Refresh
              </span>
            </button>

            {/* LOGOUT */}
            <button
              type="button"
              onClick={handleLogout}
              className="flex items-center gap-2 border border-red-200 bg-red-50 px-3 py-2 text-sm font-semibold text-red-600 transition hover:bg-red-100"
            >
              <LogOut size={16} />

              <span className="hidden sm:inline">
                Logout
              </span>
            </button>
          </div>
        </div>
      </header>

      {/* =====================================================
          MAIN
      ===================================================== */}

      <main className="mx-auto max-w-7xl px-4 py-7 sm:px-6 lg:px-8">
        {/* ===================================================
            ERROR
        =================================================== */}

        {error && (
          <div className="mb-7 flex items-start gap-3 border border-red-200 bg-red-50 p-4 text-red-700 shadow-sm">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center bg-red-100">
              <AlertCircle size={19} />
            </div>

            <div className="min-w-0">
              <p className="font-bold">
                Dashboard Error
              </p>

              <p className="mt-1 text-sm">
                {error}
              </p>

              <button
                type="button"
                onClick={() => fetchDashboard(true)}
                className="mt-3 border border-red-300 bg-white px-3 py-1.5 text-xs font-semibold text-red-700 hover:bg-red-100"
              >
                Try Again
              </button>
            </div>
          </div>
        )}

        {/* ===================================================
            WORKER OVERVIEW
        =================================================== */}

        <section className="mb-9">
          <SectionTitle
            icon={Users}
            title="Worker Overview"
            subtitle="Global worker registration and account status"
            accent="blue"
          />

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <StatCard
              icon={Users}
              title="Total Workers"
              value={workerStats.totalWorkers || 0}
              accent="blue"
            />

            <StatCard
              icon={CreditCard}
              title="Paid Workers"
              value={workerStats.paidWorkers || 0}
              accent="green"
            />

            <StatCard
              icon={Clock3}
              title="Pending Payment"
              value={workerStats.pendingPayment || 0}
              accent="orange"
            />

            <StatCard
              icon={UserCheck}
              title="Active Workers"
              value={workerStats.activeWorkers || 0}
              accent="cyan"
            />

            <StatCard
              icon={UserPlus}
              title="Pending Accounts"
              value={workerStats.pendingWorkers || 0}
              accent="purple"
            />

            <StatCard
              icon={Ban}
              title="Blocked Workers"
              value={workerStats.blockedWorkers || 0}
              accent="red"
            />
          </div>
        </section>

        {/* ===================================================
            VERIFICATION
        =================================================== */}

        <section className="mb-9">
          <SectionTitle
            icon={ShieldCheck}
            title="Worker Verification"
            subtitle="KYC, skill and verification status"
            accent="purple"
          />

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <StatCard
              icon={Clock3}
              title="Pending Verification"
              value={
                workerStats.pendingVerification || 0
              }
              accent="orange"
            />

            <StatCard
              icon={TrendingUp}
              title="Under Review"
              value={workerStats.underReview || 0}
              accent="blue"
            />

            <StatCard
              icon={BadgeCheck}
              title="Verified Workers"
              value={workerStats.verifiedWorkers || 0}
              accent="green"
            />

            <StatCard
              icon={AlertCircle}
              title="Need More Information"
              value={
                workerStats.needMoreInformation || 0
              }
              accent="orange"
            />

            <StatCard
              icon={Ban}
              title="Rejected"
              value={workerStats.rejectedWorkers || 0}
              accent="red"
            />

            <StatCard
              icon={BadgeCheck}
              title="Expert"
              value={workerStats.expertWorkers || 0}
              accent="purple"
            />

            <StatCard
              icon={UserCheck}
              title="Skilled"
              value={workerStats.skilledWorkers || 0}
              accent="cyan"
            />

            <StatCard
              icon={ShieldCheck}
              title="KYC Verified"
              value={workerStats.kycVerifiedWorkers || 0}
              accent="green"
            />
          </div>
        </section>

        {/* ===================================================
            GLOBAL WORK OVERVIEW
        =================================================== */}

        <section className="mb-9">
          <SectionTitle
            icon={BriefcaseBusiness}
            title="Global Work Overview"
            subtitle="All jobs across JobHIR"
            accent="cyan"
          />

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
            <StatCard
              icon={BriefcaseBusiness}
              title="Total Jobs"
              value={jobs.totalJobs || 0}
              accent="blue"
            />

            <StatCard
              icon={UserCheck}
              title="Assigned Jobs"
              value={jobs.assignedJobs || 0}
              accent="purple"
            />

            <StatCard
              icon={Clock3}
              title="Working Jobs"
              value={jobs.workingJobs || 0}
              accent="orange"
            />

            <StatCard
              icon={CheckCircle2}
              title="Completed Jobs"
              value={jobs.completedJobs || 0}
              accent="green"
            />

            <StatCard
              icon={IndianRupee}
              title="Total Job Value"
              value={formatMoney(
                jobs.totalJobValue
              )}
              accent="cyan"
            />
          </div>
        </section>

        {/* ===================================================
            CLIENT PAYMENT
        =================================================== */}

        <section className="mb-9">
          <SectionTitle
            icon={CreditCard}
            title="Client Payment"
            subtitle="Verified client payments received through JobHIR"
            accent="green"
          />

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <StatCard
              icon={CircleDollarSign}
              title="Total Client Payment"
              value={formatMoney(payment.total)}
              subtitle="All verified payments"
              accent="green"
            />

            <StatCard
              icon={TrendingUp}
              title="This Month"
              value={formatMoney(payment.thisMonth)}
              accent="cyan"
            />

            <StatCard
              icon={Banknote}
              title="This Year"
              value={formatMoney(payment.thisYear)}
              accent="blue"
            />

            <StatCard
              icon={Clock3}
              title="Pending Payment"
              value={formatMoney(payment.pending)}
              subtitle={`${payment.pendingCount || 0} pending payment(s)`}
              accent="orange"
            />
          </div>
        </section>

        {/* ===================================================
            JOBHIR COMMISSION
        =================================================== */}

        <section className="mb-9">
          <SectionTitle
            icon={TrendingUp}
            title="JobHIR Commission"
            subtitle="Platform commission from verified client payments"
            accent="purple"
          />

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <StatCard
              icon={IndianRupee}
              title="Total Commission"
              value={formatMoney(
                commission.total
              )}
              subtitle="JobHIR total revenue"
              accent="purple"
            />

            <StatCard
              icon={TrendingUp}
              title="This Month"
              value={formatMoney(
                commission.thisMonth
              )}
              accent="green"
            />

            <StatCard
              icon={Banknote}
              title="This Year"
              value={formatMoney(
                commission.thisYear
              )}
              accent="blue"
            />

            <StatCard
              icon={BadgeCheck}
              title="Commission Rate"
              value={`${commission.rate ?? 10}%`}
              subtitle="Current platform commission"
              accent="orange"
            />
          </div>
        </section>

        {/* ===================================================
            WORKER SHARE & PAYOUT
        =================================================== */}

        <section className="mb-9">
          <SectionTitle
            icon={Wallet}
            title="Worker Share & Payout"
            subtitle="90% worker share and payout tracking"
            accent="orange"
          />

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
            <StatCard
              icon={Wallet}
              title="Total Worker Share"
              value={formatMoney(
                workerShare.total
              )}
              subtitle="Total worker earnings"
              accent="blue"
            />

            <StatCard
              icon={TrendingUp}
              title="This Month"
              value={formatMoney(
                workerShare.thisMonth
              )}
              accent="cyan"
            />

            <StatCard
              icon={Banknote}
              title="This Year"
              value={formatMoney(
                workerShare.thisYear
              )}
              accent="purple"
            />

            <StatCard
              icon={CheckCircle2}
              title="Worker Paid"
              value={formatMoney(
                workerPayout.paid
              )}
              subtitle={`${workerPayout.paidCount || 0} payout(s)`}
              accent="green"
            />

            <StatCard
              icon={Clock3}
              title="Worker Payout Pending"
              value={formatMoney(
                workerPayout.pending
              )}
              subtitle={`${workerPayout.pendingCount || 0} payout(s)`}
              accent="orange"
            />
          </div>
        </section>

        {/* ===================================================
            MONTHLY REVENUE
        =================================================== */}

        <section className="mb-9">
          <SectionTitle
            icon={ClipboardList}
            title="Monthly Revenue Report"
            subtitle="Client payment, JobHIR commission and worker share"
            accent="indigo"
          />

          <div className="overflow-hidden border border-slate-200 bg-white shadow-sm">
            {monthlyBreakdown.length === 0 ? (
              <div className="px-6 py-14 text-center">
                <div className="mx-auto flex h-14 w-14 items-center justify-center bg-indigo-50 text-indigo-500">
                  <ClipboardList size={27} />
                </div>

                <p className="mt-4 font-bold text-slate-800">
                  No monthly revenue data
                </p>

                <p className="mx-auto mt-1 max-w-md text-sm text-slate-500">
                  Verified client payments ke baad
                  monthly revenue report yahan show
                  hoga.
                </p>
              </div>
            ) : (
              <>
                {/* DESKTOP */}
                <div className="hidden overflow-x-auto md:block">
                  <table className="min-w-full text-sm">
                    <thead>
                      <tr className="border-b border-slate-200 bg-gradient-to-r from-slate-50 to-indigo-50">
                        <th className="px-5 py-4 text-left font-bold text-slate-700">
                          Month
                        </th>

                        <th className="px-5 py-4 text-right font-bold text-slate-700">
                          Client Payment
                        </th>

                        <th className="px-5 py-4 text-right font-bold text-emerald-700">
                          JobHIR Commission
                        </th>

                        <th className="px-5 py-4 text-right font-bold text-blue-700">
                          Worker Share
                        </th>
                      </tr>
                    </thead>

                    <tbody>
                      {monthlyBreakdown.map(
                        (item, index) => (
                          <tr
                            key={`${item.year}-${item.month}-${index}`}
                            className="border-b border-slate-100 transition hover:bg-slate-50 last:border-b-0"
                          >
                            <td className="px-5 py-4 font-bold text-slate-800">
                              {item.monthName}{" "}
                              {item.year}
                            </td>

                            <td className="px-5 py-4 text-right font-semibold text-slate-800">
                              {formatMoney(
                                item.payment
                              )}
                            </td>

                            <td className="px-5 py-4 text-right font-bold text-emerald-600">
                              {formatMoney(
                                item.commission
                              )}
                            </td>

                            <td className="px-5 py-4 text-right font-bold text-blue-600">
                              {formatMoney(
                                item.workerAmount
                              )}
                            </td>
                          </tr>
                        )
                      )}
                    </tbody>
                  </table>
                </div>

                {/* MOBILE */}
                <div className="divide-y divide-slate-100 md:hidden">
                  {monthlyBreakdown.map(
                    (item, index) => (
                      <div
                        key={`${item.year}-${item.month}-${index}`}
                        className="p-5"
                      >
                        <div className="mb-4 flex items-center justify-between">
                          <p className="font-bold text-slate-900">
                            {item.monthName}{" "}
                            {item.year}
                          </p>

                          <span className="border border-indigo-200 bg-indigo-50 px-2.5 py-1 text-xs font-semibold text-indigo-600">
                            Monthly
                          </span>
                        </div>

                        <div className="space-y-3">
                          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                            <span className="text-sm text-slate-500">
                              Client Payment
                            </span>

                            <span className="font-bold text-slate-800">
                              {formatMoney(
                                item.payment
                              )}
                            </span>
                          </div>

                          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                            <span className="text-sm text-slate-500">
                              JobHIR Commission
                            </span>

                            <span className="font-bold text-emerald-600">
                              {formatMoney(
                                item.commission
                              )}
                            </span>
                          </div>

                          <div className="flex items-center justify-between">
                            <span className="text-sm text-slate-500">
                              Worker Share
                            </span>

                            <span className="font-bold text-blue-600">
                              {formatMoney(
                                item.workerAmount
                              )}
                            </span>
                          </div>
                        </div>
                      </div>
                    )
                  )}
                </div>
              </>
            )}
          </div>
        </section>

        {/* ===================================================
            WORKER MANAGEMENT
        =================================================== */}

        <section className="mb-9">
          <SectionTitle
            icon={Users}
            title="Worker Management"
            subtitle="Manage registered workers and verification"
            accent="blue"
          />

          <div className="relative overflow-hidden border border-blue-200 bg-gradient-to-r from-white via-blue-50 to-violet-50 p-6 shadow-sm">
            <div className="absolute right-0 top-0 h-32 w-32 translate-x-12 -translate-y-12 bg-blue-100/60" />

            <div className="relative flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center bg-blue-600 text-white shadow-sm">
                  <UserRoundCheck size={23} />
                </div>

                <div>
                  <h3 className="text-lg font-extrabold text-slate-900">
                    Global Worker Directory
                  </h3>

                  <p className="mt-1 max-w-xl text-sm text-slate-600">
                    Workers ko view, verify, activate,
                    block aur manage karein.
                  </p>
                </div>
              </div>

              <Link
                to="/admin/workers"
                className="inline-flex shrink-0 items-center justify-center gap-2 border border-blue-700 bg-blue-600 px-5 py-3 text-sm font-bold !text-white shadow-sm transition hover:border-blue-800 hover:bg-blue-700"
              >
                <Users
                  size={17}
                  className="!text-white"
                />

                <span className="!text-white">
                  Manage Workers
                </span>
              </Link>
            </div>
          </div>
        </section>

        {/* ===================================================
            QUICK ACTIONS
        =================================================== */}

        <section className="mb-9">
          <SectionTitle
            icon={ClipboardList}
            title="Quick Actions"
            subtitle="Frequently used admin sections"
            accent="blue"
          />

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {/* MANAGE WORKERS */}
            <Link
              to="/admin/workers"
              className="group border border-blue-200 bg-white p-5 shadow-sm transition-all hover:-translate-y-1 hover:border-blue-400 hover:shadow-lg"
            >
              <div className="flex h-11 w-11 items-center justify-center border border-blue-200 bg-blue-50 text-blue-600 transition group-hover:bg-blue-600 group-hover:text-white">
                <Users size={21} />
              </div>

              <h3 className="mt-4 font-extrabold text-slate-900">
                Manage Workers
              </h3>

              <p className="mt-1 text-sm text-slate-500">
                Worker accounts aur profiles manage
                karein.
              </p>

              <div className="mt-4 text-xs font-bold text-blue-600">
                Open Worker Directory →
              </div>
            </Link>

            {/* VERIFICATION */}
            <Link
              to="/admin/workers?verificationStatus=Pending"
              className="group border border-violet-200 bg-white p-5 shadow-sm transition-all hover:-translate-y-1 hover:border-violet-400 hover:shadow-lg"
            >
              <div className="flex h-11 w-11 items-center justify-center border border-violet-200 bg-violet-50 text-violet-600 transition group-hover:bg-violet-600 group-hover:text-white">
                <ShieldCheck size={21} />
              </div>

              <h3 className="mt-4 font-extrabold text-slate-900">
                Worker Verification
              </h3>

              <p className="mt-1 text-sm text-slate-500">
                Pending KYC aur skill verification
                check karein.
              </p>

              <div className="mt-4 text-xs font-bold text-violet-600">
                Review Workers →
              </div>
            </Link>

            {/* JOBS */}
            <Link
              to="/admin/delete"
              className="group border border-orange-200 bg-white p-5 shadow-sm transition-all hover:-translate-y-1 hover:border-orange-400 hover:shadow-lg"
            >
              <div className="flex h-11 w-11 items-center justify-center border border-orange-200 bg-orange-50 text-orange-600 transition group-hover:bg-orange-600 group-hover:text-white">
                <BriefcaseBusiness size={21} />
              </div>

              <h3 className="mt-4 font-extrabold text-slate-900">
                Manage Jobs
              </h3>

              <p className="mt-1 text-sm text-slate-500">
                Existing job management section open
                karein.
              </p>

              <div className="mt-4 text-xs font-bold text-orange-600">
                Open Job Management →
              </div>
            </Link>
          </div>
        </section>

        {/* ===================================================
            FOOTER
        =================================================== */}

        <footer className="border-t border-slate-200 py-6">
          <div className="flex flex-col items-center justify-between gap-2 text-center text-xs text-slate-400 sm:flex-row sm:text-left">
            <p>
              © {new Date().getFullYear()} JobHIR Admin
              Dashboard
            </p>

            <p>
              Global Administration • Secure Access
            </p>
          </div>
        </footer>
      </main>
    </div>
  );
}