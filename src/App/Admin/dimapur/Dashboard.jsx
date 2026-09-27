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
  Mail,
  Receipt,
  IndianRupee,
} from "lucide-react";

const API_URL = "https://jbackend-h963.onrender.com";

const Dashboard = () => {
  const navigate = useNavigate();

  const [stats, setStats] = useState(null);
  const [revenue, setRevenue] = useState(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [selectedPayment, setSelectedPayment] = useState(null);

  // =====================================================
  // ADMIN USER
  // =====================================================

  const getAdminUser = () => {
    try {
      return JSON.parse(localStorage.getItem("adminUser") || "{}");
    } catch {
      return {};
    }
  };

  // =====================================================
  // AUTH CHECK
  // =====================================================

  const checkAuth = () => {
    const token = localStorage.getItem("adminToken");

    const adminUser = getAdminUser();

    if (!token) {
      navigate("/admin/login");
      return false;
    }

    if (adminUser?.role !== "dimapur_admin") {
      navigate("/admin/dashboard");
      return false;
    }

    return true;
  };

  // =====================================================
  // FETCH WORKER STATS
  // =====================================================

  const fetchStats = async (token) => {
    const response = await fetch(
      `${API_URL}/admin/dimapur/stats`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const data = await response.json();

    if (!response.ok || !data.success) {
      throw new Error(
        data.message || "Failed to load Dimapur statistics"
      );
    }

    setStats(data.stats);
  };

  // =====================================================
  // FETCH REVENUE
  // =====================================================

  const fetchRevenue = async (token) => {
    const response = await fetch(
      `${API_URL}/admin/dimapur/revenue`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const data = await response.json();

    if (!response.ok || !data.success) {
      throw new Error(
        data.message || "Failed to load Dimapur revenue"
      );
    }

    setRevenue(data);
  };

  // =====================================================
  // FETCH ALL DASHBOARD DATA
  // =====================================================

  const fetchDashboard = async () => {
    try {
      setLoading(true);
      setError("");

      if (!checkAuth()) {
        return;
      }

      const token = localStorage.getItem("adminToken");

      await Promise.all([
        fetchStats(token),
        fetchRevenue(token),
      ]);
    } catch (error) {
      console.error("DIMAPUR DASHBOARD ERROR:", error);

      const message = error.message || "";

      if (
        message.toLowerCase().includes("token") ||
        message.toLowerCase().includes("admin") ||
        message.toLowerCase().includes("authorization")
      ) {
        localStorage.removeItem("adminToken");
        localStorage.removeItem("adminUser");

        navigate("/admin/login");

        return;
      }

      setError(message || "Unable to load dashboard");
    } finally {
      setLoading(false);
    }
  };

  // =====================================================
  // INITIAL LOAD
  // =====================================================

  useEffect(() => {
    fetchDashboard();
  }, []);

  // =====================================================
  // LOGOUT
  // =====================================================

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    localStorage.removeItem("adminUser");

    navigate("/admin/login");
  };

  // =====================================================
  // FORMAT RUPEES
  // =====================================================

  const formatMoney = (value) => {
    const amount = Number(value) || 0;

    return `₹${amount.toLocaleString("en-IN")}`;
  };

  // =====================================================
  // FORMAT DATE
  // =====================================================

  const formatDate = (value) => {
    if (!value) return "—";

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
      return "—";
    }

    return date.toLocaleString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // =====================================================
  // PAYMENT STATUS
  // =====================================================

  const getPaymentStatusClass = (status) => {
    switch (status) {
      case "VERIFIED":
        return "border-emerald-200 bg-emerald-100 text-emerald-700";

      case "REJECTED":
        return "border-red-200 bg-red-100 text-red-700";

      case "PENDING":
      default:
        return "border-amber-200 bg-amber-100 text-amber-700";
    }
  };

  // =====================================================
  // PAYOUT STATUS
  // =====================================================

  const getPayoutStatusClass = (status) => {
    if (status === "PAID") {
      return "border-emerald-200 bg-emerald-100 text-emerald-700";
    }

    return "border-amber-200 bg-amber-100 text-amber-700";
  };

  // =====================================================
  // WORKER STAT CARDS
  // =====================================================

  const statCards = [
    {
      title: "Total Workers",
      value: stats?.totalWorkers ?? 0,
      icon: Users,
    },

    {
      title: "Active Workers",
      value: stats?.activeWorkers ?? 0,
      icon: UserCheck,
    },

    {
      title: "Pending Workers",
      value: stats?.pendingWorkers ?? 0,
      icon: Clock,
    },

    {
      title: "Blocked Workers",
      value: stats?.blockedWorkers ?? 0,
      icon: UserX,
    },

    {
      title: "Paid Workers",
      value: stats?.paidWorkers ?? 0,
      icon: CreditCard,
    },

    {
      title: "Pending Payment",
      value: stats?.pendingPayment ?? 0,
      icon: CreditCard,
    },

    {
      title: "Pending Verification",
      value: stats?.pendingVerification ?? 0,
      icon: ShieldCheck,
    },

    {
      title: "Verified Workers",
      value: stats?.verifiedWorkers ?? 0,
      icon: ShieldCheck,
    },
  ];

  // =====================================================
  // RECENT PAYMENTS
  // =====================================================

  const recentPayments = revenue?.recentPayments || [];

  // =====================================================
  // RENDER
  // =====================================================

  return (
    <div className="min-h-screen bg-gray-100 text-gray-900">

      {/* =================================================
          HEADER
      ================================================= */}

      <header className="border-b border-gray-200 bg-white">

        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6">

          <div>

            <h1 className="text-xl font-bold">
              JobHIR Admin
            </h1>

            <div className="mt-1 flex items-center gap-2 text-sm text-gray-500">

              <MapPin size={16} />

              <span>
                Dimapur, Nagaland
              </span>

            </div>

          </div>

          <div className="flex items-center gap-2 sm:gap-3">

            <Link
              to="/admin/dimapur/workers"
              className="flex items-center gap-2 border border-gray-300 bg-white px-3 py-2 text-sm font-medium hover:bg-gray-50 sm:px-4"
            >
              <Users size={17} />

              <span className="hidden sm:inline">
                Workers
              </span>

            </Link>

            <button
              type="button"
              onClick={fetchDashboard}
              disabled={loading}
              className="flex items-center gap-2 border border-gray-300 bg-white px-3 py-2 text-sm font-medium hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50 sm:px-4"
            >

              <RefreshCw
                size={17}
                className={loading ? "animate-spin" : ""}
              />

              <span className="hidden sm:inline">
                Refresh
              </span>

            </button>

            <button
              type="button"
              onClick={handleLogout}
              className="flex items-center gap-2 bg-red-600 px-3 py-2 text-sm font-medium text-white hover:bg-red-700 sm:px-4"
            >

              <LogOut size={17} />

              <span className="hidden sm:inline">
                Logout
              </span>

            </button>

          </div>

        </div>

      </header>

      {/* =================================================
          MAIN
      ================================================= */}

      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-8">

        {/* =================================================
            LOCATION
        ================================================= */}

        <div className="mb-8 border border-emerald-200 bg-emerald-50 px-5 py-4">

          <div className="flex items-center gap-3">

            <div className="flex h-10 w-10 shrink-0 items-center justify-center bg-emerald-600 text-white">
              <MapPin size={21} />
            </div>

            <div>

              <h2 className="font-semibold text-emerald-900">
                Dimapur Administration
              </h2>

              <p className="text-sm text-emerald-700">
                Managing workers, jobs and revenue from
                Dimapur, Nagaland.
              </p>

            </div>

          </div>

        </div>

        {/* =================================================
            ERROR
        ================================================= */}

        {error && (
          <div className="mb-6 border border-red-200 bg-red-50 px-5 py-4">

            <div className="flex items-center gap-2">

              <AlertCircle
                size={18}
                className="text-red-600"
              />

              <p className="text-sm font-medium text-red-700">
                {error}
              </p>

            </div>

          </div>
        )}

        {/* =================================================
            WORKER STATISTICS
        ================================================= */}

        <div className="mb-3">

          <h2 className="text-lg font-bold">
            Worker Overview
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            Dimapur worker registration and verification
            statistics.
          </p>

        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">

          {statCards.map((card) => {

            const Icon = card.icon;

            return (
              <div
                key={card.title}
                className="border border-gray-200 bg-white p-5"
              >

                <div className="flex items-start justify-between">

                  <div>

                    <p className="text-sm text-gray-500">
                      {card.title}
                    </p>

                    <p className="mt-2 text-3xl font-bold">
                      {loading ? "—" : card.value}
                    </p>

                  </div>

                  <div className="flex h-10 w-10 items-center justify-center bg-gray-100 text-gray-700">

                    <Icon size={20} />

                  </div>

                </div>

              </div>
            );
          })}

        </div>

        {/* =================================================
            WORKER VERIFICATION
        ================================================= */}

        <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-4">

          <div className="border border-gray-200 bg-white p-5">

            <div className="flex items-center gap-3">

              <ShieldCheck size={20} />

              <div>

                <p className="text-sm text-gray-500">
                  KYC Verified
                </p>

                <p className="mt-1 text-2xl font-bold">
                  {loading
                    ? "—"
                    : stats?.kycVerifiedWorkers ?? 0}
                </p>

              </div>

            </div>

          </div>

          <div className="border border-gray-200 bg-white p-5">

            <div className="flex items-center gap-3">

              <BriefcaseBusiness size={20} />

              <div>

                <p className="text-sm text-gray-500">
                  Skill Verified
                </p>

                <p className="mt-1 text-2xl font-bold">
                  {loading
                    ? "—"
                    : stats?.skillVerifiedWorkers ?? 0}
                </p>

              </div>

            </div>

          </div>

          <div className="border border-gray-200 bg-white p-5">

            <div className="flex items-center gap-3">

              <Clock size={20} />

              <div>

                <p className="text-sm text-gray-500">
                  Under Review
                </p>

                <p className="mt-1 text-2xl font-bold">
                  {loading
                    ? "—"
                    : stats?.underReview ?? 0}
                </p>

              </div>

            </div>

          </div>

          <div className="border border-gray-200 bg-white p-5">

            <div className="flex items-center gap-3">

              <Award size={20} />

              <div>

                <p className="text-sm text-gray-500">
                  Expert Workers
                </p>

                <p className="mt-1 text-2xl font-bold">
                  {loading
                    ? "—"
                    : stats?.expertWorkers ?? 0}
                </p>

              </div>

            </div>

          </div>

        </div>

        {/* =================================================
            JOB OVERVIEW
        ================================================= */}

        <div className="mt-10 mb-3">

          <h2 className="text-lg font-bold">
            Dimapur Work Overview
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            Jobs registered and assigned in Dimapur.
          </p>

        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">

          <div className="border border-gray-200 bg-white p-5">

            <div className="flex items-center justify-between">

              <div>

                <p className="text-sm text-gray-500">
                  Total Jobs
                </p>

                <p className="mt-2 text-3xl font-bold">
                  {loading
                    ? "—"
                    : revenue?.jobs?.totalJobs ?? 0}
                </p>

              </div>

              <div className="flex h-10 w-10 items-center justify-center bg-gray-100">

                <BriefcaseBusiness size={20} />

              </div>

            </div>

          </div>

          <div className="border border-gray-200 bg-white p-5">

            <div className="flex items-center justify-between">

              <div>

                <p className="text-sm text-gray-500">
                  Assigned Jobs
                </p>

                <p className="mt-2 text-3xl font-bold">
                  {loading
                    ? "—"
                    : revenue?.jobs?.assignedJobs ?? 0}
                </p>

              </div>

              <div className="flex h-10 w-10 items-center justify-center bg-gray-100">

                <UserCheck size={20} />

              </div>

            </div>

          </div>

          <div className="border border-gray-200 bg-white p-5">

            <div className="flex items-center justify-between">

              <div>

                <p className="text-sm text-gray-500">
                  Working Jobs
                </p>

                <p className="mt-2 text-3xl font-bold">
                  {loading
                    ? "—"
                    : revenue?.jobs?.workingJobs ?? 0}
                </p>

              </div>

              <div className="flex h-10 w-10 items-center justify-center bg-gray-100">

                <Clock size={20} />

              </div>

            </div>

          </div>

          <div className="border border-gray-200 bg-white p-5">

            <div className="flex items-center justify-between">

              <div>

                <p className="text-sm text-gray-500">
                  Total Job Value
                </p>

                <p className="mt-2 text-2xl font-bold">
                  {loading
                    ? "—"
                    : formatMoney(
                        revenue?.jobs?.totalJobValue
                      )}
                </p>

              </div>

              <div className="flex h-10 w-10 items-center justify-center bg-gray-100">

                <Banknote size={20} />

              </div>

            </div>

          </div>

        </div>

        {/* =================================================
            PAYMENT OVERVIEW
        ================================================= */}

        <div className="mt-10 mb-3">

          <h2 className="text-lg font-bold">
            Client Payment
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            Verified client payments received for
            Dimapur jobs.
          </p>

        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">

          <div className="border border-gray-200 bg-white p-5">

            <p className="text-sm text-gray-500">
              Total Client Payment
            </p>

            <p className="mt-2 text-3xl font-bold">
              {loading
                ? "—"
                : formatMoney(revenue?.payment?.total)}
            </p>

            <div className="mt-3 flex items-center gap-2 text-xs text-gray-500">

              <CreditCard size={15} />

              Verified payments

            </div>

          </div>

          <div className="border border-gray-200 bg-white p-5">

            <p className="text-sm text-gray-500">
              This Month
            </p>

            <p className="mt-2 text-3xl font-bold">
              {loading
                ? "—"
                : formatMoney(revenue?.payment?.thisMonth)}
            </p>

            <div className="mt-3 flex items-center gap-2 text-xs text-gray-500">

              <TrendingUp size={15} />

              Current month

            </div>

          </div>

          <div className="border border-gray-200 bg-white p-5">

            <p className="text-sm text-gray-500">
              This Year
            </p>

            <p className="mt-2 text-3xl font-bold">
              {loading
                ? "—"
                : formatMoney(revenue?.payment?.thisYear)}
            </p>

            <div className="mt-3 flex items-center gap-2 text-xs text-gray-500">

              <TrendingUp size={15} />

              Current year

            </div>

          </div>

          <div className="border border-gray-200 bg-white p-5">

            <p className="text-sm text-gray-500">
              Pending Payment
            </p>

            <p className="mt-2 text-3xl font-bold">
              {loading
                ? "—"
                : formatMoney(revenue?.payment?.pending)}
            </p>

            <div className="mt-3 flex items-center gap-2 text-xs text-gray-500">

              <Clock size={15} />

              {revenue?.payment?.pendingCount ?? 0} pending

            </div>

          </div>

        </div>

        {/* =================================================
            JOBHIR COMMISSION
        ================================================= */}

        <div className="mt-10 mb-3">

          <h2 className="text-lg font-bold">
            JobHIR Commission
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            JobHIR commission from verified Dimapur
            client payments.
          </p>

        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">

          <div className="border border-emerald-200 bg-emerald-50 p-6">

            <div className="flex items-center justify-between">

              <div>

                <p className="text-sm font-medium text-emerald-700">
                  Total Commission
                </p>

                <p className="mt-2 text-3xl font-bold text-emerald-900">
                  {loading
                    ? "—"
                    : formatMoney(
                        revenue?.commission?.total
                      )}
                </p>

              </div>

              <div className="flex h-11 w-11 items-center justify-center bg-emerald-600 text-white">

                <Wallet size={21} />

              </div>

            </div>

            <p className="mt-4 text-xs text-emerald-700">

              Commission rate:{" "}

              <strong>
                {revenue?.commission?.rate ?? 10}%
              </strong>

            </p>

          </div>

          <div className="border border-gray-200 bg-white p-6">

            <p className="text-sm text-gray-500">
              This Month Commission
            </p>

            <p className="mt-2 text-3xl font-bold">
              {loading
                ? "—"
                : formatMoney(
                    revenue?.commission?.thisMonth
                  )}
            </p>

            <p className="mt-4 text-xs text-gray-500">
              10% of verified monthly client payments
            </p>

          </div>

          <div className="border border-gray-200 bg-white p-6">

            <p className="text-sm text-gray-500">
              This Year Commission
            </p>

            <p className="mt-2 text-3xl font-bold">
              {loading
                ? "—"
                : formatMoney(
                    revenue?.commission?.thisYear
                  )}
            </p>

            <p className="mt-4 text-xs text-gray-500">
              10% of verified yearly client payments
            </p>

          </div>

        </div>

        {/* =================================================
            WORKER SHARE / PAYOUT
        ================================================= */}

        <div className="mt-10 mb-3">

          <h2 className="text-lg font-bold">
            Worker Payout
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            Worker share and payout status.
          </p>

        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">

          <div className="border border-gray-200 bg-white p-5">

            <p className="text-sm text-gray-500">
              Worker Share
            </p>

            <p className="mt-2 text-3xl font-bold">
              {loading
                ? "—"
                : formatMoney(
                    revenue?.workerShare?.total
                  )}
            </p>

            <p className="mt-3 text-xs text-gray-500">
              90% of verified payments
            </p>

          </div>

          <div className="border border-gray-200 bg-white p-5">

            <p className="text-sm text-gray-500">
              Worker Paid
            </p>

            <p className="mt-2 text-3xl font-bold">
              {loading
                ? "—"
                : formatMoney(
                    revenue?.workerPayout?.paid
                  )}
            </p>

            <div className="mt-3 flex items-center gap-2 text-xs text-gray-500">

              <CheckCircle size={15} />

              {revenue?.workerPayout?.paidCount ?? 0} payouts

            </div>

          </div>

          <div className="border border-gray-200 bg-white p-5">

            <p className="text-sm text-gray-500">
              Worker Pending
            </p>

            <p className="mt-2 text-3xl font-bold">
              {loading
                ? "—"
                : formatMoney(
                    revenue?.workerPayout?.pending
                  )}
            </p>

            <div className="mt-3 flex items-center gap-2 text-xs text-gray-500">

              <Clock size={15} />

              {revenue?.workerPayout?.pendingCount ?? 0}{" "}
              pending payouts

            </div>

          </div>

          <div className="border border-gray-200 bg-white p-5">

            <p className="text-sm text-gray-500">
              Worker Share This Year
            </p>

            <p className="mt-2 text-3xl font-bold">
              {loading
                ? "—"
                : formatMoney(
                    revenue?.workerShare?.thisYear
                  )}
            </p>

            <p className="mt-3 text-xs text-gray-500">
              90% yearly worker share
            </p>

          </div>

        </div>

        {/* =================================================
            MONTHLY REPORT
        ================================================= */}

        <div className="mt-10 border border-gray-200 bg-white">

          <div className="border-b border-gray-200 px-6 py-5">

            <h2 className="text-lg font-bold">
              Monthly Revenue Report
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Dimapur verified client payments,
              JobHIR commission and worker share.
            </p>

          </div>

          <div className="overflow-x-auto">

            <table className="min-w-full text-left">

              <thead className="border-b border-gray-200 bg-gray-50">

                <tr>

                  <th className="px-6 py-3 text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Month
                  </th>

                  <th className="px-6 py-3 text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Client Payment
                  </th>

                  <th className="px-6 py-3 text-xs font-semibold uppercase tracking-wide text-gray-500">
                    JobHIR 10%
                  </th>

                  <th className="px-6 py-3 text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Worker 90%
                  </th>

                </tr>

              </thead>

              <tbody>

                {loading ? (

                  <tr>

                    <td
                      colSpan="4"
                      className="px-6 py-10 text-center text-sm text-gray-500"
                    >
                      Loading monthly report...
                    </td>

                  </tr>

                ) : revenue?.monthlyBreakdown?.length ? (

                  revenue.monthlyBreakdown.map((item) => (

                    <tr
                      key={`${item.year}-${item.month}`}
                      className="border-b border-gray-100 last:border-0"
                    >

                      <td className="px-6 py-4 text-sm font-medium">
                        {item.monthName} {item.year}
                      </td>

                      <td className="px-6 py-4 text-sm font-semibold">
                        {formatMoney(item.payment)}
                      </td>

                      <td className="px-6 py-4 text-sm font-semibold text-emerald-700">
                        {formatMoney(item.commission)}
                      </td>

                      <td className="px-6 py-4 text-sm font-semibold">
                        {formatMoney(item.workerAmount)}
                      </td>

                    </tr>

                  ))

                ) : (

                  <tr>

                    <td
                      colSpan="4"
                      className="px-6 py-10 text-center text-sm text-gray-500"
                    >
                      No verified payment recorded for this
                      year.
                    </td>

                  </tr>

                )}

              </tbody>

            </table>

          </div>

        </div>

        {/* =================================================
            RECENT QR PAYMENTS
        ================================================= */}

        <div className="mt-10 border border-gray-200 bg-white">

          {/* HEADER */}

          <div className="border-b border-gray-200 px-6 py-5">

            <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">

              <div>

                <div className="flex items-center gap-2">

                  <div className="flex h-9 w-9 items-center justify-center bg-emerald-100 text-emerald-700">
                    <CreditCard size={18} />
                  </div>

                  <h2 className="text-lg font-bold">
                    Recent QR Payments
                  </h2>

                </div>

                <p className="mt-2 text-sm text-gray-500">
                  Recent client payments received for
                  Dimapur jobs through QR payment.
                </p>

              </div>

              <div className="flex w-fit items-center gap-2 border border-emerald-200 bg-emerald-50 px-3 py-2 text-xs font-semibold text-emerald-700">

                <CreditCard size={15} />

                QR PAYMENT

              </div>

            </div>

          </div>

          {/* DESKTOP TABLE */}

          <div className="hidden overflow-x-auto md:block">

            <table className="min-w-full text-left">

              <thead className="border-b border-gray-200 bg-gray-50">

                <tr>

                  <th className="px-6 py-3 text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Date
                  </th>

                  <th className="px-6 py-3 text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Client
                  </th>

                  <th className="px-6 py-3 text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Job
                  </th>

                  <th className="px-6 py-3 text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Worker
                  </th>

                  <th className="px-6 py-3 text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Amount
                  </th>

                  <th className="px-6 py-3 text-xs font-semibold uppercase tracking-wide text-gray-500">
                    UTR
                  </th>

                  <th className="px-6 py-3 text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Status
                  </th>

                  <th className="px-6 py-3 text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Action
                  </th>

                </tr>

              </thead>

              <tbody>

                {loading ? (

                  <tr>

                    <td
                      colSpan="8"
                      className="px-6 py-12 text-center text-sm text-gray-500"
                    >
                      Loading QR payments...
                    </td>

                  </tr>

                ) : recentPayments.length > 0 ? (

                  recentPayments.map((payment) => (

                    <tr
                      key={payment._id}
                      className="border-b border-gray-100 last:border-0 hover:bg-gray-50"
                    >

                      {/* DATE */}

                      <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-600">

                        {formatDate(payment.createdAt)}

                      </td>

                      {/* CLIENT */}

                      <td className="px-6 py-4">

                        <p className="text-sm font-semibold text-gray-900">
                          {payment.clientName || "Unknown Client"}
                        </p>

                        <div className="mt-1 flex items-center gap-1 text-xs text-gray-500">

                          <Smartphone size={12} />

                          {payment.clientPhone || "—"}

                        </div>

                      </td>

                      {/* JOB */}

                      <td className="max-w-[220px] px-6 py-4">

                        <p className="truncate text-sm font-medium text-gray-900">
                          {payment.jobTitle || "—"}
                        </p>

                      </td>

                      {/* WORKER */}

                      <td className="px-6 py-4 text-sm text-gray-700">

                        {payment.workerName || "Not assigned"}

                      </td>

                      {/* AMOUNT */}

                      <td className="whitespace-nowrap px-6 py-4 text-sm font-bold text-gray-900">

                        {formatMoney(payment.amount)}

                      </td>

                      {/* UTR */}

                      <td className="whitespace-nowrap px-6 py-4">

                        <span className="font-mono text-xs text-gray-600">

                          {payment.utrNumber || "—"}

                        </span>

                      </td>

                      {/* STATUS */}

                      <td className="px-6 py-4">

                        <span
                          className={`inline-flex border px-2.5 py-1 text-xs font-semibold ${getPaymentStatusClass(
                            payment.paymentStatus
                          )}`}
                        >
                          {payment.paymentStatus || "PENDING"}
                        </span>

                      </td>

                      {/* ACTION */}

                      <td className="px-6 py-4">

                        <button
                          type="button"
                          onClick={() =>
                            setSelectedPayment(payment)
                          }
                          className="inline-flex items-center gap-2 border border-gray-300 bg-white px-3 py-2 text-xs font-semibold text-gray-700 hover:bg-gray-50"
                        >

                          <Eye size={14} />

                          View

                        </button>

                      </td>

                    </tr>

                  ))

                ) : (

                  <tr>

                    <td
                      colSpan="8"
                      className="px-6 py-12 text-center"
                    >

                      <div className="flex flex-col items-center">

                        <div className="flex h-12 w-12 items-center justify-center bg-gray-100 text-gray-400">

                          <CreditCard size={23} />

                        </div>

                        <p className="mt-3 text-sm font-semibold text-gray-700">
                          No QR payments found
                        </p>

                        <p className="mt-1 text-xs text-gray-500">
                          No client QR payment has been
                          recorded for Dimapur.
                        </p>

                      </div>

                    </td>

                  </tr>

                )}

              </tbody>

            </table>

          </div>

          {/* MOBILE */}

          <div className="space-y-4 p-4 md:hidden">

            {loading ? (

              <div className="py-10 text-center text-sm text-gray-500">
                Loading QR payments...
              </div>

            ) : recentPayments.length > 0 ? (

              recentPayments.map((payment) => (

                <div
                  key={payment._id}
                  className="border border-gray-200 bg-white p-4"
                >

                  <div className="flex items-start justify-between gap-3">

                    <div className="min-w-0">

                      <p className="truncate text-sm font-bold text-gray-900">
                        {payment.clientName ||
                          "Unknown Client"}
                      </p>

                      <p className="mt-1 text-xs text-gray-500">
                        {payment.clientPhone || "—"}
                      </p>

                    </div>

                    <span
                      className={`shrink-0 border px-2 py-1 text-[10px] font-bold ${getPaymentStatusClass(
                        payment.paymentStatus
                      )}`}
                    >
                      {payment.paymentStatus || "PENDING"}
                    </span>

                  </div>

                  <div className="mt-4 border-t border-gray-100 pt-4">

                    <div className="grid grid-cols-2 gap-4">

                      <div>

                        <p className="text-xs text-gray-500">
                          Amount
                        </p>

                        <p className="mt-1 text-lg font-bold text-gray-900">
                          {formatMoney(payment.amount)}
                        </p>

                      </div>

                      <div>

                        <p className="text-xs text-gray-500">
                          UTR
                        </p>

                        <p className="mt-1 truncate font-mono text-xs font-semibold text-gray-700">
                          {payment.utrNumber || "—"}
                        </p>

                      </div>

                    </div>

                    <div className="mt-4">

                      <p className="text-xs text-gray-500">
                        Job
                      </p>

                      <p className="mt-1 text-sm font-semibold text-gray-900">
                        {payment.jobTitle || "—"}
                      </p>

                    </div>

                    <div className="mt-3">

                      <p className="text-xs text-gray-500">
                        Worker
                      </p>

                      <p className="mt-1 text-sm font-medium text-gray-700">
                        {payment.workerName ||
                          "Not assigned"}
                      </p>

                    </div>

                    <div className="mt-3">

                      <p className="text-xs text-gray-400">
                        {formatDate(payment.createdAt)}
                      </p>

                    </div>

                    <button
                      type="button"
                      onClick={() =>
                        setSelectedPayment(payment)
                      }
                      className="mt-4 flex w-full items-center justify-center gap-2 border border-gray-300 bg-white px-4 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-50"
                    >

                      <Eye size={15} />

                      View Payment Details

                    </button>

                  </div>

                </div>

              ))

            ) : (

              <div className="py-10 text-center">

                <div className="mx-auto flex h-12 w-12 items-center justify-center bg-gray-100 text-gray-400">

                  <CreditCard size={23} />

                </div>

                <p className="mt-3 text-sm font-semibold text-gray-700">
                  No QR payments found
                </p>

                <p className="mt-1 text-xs text-gray-500">
                  No client QR payment has been recorded
                  for Dimapur.
                </p>

              </div>

            )}

          </div>

        </div>

        {/* =================================================
            WORKER MANAGEMENT
        ================================================= */}

        <div className="mt-8 border border-gray-200 bg-white p-6">

          <div className="flex flex-col justify-between gap-5 md:flex-row md:items-center">

            <div>

              <h2 className="text-lg font-semibold">
                Worker Management
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                View and manage workers from Dimapur,
                Nagaland.
              </p>

            </div>

            <Link
              to="/admin/dimapur/workers"
              className="flex items-center justify-center gap-2 bg-emerald-600 px-5 py-3 text-sm font-semibold text-white hover:bg-emerald-700"
            >

              <span className="text-white">
                Manage Workers
              </span>

              <ArrowRight
                size={18}
                className="text-white"
              />

            </Link>

          </div>

        </div>

      </main>

      {/* =================================================
          PAYMENT DETAILS MODAL
      ================================================= */}

      {selectedPayment && (

        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          onClick={() => setSelectedPayment(null)}
        >

          <div
            className="max-h-[92vh] w-full max-w-2xl overflow-y-auto border border-gray-200 bg-white shadow-2xl"
            onClick={(event) =>
              event.stopPropagation()
            }
          >

            {/* MODAL HEADER */}

            <div className="sticky top-0 z-10 flex items-center justify-between border-b border-gray-200 bg-white px-5 py-4 sm:px-6">

              <div className="flex items-center gap-3">

                <div className="flex h-10 w-10 items-center justify-center bg-emerald-100 text-emerald-700">

                  <Receipt size={20} />

                </div>

                <div>

                  <h2 className="text-lg font-bold text-gray-900">
                    QR Payment Details
                  </h2>

                  <p className="text-xs text-gray-500">
                    Complete client payment information
                  </p>

                </div>

              </div>

              <button
                type="button"
                onClick={() =>
                  setSelectedPayment(null)
                }
                className="flex h-9 w-9 items-center justify-center border border-gray-300 text-gray-500 hover:bg-gray-50 hover:text-gray-900"
              >

                <X size={18} />

              </button>

            </div>

            <div className="p-5 sm:p-6">

              {/* PAYMENT SUMMARY */}

              <div className="mb-6 border border-emerald-200 bg-emerald-50 p-5">

                <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">

                  <div>

                    <p className="text-xs font-medium uppercase tracking-wide text-emerald-700">
                      Payment Status
                    </p>

                    <span
                      className={`mt-2 inline-flex border px-3 py-1.5 text-xs font-bold ${getPaymentStatusClass(
                        selectedPayment.paymentStatus
                      )}`}
                    >
                      {selectedPayment.paymentStatus ||
                        "PENDING"}
                    </span>

                  </div>

                  <div className="sm:text-right">

                    <p className="text-xs font-medium uppercase tracking-wide text-emerald-700">
                      Total Amount
                    </p>

                    <div className="mt-1 flex items-center gap-1 sm:justify-end">

                      <IndianRupee size={19} />

                      <p className="text-2xl font-bold text-emerald-900">

                        {Number(
                          selectedPayment.amount
                        ).toLocaleString("en-IN")}

                      </p>

                    </div>

                  </div>

                </div>

              </div>

              {/* CLIENT INFORMATION */}

              <div className="mb-6">

                <div className="mb-4 flex items-center gap-2 border-b border-gray-200 pb-2">

                  <Users size={17} />

                  <h3 className="text-sm font-bold">
                    Client Information
                  </h3>

                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">

                  <div className="border border-gray-200 p-4">

                    <div className="flex items-center gap-2 text-gray-500">

                      <Users size={15} />

                      <p className="text-xs">
                        Client Name
                      </p>

                    </div>

                    <p className="mt-2 text-sm font-semibold text-gray-900">
                      {selectedPayment.clientName ||
                        "—"}
                    </p>

                  </div>

                  <div className="border border-gray-200 p-4">

                    <div className="flex items-center gap-2 text-gray-500">

                      <Smartphone size={15} />

                      <p className="text-xs">
                        Client Phone
                      </p>

                    </div>

                    <p className="mt-2 text-sm font-semibold text-gray-900">
                      {selectedPayment.clientPhone ||
                        "—"}
                    </p>

                  </div>

                  <div className="border border-gray-200 p-4 sm:col-span-2">

                    <div className="flex items-center gap-2 text-gray-500">

                      <Mail size={15} />

                      <p className="text-xs">
                        Client Email
                      </p>

                    </div>

                    <p className="mt-2 break-all text-sm font-semibold text-gray-900">
                      {selectedPayment.clientEmail ||
                        "—"}
                    </p>

                  </div>

                </div>

              </div>

              {/* JOB INFORMATION */}

              <div className="mb-6">

                <div className="mb-4 flex items-center gap-2 border-b border-gray-200 pb-2">

                  <BriefcaseBusiness size={17} />

                  <h3 className="text-sm font-bold">
                    Job & Worker
                  </h3>

                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">

                  <div className="border border-gray-200 p-4">

                    <p className="text-xs text-gray-500">
                      Job Title
                    </p>

                    <p className="mt-2 text-sm font-semibold text-gray-900">
                      {selectedPayment.jobTitle ||
                        "—"}
                    </p>

                  </div>

                  <div className="border border-gray-200 p-4">

                    <p className="text-xs text-gray-500">
                      Worker
                    </p>

                    <p className="mt-2 text-sm font-semibold text-gray-900">
                      {selectedPayment.workerName ||
                        "Not assigned"}
                    </p>

                  </div>

                </div>

              </div>

              {/* PAYMENT INFORMATION */}

              <div className="mb-6">

                <div className="mb-4 flex items-center gap-2 border-b border-gray-200 pb-2">

                  <CreditCard size={17} />

                  <h3 className="text-sm font-bold">
                    Payment Information
                  </h3>

                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">

                  <div className="border border-gray-200 p-4">

                    <p className="text-xs text-gray-500">
                      Payment Method
                    </p>

                    <p className="mt-2 text-sm font-semibold text-gray-900">
                      {selectedPayment.paymentMethod ||
                        "QR"}
                    </p>

                  </div>

                  <div className="border border-gray-200 p-4">

                    <p className="text-xs text-gray-500">
                      UTR Number
                    </p>

                    <p className="mt-2 break-all font-mono text-sm font-bold text-gray-900">
                      {selectedPayment.utrNumber ||
                        "—"}
                    </p>

                  </div>

                  <div className="border border-gray-200 p-4">

                    <p className="text-xs text-gray-500">
                      Payment Created
                    </p>

                    <p className="mt-2 text-sm font-semibold text-gray-900">
                      {formatDate(
                        selectedPayment.createdAt
                      )}
                    </p>

                  </div>

                  <div className="border border-gray-200 p-4">

                    <p className="text-xs text-gray-500">
                      Verified At
                    </p>

                    <p className="mt-2 text-sm font-semibold text-gray-900">
                      {formatDate(
                        selectedPayment.verifiedAt
                      )}
                    </p>

                  </div>

                </div>

              </div>

              {/* PAYMENT DISTRIBUTION */}

              <div className="mb-6">

                <div className="mb-4 flex items-center gap-2 border-b border-gray-200 pb-2">

                  <Wallet size={17} />

                  <h3 className="text-sm font-bold">
                    Payment Distribution
                  </h3>

                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">

                  {/* COMMISSION */}

                  <div className="border border-emerald-200 bg-emerald-50 p-4">

                    <p className="text-xs font-medium text-emerald-700">
                      JobHIR Commission
                    </p>

                    <p className="mt-2 text-xl font-bold text-emerald-900">
                      {formatMoney(
                        selectedPayment.commissionAmount
                      )}
                    </p>

                    <p className="mt-1 text-xs text-emerald-700">

                      {selectedPayment.commissionRate ??
                        10}
                      %

                    </p>

                  </div>

                  {/* WORKER */}

                  <div className="border border-gray-200 bg-gray-50 p-4">

                    <p className="text-xs font-medium text-gray-600">
                      Worker Share
                    </p>

                    <p className="mt-2 text-xl font-bold text-gray-900">
                      {formatMoney(
                        selectedPayment.workerAmount
                      )}
                    </p>

                    <p className="mt-1 text-xs text-gray-500">
                      90%
                    </p>

                  </div>

                  {/* PAYOUT */}

                  <div className="border border-gray-200 bg-gray-50 p-4">

                    <p className="text-xs font-medium text-gray-600">
                      Worker Payout
                    </p>

                    <span
                      className={`mt-2 inline-flex border px-2.5 py-1 text-xs font-semibold ${getPayoutStatusClass(
                        selectedPayment.workerPayoutStatus
                      )}`}
                    >
                      {selectedPayment.workerPayoutStatus ||
                        "PENDING"}
                    </span>

                    {selectedPayment.workerPaidAt && (

                      <p className="mt-2 text-[11px] text-gray-500">
                        Paid:{" "}
                        {formatDate(
                          selectedPayment.workerPaidAt
                        )}
                      </p>

                    )}

                  </div>

                </div>

              </div>

              {/* PAYMENT ID */}

              <div className="mb-6 border border-gray-200 bg-gray-50 p-4">

                <p className="text-xs text-gray-500">
                  Payment ID
                </p>

                <p className="mt-1 break-all font-mono text-xs text-gray-700">
                  {selectedPayment._id || "—"}
                </p>

                {selectedPayment.jobId && (

                  <>

                    <p className="mt-4 text-xs text-gray-500">
                      Job ID
                    </p>

                    <p className="mt-1 break-all font-mono text-xs text-gray-700">
                      {selectedPayment.jobId}
                    </p>

                  </>

                )}

              </div>

              {/* CLOSE */}

              <div className="flex justify-end border-t border-gray-200 pt-5">

                <button
                  type="button"
                  onClick={() =>
                    setSelectedPayment(null)
                  }
                  className="flex items-center gap-2 bg-gray-900 px-5 py-2.5 text-sm font-semibold text-white hover:bg-gray-800"
                >

                  <X size={16} />

                  Close

                </button>

              </div>

            </div>

          </div>

        </div>

      )}

    </div>
  );
};

export default Dashboard;