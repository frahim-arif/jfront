import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const API_URL = "https://jbackend-h963.onrender.com";

export default function AdminDashboard() {
  const navigate = useNavigate();

  const [stats, setStats] = useState(null);
  const [revenue, setRevenue] = useState(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // =====================================================
  // ADMIN USER
  // =====================================================

  let adminUser = {};

  try {
    adminUser = JSON.parse(
      localStorage.getItem("adminUser") || "{}"
    );
  } catch {
    adminUser = {};
  }

  // =====================================================
  // FORMAT MONEY
  // =====================================================

  const formatMoney = (value) => {
    const amount = Number(value) || 0;

    return `₹${amount.toLocaleString("en-IN")}`;
  };

  // =====================================================
  // FETCH DASHBOARD
  // =====================================================

  const fetchDashboard = async () => {
    try {
      setLoading(true);
      setError("");

      const token = localStorage.getItem("adminToken");

      if (!token) {
        navigate("/admin/login");
        return;
      }

      const headers = {
        Authorization: `Bearer ${token}`,
      };

      // -----------------------------------------------
      // FETCH WORKER STATS + REVENUE
      // -----------------------------------------------

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

      const statsData = await statsResponse.json();
      const revenueData = await revenueResponse.json();

      // -----------------------------------------------
      // AUTH ERROR
      // -----------------------------------------------

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

      // -----------------------------------------------
      // STATS ERROR
      // -----------------------------------------------

      if (!statsResponse.ok || !statsData.success) {
        throw new Error(
          statsData.message ||
            "Failed to load worker statistics"
        );
      }

      // -----------------------------------------------
      // REVENUE ERROR
      // -----------------------------------------------

      if (!revenueResponse.ok || !revenueData.success) {
        throw new Error(
          revenueData.message ||
            "Failed to load revenue statistics"
        );
      }

      setStats(statsData.stats);
      setRevenue(revenueData);
    } catch (err) {
      console.error(
        "GLOBAL ADMIN DASHBOARD ERROR:",
        err
      );

      setError(
        err.message ||
          "Dashboard load nahi ho saka."
      );
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
  // LOADING
  // =====================================================

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-100 flex items-center justify-center px-4">
        <div className="bg-white border border-slate-200 shadow-sm p-8 text-center">
          <div className="w-10 h-10 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>

          <p className="text-slate-600 font-medium">
            Loading Global Admin Dashboard...
          </p>
        </div>
      </div>
    );
  }

  // =====================================================
  // RETURN
  // =====================================================

  return (
    <div className="min-h-screen bg-slate-100">

      {/* =================================================
          HEADER
      ================================================= */}

      <header className="bg-slate-900 text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">

          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">

            <div>
              <h1 className="text-2xl font-bold">
                JobHIR Admin
              </h1>

              <p className="text-sm text-slate-400 mt-1">
                Global Worker, Jobs & Revenue Dashboard
              </p>
            </div>

            <div className="flex items-center gap-3">

              <div className="hidden sm:block text-right">
                <p className="text-sm text-slate-400">
                  Logged in as
                </p>

                <p className="font-semibold">
                  {adminUser?.username || "Admin"}
                </p>
              </div>

              <button
                onClick={handleLogout}
                className="bg-red-600 hover:bg-red-700 px-4 py-2 text-sm font-semibold transition"
              >
                Logout
              </button>

            </div>
          </div>

        </div>
      </header>

      {/* =================================================
          CONTENT
      ================================================= */}

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6">

        {/* =================================================
            ERROR
        ================================================= */}

        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-700 p-4">

            <p className="font-semibold">
              Dashboard Error
            </p>

            <p className="text-sm mt-1">
              {error}
            </p>

            <button
              onClick={fetchDashboard}
              className="mt-3 bg-red-600 text-white px-4 py-2 text-sm font-semibold hover:bg-red-700"
            >
              Try Again
            </button>

          </div>
        )}

        {/* =================================================
            PAGE TITLE
        ================================================= */}

        <div className="mb-6">

          <h2 className="text-2xl font-bold text-slate-900">
            Global Dashboard
          </h2>

          <p className="text-slate-500 mt-1">
            JobHIR ke workers, jobs, client payments,
            commission aur worker payouts ka complete
            global overview.
          </p>

        </div>

        {/* =================================================
            WORKER OVERVIEW
        ================================================= */}

        <section>

          <div className="mb-4">
            <h3 className="text-xl font-bold text-slate-900">
              Worker Overview
            </h3>

            <p className="text-sm text-slate-500 mt-1">
              All states aur districts ke registered workers.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">

            {/* TOTAL WORKERS */}

            <StatCard
              title="Total Workers"
              value={stats?.totalWorkers ?? 0}
              description="All registered workers"
            />

            {/* PAID WORKERS */}

            <StatCard
              title="Paid Workers"
              value={stats?.paidWorkers ?? 0}
              valueClass="text-green-600"
              description="Registration payment completed"
            />

            {/* PENDING PAYMENT */}

            <StatCard
              title="Pending Payment"
              value={stats?.pendingPayment ?? 0}
              valueClass="text-orange-500"
              description="Registration payment pending"
            />

            {/* ACTIVE */}

            <StatCard
              title="Active Workers"
              value={stats?.activeWorkers ?? 0}
              valueClass="text-blue-600"
              description="Currently active accounts"
            />

            {/* PENDING */}

            <StatCard
              title="Pending Accounts"
              value={stats?.pendingWorkers ?? 0}
              valueClass="text-yellow-600"
              description="Waiting for approval"
            />

            {/* BLOCKED */}

            <StatCard
              title="Blocked Workers"
              value={stats?.blockedWorkers ?? 0}
              valueClass="text-red-600"
              description="Blocked accounts"
            />

          </div>

        </section>

        {/* =================================================
            VERIFICATION
        ================================================= */}

        <section className="mt-8">

          <div className="mb-4">

            <h3 className="text-xl font-bold text-slate-900">
              Worker Verification
            </h3>

            <p className="text-sm text-slate-500 mt-1">
              KYC, skill aur experience verification overview.
            </p>

          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">

            <StatCard
              title="Pending Verification"
              value={stats?.pendingVerification ?? 0}
              valueClass="text-orange-500"
              description="Workers waiting for review"
            />

            <StatCard
              title="Under Review"
              value={stats?.underReview ?? 0}
              valueClass="text-blue-600"
              description="Verification in progress"
            />

            <StatCard
              title="Verified Workers"
              value={stats?.verifiedWorkers ?? 0}
              valueClass="text-green-600"
              description="Successfully verified"
            />

            <StatCard
              title="Need More Information"
              value={stats?.needMoreInformation ?? 0}
              valueClass="text-yellow-600"
              description="Additional information required"
            />

          </div>

        </section>

        {/* =================================================
            SKILL OVERVIEW
        ================================================= */}

        <section className="mt-8">

          <div className="mb-4">

            <h3 className="text-xl font-bold text-slate-900">
              Worker Skill Overview
            </h3>

          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">

            <StatCard
              title="Expert"
              value={stats?.expertWorkers ?? 0}
              valueClass="text-purple-600"
              description="Expert level workers"
            />

            <StatCard
              title="Skilled"
              value={stats?.skilledWorkers ?? 0}
              valueClass="text-indigo-600"
              description="Skilled workers"
            />

            <StatCard
              title="Semi-Skilled"
              value={stats?.semiSkilledWorkers ?? 0}
              valueClass="text-blue-600"
              description="Semi-skilled workers"
            />

            <StatCard
              title="Helpers"
              value={stats?.helperWorkers ?? 0}
              valueClass="text-slate-600"
              description="Helper level workers"
            />

          </div>

        </section>

        {/* =================================================
            JOB OVERVIEW
        ================================================= */}

        <section className="mt-8">

          <div className="mb-4">

            <h3 className="text-xl font-bold text-slate-900">
              Global Work Overview
            </h3>

            <p className="text-sm text-slate-500 mt-1">
              JobHIR par posted aur assigned jobs ka overview.
            </p>

          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5">

            <StatCard
              title="Total Jobs"
              value={
                revenue?.jobs?.totalJobs ?? 0
              }
              valueClass="text-blue-600"
              description="All posted jobs"
            />

            <StatCard
              title="Assigned Jobs"
              value={
                revenue?.jobs?.assignedJobs ?? 0
              }
              valueClass="text-indigo-600"
              description="Worker assigned"
            />

            <StatCard
              title="Working Jobs"
              value={
                revenue?.jobs?.workingJobs ?? 0
              }
              valueClass="text-orange-500"
              description="Currently working"
            />

            <StatCard
              title="Completed Jobs"
              value={
                revenue?.jobs?.completedJobs ?? 0
              }
              valueClass="text-green-600"
              description="Completed work"
            />

            <MoneyCard
              title="Total Job Value"
              value={
                revenue?.jobs?.totalJobValue ?? 0
              }
              description="Total posted job value"
            />

          </div>

        </section>

        {/* =================================================
            CLIENT PAYMENT
        ================================================= */}

        <section className="mt-8">

          <div className="mb-4">

            <h3 className="text-xl font-bold text-slate-900">
              Client Payment
            </h3>

            <p className="text-sm text-slate-500 mt-1">
              Client se receive hui actual job payments.
            </p>

          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">

            <MoneyCard
              title="Total Client Payment"
              value={
                revenue?.payment?.total ?? 0
              }
              description="All verified client payments"
            />

            <MoneyCard
              title="This Month"
              value={
                revenue?.payment?.thisMonth ?? 0
              }
              valueClass="text-blue-600"
              description="Verified payment this month"
            />

            <MoneyCard
              title="This Year"
              value={
                revenue?.payment?.thisYear ?? 0
              }
              valueClass="text-indigo-600"
              description="Verified payment this year"
            />

            <MoneyCard
              title="Pending Payment"
              value={
                revenue?.payment?.pending ?? 0
              }
              valueClass="text-orange-500"
              description={
                `${revenue?.payment?.pendingCount ?? 0} pending payment(s)`
              }
            />

          </div>

        </section>

        {/* =================================================
            JOBHIR COMMISSION
        ================================================= */}

        <section className="mt-8">

          <div className="mb-4">

            <h3 className="text-xl font-bold text-slate-900">
              JobHIR Commission
            </h3>

            <p className="text-sm text-slate-500 mt-1">
              Verified client payment par JobHIR commission.
            </p>

          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">

            <MoneyCard
              title="Commission Rate"
              value={`${revenue?.commission?.rate ?? 10}%`}
              description="Current JobHIR commission"
              showRupee={false}
            />

            <MoneyCard
              title="Total Commission"
              value={
                revenue?.commission?.total ?? 0
              }
              valueClass="text-green-600"
              description="Total JobHIR earnings"
            />

            <MoneyCard
              title="This Month"
              value={
                revenue?.commission?.thisMonth ?? 0
              }
              valueClass="text-blue-600"
              description="Commission this month"
            />

            <MoneyCard
              title="This Year"
              value={
                revenue?.commission?.thisYear ?? 0
              }
              valueClass="text-indigo-600"
              description="Commission this year"
            />

          </div>

        </section>

        {/* =================================================
            WORKER SHARE
        ================================================= */}

        <section className="mt-8">

          <div className="mb-4">

            <h3 className="text-xl font-bold text-slate-900">
              Worker Share
            </h3>

            <p className="text-sm text-slate-500 mt-1">
              Verified client payment me worker ka 90% share.
            </p>

          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">

            <MoneyCard
              title="Total Worker Share"
              value={
                revenue?.workerShare?.total ?? 0
              }
              valueClass="text-green-600"
              description="Total amount allocated to workers"
            />

            <MoneyCard
              title="Worker Share This Month"
              value={
                revenue?.workerShare?.thisMonth ?? 0
              }
              valueClass="text-blue-600"
              description="Worker share this month"
            />

            <MoneyCard
              title="Worker Share This Year"
              value={
                revenue?.workerShare?.thisYear ?? 0
              }
              valueClass="text-indigo-600"
              description="Worker share this year"
            />

          </div>

        </section>

        {/* =================================================
            WORKER PAYOUT
        ================================================= */}

        <section className="mt-8">

          <div className="mb-4">

            <h3 className="text-xl font-bold text-slate-900">
              Worker Payout
            </h3>

            <p className="text-sm text-slate-500 mt-1">
              Workers ko actual payout ka overview.
            </p>

          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">

            <MoneyCard
              title="Worker Paid"
              value={
                revenue?.workerPayout?.paid ?? 0
              }
              valueClass="text-green-600"
              description={
                `${revenue?.workerPayout?.paidCount ?? 0} payout(s) completed`
              }
            />

            <MoneyCard
              title="Worker Pending"
              value={
                revenue?.workerPayout?.pending ?? 0
              }
              valueClass="text-orange-500"
              description={
                `${revenue?.workerPayout?.pendingCount ?? 0} payout(s) pending`
              }
            />

            <MoneyCard
              title="Worker Share"
              value={
                revenue?.workerShare?.total ?? 0
              }
              valueClass="text-blue-600"
              description="Total worker allocation"
            />

            <MoneyCard
              title="JobHIR Earnings"
              value={
                revenue?.commission?.total ?? 0
              }
              valueClass="text-green-600"
              description="Total commission"
            />

          </div>

        </section>

        {/* =================================================
            MONTHLY REPORT
        ================================================= */}

        <section className="mt-8">

          <div className="mb-4">

            <h3 className="text-xl font-bold text-slate-900">
              Monthly Revenue Report
            </h3>

            <p className="text-sm text-slate-500 mt-1">
              Current year ka client payment, commission aur worker share.
            </p>

          </div>

          <div className="bg-white border border-slate-200 shadow-sm overflow-hidden">

            {revenue?.monthlyBreakdown?.length ? (

              <div className="overflow-x-auto">

                <table className="w-full text-sm">

                  <thead className="bg-slate-900 text-white">

                    <tr>

                      <th className="text-left px-4 py-4">
                        Month
                      </th>

                      <th className="text-right px-4 py-4">
                        Client Payment
                      </th>

                      <th className="text-right px-4 py-4">
                        JobHIR Commission
                      </th>

                      <th className="text-right px-4 py-4">
                        Worker Share
                      </th>

                    </tr>

                  </thead>

                  <tbody>

                    {revenue.monthlyBreakdown.map(
                      (item, index) => (
                        <tr
                          key={`${item.month}-${index}`}
                          className="border-t border-slate-200 hover:bg-slate-50"
                        >

                          <td className="px-4 py-4 font-semibold text-slate-900">
                            {item.month || "-"}
                          </td>

                          <td className="px-4 py-4 text-right font-semibold">
                            {formatMoney(
                              item.payment
                            )}
                          </td>

                          <td className="px-4 py-4 text-right font-semibold text-green-600">
                            {formatMoney(
                              item.commission
                            )}
                          </td>

                          <td className="px-4 py-4 text-right font-semibold text-blue-600">
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

            ) : (

              <div className="p-8 text-center">

                <p className="font-semibold text-slate-700">
                  No revenue data available
                </p>

                <p className="text-sm text-slate-500 mt-1">
                  Client payments add hone ke baad monthly
                  report yahan show hogi.
                </p>

              </div>

            )}

          </div>

        </section>

        {/* =================================================
            GLOBAL WORKER DIRECTORY
        ================================================= */}

        <section className="mt-8">

          <div className="bg-white border border-slate-200 shadow-sm p-6">

            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">

              <div>

                <h3 className="text-xl font-bold text-slate-900">
                  Global Worker Directory
                </h3>

                <p className="text-sm text-slate-500 mt-1">
                  State, district, work type, payment,
                  verification aur skill ke according workers manage karein.
                </p>

              </div>

              <Link
                to="/admin/workers"
                className="inline-flex items-center justify-center bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 font-semibold transition"
              >
                View All Workers →
              </Link>

            </div>

          </div>

        </section>

        {/* =================================================
            QUICK ACTIONS
        ================================================= */}

        <section className="mt-8">

          <h3 className="text-xl font-bold text-slate-900 mb-4">
            Quick Actions
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">

            {/* WORKERS */}

            <Link
              to="/admin/workers"
              className="bg-blue-600 hover:bg-blue-700 text-white p-5 transition"
            >

              <h4 className="font-bold text-lg">
                Manage Workers
              </h4>

              <p className="text-sm text-blue-100 mt-1">
                Sabhi states aur districts ke workers
                dekhein aur manage karein.
              </p>

            </Link>

            {/* VERIFICATION */}

            <Link
              to="/admin/workers?verificationStatus=Pending"
              className="bg-purple-600 hover:bg-purple-700 text-white p-5 transition"
            >

              <h4 className="font-bold text-lg">
                Worker Verification
              </h4>

              <p className="text-sm text-purple-100 mt-1">
                Pending workers ki KYC aur skill
                verification karein.
              </p>

            </Link>

            {/* JOBS */}

            <Link
              to="/admin/delete"
              className="bg-red-600 hover:bg-red-700 text-white p-5 transition"
            >

              <h4 className="font-bold text-lg">
                Manage Jobs
              </h4>

              <p className="text-sm text-red-100 mt-1">
                Posted jobs dekhein aur manage karein.
              </p>

            </Link>

          </div>

        </section>

        {/* =================================================
            REFRESH
        ================================================= */}

        <div className="mt-8 flex justify-end">

          <button
            onClick={fetchDashboard}
            className="bg-white border border-slate-300 text-slate-700 px-5 py-2.5 font-semibold hover:bg-slate-50 transition"
          >
            Refresh Dashboard
          </button>

        </div>

      </main>

    </div>
  );
}

// =====================================================
// STAT CARD
// =====================================================

function StatCard({
  title,
  value,
  description,
  valueClass = "text-slate-900",
}) {
  return (
    <div className="bg-white border border-slate-200 shadow-sm p-5">

      <p className="text-sm font-medium text-slate-500">
        {title}
      </p>

      <h3
        className={`text-3xl font-bold mt-2 ${valueClass}`}
      >
        {value}
      </h3>

      <p className="text-xs text-slate-400 mt-2">
        {description}
      </p>

    </div>
  );
}

// =====================================================
// MONEY CARD
// =====================================================

function MoneyCard({
  title,
  value,
  description,
  valueClass = "text-slate-900",
  showRupee = true,
}) {
  const displayValue =
    showRupee && typeof value === "number"
      ? `₹${Number(value || 0).toLocaleString("en-IN")}`
      : value;

  return (
    <div className="bg-white border border-slate-200 shadow-sm p-5">

      <p className="text-sm font-medium text-slate-500">
        {title}
      </p>

      <h3
        className={`text-2xl sm:text-3xl font-bold mt-2 ${valueClass}`}
      >
        {displayValue}
      </h3>

      <p className="text-xs text-slate-400 mt-2">
        {description}
      </p>

    </div>
  );
}