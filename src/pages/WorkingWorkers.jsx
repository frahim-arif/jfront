
import { useEffect, useState } from "react";
import axios from "axios";
import {
  ArrowLeft,
  BriefcaseBusiness,
  MapPin,
  UserRound,
  BadgeCheck,
  Clock3,
  Award,
  RefreshCw,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const API_BASE_URL = "https://jbackend-h963.onrender.com";

export default function WorkingWorkers() {
  const navigate = useNavigate();

  const [workers, setWorkers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchWorkingWorkers = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await axios.get(
        `${API_BASE_URL}/workers/working`
      );

      if (response.data?.success) {
        setWorkers(response.data.workers || []);
      } else {
        setWorkers([]);
        setError(
          response.data?.message ||
            "Unable to load working workers."
        );
      }
    } catch (err) {
      console.error(
        "Working Workers Error:",
        err
      );

      setWorkers([]);
      setError(
        "Working workers load nahi ho paaye."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWorkingWorkers();
  }, []);

  return (
    <div className="min-h-screen bg-slate-50">

      {/* =====================================================
          HEADER
      ===================================================== */}

      <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/95 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">

          <button
            type="button"
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50"
          >
            <ArrowLeft size={18} />
            Back
          </button>

          <div className="text-center">
            <h1 className="text-xl font-bold tracking-tight text-slate-900 sm:text-2xl">
              Kaam Kar Rahe Workers
            </h1>

            <p className="mt-1 hidden text-xs text-slate-500 sm:block">
              Currently working workers
            </p>
          </div>

          <button
            type="button"
            onClick={fetchWorkingWorkers}
            disabled={loading}
            className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <RefreshCw
              size={17}
              className={
                loading
                  ? "animate-spin"
                  : ""
              }
            />
            <span className="hidden sm:inline">
              Refresh
            </span>
          </button>

        </div>
      </header>


      {/* =====================================================
          MAIN
      ===================================================== */}

      <main className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">

        {/* INTRO */}
        <div className="mb-8 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">

          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

            <div>
              <div className="mb-2 flex items-center gap-2">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                  <BriefcaseBusiness size={21} />
                </div>

                <span className="text-sm font-semibold text-emerald-700">
                  Live Working Workers
                </span>
              </div>

              <h2 className="text-xl font-bold text-slate-900">
                Currently working on jobs
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Ye list un workers ki hai jo
                abhi kisi job par kaam kar rahe hain.
              </p>
            </div>

            <div className="flex h-16 min-w-28 items-center justify-center rounded-xl bg-slate-50 px-5">
              <div className="text-center">
                <div className="text-2xl font-bold text-slate-900">
                  {workers.length}
                </div>

                <div className="text-xs font-medium text-slate-500">
                  Working
                </div>
              </div>
            </div>

          </div>
        </div>


        {/* =====================================================
            LOADING
        ===================================================== */}

        {loading && (
          <div className="flex min-h-[300px] items-center justify-center">
            <div className="text-center">

              <RefreshCw
                size={32}
                className="mx-auto animate-spin text-emerald-600"
              />

              <p className="mt-3 text-sm font-medium text-slate-500">
                Working workers load ho rahe hain...
              </p>

            </div>
          </div>
        )}


        {/* =====================================================
            ERROR
        ===================================================== */}

        {!loading && error && (
          <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-center">

            <p className="font-semibold text-red-700">
              {error}
            </p>

            <button
              type="button"
              onClick={fetchWorkingWorkers}
              className="mt-4 inline-flex items-center gap-2 rounded-xl bg-red-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-red-700"
            >
              <RefreshCw size={17} />
              Try Again
            </button>

          </div>
        )}


        {/* =====================================================
            EMPTY
        ===================================================== */}

        {!loading &&
          !error &&
          workers.length === 0 && (
            <div className="rounded-2xl border border-slate-200 bg-white px-6 py-14 text-center shadow-sm">

              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100 text-slate-400">
                <BriefcaseBusiness size={30} />
              </div>

              <h3 className="mt-5 text-lg font-bold text-slate-900">
                Abhi koi worker kaam par nahi hai
              </h3>

              <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
                Jab koi registered worker kisi job par
                actual kaam karega, woh yahan दिखाई देगा.
              </p>

            </div>
          )}


        {/* =====================================================
            WORKER GRID
        ===================================================== */}

        {!loading &&
          !error &&
          workers.length > 0 && (
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">

              {workers.map((worker) => (
                <article
                  key={worker._id}
                  className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg"
                >

                  {/* TOP */}
                  <div className="border-b border-slate-100 p-5">

                    <div className="flex items-start justify-between gap-4">

                      <div className="flex min-w-0 items-center gap-3">

                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700">
                          <UserRound size={23} />
                        </div>

                        <div className="min-w-0">
                          <h3 className="truncate text-base font-bold text-slate-900">
                            {worker.name}
                          </h3>

                          <p className="mt-0.5 text-xs text-slate-500">
                            {worker.workType || "Worker"}
                          </p>
                        </div>

                      </div>

                      <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1 text-[11px] font-bold text-emerald-700">
                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                        Working
                      </span>

                    </div>

                  </div>


                  {/* DETAILS */}
                  <div className="space-y-3 p-5">

                    <div className="flex items-center gap-3 text-sm">
                      <MapPin
                        size={17}
                        className="shrink-0 text-slate-400"
                      />

                      <span className="text-slate-600">
                        {worker.district || "District not available"}
                        {worker.state
                          ? `, ${worker.state}`
                          : ""}
                      </span>
                    </div>


                    {worker.jobTitle && (
                      <div className="flex items-center gap-3 text-sm">
                        <BriefcaseBusiness
                          size={17}
                          className="shrink-0 text-slate-400"
                        />

                        <span className="font-medium text-slate-700">
                          {worker.jobTitle}
                        </span>
                      </div>
                    )}


                    {worker.skillLevel && (
                      <div className="flex items-center gap-3 text-sm">
                        <Award
                          size={17}
                          className="shrink-0 text-slate-400"
                        />

                        <span className="text-slate-600">
                          Skill:{" "}
                          <strong className="text-slate-800">
                            {worker.skillLevel}
                          </strong>
                        </span>
                      </div>
                    )}


                    {worker.experienceYears !==
                      undefined &&
                      worker.experienceYears !==
                        null && (
                        <div className="flex items-center gap-3 text-sm">
                          <BadgeCheck
                            size={17}
                            className="shrink-0 text-slate-400"
                          />

                          <span className="text-slate-600">
                            Experience:{" "}
                            <strong className="text-slate-800">
                              {worker.experienceYears}{" "}
                              {Number(
                                worker.experienceYears
                              ) === 1
                                ? "year"
                                : "years"}
                            </strong>
                          </span>
                        </div>
                      )}


                    {worker.workStartedAt && (
                      <div className="flex items-center gap-3 text-sm">
                        <Clock3
                          size={17}
                          className="shrink-0 text-slate-400"
                        />

                        <span className="text-slate-600">
                          Working since{" "}
                          <strong className="text-slate-800">
                            {new Date(
                              worker.workStartedAt
                            ).toLocaleDateString(
                              "en-IN",
                              {
                                day: "2-digit",
                                month: "short",
                                year: "numeric",
                              }
                            )}
                          </strong>
                        </span>
                      </div>
                    )}

                  </div>


                  {/* FOOTER */}
                  <div className="border-t border-slate-100 bg-slate-50 px-5 py-3">

                    <div className="flex items-center justify-between gap-3">

                      <span className="text-xs text-slate-500">
                        {worker.verificationStatus ===
                        "Verified"
                          ? "Verified Worker"
                          : "Registered Worker"}
                      </span>

                      <span className="text-xs font-semibold text-emerald-700">
                        {worker.workType ||
                          "Professional"}
                      </span>

                    </div>

                  </div>

                </article>
              ))}

            </div>
          )}

      </main>
    </div>
  );
}

