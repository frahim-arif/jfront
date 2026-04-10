import { useEffect, useState } from "react";
import axios from "axios";

export default function AdminDashboard() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch all jobs
  const fetchJobs = async () => {
    try {
      const res = await axios.get("http://localhost:5000/jobs");
      setJobs(res.data.jobs);
    } catch (err) {
      console.error("Error fetching jobs:", err);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  // Delete a job
  const deleteJob = async (jobId) => {
    if (!window.confirm("Are you sure you want to delete this job?")) return;

    try {
      setLoading(true);
      await axios.delete(`http://localhost:5000/jobs/${jobId}`);
      // Refresh job list after deletion
      fetchJobs();
    } catch (err) {
      console.error("Error deleting job:", err);
      alert("Failed to delete job");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
      {jobs.length === 0 && <p>No jobs found.</p>}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {jobs.map((job) => (
          <div
            key={job._id}
            className="bg-white shadow rounded-lg p-4 flex flex-col justify-between"
          >
            <div>
              <h2 className="font-bold text-xl">{job.title}</h2>
              <p className="text-gray-700">{job.description}</p>
              <p className="text-sm text-gray-500">District: {job.district}</p>
              <p className="text-sm text-gray-500">Price: {job.amount} ₹</p>
            </div>

            <button
              onClick={() => deleteJob(job._id)}
              className="mt-3 bg-red-600 text-white py-2 rounded hover:bg-red-700 transition"
              disabled={loading}
            >
              {loading ? "Deleting..." : "Delete Job"}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
