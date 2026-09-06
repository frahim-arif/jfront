
import { useEffect, useState } from "react";
import axios from "axios";

const API_URL = "https://jbackend-h963.onrender.com";

export default function AdminDashboard() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);

  // ==========================================
  // FETCH ALL JOBS
  // ==========================================

  const fetchJobs = async () => {
    try {
      setLoading(true);

      const res = await axios.get(`${API_URL}/jobs`);

      if (res.data?.success) {
        setJobs(res.data.jobs || []);
      } else {
        setJobs([]);
      }
    } catch (error) {
      console.error("FETCH JOBS ERROR:", error);
      alert("Jobs load nahi ho paaye.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  // ==========================================
  // DELETE JOB
  // ==========================================

  const deleteJob = async (jobId) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this job?"
    );

    if (!confirmed) return;

    try {
      setDeletingId(jobId);

      const res = await axios.delete(
        `${API_URL}/jobs/${jobId}`
      );

      if (res.data?.success) {
        // Remove job immediately from screen
        setJobs((prevJobs) =>
          prevJobs.filter((job) => job._id !== jobId)
        );

        alert("Job deleted successfully.");
      } else {
        alert(res.data?.message || "Failed to delete job.");
      }
    } catch (error) {
      console.error("DELETE JOB ERROR:", error);

      alert(
        error.response?.data?.message ||
          "Failed to delete job."
      );
    } finally {
      setDeletingId(null);
    }
  };

  // ==========================================
  // LOADING
  // ==========================================

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <p className="text-gray-600 text-lg">
          Loading jobs...
        </p>
      </div>
    );
  }

  // ==========================================
  // PAGE
  // ==========================================

  return (
    <div className="min-h-screen bg-gray-100 p-6">

      {/* HEADER */}
      <div className="max-w-7xl mx-auto mb-8">
        <h1 className="text-3xl font-bold text-gray-900">
          JobHIR Admin
        </h1>

        <p className="text-gray-500 mt-1">
          Manage posted jobs
        </p>
      </div>

      <div className="max-w-7xl mx-auto">

        {/* JOB COUNT */}
        <div className="mb-5">
          <span className="bg-white border rounded-lg px-4 py-2 text-sm text-gray-700">
            Total Jobs:{" "}
            <strong>{jobs.length}</strong>
          </span>
        </div>

        {/* NO JOBS */}
        {jobs.length === 0 ? (
          <div className="bg-white rounded-xl shadow p-10 text-center">
            <h2 className="text-xl font-semibold text-gray-700">
              No jobs found
            </h2>

            <p className="text-gray-500 mt-2">
              Abhi koi job posted nahi hai.
            </p>
          </div>
        ) : (
          /* JOB LIST */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">

            {jobs.map((job) => (
              <div
                key={job._id}
                className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 flex flex-col justify-between"
              >

                {/* JOB DETAILS */}
                <div>

                  <h2 className="text-xl font-bold text-gray-900">
                    {job.title}
                  </h2>

                  {job.description && (
                    <p className="text-gray-600 mt-2">
                      {job.description}
                    </p>
                  )}

                  <div className="mt-4 space-y-2">

                    <p className="text-sm text-gray-600">
                      <span className="font-semibold">
                        District:
                      </span>{" "}
                      {job.district}
                    </p>

                    <p className="text-sm text-gray-600">
                      <span className="font-semibold">
                        Work Type:
                      </span>{" "}
                      {job.workType}
                    </p>

                    <p className="text-lg font-bold text-green-600">
                      ₹{job.amount}
                    </p>

                  </div>
                </div>

                {/* DELETE BUTTON */}
                <button
                  type="button"
                  onClick={() => deleteJob(job._id)}
                  disabled={deletingId === job._id}
                  className="mt-5 w-full bg-red-600 hover:bg-red-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-semibold py-2.5 rounded-lg transition"
                >
                  {deletingId === job._id
                    ? "Deleting..."
                    : "Delete Job"}
                </button>

              </div>
            ))}

          </div>
        )}
      </div>
    </div>
  );
}

