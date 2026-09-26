
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
                className="w-full border border-slate-300 px-3 py-2.5 outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium">
                Work Type
              </label>

              <select
                name="workType"
                value={filters.workType}
                onChange={handleFilterChange}
                className="w-full border border-slate-300 px-3 py-2.5"
              >
                <option value="">
                  All Work Types
                </option>

                <option value="Mason">Mason</option>
                <option value="Carpenter">
                  Carpenter
                </option>
                <option value="Painter">
                  Painter
                </option>
                <option value="Electrician">
                  Electrician
                </option>
                <option value="Plumber">
                  Plumber
                </option>
                <option value="Gardener">
                  Gardener
                </option>
                <option value="Cleaner">
                  Cleaner
                </option>
                <option value="Welder">
                  Welder
                </option>
                <option value="Driver">
                  Driver
                </option>
                <option value="Construction Worker">
                  Construction Worker
                </option>
                <option value="Helper">
                  Helper
                </option>
                <option value="AC Technician">
                  AC Technician
                </option>
                <option value="Mechanic">
                  Mechanic
                </option>
                <option value="Tiles Worker">
                  Tiles Worker
                </option>
                <option value="Furniture Worker">
                  Furniture Worker
                </option>
                <option value="Home Care">
                  Home Care
                </option>
                <option value="Graphic Designer">
                  Graphic Designer
                </option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium">
                Payment
              </label>

              <select
                name="paymentStatus"
                value={filters.paymentStatus}
                onChange={handleFilterChange}
                className="w-full border border-slate-300 px-3 py-2.5"
              >
                <option value="">
                  All Payments
                </option>

                <option value="PAID">Paid</option>
                <option value="PENDING">
                  Pending
                </option>
                <option value="FAILED">
                  Failed
                </option>
              </select>
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium">
                Account Status
              </label>

              <select
                name="status"
                value={filters.status}
                onChange={handleFilterChange}
                className="w-full border border-slate-300 px-3 py-2.5"
              >
                <option value="">
                  All Status
                </option>

                <option value="Active">
                  Active
                </option>

                <option value="Pending">
                  Pending
                </option>

                <option value="Blocked">
                  Blocked
                </option>
              </select>
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium">
                Verification
              </label>

              <select
                name="verificationStatus"
                value={filters.verificationStatus}
                onChange={handleFilterChange}
                className="w-full border border-slate-300 px-3 py-2.5"
              >
                <option value="">
                  All Verification
                </option>

                {VERIFICATION_STATUSES.map(
                  (status) => (
                    <option
                      key={status}
                      value={status}
                    >
                      {status}
                    </option>
                  )
                )}
              </select>
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium">
                Skill Level
              </label>

              <select
                name="skillLevel"
                value={filters.skillLevel}
                onChange={handleFilterChange}
                className="w-full border border-slate-300 px-3 py-2.5"
              >
                <option value="">
                  All Skill Levels
                </option>

                {SKILL_LEVELS.map(
                  (level) => (
                    <option
                      key={level}
                      value={level}
                    >
                      {level}
                    </option>
                  )
                )}
              </select>
            </div>

          </div>

          <div className="mt-5 flex flex-wrap gap-3">

            <button
              onClick={() => fetchWorkers(filters)}
              className="bg-blue-600 px-6 py-2.5 font-semibold text-white hover:bg-blue-700"
            >
              Apply Filters
            </button>

            <button
              onClick={clearFilters}
              className="bg-slate-200 px-6 py-2.5 font-semibold text-slate-800 hover:bg-slate-300"
            >
              Clear
            </button>

            <button
              onClick={() => fetchWorkers(filters)}
              className="bg-green-600 px-6 py-2.5 font-semibold text-white hover:bg-green-700"
            >
              Refresh
            </button>

          </div>

        </div>

        {/* ERROR */}

        {error && (
          <div className="mb-6 border border-red-200 bg-red-50 p-4 text-red-700">
            <p className="font-semibold">
              Error
            </p>

            <p className="mt-1 text-sm">
              {error}
            </p>
          </div>
        )}

        {/* COUNT */}

        <div className="mb-4 flex items-center justify-between">

          <h3 className="text-lg font-bold">
            Workers
          </h3>

          <span className="bg-blue-100 px-3 py-1 text-sm font-semibold text-blue-700">
            {workers.length} Workers
          </span>

        </div>

        {/* LOADING */}

        {loading ? (
          <div className="border border-slate-200 bg-white p-10 text-center">

            <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-4 border-blue-200 border-t-blue-600" />

            <p className="text-slate-500">
              Loading workers...
            </p>

          </div>
        ) : workers.length === 0 ? (
          <div className="border border-slate-200 bg-white p-10 text-center">

            <h3 className="text-lg font-bold">
              No workers found
            </h3>

            <p className="mt-1 text-sm text-slate-500">
              Dimapur workers nahi mile.
            </p>

          </div>
        ) : (

          /* TABLE */

          <div className="overflow-hidden border border-slate-200 bg-white shadow-sm">

            <div className="overflow-x-auto">

              <table className="w-full text-sm">

                <thead className="bg-slate-900 text-white">

                  <tr>

                    <th className="px-4 py-4 text-left">
                      Worker
                    </th>

                    <th className="px-4 py-4 text-left">
                      Location
                    </th>

                    <th className="px-4 py-4 text-left">
                      Work
                    </th>

                    <th className="px-4 py-4 text-left">
                      Payment
                    </th>

                    <th className="px-4 py-4 text-left">
                      Verification
                    </th>

                    <th className="px-4 py-4 text-left">
                      Skill
                    </th>

                    <th className="px-4 py-4 text-left">
                      Status
                    </th>

                    <th className="px-4 py-4 text-left">
                      Action
                    </th>

                  </tr>

                </thead>

                <tbody>

                  {workers.map((worker) => (

                    <tr
                      key={worker._id}
                      className="border-t border-slate-200 hover:bg-slate-50"
                    >

                      <td className="px-4 py-4">

                        <p className="font-bold text-slate-900">
                          {worker.name || "-"}
                        </p>

                        <p className="mt-1 text-xs text-slate-500">
                          {worker.mobile || "-"}
                        </p>

                      </td>

                      <td className="px-4 py-4">

                        <p className="font-medium">
                          {worker.district || "-"}
                        </p>

                        <p className="text-xs text-slate-500">
                          {worker.state || "-"}
                        </p>

                      </td>

                      <td className="px-4 py-4">
                        {worker.workType || "-"}
                      </td>

                      <td className="px-4 py-4">

                        {paymentBadge(
                          worker.paymentStatus
                        )}

                        <p className="mt-1 text-xs text-slate-500">
                          ₹
                          {Number(
                            worker.paymentAmount || 0
                          ) / 100}
                        </p>

                      </td>

                      <td className="px-4 py-4">

                        {verificationBadge(
                          worker.verificationStatus
                        )}

                        <p className="mt-1 text-xs text-slate-500">
                          Score:{" "}
                          {worker.verificationScore ??
                            0}
                          /100
                        </p>

                      </td>

                      <td className="px-4 py-4">

                        {skillBadge(
                          worker.skillLevel
                        )}

                        <p className="mt-1 text-xs text-slate-500">
                          {worker.experienceYears ??
                            0}{" "}
                          yrs
                        </p>

                      </td>

                      <td className="px-4 py-4">
                        {statusBadge(
                          worker.status
                        )}
                      </td>

                      <td className="px-4 py-4">

                        <button
                          onClick={() =>
                            viewWorker(
                              worker._id
                            )
                          }
                          className="bg-slate-900 px-4 py-2 text-xs font-semibold text-white hover:bg-slate-800"
                        >
                          View
                        </button>

                      </td>

                    </tr>

                  ))}

                </tbody>

              </table>

            </div>

          </div>

        )}

      </main>

      {/* =====================================================
          WORKER DETAIL MODAL
      ===================================================== */}

      {selectedWorker && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">

          <div className="max-h-[94vh] w-full max-w-5xl overflow-y-auto bg-white shadow-2xl">

            {/* HEADER */}

            <div className="sticky top-0 z-10 flex items-center justify-between bg-slate-900 px-5 py-4 text-white">

              <div>
                <h2 className="text-xl font-bold">
                  Worker Details
                </h2>

                <p className="mt-1 text-sm text-slate-400">
                  {selectedWorker.name || "-"}
                </p>
              </div>

              <button
                onClick={() =>
                  setSelectedWorker(null)
                }
                className="text-2xl hover:text-red-300"
              >
                ×
              </button>

            </div>

            {/* DETAILS */}

            <div className="p-5">

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">

                <DetailItem
                  label="Name"
                  value={selectedWorker.name}
                />

                <DetailItem
                  label="Mobile"
                  value={selectedWorker.mobile}
                />

                <DetailItem
                  label="Email"
                  value={selectedWorker.email}
                />

                <DetailItem
                  label="State"
                  value={selectedWorker.state}
                />

                <DetailItem
                  label="District"
                  value={selectedWorker.district}
                />

                <DetailItem
                  label="Work Type"
                  value={selectedWorker.workType}
                />

                <DetailItem
                  label="KYC Type"
                  value={selectedWorker.kycType}
                />

                <DetailItem
                  label="KYC Number"
                  value={selectedWorker.kycNumber}
                />

                <DetailItem
                  label="Payment Status"
                  value={selectedWorker.paymentStatus}
                />

                <DetailItem
                  label="Payment Amount"
                  value={`₹${
                    Number(
                      selectedWorker.paymentAmount ||
                        0
                    ) / 100
                  }`}
                />

                <DetailItem
                  label="Account Status"
                  value={selectedWorker.status}
                />

                <DetailItem
                  label="Verification"
                  value={
                    selectedWorker.verificationStatus ||
                    "Pending"
                  }
                />

                <DetailItem
                  label="Skill Level"
                  value={
                    selectedWorker.skillLevel ||
                    "Not Assessed"
                  }
                />

                <DetailItem
                  label="Verification Score"
                  value={`${selectedWorker.verificationScore ?? 0}/100`}
                />

                <DetailItem
                  label="Experience"
                  value={`${selectedWorker.experienceYears ?? 0} years`}
                />

                <DetailItem
                  label="KYC Verified"
                  value={
                    selectedWorker.kycVerified
                      ? "Yes"
                      : "No"
                  }
                />

                <DetailItem
                  label="Skill Verified"
                  value={
                    selectedWorker.skillVerified
                      ? "Yes"
                      : "No"
                  }
                />

                <DetailItem
                  label="Registered"
                  value={formatDateTime(
                    selectedWorker.createdAt
                  )}
                />

                <DetailItem
                  label="Paid At"
                  value={formatDateTime(
                    selectedWorker.paidAt
                  )}
                />

                <DetailItem
                  label="Merchant Order ID"
                  value={
                    selectedWorker.merchantOrderId ||
                    "-"
                  }
                />

              </div>

              {/* KYC DOCUMENT */}

              {selectedWorker.kycDocument && (
                <div className="mt-6 border border-blue-200 bg-blue-50 p-4">

                  <h3 className="mb-2 font-bold">
                    KYC Document
                  </h3>

                  <a
                    href={`${API_URL}${selectedWorker.kycDocument}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block bg-blue-600 px-5 py-2.5 font-semibold text-white hover:bg-blue-700"
                  >
                    View KYC Document
                  </a>

                </div>
              )}

              {/* NOTES */}

              {selectedWorker.adminNotes && (
                <div className="mt-6 border border-slate-200 bg-slate-50 p-4">

                  <h3 className="font-bold">
                    Admin Notes
                  </h3>

                  <p className="mt-2 text-sm text-slate-600">
                    {selectedWorker.adminNotes}
                  </p>

                </div>
              )}

              <div className="mt-6 flex justify-end">

                <button
                  onClick={() =>
                    setSelectedWorker(null)
                  }
                  className="bg-slate-200 px-6 py-2.5 font-semibold hover:bg-slate-300"
                >
                  Close
                </button>

              </div>

            </div>

          </div>

        </div>
      )}

    </div>
  );
}

// =====================================================
// DETAIL ITEM
// =====================================================

function DetailItem({ label, value }) {
  return (
    <div className="border border-slate-200 bg-slate-50 p-3">

      <p className="text-xs font-medium text-slate-500">
        {label}
      </p>

      <p className="mt-1 break-words text-sm font-semibold text-slate-900">
        {value || "-"}
      </p>

    </div>
  );
}

