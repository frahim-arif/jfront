
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
} from "lucide-react";

const API_URL = "https://jbackend-h963.onrender.com";

const Dashboard = () => {
  const navigate = useNavigate();

  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const getAdminUser = () => {
    try {
      return JSON.parse(
        localStorage.getItem("adminUser") || "{}"
      );
    } catch {
      return {};
    }
  };

  const fetchStats = async () => {
    try {
      setLoading(true);
      setError("");

      const token = localStorage.getItem("adminToken");
      const adminUser = getAdminUser();

      // Token nahi hai
      if (!token) {
        navigate("/admin/login");
        return;
      }

      // Dimapur admin nahi hai
      if (adminUser?.role !== "dimapur_admin") {
        navigate("/admin/dashboard");
        return;
      }

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
    } catch (error) {
      console.error("DIMAPUR DASHBOARD ERROR:", error);

      if (
        error.message?.toLowerCase().includes("token") ||
        error.message?.toLowerCase().includes("admin")
      ) {
        localStorage.removeItem("adminToken");
        localStorage.removeItem("adminUser");
        navigate("/admin/login");
        return;
      }

      setError(
        error.message || "Unable to load dashboard"
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

  return (
    <div className="min-h-screen bg-gray-100 text-gray-900">

      {/* Header */}
      <header className="border-b border-gray-200 bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">

          {/* Logo / Title */}
          <div>
            <h1 className="text-xl font-bold">
              JobHIR Admin
            </h1>

            <div className="mt-1 flex items-center gap-2 text-sm text-gray-500">
              <MapPin size={16} />
              <span>Dimapur, Nagaland</span>
            </div>
          </div>

          {/* Header Actions */}
          <div className="flex items-center gap-3">

            <Link
              to="/admin/dimapur/workers"
              className="flex items-center gap-2 border border-gray-300 bg-white px-4 py-2 text-sm font-medium hover:bg-gray-50"
            >
              <Users size={17} />
              Workers
            </Link>

            <button
              type="button"
              onClick={fetchStats}
              disabled={loading}
              className="flex items-center gap-2 border border-gray-300 bg-white px-4 py-2 text-sm font-medium hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <RefreshCw
                size={17}
                className={loading ? "animate-spin" : ""}
              />
              Refresh
            </button>

            <button
              type="button"
              onClick={handleLogout}
              className="flex items-center gap-2 bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700"
            >
              <LogOut size={17} />
              Logout
            </button>

          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="mx-auto max-w-7xl px-6 py-8">

        {/* Location Banner */}
        <div className="mb-8 border border-emerald-200 bg-emerald-50 px-5 py-4">
          <div className="flex items-center gap-3">

            <div className="flex h-10 w-10 items-center justify-center bg-emerald-600 text-white">
              <MapPin size={21} />
            </div>

            <div>
              <h2 className="font-semibold text-emerald-900">
                Dimapur Administration
              </h2>

              <p className="text-sm text-emerald-700">
                Managing workers registered in Dimapur,
                Nagaland.
              </p>
            </div>

          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="mb-6 border border-red-200 bg-red-50 px-5 py-4">
            <p className="text-sm font-medium text-red-700">
              {error}
            </p>
          </div>
        )}

        {/* Statistics */}
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

        {/* Verification / Skill Stats */}
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

        {/* Worker Management */}
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
              Manage Workers
              <ArrowRight size={18} />
            </Link>

          </div>

        </div>

      </main>
    </div>
  );
};

export default Dashboard;

