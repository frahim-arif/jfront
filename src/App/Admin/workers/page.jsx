import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";

const API_URL = "https://jbackend-h963.onrender.com";

export default function AdminWorkers() {
  const [searchParams, setSearchParams] =
    useSearchParams();

  const [workers, setWorkers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);
  const [verificationUpdating, setVerificationUpdating] =
    useState(false);
  const [error, setError] = useState("");

  // =====================================================
  // FILTERS
  // =====================================================

  const [filters, setFilters] = useState({
    state: searchParams.get("state") || "",
    district: searchParams.get("district") || "",
    workType: "",
    paymentStatus: "",
    status: "",
    verificationStatus: "",
    skillLevel: "",
    search: "",
  });

  // =====================================================
  // SELECTED WORKER
  // =====================================================

  const [selectedWorker, setSelectedWorker] =
    useState(null);

  const [detailLoading, setDetailLoading] =
    useState(false);

  // =====================================================
  // VERIFICATION FORM
  // =====================================================

  const [verificationForm, setVerificationForm] =
    useState({
      verificationStatus: "Pending",
      skillLevel: "",
      verificationNotes: "",
    });

  // =====================================================
  // ADMIN TOKEN
  // =====================================================

  const getAdminToken = () => {
    const token =
      localStorage.getItem("adminToken");

    if (!token) {
      window.location.href = "/admin/login";
      return null;
    }

    return token;
  };

  // =====================================================
  // HANDLE AUTH ERROR
  // =====================================================

  const handleAuthError = () => {
    localStorage.removeItem("adminToken");
    localStorage.removeItem("adminUser");

    window.location.href = "/admin/login";
  };

  // =====================================================
  // FETCH WORKERS
  // =====================================================

  const fetchWorkers = async (
    customFilters = filters
  ) => {
    try {
      setLoading(true);
      setError("");

      const token = getAdminToken();

      if (!token) return;

      const params = new URLSearchParams();

      if (customFilters.state) {
        params.append(
          "state",
          customFilters.state
        );
      }

      if (customFilters.district) {
        params.append(
          "district",
          customFilters.district
        );
      }

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

      const url =
        `${API_URL}/admin/workers` +
        (params.toString()
          ? `?${params.toString()}`
          : "");

      const response = await fetch(url, {
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

      if (
        !response.ok ||
        !data.success
      ) {
        throw new Error(
          data.message ||
            "Failed to load workers"
        );
      }

      setWorkers(data.workers || []);
    } catch (err) {
      console.error(
        "ADMIN WORKERS ERROR:",
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

  useEffect(() => {
    fetchWorkers(filters);
  }, []);

  // =====================================================
  // FILTER CHANGE
  // =====================================================

  const handleFilterChange = (e) => {
    const {
      name,
      value,
    } = e.target;

    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // =====================================================
  // APPLY FILTERS
  // =====================================================

  const applyFilters = () => {
    const params = {};

    Object.entries(filters).forEach(
      ([key, value]) => {
        if (value) {
          params[key] = value;
        }
      }
    );

    setSearchParams(params);

    fetchWorkers(filters);
  };

  // =====================================================
  // CLEAR FILTERS
  // =====================================================

  const clearFilters = () => {
    const emptyFilters = {
      state: "",
      district: "",
      workType: "",
      paymentStatus: "",
      status: "",
      verificationStatus: "",
      skillLevel: "",
      search: "",
    };

    setFilters(emptyFilters);
    setSearchParams({});

    fetchWorkers(emptyFilters);
  };

  // =====================================================
  // UPDATE ACCOUNT STATUS
  // =====================================================

  const updateStatus = async (
    workerId,
    status
  ) => {
    try {
      const token = getAdminToken();

      if (!token) return;

      setUpdatingId(workerId);

      const response = await fetch(
        `${API_URL}/admin/workers/${workerId}/status`,
        {
          method: "PATCH",
          headers: {
            "Content-Type":
              "application/json",
            Authorization:
              `Bearer ${token}`,
          },
          body: JSON.stringify({
            status,
          }),
        }
      );

      const data =
        await response.json();

      if (
        response.status === 401 ||
        response.status === 403
      ) {
        handleAuthError();
        return;
      }

      if (
        !response.ok ||
        !data.success
      ) {
        throw new Error(
          data.message ||
            "Failed to update status"
        );
      }

      setWorkers((prev) =>
        prev.map((worker) =>
          worker._id === workerId
            ? {
                ...worker,
                status:
                  data.worker.status,
              }
            : worker
        )
      );

      setSelectedWorker((prev) =>
        prev &&
        prev._id === workerId
          ? {
              ...prev,
              status:
                data.worker.status,
            }
          : prev
      );
    } catch (err) {
      console.error(
        "STATUS UPDATE ERROR:",
        err
      );

      alert(
        err.message ||
          "Status update failed"
      );
    } finally {
      setUpdatingId(null);
    }
  };

  // =====================================================
  // VIEW WORKER
  // =====================================================

  const viewWorker = async (
    workerId
  ) => {
    try {
      const token = getAdminToken();

      if (!token) return;

      setDetailLoading(true);

      const response = await fetch(
        `${API_URL}/admin/workers/${workerId}`,
        {
          headers: {
            Authorization:
              `Bearer ${token}`,
          },
        }
      );

      const data =
        await response.json();

      if (
        response.status === 401 ||
        response.status === 403
      ) {
        handleAuthError();
        return;
      }

      if (
        !response.ok ||
        !data.success
      ) {
        throw new Error(
          data.message ||
            "Failed to load worker"
        );
      }

      const worker =
        data.worker;

      setSelectedWorker(worker);

      setVerificationForm({
        verificationStatus:
          worker.verificationStatus ||
          "Pending",

        skillLevel:
          worker.skillLevel || "",

        verificationNotes:
          worker.verificationNotes ||
          "",
      });
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
  // VERIFICATION FORM CHANGE
  // =====================================================

  const handleVerificationChange = (
    e
  ) => {
    const {
      name,
      value,
    } = e.target;

    setVerificationForm(
      (prev) => ({
        ...prev,
        [name]: value,
      })
    );
  };

  // =====================================================
  // SAVE VERIFICATION
  // =====================================================

  const saveVerification = async () => {
    if (!selectedWorker) return;

    try {
      const token =
        getAdminToken();

      if (!token) return;

      // Verified worker must have skill level
      if (
        verificationForm.verificationStatus ===
          "Verified" &&
        !verificationForm.skillLevel
      ) {
        alert(
          "Verified worker ke liye Skill Level select karna zaroori hai."
        );

        return;
      }

      setVerificationUpdating(true);

      const response =
        await fetch(
          `${API_URL}/admin/workers/${selectedWorker._id}/verification`,
          {
            method: "PATCH",

            headers: {
              "Content-Type":
                "application/json",

              Authorization:
                `Bearer ${token}`,
            },

            body: JSON.stringify({
              verificationStatus:
                verificationForm.verificationStatus,

              skillLevel:
                verificationForm.skillLevel ||
                null,

              verificationNotes:
                verificationForm.verificationNotes,
            }),
          }
        );

      const data =
        await response.json();

      if (
        response.status === 401 ||
        response.status === 403
      ) {
        handleAuthError();
        return;
      }

      if (
        !response.ok ||
        !data.success
      ) {
        throw new Error(
          data.message ||
            "Verification update failed"
        );
      }

      // -----------------------------------------------
      // UPDATE SELECTED WORKER
      // -----------------------------------------------

      setSelectedWorker(
        data.worker
      );

      // -----------------------------------------------
      // UPDATE WORKER LIST
      // -----------------------------------------------

      setWorkers((prev) =>
        prev.map((worker) =>
          worker._id ===
          selectedWorker._id
            ? {
                ...worker,
                ...data.worker,
              }
            : worker
        )
      );

      // -----------------------------------------------
      // UPDATE FORM
      // -----------------------------------------------

      setVerificationForm({
        verificationStatus:
          data.worker
            .verificationStatus ||
          "Pending",

        skillLevel:
          data.worker
            .skillLevel || "",

        verificationNotes:
          data.worker
            .verificationNotes || "",
      });

      alert(
        data.message ||
          "Worker verification updated successfully."
      );
    } catch (err) {
      console.error(
        "VERIFICATION UPDATE ERROR:",
        err
      );

      alert(
        err.message ||
          "Worker verification update failed."
      );
    } finally {
      setVerificationUpdating(
        false
      );
    }
  };

  // =====================================================
  // PAYMENT BADGE
  // =====================================================

  const paymentBadge = (
    status
  ) => {
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

  // =====================================================
  // ACCOUNT STATUS BADGE
  // =====================================================

  const statusBadge = (
    status
  ) => {
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

  // =====================================================
  // VERIFICATION BADGE
  // =====================================================

  const verificationBadge = (
    status
  ) => {
    if (status === "Verified") {
      return (
        <span className="inline-flex border border-green-200 bg-green-50 px-2.5 py-1 text-xs font-semibold text-green-700">
          ✓ Verified
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

    return (
      <span className="inline-flex border border-orange-200 bg-orange-50 px-2.5 py-1 text-xs font-semibold text-orange-700">
        Pending
      </span>
    );
  };

  // =====================================================
  // SKILL BADGE
  // =====================================================

  const skillBadge = (
    level
  ) => {
    if (!level) {
      return (
        <span className="text-slate-400 text-xs">
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

  // =====================================================
  // FORMAT DATE
  // =====================================================

  const formatDate = (
    date
  ) => {
    if (!date) return "-";

    return new Date(
      date
    ).toLocaleDateString(
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
                Worker Management &
                Verification
              </p>
            </div>

            <div className="flex flex-wrap gap-2">

              <Link
                to="/admin/dashboard"
                className="bg-slate-700 hover:bg-slate-600 px-4 py-2 text-sm font-semibold"
              >
                Dashboard
              </Link>

              <button
                onClick={() => {
                  localStorage.removeItem(
                    "adminToken"
                  );

                  localStorage.removeItem(
                    "adminUser"
                  );

                  window.location.href =
                    "/admin/login";
                }}
                className="bg-red-600 hover:bg-red-700 px-4 py-2 text-sm font-semibold"
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

        <div className="mb-6">
          <h2 className="text-2xl font-bold text-slate-900">
            Registered Workers
          </h2>

          <p className="text-slate-500 mt-1">
            Search, manage and manually
            verify JobHIR workers.
          </p>
        </div>

        {/* =================================================
            FILTERS
        ================================================= */}

        <div className="bg-white border border-slate-200 shadow-sm p-5 mb-6">

          <h3 className="font-bold text-lg text-slate-900 mb-4">
            Search & Filters
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">

            {/* SEARCH */}

            <FilterInput
              label="Name / Mobile"
              name="search"
              value={filters.search}
              onChange={
                handleFilterChange
              }
              placeholder="Search worker..."
            />

            {/* STATE */}

            <FilterInput
              label="State"
              name="state"
              value={filters.state}
              onChange={
                handleFilterChange
              }
              placeholder="e.g. Uttar Pradesh"
            />

            {/* DISTRICT */}

            <FilterInput
              label="District"
              name="district"
              value={filters.district}
              onChange={
                handleFilterChange
              }
              placeholder="e.g. Noida"
            />

            {/* WORK TYPE */}

            <FilterSelect
              label="Work Type"
              name="workType"
              value={filters.workType}
              onChange={
                handleFilterChange
              }
            >
              <option value="">
                All Work Types
              </option>

              <option value="Mason">
                Mason
              </option>

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

              <option value="Home Care">
                Home Care
              </option>

              <option value="Other">
                Other
              </option>
            </FilterSelect>

            {/* PAYMENT */}

            <FilterSelect
              label="Payment"
              name="paymentStatus"
              value={
                filters.paymentStatus
              }
              onChange={
                handleFilterChange
              }
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
            </FilterSelect>

            {/* ACCOUNT STATUS */}

            <FilterSelect
              label="Account Status"
              name="status"
              value={filters.status}
              onChange={
                handleFilterChange
              }
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
            </FilterSelect>

            {/* VERIFICATION */}

            <FilterSelect
              label="Verification"
              name="verificationStatus"
              value={
                filters.verificationStatus
              }
              onChange={
                handleFilterChange
              }
            >
              <option value="">
                All Verification
              </option>

              <option value="Pending">
                Pending
              </option>

              <option value="Verified">
                Verified
              </option>

              <option value="Rejected">
                Rejected
              </option>
            </FilterSelect>

            {/* SKILL */}

            <FilterSelect
              label="Skill Level"
              name="skillLevel"
              value={filters.skillLevel}
              onChange={
                handleFilterChange
              }
            >
              <option value="">
                All Skill Levels
              </option>

              <option value="Entry Level">
                Entry Level
              </option>

              <option value="Intermediate">
                Intermediate
              </option>

              <option value="Expert">
                Expert
              </option>
            </FilterSelect>

          </div>

          <div className="flex flex-wrap gap-3 mt-5">

            <button
              onClick={
                applyFilters
              }
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 font-semibold"
            >
              Apply Filters
            </button>

            <button
              onClick={
                clearFilters
              }
              className="bg-slate-200 hover:bg-slate-300 text-slate-800 px-6 py-2.5 font-semibold"
            >
              Clear
            </button>

            <button
              onClick={() =>
                fetchWorkers(
                  filters
                )
              }
              className="bg-green-600 hover:bg-green-700 text-white px-6 py-2.5 font-semibold"
            >
              Refresh
            </button>

          </div>
        </div>

        {/* =================================================
            ERROR
        ================================================= */}

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 p-4 mb-6">
            <p className="font-semibold">
              Error
            </p>

            <p className="text-sm mt-1">
              {error}
            </p>
          </div>
        )}

        {/* =================================================
            COUNT
        ================================================= */}

        <div className="flex items-center justify-between mb-4">

          <h3 className="text-lg font-bold text-slate-900">
            Workers
          </h3>

          <span className="bg-blue-100 text-blue-700 px-3 py-1 text-sm font-semibold">
            {workers.length} Workers
          </span>

        </div>

        {/* =================================================
            LOADING
        ================================================= */}

        {loading ? (
          <div className="bg-white border border-slate-200 p-10 text-center">

            <div className="w-10 h-10 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>

            <p className="text-slate-500">
              Loading workers...
            </p>

          </div>
        ) : workers.length === 0 ? (
          <div className="bg-white border border-slate-200 p-10 text-center">

            <h3 className="font-bold text-lg text-slate-800">
              No workers found
            </h3>

            <p className="text-slate-500 mt-1">
              Try changing your filters.
            </p>

          </div>
        ) : (
          <>

            {/* =================================================
                MOBILE
            ================================================= */}

            <div className="grid grid-cols-1 gap-4 md:hidden">

              {workers.map(
                (worker) => (
                  <div
                    key={
                      worker._id
                    }
                    className="bg-white border border-slate-200 shadow-sm p-5"
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

                      {statusBadge(
                        worker.status
                      )}

                    </div>

                    <div className="mt-4 space-y-3 text-sm">

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

                      <div>
                        <span className="font-semibold">
                          Payment:
                        </span>{" "}
                        {paymentBadge(
                          worker.paymentStatus
                        )}
                      </div>

                      <div>
                        <span className="font-semibold">
                          Verification:
                        </span>{" "}
                        {verificationBadge(
                          worker.verificationStatus
                        )}
                      </div>

                      <div>
                        <span className="font-semibold">
                          Skill:
                        </span>{" "}
                        {skillBadge(
                          worker.skillLevel
                        )}
                      </div>

                      <p>
                        <span className="font-semibold">
                          Registered:
                        </span>{" "}
                        {formatDate(
                          worker.createdAt
                        )}
                      </p>

                    </div>

                    {/* ACCOUNT STATUS */}

                    <div className="mt-4">

                      <label className="block text-xs font-semibold text-slate-500 mb-1">
                        Account Status
                      </label>

                      <select
                        value={
                          worker.status
                        }
                        disabled={
                          updatingId ===
                          worker._id
                        }
                        onChange={(
                          e
                        ) =>
                          updateStatus(
                            worker._id,
                            e.target.value
                          )
                        }
                        className="w-full border border-slate-300 px-3 py-2 text-sm"
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
                        viewWorker(
                          worker._id
                        )
                      }
                      className="mt-4 w-full bg-slate-900 hover:bg-slate-800 text-white py-2.5 font-semibold"
                    >
                      {detailLoading
                        ? "Loading..."
                        : "View & Verify"}
                    </button>

                  </div>
                )
              )}

            </div>

            {/* =================================================
                DESKTOP TABLE
            ================================================= */}

            <div className="hidden md:block bg-white border border-slate-200 shadow-sm overflow-hidden">

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
                        Payment
                      </th>

                      <th className="text-left px-4 py-4">
                        Verification
                      </th>

                      <th className="text-left px-4 py-4">
                        Skill
                      </th>

                      <th className="text-left px-4 py-4">
                        Account
                      </th>

                      <th className="text-left px-4 py-4">
                        Action
                      </th>

                    </tr>

                  </thead>

                  <tbody>

                    {workers.map(
                      (worker) => (
                        <tr
                          key={
                            worker._id
                          }
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

                            {paymentBadge(
                              worker.paymentStatus
                            )}

                            <p className="text-xs text-slate-500 mt-1">
                              ₹
                              {Number(
                                worker.paymentAmount ||
                                  0
                              ) / 100}
                            </p>

                          </td>

                          <td className="px-4 py-4">

                            {verificationBadge(
                              worker.verificationStatus
                            )}

                          </td>

                          <td className="px-4 py-4">
                            {skillBadge(
                              worker.skillLevel
                            )}
                          </td>

                          <td className="px-4 py-4">

                            {statusBadge(
                              worker.status
                            )}

                            <select
                              value={
                                worker.status
                              }
                              disabled={
                                updatingId ===
                                worker._id
                              }
                              onChange={(
                                e
                              ) =>
                                updateStatus(
                                  worker._id,
                                  e.target.value
                                )
                              }
                              className="mt-2 w-full min-w-[110px] border border-slate-300 px-2 py-1.5 text-xs"
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

                          <td className="px-4 py-4">

                            <button
                              onClick={() =>
                                viewWorker(
                                  worker._id
                                )
                              }
                              className="bg-slate-900 hover:bg-slate-800 text-white px-4 py-2 text-xs font-semibold"
                            >
                              View & Verify
                            </button>

                          </td>

                        </tr>
                      )
                    )}

                  </tbody>

                </table>

              </div>

            </div>

          </>
        )}

      </main>

      {/* =====================================================
          WORKER DETAIL MODAL
      ===================================================== */}

      {selectedWorker && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">

          <div className="bg-white w-full max-w-4xl max-h-[94vh] overflow-y-auto shadow-2xl">

            {/* MODAL HEADER */}

            <div className="sticky top-0 z-10 bg-slate-900 text-white px-5 py-4 flex items-center justify-between">

              <div>

                <h2 className="text-xl font-bold">
                  Worker Verification
                </h2>

                <p className="text-sm text-slate-400 mt-1">
                  {selectedWorker.name}
                  {" • "}
                  {selectedWorker.workType}
                </p>

              </div>

              <button
                onClick={() =>
                  setSelectedWorker(
                    null
                  )
                }
                className="text-white text-2xl hover:text-red-300"
              >
                ×
              </button>

            </div>

            {/* MODAL BODY */}

            <div className="p-5">

              {/* =================================================
                  WORKER INFORMATION
              ================================================= */}

              <div className="mb-6">

                <div className="flex items-center justify-between mb-3">

                  <h3 className="font-bold text-lg text-slate-900">
                    Worker Information
                  </h3>

                  {verificationBadge(
                    selectedWorker.verificationStatus
                  )}

                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">

                  <DetailItem
                    label="Name"
                    value={
                      selectedWorker.name
                    }
                  />

                  <DetailItem
                    label="Mobile"
                    value={
                      selectedWorker.mobile
                    }
                  />

                  <DetailItem
                    label="State"
                    value={
                      selectedWorker.state
                    }
                  />

                  <DetailItem
                    label="District"
                    value={
                      selectedWorker.district
                    }
                  />

                  <DetailItem
                    label="Work Type"
                    value={
                      selectedWorker.workType
                    }
                  />

                  <DetailItem
                    label="KYC Type"
                    value={
                      selectedWorker.kycType
                    }
                  />

                  <DetailItem
                    label="KYC Number"
                    value={
                      selectedWorker.kycNumber
                    }
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
                        selectedWorker.paymentAmount ||
                          0
                      ) / 100
                    }`}
                  />

                  <DetailItem
                    label="Account Status"
                    value={
                      selectedWorker.status
                    }
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

              </div>

              {/* =================================================
                  KYC DOCUMENT
              ================================================= */}

              {selectedWorker.kycDocument && (
                <div className="mb-6 bg-blue-50 border border-blue-200 p-4">

                  <h3 className="font-bold text-slate-900 mb-2">
                    KYC Document
                  </h3>

                  <p className="text-sm text-slate-600 mb-3">
                    Check the uploaded document
                    before completing verification.
                  </p>

                  <a
                    href={`${API_URL}${selectedWorker.kycDocument}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 font-semibold"
                  >
                    View KYC Document
                  </a>

                </div>
              )}

              {/* =================================================
                  VERIFICATION
              ================================================= */}

              <div className="border border-slate-200 overflow-hidden">

                <div className="bg-slate-50 border-b border-slate-200 px-5 py-4">

                  <h3 className="font-bold text-lg text-slate-900">
                    Admin Verification
                  </h3>

                  <p className="text-sm text-slate-500 mt-1">
                    Payment complete hone ke baad
                    worker ko manually verify karein.
                  </p>

                </div>

                <div className="p-5">

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

                    {/* VERIFICATION STATUS */}

                    <div>

                      <label className="block text-sm font-semibold text-slate-700 mb-2">
                        Verification Status
                      </label>

                      <select
                        name="verificationStatus"
                        value={
                          verificationForm.verificationStatus
                        }
                        onChange={
                          handleVerificationChange
                        }
                        className="w-full border border-slate-300 px-3 py-2.5 focus:border-blue-500 outline-none"
                      >

                        <option value="Pending">
                          Pending
                        </option>

                        <option value="Verified">
                          Verified
                        </option>

                        <option value="Rejected">
                          Rejected
                        </option>

                      </select>

                    </div>

                    {/* SKILL LEVEL */}

                    <div>

                      <label className="block text-sm font-semibold text-slate-700 mb-2">
                        Skill Level
                      </label>

                      <select
                        name="skillLevel"
                        value={
                          verificationForm.skillLevel
                        }
                        onChange={
                          handleVerificationChange
                        }
                        className="w-full border border-slate-300 px-3 py-2.5 focus:border-blue-500 outline-none"
                      >

                        <option value="">
                          Not Assessed
                        </option>

                        <option value="Entry Level">
                          Entry Level
                        </option>

                        <option value="Intermediate">
                          Intermediate
                        </option>

                        <option value="Expert">
                          Expert
                        </option>

                      </select>

                    </div>

                  </div>

                  {/* CURRENT LEVEL INFO */}

                  <div className="mt-5 grid grid-cols-1 sm:grid-cols-3 gap-3">

                    <div className="border border-slate-200 bg-slate-50 p-4">
                      <p className="text-xs text-slate-500">
                        Verification
                      </p>

                      <p className="font-bold mt-1">
                        {selectedWorker.verificationStatus ||
                          "Pending"}
                      </p>
                    </div>

                    <div className="border border-slate-200 bg-slate-50 p-4">
                      <p className="text-xs text-slate-500">
                        Skill Level
                      </p>

                      <p className="font-bold mt-1">
                        {selectedWorker.skillLevel ||
                          "Not Assessed"}
                      </p>
                    </div>

                    <div className="border border-slate-200 bg-slate-50 p-4">
                      <p className="text-xs text-slate-500">
                        Payment
                      </p>

                      <p className="font-bold mt-1">
                        {selectedWorker.paymentStatus}
                      </p>
                    </div>

                  </div>

                  {/* NOTES */}

                  <div className="mt-6">

                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      Verification Notes
                    </label>

                    <textarea
                      name="verificationNotes"
                      rows="4"
                      value={
                        verificationForm.verificationNotes
                      }
                      onChange={
                        handleVerificationChange
                      }
                      placeholder="Write verification notes..."
                      className="w-full border border-slate-300 px-3 py-3 focus:border-blue-500 outline-none resize-none"
                    />

                  </div>

                  {/* VERIFIED INFO */}

                  {selectedWorker.verifiedAt && (
                    <div className="mt-5 bg-green-50 border border-green-200 p-4">

                      <p className="text-sm text-green-800">
                        <strong>
                          Verified At:
                        </strong>{" "}
                        {formatDate(
                          selectedWorker.verifiedAt
                        )}
                      </p>

                      <p className="text-sm text-green-800 mt-1">
                        <strong>
                          Verified By:
                        </strong>{" "}
                        {selectedWorker.verifiedBy ||
                          "Admin"}
                      </p>

                    </div>
                  )}

                  {/* SAVE */}

                  <div className="mt-6 flex flex-col sm:flex-row gap-3">

                    <button
                      onClick={
                        saveVerification
                      }
                      disabled={
                        verificationUpdating
                      }
                      className="flex-1 bg-green-600 hover:bg-green-700 disabled:bg-green-300 text-white px-6 py-3 font-bold"
                    >
                      {verificationUpdating
                        ? "Saving..."
                        : "Save Verification"}
                    </button>

                    <button
                      onClick={() =>
                        setSelectedWorker(
                          null
                        )
                      }
                      disabled={
                        verificationUpdating
                      }
                      className="sm:w-32 bg-slate-200 hover:bg-slate-300 text-slate-800 px-6 py-3 font-semibold"
                    >
                      Close
                    </button>

                  </div>

                </div>

              </div>

              {/* =================================================
                  ACCOUNT STATUS
              ================================================= */}

              <div className="mt-6 border-t border-slate-200 pt-5">

                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Worker Account Status
                </label>

                <select
                  value={
                    selectedWorker.status
                  }
                  disabled={
                    updatingId ===
                    selectedWorker._id
                  }
                  onChange={async (
                    e
                  ) => {
                    await updateStatus(
                      selectedWorker._id,
                      e.target.value
                    );
                  }}
                  className="w-full border border-slate-300 px-3 py-2.5"
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

// =====================================================
// FILTER INPUT
// =====================================================

function FilterInput({
  label,
  name,
  value,
  onChange,
  placeholder,
}) {
  return (
    <div>

      <label className="block text-sm font-medium text-slate-700 mb-1">
        {label}
      </label>

      <input
        type="text"
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full border border-slate-300 px-3 py-2.5 outline-none focus:border-blue-500"
      />

    </div>
  );
}

// =====================================================
// FILTER SELECT
// =====================================================

function FilterSelect({
  label,
  name,
  value,
  onChange,
  children,
}) {
  return (
    <div>

      <label className="block text-sm font-medium text-slate-700 mb-1">
        {label}
      </label>

      <select
        name={name}
        value={value}
        onChange={onChange}
        className="w-full border border-slate-300 px-3 py-2.5 outline-none focus:border-blue-500"
      >
        {children}
      </select>

    </div>
  );
}

// =====================================================
// DETAIL ITEM
// =====================================================

function DetailItem({
  label,
  value,
}) {
  return (
    <div className="bg-slate-50 border border-slate-200 p-3">

      <p className="text-xs text-slate-500 font-medium">
        {label}
      </p>

      <p className="text-sm font-semibold text-slate-900 mt-1 break-words">
        {value || "-"}
      </p>

    </div>
  );
}