
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const API_URL = "https://jbackend-h963.onrender.com";

const VERIFICATION_STATUSES = [
  "Pending",
  "Under Review",
  "Verified",
  "Need More Information",
  "Rejected",
];

const SKILL_LEVELS = [
  "Expert",
  "Skilled",
  "Semi-Skilled",
  "Helper",
];

export default function DimapurWorkers() {
  const navigate = useNavigate();

  const [workers, setWorkers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [filters, setFilters] = useState({
    workType: "",
    paymentStatus: "",
    status: "",
    verificationStatus: "",
    skillLevel: "",
    search: "",
  });

  const [selectedWorker, setSelectedWorker] = useState(null);
  const [detailLoading, setDetailLoading] = useState(false);

  // =====================================================
  // AUTH
  // =====================================================

  const getAdminToken = () => {
    const token = localStorage.getItem("adminToken");

    if (!token) {
      navigate("/admin/login");
      return null;
    }

    try {
      const adminUser = JSON.parse(
        localStorage.getItem("adminUser") || "{}"
      );

      if (adminUser?.role !== "dimapur_admin") {
        navigate("/admin/dashboard");
        return null;
      }
    } catch {
      navigate("/admin/login");
      return null;
    }

    return token;
  };

  const handleAuthError = () => {
    localStorage.removeItem("adminToken");
    localStorage.removeItem("adminUser");

    navigate("/admin/login");
  };

  // =====================================================
  // FETCH DIMAPUR WORKERS
  // =====================================================

  const fetchWorkers = async (customFilters = filters) => {
    try {
      setLoading(true);
      setError("");

      const token = getAdminToken();

      if (!token) return;

      const params = new URLSearchParams();

      if (customFilters.workType) {
        params.append(
          "workType",
          customFilters.workType
        );
      }

      if (customFilters.paymentStatus) {
        params.append(
          "paymentStatus",
          customFilters.paymentStatus
        );
      }

      if (customFilters.status) {
        params.append(
          "status",
          customFilters.status
        );
      }

      if (customFilters.verificationStatus) {
        params.append(
          "verificationStatus",
          customFilters.verificationStatus
        );
      }

      if (customFilters.skillLevel) {
        params.append(
          "skillLevel",
          customFilters.skillLevel
        );
      }

      if (customFilters.search.trim()) {
        params.append(
          "search",
          customFilters.search.trim()
        );
      }

      const query = params.toString();

      const url =
        `${API_URL}/admin/dimapur/workers` +
        (query ? `?${query}` : "");

      const response = await fetch(url, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (
        response.status === 401 ||
        response.status === 403
      ) {
        handleAuthError();
        return;
      }

      if (!response.ok || !data.success) {
        throw new Error(
          data.message || "Failed to load workers"
        );
      }

      setWorkers(data.workers || []);
    } catch (err) {
      console.error(
        "DIMAPUR WORKERS ERROR:",
        err
      );

      setError(
        err.message ||
          "Workers load nahi ho sake."
      );
    } finally {
      setLoading(false);
    }
  };

  // =====================================================
  // INITIAL LOAD
  // =====================================================

  useEffect(() => {
    fetchWorkers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // =====================================================
  // FILTER CHANGE
  // =====================================================

  const handleFilterChange = (e) => {
    const { name, value } = e.target;

    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // =====================================================
  // VIEW WORKER
  // =====================================================

  const viewWorker = async (workerId) => {
    try {
      const token = getAdminToken();

      if (!token) return;

      setDetailLoading(true);
      setError("");

      const response = await fetch(
        `${API_URL}/admin/workers/${workerId}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (
        response.status === 401 ||
        response.status === 403
      ) {
        handleAuthError();
        return;
      }

      if (!response.ok || !data.success) {
        throw new Error(
          data.message ||
            "Failed to load worker"
        );
      }

      setSelectedWorker(data.worker);
    } catch (err) {
      console.error(
        "WORKER DETAIL ERROR:",
        err
      );

      alert(
        err.message ||
          "Worker details load nahi ho sake."
      );
    } finally {
      setDetailLoading(false);
    }
  };

  // =====================================================
  // CLEAR FILTERS
  // =====================================================

  const clearFilters = () => {
    const emptyFilters = {
      workType: "",
      paymentStatus: "",
      status: "",
      verificationStatus: "",
      skillLevel: "",
      search: "",
    };

    setFilters(emptyFilters);

    fetchWorkers(emptyFilters);
  };

  // =====================================================
  // BADGES
  // =====================================================

  const paymentBadge = (status) => {
    if (status === "PAID") {
      return (
        <span className="inline-flex border border-green-200 bg-green-50 px-2.5 py-1 text-xs font-semibold text-green-700">
          PAID
        </span>
      );
    }

    if (status === "FAILED") {
      return (
        <span className="inline-flex border border-red-200 bg-red-50 px-2.5 py-1 text-xs font-semibold text-red-700">
          FAILED
        </span>
      );
    }

    return (
      <span className="inline-flex border border-yellow-200 bg-yellow-50 px-2.5 py-1 text-xs font-semibold text-yellow-700">
        PENDING
      </span>
    );
  };

  const statusBadge = (status) => {
    if (status === "Active") {
      return (
        <span className="inline-flex border border-blue-200 bg-blue-50 px-2.5 py-1 text-xs font-semibold text-blue-700">
          Active
        </span>
      );
    }

    if (status === "Blocked") {
      return (
        <span className="inline-flex border border-red-200 bg-red-50 px-2.5 py-1 text-xs font-semibold text-red-700">
          Blocked
        </span>
      );
    }

    return (
      <span className="inline-flex border border-orange-200 bg-orange-50 px-2.5 py-1 text-xs font-semibold text-orange-700">
        Pending
      </span>
    );
  };

  const verificationBadge = (status) => {
    if (status === "Verified") {
      return (
        <span className="inline-flex border border-green-200 bg-green-50 px-2.5 py-1 text-xs font-semibold text-green-700">
          Verified
        </span>
      );
    }

    if (status === "Under Review") {
      return (
        <span className="inline-flex border border-blue-200 bg-blue-50 px-2.5 py-1 text-xs font-semibold text-blue-700">
          Under Review
        </span>
      );
    }

    if (status === "Rejected") {
      return (
        <span className="inline-flex border border-red-200 bg-red-50 px-2.5 py-1 text-xs font-semibold text-red-700">
          Rejected
        </span>
      );
    }

    if (
      status === "Need More Information"
    ) {
      return (
        <span className="inline-flex border border-yellow-200 bg-yellow-50 px-2.5 py-1 text-xs font-semibold text-yellow-700">
          Need More Information
        </span>
      );
    }

    return (
      <span className="inline-flex border border-orange-200 bg-orange-50 px-2.5 py-1 text-xs font-semibold text-orange-700">
        Pending
      </span>
    );
  };

  const skillBadge = (level) => {
    if (!level) {
      return (
        <span className="text-xs text-gray-400">
          Not Assessed
        </span>
      );
    }

    return (
      <span className="inline-flex border border-purple-200 bg-purple-50 px-2.5 py-1 text-xs font-semibold text-purple-700">
        {level}
      </span>
    );
  };

  const formatDate = (date) => {
    if (!date) return "-";

    return new Date(date).toLocaleDateString(
      "en-IN",
      {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }
    );
  };

  const formatDateTime = (date) => {
    if (!date) return "-";

    return new Date(date).toLocaleString(
      "en-IN",
      {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }
    );
  };

  // =====================================================
  // LOGOUT
  // =====================================================

  const logout = () => {
    localStorage.removeItem("adminToken");
    localStorage.removeItem("adminUser");

    navigate("/admin/login");
  };

  return (
    <div className="min-h-screen bg-slate-100">

      {/* HEADER */}
      <header className="border-b border-slate-200 bg-slate-900 text-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6">

          <div>
            <h1 className="text-xl font-bold">
              JobHIR Admin
            </h1>

            <p className="mt-1 text-sm text-slate-400">
              Dimapur, Nagaland — Worker Management
            </p>
          </div>

          <div className="flex gap-2">

            <Link
              to="/admin/dimapur"
              className="bg-slate-700 px-4 py-2 text-sm font-semibold hover:bg-slate-600"
            >
              Dashboard
            </Link>

            <button
              onClick={logout}
              className="bg-red-600 px-4 py-2 text-sm font-semibold hover:bg-red-700"
            >
              Logout
            </button>

          </div>

        </div>
      </header>

      {/* MAIN */}
      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6">

        <div className="mb-6">
          <h2 className="text-2xl font-bold text-slate-900">
            Dimapur Workers
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Workers from Dimapur, Nagaland only.
          </p>
        </div>

        {/* FILTERS */}

        <div className="mb-6 border border-slate-200 bg-white p-5">

          <h3 className="mb-4 text-lg font-bold">
            Search & Filters
          </h3>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">

            <div>
              <label className="mb-1 block text-sm font-medium">
                Worker Name / Mobile
              </label>

              <input
                type="text"
                name="search"
                value={filters.search}
                onChange={handleFilterChange}
                placeholder="Search worker..."
                className="w-full border border-slate-300 px-3 py-2.5 outline-none focus:border-bl

