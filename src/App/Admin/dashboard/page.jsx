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
} from "lucide-react";

const API_URL = "https://jbackend-h963.onrender.com";

const formatMoney = (value) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(Number(value || 0));

const StatCard = ({ icon: Icon, title, value, subtitle, iconClass = "" }) => (
  <div className="border border-slate-200 bg-white p-5 shadow-sm rounded-none">
    <div className="flex items-start justify-between gap-4">
      <div>
        <p className="text-sm font-medium text-slate-500">{title}</p>
        <p className="mt-2 text-2xl font-bold text-slate-900">{value}</p>
        {subtitle && (
          <p className="mt-1 text-xs text-slate-500">{subtitle}</p>
        )}
      </div>

      <div
        className={`flex h-11 w-11 shrink-0 items-center justify-center border border-slate-200 bg-slate-50 ${iconClass}`}
      >
        <Icon size={21} />
      </div>
    </div>
  </div>
);

const SectionTitle = ({ icon: Icon, title, subtitle }) => (
  <div className="mb-5 flex items-center justify-between gap-4">
    <div className="flex items-center gap-3">
      <div className="flex h-10 w-10 items-center justify-center border border-slate-200 bg-white">
        <Icon size={19} className="text-slate-700" />
      </div>

      <div>
        <h2 className="text-lg font-bold text-slate-900">{title}</h2>
        {subtitle && (
          <p className="text-xs text-slate-500">{subtitle}</p>
        )}
      </div>
    </div>
  </div>
);

export default function AdminDashboard() {
  const navigate = useNavigate();

  const [stats, setStats] = useState(null);
  const [revenue, setRevenue] = useState(null);

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");

  const fetchDashboard = async (isRefresh = false) => {
    const token = localStorage.getItem("adminToken");
    const adminUser = JSON.parse(
      localStorage.getItem("adminUser") || "null"
    );

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
      };

      const [statsResponse, revenueResponse] = await Promise.all([
        fetch(`${API_URL}/admin/stats`, {
          headers,
        }),
        fetch(`${API_URL}/admin/revenue`, {
          headers,
        }),
      ]);

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

      if (!statsResponse.ok) {
        throw new Error(
          statsData?.message || "Failed to load worker statistics"
        );
      }

      if (!revenueResponse.ok) {
        throw new Error(
          revenueData?.message || "Failed to load revenue statistics"
        );
      }

      setStats(statsData?.stats || statsData?.data || statsData);
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

  useEffect(() => {
    const token = localStorage.getItem("adminToken");
    const adminUser = JSON.parse(
      localStorage.getItem("adminUser") || "null"
    );

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

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    localStorage.removeItem("adminUser");
    navigate("/admin/login");
  };

  const adminUser = JSON.parse(
    localStorage.getItem("adminUser") || "null"
  );

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

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50">
        <header className="border-b border-slate-200 bg-white">
          <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
            <div>
              <h1 className="text-xl font-bold text-slate-900">
                JobHIR Admin
              </h1>
              <p className="text-sm text-slate-500">
                Global Worker Management Dashboard
              </p>
            </div>
          </div>
        </header>

        <main className="mx-auto flex max-w-7xl items-center justify-center px-4 py-20">
          <div className="flex items-center gap-3 text-slate-600">
            <RefreshCw className="animate-spin" size={20} />
            <span>Dashboard loading...</span>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* HEADER */}
      <header className="sticky top-0 z-30 border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
          <div>
            <h1 className="text-xl font-bold text-slate-900">
              JobHIR Admin
            </h1>
            <p className="text-sm text-slate-500">
              Global Worker Management Dashboard
            </p>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <div className="hidden border border-slate-200 bg-slate-50 px-3 py-2 text-sm sm:block">
              <span className="text-slate-500">Admin: </span>
              <span className="font-semibold text-slate-800">
                {adminUser?.username || "Admin"}
              </span>
            </div>

            <button
              onClick={() => fetchDashboard(true)}
              disabled={refreshing}
              className="flex items-center gap-2 border border-slate-300 bg-white px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <RefreshCw
                size={16}
                className={refreshing ? "animate-spin" : ""}
              />
              <span className="hidden sm:inline">Refresh</span>
            </button>

            <button
              onClick={handleLogout}
              className="flex items-center gap-2 border border-red-200 bg-white px-3 py-2 text-sm font-medium text-red-600 transition hover:bg-red-50"
            >
              <LogOut size={16} />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        {/* ERROR */}
        {error && (
          <div className="mb-6 flex items-start gap-3 border border-red-200 bg-red-50 p-4 text-red-700 rounded-none">
            <AlertCircle className="mt-0.5 shrink-0" size={19} />
            <div>
              <p className="font-semibold">Dashboard Error</p>
              <p className="mt-1 text-sm">{error}</p>
            </div>
          </div>
        )}

        {/* =========================================================
            WORKER OVERVIEW
        ========================================================= */}
        <section className="mb-8">
          <SectionTitle
            icon={Users}
            title="Worker Overview"
            subtitle="Global worker registration and account status"
          />

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <StatCard
              icon={Users}
              title="Total Workers"
              value={workerStats.totalWorkers || 0}
            />

            <StatCard
              icon={CreditCard}
              title="Paid Workers"
              value={workerStats.paidWorkers || 0}
            />

            <StatCard
              icon={Clock3}
              title="Pending Payment"
              value={workerStats.pendingPayment || 0}
            />

            <StatCard
              icon={UserCheck}
              title="Active Workers"
              value={workerStats.activeWorkers || 0}
            />

            <StatCard
              icon={UserPlus}
              title="Pending Accounts"
              value={workerStats.pendingWorkers || 0}
            />

            <StatCard
              icon={Ban}
              title="Blocked Workers"
              value={workerStats.blockedWorkers || 0}
            />
          </div>
        </section>

        {/* =========================================================
            VERIFICATION
        ========================================================= */}
        <section className="mb-8">
          <SectionTitle
            icon={ShieldCheck}
            title="Worker Verification"
            subtitle="KYC and skill verification overview"
          />

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <StatCard
              icon={Clock3}
              title="Pending Verification"
              value={workerStats.pendingVerification || 0}
            />

            <StatCard
              icon={TrendingUp}
              title="Under Review"
              value={workerStats.underReview || 0}
            />

            <StatCard
              icon={BadgeCheck}
              title="Verified Workers"
              value={workerStats.verifiedWorkers || 0}
            />

            <StatCard
              icon={AlertCircle}
              title="Need More Information"
              value={workerStats.needMoreInformation || 0}
            />

            <StatCard
              icon={Ban}
              title="Rejected"
              value={workerStats.rejectedWorkers || 0}
            />

            <StatCard
              icon={BadgeCheck}
              title="Expert"
              value={workerStats.expertWorkers || 0}
            />

            <StatCard
              icon={UserCheck}
              title="Skilled"
              value={workerStats.skilledWorkers || 0}
            />

            <StatCard
              icon={ShieldCheck}
              title="KYC Verified"
              value={workerStats.kycVerifiedWorkers || 0}
            />
          </div>
        </section>

        {/* =========================================================
            GLOBAL WORK OVERVIEW
        ========================================================= */}
        <section className="mb-8">
          <SectionTitle
            icon={BriefcaseBusiness}
            title="Global Work Overview"
            subtitle="All jobs across JobHIR"
          />

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
            <StatCard
              icon={BriefcaseBusiness}
              title="Total Jobs"
              value={jobs.totalJobs || 0}
            />

            <StatCard
              icon={UserCheck}
              title="Assigned Jobs"
              value={jobs.assignedJobs || 0}
            />

            <StatCard
              icon={Clock3}
              title="Working Jobs"
              value={jobs.workingJobs || 0}
            />

            <StatCard
              icon={CheckCircle2}
              title="Completed Jobs"
              value={jobs.completedJobs || 0}
            />

            <StatCard
              icon={IndianRupee}
              title="Total Job Value"
              value={formatMoney(jobs.totalJobValue)}
            />
          </div>
        </section>

        {/* =========================================================
            CLIENT PAYMENT
        ========================================================= */}
        <section className="mb-8">
          <SectionTitle
            icon={CreditCard}
            title="Client Payment"
            subtitle="Verified client payments received through JobHIR"
          />

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <StatCard
              icon={CreditCard}
              title="Total Client Payment"
              value={formatMoney(payment.total)}
              subtitle="All verified payments"
            />

            <StatCard
              icon={TrendingUp}
              title="This Month"
              value={formatMoney(payment.thisMonth)}
            />

            <StatCard
              icon={Banknote}
              title="This Year"
              value={formatMoney(payment.thisYear)}
            />

            <StatCard
              icon={Clock3}
              title="Pending Payment"
              value={formatMoney(payment.pending)}
              subtitle={`${payment.pendingCount || 0} pending payment(s)`}
            />
          </div>
        </section>

        {/* =========================================================
            JOBHIR COMMISSION
        ========================================================= */}
        <section className="mb-8">
          <SectionTitle
            icon={TrendingUp}
            title="JobHIR Commission"
            subtitle="Platform commission from verified client payments"
          />

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <StatCard
              icon={IndianRupee}
              title="Total Commission"
              value={formatMoney(commission.total)}
              subtitle="JobHIR total revenue"
            />

            <StatCard
              icon={TrendingUp}
              title="This Month"
              value={formatMoney(commission.thisMonth)}
            />

            <StatCard
              icon={Banknote}
              title="This Year"
              value={formatMoney(commission.thisYear)}
            />

            <StatCard
              icon={BadgeCheck}
              title="Commission Rate"
              value={`${commission.rate ?? 10}%`}
              subtitle="Current platform commission"
            />
          </div>
        </section>

        {/* =========================================================
            WORKER SHARE / PAYOUT
        ========================================================= */}
        <section className="mb-8">
          <SectionTitle
            icon={Wallet}
            title="Worker Share & Payout"
            subtitle="90% worker share and payout tracking"
          />

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
            <StatCard
              icon={Wallet}
              title="Total Worker Share"
              value={formatMoney(workerShare.total)}
              subtitle="Total worker earnings"
            />

            <StatCard
              icon={TrendingUp}
              title="This Month"
              value={formatMoney(workerShare.thisMonth)}
            />

            <StatCard
              icon={Banknote}
              title="This Year"
              value={formatMoney(workerShare.thisYear)}
            />

            <StatCard
              icon={CheckCircle2}
              title="Worker Paid"
              value={formatMoney(workerPayout.paid)}
              subtitle={`${workerPayout.paidCount || 0} payout(s)`}
            />

            <StatCard
              icon={Clock3}
              title="Worker Payout Pending"
              value={formatMoney(workerPayout.pending)}
              subtitle={`${workerPayout.pendingCount || 0} payout(s)`}
            />
          </div>
        </section>

        {/* =========================================================
            MONTHLY REVENUE REPORT
        ========================================================= */}
        <section className="mb-8">
          <SectionTitle
            icon={ClipboardList}
            title="Monthly Revenue Report"
            subtitle="Client payment, JobHIR commission and worker share"
          />

          <div className="overflow-hidden border border-slate-200 bg-white rounded-none shadow-sm">
            {monthlyBreakdown.length === 0 ? (
              <div className="px-6 py-12 text-center">
                <ClipboardList
                  size={34}
                  className="mx-auto text-slate-300"
                />

                <p className="mt-3 font-semibold text-slate-700">
                  No monthly revenue data
                </p>

                <p className="mt-1 text-sm text-slate-500">
                  Verified client payments ke baad monthly report yahan
                  show hoga.
                </p>
              </div>
            ) : (
              <>
                {/* Desktop Table */}
                <div className="hidden overflow-x-auto md:block">
                  <table className="min-w-full text-sm">
                    <thead>
                      <tr className="border-b border-slate-200 bg-slate-50">
                        <th className="px-5 py-4 text-left font-semibold text-slate-700">
                          Month
                        </th>

                        <th className="px-5 py-4 text-right font-semibold text-slate-700">
                          Client Payment
                        </th>

                        <th className="px-5 py-4 text-right font-semibold text-slate-700">
                          JobHIR Commission
                        </th>

                        <th className="px-5 py-4 text-right font-semibold text-slate-700">
                          Worker Share
                        </th>
                      </tr>
                    </thead>

                    <tbody>
                      {monthlyBreakdown.map((item, index) => (
                        <tr
                          key={`${item.year}-${item.month}-${index}`}
                          className="border-b border-slate-100 last:border-b-0"
                        >
                          <td className="px-5 py-4 font-medium text-slate-800">
                            {item.monthName} {item.year}
                          </td>

                          <td className="px-5 py-4 text-right font-semibold text-slate-800">
                            {formatMoney(item.payment)}
                          </td>

                          <td className="px-5 py-4 text-right font-semibold text-emerald-700">
                            {formatMoney(item.commission)}
                          </td>

                          <td className="px-5 py-4 text-right font-semibold text-blue-700">
                            {formatMoney(item.workerAmount)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Mobile Cards */}
                <div className="divide-y divide-slate-100 md:hidden">
                  {monthlyBreakdown.map((item, index) => (
                    <div
                      key={`${item.year}-${item.month}-${index}`}
                      className="p-5"
                    >
                      <div className="mb-4 flex items-center justify-between">
                        <p className="font-bold text-slate-900">
                          {item.monthName} {item.year}
                        </p>

                        <span className="border border-slate-200 bg-slate-50 px-2 py-1 text-xs text-slate-500">
                          Monthly
                        </span>
                      </div>

                      <div className="space-y-3 text-sm">
                        <div className="flex items-center justify-between">
                          <span className="text-slate-500">
                            Client Payment
                          </span>

                          <span className="font-semibold text-slate-800">
                            {formatMoney(item.payment)}
                          </span>
                        </div>

                        <div className="flex items-center justify-between">
                          <span className="text-slate-500">
                            JobHIR Commission
                          </span>

                          <span className="font-semibold text-emerald-700">
                            {formatMoney(item.commission)}
                          </span>
                        </div>

                        <div className="flex items-center justify-between">
                          <span className="text-slate-500">
                            Worker Share
                          </span>

                          <span className="font-semibold text-blue-700">
                            {formatMoney(item.workerAmount)}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        </section>

        {/* =========================================================
            WORKER MANAGEMENT
        ========================================================= */}
        <section className="mb-8">
          <SectionTitle
            icon={Users}
            title="Worker Management"
            subtitle="Manage registered workers and verification"
          />

          <div className="border border-slate-200 bg-white p-5 shadow-sm rounded-none">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h3 className="font-bold text-slate-900">
                  Global Worker Directory
                </h3>

                <p className="mt-1 text-sm text-slate-500">
                  Workers ko view, verify, activate, block aur manage
                  karein.
                </p>
              </div>

              <Link
                to="/admin/workers"
                className="inline-flex items-center justify-center gap-2 border border-slate-900 bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
              >
                <Users size={17} />
                Manage Workers
              </Link>
            </div>
          </div>
        </section>

        {/* =========================================================
            QUICK ACTIONS
        ========================================================= */}
        <section className="mb-8">
          <SectionTitle
            icon={ClipboardList}
            title="Quick Actions"
            subtitle="Frequently used admin sections"
          />

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <Link
              to="/admin/workers"
              className="border border-slate-200 bg-white p-5 shadow-sm transition hover:border-slate-400 rounded-none"
            >
              <Users size={22} className="text-slate-700" />

              <h3 className="mt-3 font-bold text-slate-900">
                Manage Workers
              </h3>

              <p className="mt-1 text-sm text-slate-500">
                Worker accounts aur profiles manage karein.
              </p>
            </Link>

            <Link
              to="/admin/workers?verificationStatus=Pending"
              className="border border-slate-200 bg-white p-5 shadow-sm transition hover:border-slate-400 rounded-none"
            >
              <ShieldCheck size={22} className="text-slate-700" />

              <h3 className="mt-3 font-bold text-slate-900">
                Worker Verification
              </h3>

              <p className="mt-1 text-sm text-slate-500">
                Pending KYC aur skill verification check karein.
              </p>
            </Link>

            <Link
              to="/admin/delete"
              className="border border-slate-200 bg-white p-5 shadow-sm transition hover:border-slate-400 rounded-none"
            >
              <BriefcaseBusiness
                size={22}
                className="text-slate-700"
              />

              <h3 className="mt-3 font-bold text-slate-900">
                Manage Jobs
              </h3>

              <p className="mt-1 text-sm text-slate-500">
                Existing job management section open karein.
              </p>
            </Link>
          </div>
        </section>

        {/* FOOTER INFO */}
        <div className="border-t border-slate-200 py-5 text-center text-xs text-slate-400">
          JobHIR Global Admin Dashboard
        </div>
      </main>
    </div>
  );
}