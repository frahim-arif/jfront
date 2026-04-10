import { useState, useEffect } from "react";
import Header from "../components/Header";
import JobCard from "../components/JobCard";
import axios from "axios";



export default function App() {
  const [jobs, setJobs] = useState([]);
  const [showOfferJob, setShowOfferJob] = useState(false);

  // form states...
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState(10);
  const [district, setDistrict] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");

  const districts = ["District 1","District 2","District 3","District 4","District 5","District 6"];

  useEffect(() => { fetchJobs() }, []);

  const fetchJobs = async () => {
    try {
      const res = await axios.get("http://localhost:5000/jobs");
      setJobs(res.data.jobs);
    } catch (err) { console.error(err); }
  };

  const createJob = async () => {
    if (!title || !description || !amount || !district || !phone || !email) {
      alert("All fields are required!"); return;
    }
    try {
      await axios.post("http://localhost:5000/jobs", { title, description, amount, district, postedByPhone: phone, postedByEmail: email });
      setShowOfferJob(false);
      setTitle(""); setDescription(""); setAmount(10); setDistrict(""); setPhone(""); setEmail("");
      fetchJobs();
    } catch (err) { console.error(err); alert("Error posting job!"); }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      {/* Header */}
      <Header onOfferJobClick={() => setShowOfferJob(true)} />

      {/* Offer Job Modal */}
      {showOfferJob && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Offer a Job</h2>
            <input type="text" placeholder="Job Title" value={title} onChange={(e) => setTitle(e.target.value)} className="w-full mb-2 p-2 border rounded" />
            <textarea placeholder="Job Description" value={description} onChange={(e) => setDescription(e.target.value)} className="w-full mb-2 p-2 border rounded" />
            <input type="number" placeholder="Price in INR" value={amount} onChange={(e) => setAmount(e.target.value)} className="w-full mb-2 p-2 border rounded" />
            <select value={district} onChange={(e) => setDistrict(e.target.value)} className="w-full mb-2 p-2 border rounded">
              <option value="">Select District</option>
              {districts.map(d => (<option key={d} value={d}>{d}</option>))}
            </select>
            <input type="tel" placeholder="Phone" value={phone} onChange={(e) => setPhone(e.target.value)} className="w-full mb-2 p-2 border rounded" />
            <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full mb-2 p-2 border rounded" />
            <div className="flex justify-end gap-2 mt-4">
              <button onClick={() => setShowOfferJob(false)} className="px-3 py-1 border rounded">Cancel</button>
              <button onClick={createJob} className="px-3 py-1 bg-indigo-600 text-white rounded hover:bg-indigo-700">Submit</button>
            </div>
          </div>
        </div>
      )}

      {/* Job List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-6">
        {jobs.map(job => <JobCard key={job._id} job={job} />)}
      </div>
    </div>
  );
}
