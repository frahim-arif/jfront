import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";

const API_URL = "https://jbackend-h963.onrender.com";

export default function AdminWorkers() {
  const [searchParams, setSearchParams] = useSearchParams();

  const [workers, setWorkers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);
  const [error, setError] = useState("");

  const [filters, setFilters] = useState({
    state: searchParams.get("state") || "",
    district: searchParams.get("district") || "",
    workType: "",
    paymentStatus: "",
    status: "",
    search: "",
  });

  const [selectedWorker, setSelectedWorker] = useState(null);
  const [detailLoading, setDetailLoading] = useState(false);

  // =========================
  // FETCH WORKERS
  // =========================
  const fetchWorkers = async (customFilters = filters) => {
    try {
      setLoading(true);
      setError("");

      const token = localStorage.getItem("adminToken");

      if (!token) {
        window.location.href = "/admin/login";
        return;
      }

      const params = new URLSearchParams();

      if (customFilters.state) {
        params.append("state", customFilters.state);
      }

      if (customFilters.district) {
        params.append("district", customFilters.district);
      }

      if (customFilters.workType) {
        params.append("workType", customFilters.workType);
      }

      if (customFilters.paymentStatus) {
        params.append(
          "paymentStatus",
          customFilters.paymentStatus
        );
      }

      if (customFilters.status) {
        params.append("status", customFilters.status);
      }

      if (customFilters.search.trim()) {
        params.append(
          "search",
          customFilters.search.trim()
        );
      }

      const url = `${API_URL}/admin/workers${
        params.toString()
          ? `?${params.toString()}`
          : ""
      }`;

      const response = await fetch(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (response.status === 401 || response.status === 403) {
        localStorage.removeItem("adminToken");
        localStorage.removeItem("adminUser");

        window.location.href = "/admin/login";
        return;
      }

      if (!response.ok || !data.success) {
        throw new Error(
          data.message || "Failed to load workers"
        );
      }

      setWorkers(data.workers || []);
    } catch (err) {
      console.error("ADMIN WORKERS ERROR:", err);

      setError(
        err.message || "Workers load nahi ho sake."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWorkers(filters);
  }, []);

  // =========================
  // FILTER CHANGE
  // =========================
  const handleFilterChange = (e) => {
    const { name, value } = e.target;

    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // =========================
  // APPLY FILTER
  // =========================
  const applyFilters = () => {
    const params = {};

    Object.entries(filters).forEach(([key, value]) => {
      if (value) {
        params[key] = value;
      }
    });

    setSearchParams(params);

    fetchWorkers(filters);
  };

  // =========================
  // CLEAR FILTER
  // =========================
  const clearFilters = () => {
    const emptyFilters = {
      state: "",
      district: "",
      workType: "",
      paymentStatus: "",
      status: "",
      search: "",
    };

    setFilters(emptyFilters);
    setSearchParams({});

    fetchWorkers(emptyFilters);
  };

  // =========================
  // UPDATE STATUS
  // =========================
  const updateStatus = async (workerId, status) => {
    try {
      const token = localStorage.getItem("adminToken");

      if (!token) {
        window.location.href = "/admin/login";
        return;
      }

      setUpdatingId(workerId);

      const response = await fetch(
        `${API_URL}/admin/workers/${workerId}/status`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            status,
          }),
        }
      );

      const data = await response.json();

      if (response.status === 401 || response.status === 403) {
        localStorage.removeItem("adminToken");
        localStorage.removeItem("adminUser");

        window.location.href = "/admin/login";
        return;
      }

      if (!response.ok || !data.success) {
        throw new Error(
          data.message || "Failed to update status"
        );
      }

      // Update list immediately
      setWorkers((prev) =>
        prev.map((worker) =>
          worker._id === workerId
            ? {
                ...worker,
                status: data.worker.status,
              }
            : worker
        )
      );
    } catch (err) {
      console.error("STATUS UPDATE ERROR:", err);

      alert(
        err.message || "Status update failed"
      );
    } finally {
      setUpdatingId(null);
    }
  };

  // =========================
  // VIEW WORKER DETAILS
  // =========================
  const viewWorker = async (workerId) => {
    try {
      const token = localStorage.getItem("adminToken");

      if (!token) {
        window.location.href = "/admin/login";
        return;
      }

      setDetailLoading(true);

      const response = await fetch(
        `${API_URL}/admin/workers/${workerId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (response.status === 401 || response.status === 403) {
        localStorage.removeItem("adminToken");
        localStorage.removeItem("adminUser");

        window.location.href = "/admin/login";
        return;
      }

      if (!response.ok || !data.success) {
        throw new Error(
          data.message || "Failed to load worker"
        );
      }

      setSelectedWorker(data.worker);
    } catch (err) {
      console.error("WORKER DETAIL ERROR:", err);

      alert(
        err.message || "Worker details load nahi ho sake."
      );
    } finally {
      setDetailLoading(false);
    }
  };

  // =========================
  // PAYMENT BADGE
  // =========================
  const paymentBadge = (status) => {
    if (status === "PAID") {
      return (
        <span className="inline-flex rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700">
          PAID
        </span>
      );
    }

    if (status === "FAILED") {
      return (
        <span className="inline-flex rounded-full bg-red-100 px-3 py-1 text-xs font-semibold text-red-700">
          FAILED
        </span>
      );
    }

    return (
      <span className="inline-flex rounded-full bg-yellow-100 px-3 py-1 text-xs font-semibold text-yellow-700">
        PENDING
      </span>
    );
  };

  // =========================
  // STATUS BADGE
  // =========================
  const statusBadge = (status) => {
    if (status === "Active") {
      return (
        <span className="inline-flex rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-700">
          Active
        </span>
      );
    }

    if (status === "Blocked") {
      return (
        <span className="inline-flex rounded-full bg-red-100 px-3 py-1 text-xs font-semibold text-red-700">
          Blocked
        </span>
      );
    }

    return (
      <span className="inline-flex rounded-full bg-orange-100 px-3 py-1 text-xs font-semibold text-orange-700">
        Pending
      </span>
    );
  };

  // =========================
  // FORMAT DATE
  // =========================
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

  return (
    <div className="min-h-screen bg-slate-100">
      {/* ================= HEADER ================= */}
      <header className="bg-slate-900 text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold">
                JobHIR Admin
              </h1>

              <p className="text-sm text-slate-400 mt-1">
                Worker Management
              </p>
            </div>

            <div className="flex flex-wrap gap-2">
              <Link
                to="/admin/dashboard"
                className="bg-slate-700 hover:bg-slate-600 px-4 py-2 rounded-lg text-sm font-semibold"
              >
                Dashboard
              </Link>

              <button
                onClick={() => {
                  localStorage.removeItem("adminToken");
                  localStorage.removeItem("adminUser");

                  window.location.href =
                    "/admin/login";
                }}
                className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg text-sm font-semibold"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* ================= CONTENT ================= */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
        {/* TITLE */}
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-slate-900">
            Registered Workers
          </h2>

          <p className="text-slate-500 mt-1">
            Search, filter and manage JobHIR workers.
          </p>
        </div>

        {/* ================= FILTER BOX ================= */}
        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-5 mb-6">
          <h3 className="font-bold text-lg text-slate-900 mb-4">
            Search & Filters
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* SEARCH */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Name / Mobile
              </label>

              <input
                type="text"
                name="search"
                value={filters.search}
                onChange={handleFilterChange}
                placeholder="Search worker..."
                className="w-full border border-slate-300 rounded-lg px-3 py-2.5 outline-none focus:border-blue-500"
              />
            </div>

            {/* STATE */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                State
              </label>

              <input
                type="text"
                name="state"
                value={filters.state}
                onChange={handleFilterChange}
                placeholder="e.g. Uttar Pradesh"
                className="w-full border border-slate-300 rounded-lg px-3 py-2.5 outline-none focus:border-blue-500"
              />
            </div>

            {/* DISTRICT */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                District
              </label>

              <input
                type="text"
                name="district"
                value={filters.district}
                onChange={handleFilterChange}
                placeholder="e.g. Noida"
                className="w-full border border-slate-300 rounded-lg px-3 py-2.5 outline-none focus:border-blue-500"
              />
            </div>

            {/* WORK TYPE */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Work Type
              </label>

              <select
                name="workType"
                value={filters.workType}
                onChange={handleFilterChange}
                className="w-full border border-slate-300 rounded-lg px-3 py-2.5 outline-none focus:border-blue-500"
              >
                <option value="">
                  All Work Types
                </option>

                <option value="Mason">Mason</option>
                <option value="Carpenter">Carpenter</option>
                <option value="Painter">Painter</option>
                <option value="Electrician">
                  Electrician
                </option>
                <option value="Plumber">Plumber</option>
                <option value="Gardener">Gardener</option>
                <option value="Cleaner">Cleaner</option>
                <option value="Home Care">Home Care</option>
                <option value="Other">Other</option>
              </select>
            </div>

            {/* PAYMENT */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Payment
              </label>

              <select
                name="paymentStatus"
                value={filters.paymentStatus}
                onChange={handleFilterChange}
                className="w-full border border-slate-300 rounded-lg px-3 py-2.5 outline-none focus:border-blue-500"
              >
                <option value="">
                  All Payments
                </option>

                <option value="PAID">
                  Paid
                </option>

                <option value="PENDING">
                  Pending
                </option>

                <option value="FAILED">
                  Failed
                </option>
              </select>
            </div>

            {/* STATUS */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Worker Status
              </label>

              <select
                name="status"
                value={filters.status}
                onChange={handleFilterChange}
                className="w-full border border-slate-300 rounded-lg px-3 py-2.5 outline-none focus:border-blue-500"
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
          </div>

          {/* BUTTONS */}
          <div className="flex flex-wrap gap-3 mt-5">
            <button
              onClick={applyFilters}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-lg font-semibold"
            >
              Apply Filters
            </button>

            <button
              onClick={clearFilters}
              className="bg-slate-200 hover:bg-slate-300 text-slate-800 px-6 py-2.5 rounded-lg font-semibold"
            >
              Clear
            </button>

            <button
              onClick={() => fetchWorkers(filters)}
              className="bg-green-600 hover:bg-green-700 text-white px-6 py-2.5 rounded-lg font-semibold"
            >
              Refresh
            </button>
          </div>
        </div>

        {/* ================= ERROR ================= */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl p-4 mb-6">
            <p className="font-semibold">
              Error
            </p>

            <p className="text-sm mt-1">
              {error}
            </p>
          </div>
        )}

        {/* ================= COUNT ================= */}
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-slate-900">
            Workers
          </h3>

          <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-semibold">
            {workers.length} Workers
          </span>
        </div>

        {/* ================= LOADING ================= */}
        {loading ? (
          <div className="bg-white rounded-2xl border border-slate-200 p-10 text-center">
            <div className="w-10 h-10 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>

            <p className="text-slate-500">
              Loading workers...
            </p>
          </div>
        ) : workers.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-200 p-10 text-center">
            <h3 className="font-bold text-lg text-slate-800">
              No workers found
            </h3>

            <p className="text-slate-500 mt-1">
              Try changing your filters.
            </p>
          </div>
        ) : (
          <>
            {/* ================= MOBILE CARDS ================= */}
            <div className="grid grid-cols-1 gap-4 md:hidden">
              {workers.map((worker) => (
                <div
                  key={worker._id}
                  className="bg-white border border-slate-200 rounded-2xl shadow-sm p-5"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h3 className="font-bold text-lg text-slate-900">
                        {worker.name}
                      </h3>

                      <p className="text-sm text-slate-500 mt-1">
                        {worker.mobile}
                      </p>
                    </div>

                    {statusBadge(worker.status)}
                  </div>

                  <div className="mt-4 space-y-2 text-sm">
                    <p>
                      <span className="font-semibold">
                        Location:
                      </span>{" "}
                      {worker.district},{" "}
                      {worker.state}
                    </p>

                    <p>
                      <span className="font-semibold">
                        Work:
                      </span>{" "}
                      {worker.workType}
                    </p>

                    <p>
                      <span className="font-semibold">
                        KYC:
                      </span>{" "}
                      {worker.kycType} -{" "}
                      {worker.kycNumber}
                    </p>

                    <p>
                      <span className="font-semibold">
                        Payment:
                      </span>{" "}
                      {paymentBadge(
                        worker.paymentStatus
                      )}
                    </p>

                    <p>
                      <span className="font-semibold">
                        Registered:
                      </span>{" "}
                      {formatDate(worker.createdAt)}
                    </p>
                  </div>

                  {/* STATUS */}
                  <div className="mt-4">
                    <label className="block text-xs font-semibold text-slate-500 mb-1">
                      Change Status
                    </label>

                    <select
                      value={worker.status}
                      disabled={
                        updatingId === worker._id
                      }
                      onChange={(e) =>
                        updateStatus(
                          worker._id,
                          e.target.value
                        )
                      }
                      className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm"
                    >
                      <option value="Pending">
                        Pending
                      </option>

                      <option value="Active">
                        Active
                      </option>

                      <option value="Blocked">
                        Blocked
                      </option>
                    </select>
                  </div>

                  <button
                    onClick={() =>
                      viewWorker(worker._id)
                    }
                    className="mt-4 w-full bg-slate-900 hover:bg-slate-800 text-white py-2.5 rounded-lg font-semibold"
                  >
                    {detailLoading
                      ? "Loading..."
                      : "View Details"}
                  </button>
                </div>
              ))}
            </div>

            {/* ================= DESKTOP TABLE ================= */}
            <div className="hidden md:block bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-slate-900 text-white">
                    <tr>
                      <th className="text-left px-4 py-4">
                        Worker
                      </th>

                      <th className="text-left px-4 py-4">
                        Location
                      </th>

                      <th className="text-left px-4 py-4">
                        Work
                      </th>

                      <th className="text-left px-4 py-4">
                        KYC
                      </th>

                      <th className="text-left px-4 py-4">
                        Payment
                      </th>

                      <th className="text-left px-4 py-4">
                        Status
                      </th>

                      <th className="text-left px-4 py-4">
                        Registered
                      </th>

                      <th className="text-left px-4 py-4">
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
                            {worker.name}
                          </p>

                          <p className="text-slate-500 mt-1">
                            {worker.mobile}
                          </p>
                        </td>

                        <td className="px-4 py-4">
                          <p className="font-medium">
                            {worker.district}
                          </p>

                          <p className="text-xs text-slate-500">
                            {worker.state}
                          </p>
                        </td>

                        <td className="px-4 py-4">
                          {worker.workType}
                        </td>

                        <td className="px-4 py-4">
                          <p className="font-medium">
                            {worker.kycType}
                          </p>

                          <p className="text-xs text-slate-500">
                            {worker.kycNumber}
                          </p>
                        </td>

                        <td className="px-4 py-4">
                          {paymentBadge(
                            worker.paymentStatus
                          )}

                          <p className="text-xs text-slate-500 mt-1">
                            ₹
                            {Number(
                              worker.paymentAmount || 0
                            ) / 100}
                          </p>
                        </td>

                        <td className="px-4 py-4">
                          {statusBadge(worker.status)}

                          <select
                            value={worker.status}
                            disabled={
                              updatingId ===
                              worker._id
                            }
                            onChange={(e) =>
                              updateStatus(
                                worker._id,
                                e.target.value
                              )
                            }
                            className="mt-2 w-full min-w-[110px] border border-slate-300 rounded-md px-2 py-1.5 text-xs"
                          >
                            <option value="Pending">
                              Pending
                            </option>

                            <option value="Active">
                              Active
                            </option>

                            <option value="Blocked">
                              Blocked
                            </option>
                          </select>
                        </td>

                        <td className="px-4 py-4 whitespace-nowrap">
                          {formatDate(
                            worker.createdAt
                          )}
                        </td>

                        <td className="px-4 py-4">
                          <button
                            onClick={() =>
                              viewWorker(
                                worker._id
                              )
                            }
                            className="bg-slate-900 hover:bg-slate-800 text-white px-4 py-2 rounded-lg text-xs font-semibold"
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
          </>
        )}
      </main>

      {/* ================= DETAIL MODAL ================= */}
      {selectedWorker && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl shadow-2xl">
            {/* MODAL HEADER */}
            <div className="sticky top-0 bg-slate-900 text-white px-5 py-4 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold">
                  Worker Details
                </h2>

                <p className="text-sm text-slate-400">
                  {selectedWorker.name}
                </p>
              </div>

              <button
                onClick={() =>
                  setSelectedWorker(null)
                }
                className="text-white text-2xl hover:text-red-300"
              >
                ×
              </button>
            </div>

            {/* MODAL BODY */}
            <div className="p-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <DetailItem
                  label="Name"
                  value={selectedWorker.name}
                />

                <DetailItem
                  label="Mobile"
                  value={selectedWorker.mobile}
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
                  label="Status"
                  value={selectedWorker.status}
                />

                <DetailItem
                  label="Payment Status"
                  value={
                    selectedWorker.paymentStatus
                  }
                />

                <DetailItem
                  label="Payment Amount"
                  value={`₹${
                    Number(
                      selectedWorker.paymentAmount || 0
                    ) / 100
                  }`}
                />

                <DetailItem
                  label="Registered"
                  value={formatDate(
                    selectedWorker.createdAt
                  )}
                />

                <DetailItem
                  label="Paid At"
                  value={formatDate(
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
                <div className="mt-5">
                  <h3 className="font-bold text-slate-900 mb-2">
                    KYC Document
                  </h3>

                  <a
                    href={`${API_URL}${selectedWorker.kycDocument}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg font-semibold"
                  >
                    View KYC Document
                  </a>
                </div>
              )}

              {/* STATUS CONTROL */}
              <div className="mt-6 border-t border-slate-200 pt-5">
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Change Worker Status
                </label>

                <select
                  value={selectedWorker.status}
                  onChange={async (e) => {
                    await updateStatus(
                      selectedWorker._id,
                      e.target.value
                    );

                    setSelectedWorker((prev) =>
                      prev
                        ? {
                            ...prev,
                            status: e.target.value,
                          }
                        : prev
                    );
                  }}
                  className="w-full border border-slate-300 rounded-lg px-3 py-2.5"
                >
                  <option value="Pending">
                    Pending
                  </option>

                  <option value="Active">
                    Active
                  </option>

                  <option value="Blocked">
                    Blocked
                  </option>
                </select>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}


// =========================
// DETAIL ITEM COMPONENT
// =========================

function DetailItem({ label, value }) {
  return (
    <div className="bg-slate-50 border border-slate-200 rounded-lg p-3">
      <p className="text-xs text-slate-500 font-medium">
        {label}
      </p>

      <p className="text-sm font-semibold text-slate-900 mt-1 break-words">
        {value || "-"}
      </p>
    </div>
  );
}