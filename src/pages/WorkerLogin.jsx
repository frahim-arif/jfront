
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header.jsx";

const API_URL =
  "https://jbackend-h963.onrender.com";

export default function WorkerLogin() {
  const navigate = useNavigate();

  const [mobile, setMobile] = useState("");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  // =====================================================
  // MOBILE
  // =====================================================

  const handleMobileChange = (e) => {
    const value = e.target.value
      .replace(/\D/g, "")
      .slice(0, 10);

    setMobile(value);
  };

  // =====================================================
  // SEND OTP
  // =====================================================

  const sendOtp = async () => {
    if (!/^\d{10}$/.test(mobile)) {
      setMessage(
        "Please enter a valid 10 digit mobile number."
      );

      return;
    }

    try {
      setLoading(true);
      setMessage("");

      const response = await fetch(
        `${API_URL}/workers/login/send-otp`,
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            mobile,
          }),
        }
      );

      const result = await response.json();

      if (!response.ok) {
        setMessage(
          result.message ||
            "Unable to send OTP."
        );

        return;
      }

      setOtpSent(true);

      setMessage(
        "OTP sent successfully."
      );
    } catch (error) {
      console.error(
        "Send OTP Error:",
        error
      );

      setMessage(
        "Unable to connect with server."
      );
    } finally {
      setLoading(false);
    }
  };

  // =====================================================
  // VERIFY OTP
  // =====================================================

  const verifyOtp = async () => {
    if (!/^\d{4,8}$/.test(otp)) {
      setMessage(
        "Please enter the OTP."
      );

      return;
    }

    try {
      setLoading(true);
      setMessage("");

      const response = await fetch(
        `${API_URL}/workers/login/verify-otp`,
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            mobile,
            otp,
          }),
        }
      );

      const result =
        await response.json();

      console.log(
        "Worker Login Response:",
        result
      );

      // =================================================
      // API ERROR
      // =================================================

      if (!response.ok) {
        setMessage(
          result.message ||
            "Invalid OTP."
        );

        return;
      }

      // =================================================
      // WORKER CHECK
      // =================================================

      const worker = result.worker;

      if (!worker?._id) {
        console.error(
          "Worker ID missing:",
          result
        );

        setMessage(
          "Worker account information not found."
        );

        return;
      }

      console.log(
        "Logged in Worker:",
        worker
      );

      // =================================================
      // PAYMENT CHECK
      // =================================================

      if (
        worker.paymentStatus !== "PAID" ||
        worker.status !== "Active"
      ) {
        console.log(
          "⛔ Worker is not active/paid:",
          {
            paymentStatus:
              worker.paymentStatus,
            status: worker.status,
          }
        );

        // Remove any old active login
        localStorage.removeItem(
          "workerId"
        );

        localStorage.removeItem(
          "workerMobile"
        );

        setMessage(
          "Your ₹250 registration payment is not completed. Please complete registration payment first."
        );

        return;
      }

      // =================================================
      // SAVE ACTIVE WORKER
      // =================================================

      localStorage.setItem(
        "workerId",
        worker._id
      );

      localStorage.setItem(
        "workerMobile",
        mobile
      );

      console.log(
        "✅ Worker ID saved:",
        worker._id
      );

      // =================================================
      // TELL HEADER
      // =================================================

      window.dispatchEvent(
        new Event("workerLoggedIn")
      );

      // =================================================
      // SUCCESS
      // =================================================

      setMessage(
        "Login successful."
      );

      navigate("/");
    } catch (error) {
      console.error(
        "Verify OTP Error:",
        error
      );

      setMessage(
        "Unable to connect with server."
      );
    } finally {
      setLoading(false);
    }
  };

  // =====================================================
  // RETURN
  // =====================================================

  return (
    <>
      <Header />

      <main className="min-h-screen bg-slate-50 px-4 py-10">
        <div className="mx-auto max-w-md">

          {/* =================================================
              TITLE
          ================================================= */}

          <div className="mb-6 text-center">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-sky-100 text-2xl">
              📱
            </div>

            <h1 className="text-2xl font-bold text-slate-800">
              Worker Login
            </h1>

            <p className="mt-2 text-sm text-slate-500">
              Login to receive job notifications
            </p>
          </div>

          {/* =================================================
              FORM
          ================================================= */}

          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

            {!otpSent ? (
              <>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Mobile Number
                </label>

                <input
                  type="tel"
                  value={mobile}
                  onChange={handleMobileChange}
                  maxLength={10}
                  inputMode="numeric"
                  placeholder="10 digit mobile number"
                  className="h-12 w-full rounded-lg border border-slate-300 px-4 outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
                />

                <button
                  type="button"
                  onClick={sendOtp}
                  disabled={loading}
                  className="mt-5 h-12 w-full rounded-lg bg-sky-500 font-semibold text-white hover:bg-sky-600 disabled:opacity-60"
                >
                  {loading
                    ? "Sending OTP..."
                    : "Send OTP"}
                </button>
              </>
            ) : (
              <>
                <div className="mb-4 rounded-lg bg-green-50 p-3 text-sm text-green-700">
                  OTP sent to +91 {mobile}
                </div>

                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Enter OTP
                </label>

                <input
                  type="tel"
                  value={otp}
                  onChange={(e) =>
                    setOtp(
                      e.target.value
                        .replace(/\D/g, "")
                        .slice(0, 8)
                    )
                  }
                  inputMode="numeric"
                  placeholder="Enter OTP"
                  className="h-12 w-full rounded-lg border border-slate-300 px-4 text-center text-lg tracking-[0.3em] outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
                />

                <button
                  type="button"
                  onClick={verifyOtp}
                  disabled={loading}
                  className="mt-5 h-12 w-full rounded-lg bg-sky-500 font-semibold text-white hover:bg-sky-600 disabled:opacity-60"
                >
                  {loading
                    ? "Verifying..."
                    : "Verify & Login"}
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setOtpSent(false);
                    setOtp("");
                    setMessage("");
                  }}
                  className="mt-3 w-full text-sm text-sky-600"
                >
                  Change Mobile Number
                </button>
              </>
            )}

            {/* =================================================
                MESSAGE
            ================================================= */}

            {message && (
              <p className="mt-4 text-center text-sm text-slate-600">
                {message}
              </p>
            )}
          </div>

          <p className="mt-5 text-center text-xs text-slate-400">
            Your mobile number is used to securely
            access your worker account.
          </p>
        </div>
      </main>
    </>
  );
}

