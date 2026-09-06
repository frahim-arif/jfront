import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const API_URL = "https://jbackend-h963.onrender.com";

export default function AdminDashboard() {
  const navigate = useNavigate();

  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchStats = async () => {
    try {
      setLoading(true);
      setError("");

      const token = localStorage.getItem("adminToken");

      if (!token) {
        navigate("/admin/login");
        return;
      }

      const response = await fetch(`${API_URL}/admin/stats`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (response.status === 401 || response.status === 403) {
        localStorage.removeItem("adminToken");
        localStorage.removeItem("adminUser");

        navigate("/admin/login");
        return;
      }

      if (!response.ok || !data.success) {
        throw new Error(
          data.message || "Failed to load dashboard"
        );
      }

      setStats(data.stats);
    } catch (err) {
      console.error("ADMIN DASHBOARD ERROR:", err);

      setError(
        err.message || "Dashboard load nahi ho saka."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    localStorage.removeItem("adminUser");

    navigate("/admin/login");
  };

  const adminUser = JSON.parse(
    localStorage.getItem("adminUser") || "{}"
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-100 flex items-center justify-center">
        <div className="bg-white rounded-xl shadow p-8 text-center">
          <div className="w-10 h-10 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>

          <p className="text-slate-600">
            Loading Admin Dashboard...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100">
      {/* HEADER */}
      <header className="bg-slate-900 text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold">
                JobHIR Admin
              </h1>

              <p className="text-sm text-slate-400 mt-1">
                Worker Management Dashboard
              </p>
            </div>

            <div className="flex items-center gap-3">
              <div className="hidden sm:block text-right">
                <p className="text-sm text-slate-300">
                  Logged in as
                </p>

                <p className="font-semibold">
                  {adminUser?.username || "Admin"}
                </p>
              </div>

              <button
                onClick={handleLogout}
                className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg text-sm font-semibold transition"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* CONTENT */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
        {/* ERROR */}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-700 rounded-xl p-4">
            <p className="font-semibold">
              Dashboard Error
            </p>

            <p className="text-sm mt-1">
              {error}
            </p>

            <button
              onClick={fetchStats}
              className="mt-3 bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-red-700"
            >
              Try Again
            </button>
          </div>
        )}

        {/* PAGE TITLE */}
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-slate-900">
            Dashboard
          </h2>

          <p className="text-slate-500 mt-1">
            JobHIR workers aur registrations ka overview
          </p>
        </div>

        {/* MAIN STATS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {/* TOTAL WORKERS */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5">
            <p className="text-sm font-medium text-slate-500">
              Total Workers
            </p>

            <h3 className="text-3xl font-bold text-slate-900 mt-2">
              {stats?.totalWorkers ?? 0}
            </h3>

            <p className="text-xs text-slate-400 mt-2">
              All registered workers
            </p>
          </div>

          {/* PAID */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5">
            <p className="text-sm font-medium text-slate-500">
              Paid Workers
            </p>

            <h3 className="text-3xl font-bold text-green-600 mt-2">
              {stats?.paidWorkers ?? 0}
            </h3>

            <p className="text-xs text-slate-400 mt-2">
              Payment completed
            </p>
          </div>

          {/* PENDING PAYMENT */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5">
            <p className="text-sm font-medium text-slate-500">
              Pending Payment
            </p>

            <h3 className="text-3xl font-bold text-orange-500 mt-2">
              {stats?.pendingPayment ?? 0}
            </h3>

            <p className="text-xs text-slate-400 mt-2">
              Payment not completed
            </p>
          </div>

          {/* ACTIVE */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5">
            <p className="text-sm font-medium text-slate-500">
              Active Workers
            </p>

            <h3 className="text-3xl font-bold text-blue-600 mt-2">
              {stats?.activeWorkers ?? 0}
            </h3>

            <p className="text-xs text-slate-400 mt-2">
              Currently active
            </p>
          </div>

          {/* PENDING */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5">
            <p className="text-sm font-medium text-slate-500">
              Pending Workers
            </p>

            <h3 className="text-3xl font-bold text-yellow-600 mt-2">
              {stats?.pendingWorkers ?? 0}
            </h3>

            <p className="text-xs text-slate-400 mt-2">
              Waiting for approval
            </p>
          </div>

          {/* BLOCKED */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5">
            <p className="text-sm font-medium text-slate-500">
              Blocked Workers
            </p>

            <h3 className="text-3xl font-bold text-red-600 mt-2">
              {stats?.blockedWorkers ?? 0}
            </h3>

            <p className="text-xs text-slate-400 mt-2">
              Blocked accounts
            </p>
          </div>
        </div>

        {/* LOCATION STATS */}
        <div className="mt-8">
          <h3 className="text-xl font-bold text-slate-900 mb-4">
            Location Overview
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {/* UP */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
              <p className="text-sm font-medium text-slate-500">
                Uttar Pradesh Workers
              </p>

              <div className="flex items-end justify-between mt-3">
                <h3 className="text-4xl font-bold text-slate-900">
                  {stats?.upWorkers ?? 0}
                </h3>

                <span className="text-sm text-blue-600 font-semibold">
                  UP
                </span>
              </div>

              <Link
                to="/admin/workers?state=Uttar%20Pradesh"
                className="inline-block mt-5 text-sm font-semibold text-blue-600 hover:text-blue-800"
              >
                View UP Workers →
              </Link>
            </div>

            {/* NOIDA */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
              <p className="text-sm font-medium text-slate-500">
                Noida Workers
              </p>

              <div className="flex items-end justify-between mt-3">
                <h3 className="text-4xl font-bold text-slate-900">
                  {stats?.noidaWorkers ?? 0}
                </h3>

                <span className="text-sm text-green-600 font-semibold">
                  Noida
                </span>
              </div>

              <Link
                to="/admin/workers?state=Uttar%20Pradesh&district=Noida"
                className="inline-block mt-5 text-sm font-semibold text-green-600 hover:text-green-800"
              >
                View Noida Workers →
              </Link>
            </div>
          </div>
        </div>

        {/* QUICK ACTIONS */}
        <div className="mt-8">
          <h3 className="text-xl font-bold text-slate-900 mb-4">
            Quick Actions
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <Link
              to="/admin/workers"
              className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl p-5 transition"
            >
              <h4 className="font-bold text-lg">
                Manage Workers
              </h4>

              <p className="text-sm text-blue-100 mt-1">
                Workers dekhein, search karein aur status manage karein.
              </p>
            </Link>

            <Link
              to="/admin/workers?state=Uttar%20Pradesh&district=Noida"
              className="bg-green-600 hover:bg-green-700 text-white rounded-xl p-5 transition"
            >
              <h4 className="font-bold text-lg">
                Noida Workers
              </h4>

              <p className="text-sm text-green-100 mt-1">
                Noida, Uttar Pradesh ke registered workers dekhein.
              </p>
            </Link>

            <Link
              to="/admin/delete"
              className="bg-red-600 hover:bg-red-700 text-white rounded-xl p-5 transition"
            >
              <h4 className="font-bold text-lg">
                Manage Jobs
              </h4>

              <p className="text-sm text-red-100 mt-1">
                Posted jobs dekhein aur manage karein.
              </p>
            </Link>
          </div>
        </div>

        {/* REFRESH */}
        <div className="mt-8 flex justify-end">
          <button
            onClick={fetchStats}
            className="bg-white border border-slate-300 text-slate-700 px-5 py-2.5 rounded-lg font-semibold hover:bg-slate-50 transition"
          >
            Refresh Dashboard
          </button>
        </div>
      </main>
    </div>
  );
}