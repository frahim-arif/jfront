
import { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import axios from "axios";

const API_URL = "https://jbackend-h963.onrender.com";

function Success() {
  const [params] = useSearchParams();

  const merchantOrderId =
    params.get("merchantOrderId");

  const [loading, setLoading] = useState(true);
  const [workerActivated, setWorkerActivated] =
    useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    let mounted = true;

    async function activateWorker() {
      try {
        // ============================================
        // GET LOCAL STORAGE DATA
        // ============================================

        const pendingWorkerId =
          localStorage.getItem("pendingWorkerId");

        const savedMerchantOrderId =
          localStorage.getItem(
            "workerMerchantOrderId"
          );

        const existingWorkerId =
          localStorage.getItem("workerId");

        console.log(
          "👷 Pending Worker ID:",
          pendingWorkerId
        );

        console.log(
          "👷 Existing Worker ID:",
          existingWorkerId
        );

        console.log(
          "💳 Current Merchant Order ID:",
          merchantOrderId
        );

        console.log(
          "💳 Saved Merchant Order ID:",
          savedMerchantOrderId
        );

        // ============================================
        // MERCHANT ORDER ID REQUIRED
        // ============================================

        if (!merchantOrderId) {
          console.warn(
            "⚠️ Merchant Order ID not found in URL"
          );

          setError(
            "Payment order information not found."
          );

          return;
        }

        // ============================================
        // VERIFY LOCAL STORAGE ORDER ID
        // ============================================

        if (
          savedMerchantOrderId &&
          merchantOrderId !== savedMerchantOrderId
        ) {
          console.error(
            "❌ Merchant Order ID mismatch",
            {
              current: merchantOrderId,
              saved: savedMerchantOrderId,
            }
          );

          setError(
            "Payment order verification failed."
          );

          return;
        }

        // ============================================
        // WORKER ID
        // ============================================

        let workerId =
          pendingWorkerId ||
          existingWorkerId ||
          null;

        // ============================================
        // IF WORKER ID NOT AVAILABLE
        // RECOVER FROM BACKEND
        // ============================================

        if (!workerId) {
          console.log(
            "🔍 Worker ID not found in localStorage."
          );

          console.log(
            "🔍 Recovering Worker ID from backend..."
          );

          const response = await axios.get(
            `${API_URL}/workers/payment-by-order/${encodeURIComponent(
              merchantOrderId
            )}`
          );

          console.log(
            "🔍 Worker recovery response:",
            response.data
          );

          if (
            response.data?.success &&
            response.data?.worker?._id
          ) {
            workerId =
              response.data.worker._id;

            console.log(
              "✅ Worker ID recovered from backend:",
              workerId
            );
          }
        }

        // ============================================
        // WORKER ID STILL NOT FOUND
        // ============================================

        if (!workerId) {
          console.error(
            "❌ Unable to find Worker ID"
          );

          setError(
            "Worker registration information not found."
          );

          return;
        }

        // ============================================
        // SAVE WORKER ID PERMANENTLY
        // ============================================

        localStorage.setItem(
          "workerId",
          String(workerId)
        );

        console.log(
          "💾 Worker ID saved:",
          localStorage.getItem("workerId")
        );

        // ============================================
        // CLEAN PENDING DATA
        // ============================================

        localStorage.removeItem(
          "pendingWorkerId"
        );

        // ============================================
        // KEEP MERCHANT ORDER ID
        // ============================================
        // workerMerchantOrderId ko remove nahi kar rahe,
        // future verification/debugging ke liye useful hai.

        // ============================================
        // NOTIFY HEADER
        // ============================================

        window.dispatchEvent(
          new Event("workerPaymentSuccess")
        );

        console.log(
          "📢 Header notified about worker payment success"
        );

        // ============================================
        // SUCCESS
        // ============================================

        if (mounted) {
          setWorkerActivated(true);
        }
      } catch (error) {
        console.error(
          "❌ Worker activation error:",
          error
        );

        console.error(
          "❌ Backend response:",
          error?.response?.data
        );

        if (mounted) {
          setError(
            error?.response?.data?.message ||
              "Unable to activate worker registration."
          );
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    }

    activateWorker();

    return () => {
      mounted = false;
    };
  }, [merchantOrderId]);

  return (
    <div className="min-h-screen bg-green-50 flex items-center justify-center p-6">

      <div className="w-full max-w-xl bg-white rounded-2xl shadow-md border border-green-100 p-8 text-center">

        {/* ICON */}

        <div className="mx-auto w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mb-4">

          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="w-8 h-8 text-green-600"
          >
            <path
              fillRule="evenodd"
              d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12Zm13.36-1.814a.75.75 0 1 0-1.22-.872l-3.236 4.53-1.76-1.76a.75.75 0 0 0-1.06 1.06l2.4 2.4a.75.75 0 0 0 1.159-.103l3.717-5.255Z"
              clipRule="evenodd"
            />
          </svg>

        </div>

        {/* TITLE */}

        <h1 className="text-2xl font-bold text-gray-900">
          Payment Successful
        </h1>

        <p className="text-gray-600 mt-1">
          Thank you! Your worker registration payment
          has been successfully processed.
        </p>

        {merchantOrderId && (
          <p className="text-sm text-gray-500 mt-2">
            Order ID:{" "}
            <span className="font-mono">
              {merchantOrderId}
            </span>
          </p>
        )}

        {/* LOADING */}

        {loading && (
          <div className="mt-6 rounded-lg bg-blue-50 p-4">

            <p className="text-sm text-blue-700">
              Activating your worker registration...
            </p>

          </div>
        )}

        {/* SUCCESS */}

        {!loading && workerActivated && (
          <div className="mt-6 rounded-lg bg-green-50 border border-green-200 p-4">

            <p className="font-semibold text-green-700">
              ✓ Worker Registration Activated
            </p>

            <p className="mt-1 text-sm text-green-600">
              You will now receive job notifications
              matching your district and work type.
            </p>

          </div>
        )}

        {/* ERROR */}

        {!loading && error && (
          <div className="mt-6 rounded-lg bg-red-50 border border-red-200 p-4">

            <p className="font-semibold text-red-700">
              {error}
            </p>

          </div>
        )}

        {/* BACK */}

        <div className="mt-8">

          <Link
            to="/"
            className="px-4 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700"
          >
            Back to Home
          </Link>

        </div>

      </div>

    </div>
  );
}

export default Success;

