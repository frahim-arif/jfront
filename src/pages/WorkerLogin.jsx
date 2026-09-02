
// import { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import Header from "../components/Header.jsx";

// const API_URL = "https://jbackend-h963.onrender.com";

// export default function WorkerLogin() {
//   const navigate = useNavigate();

//   const [mobile, setMobile] = useState("");
//   const [otp, setOtp] = useState("");
//   const [otpSent, setOtpSent] = useState(false);

//   const [loading, setLoading] = useState(false);
//   const [message, setMessage] = useState("");

//   const [messageType, setMessageType] =
//     useState("normal");

//   // =====================================================
//   // MOBILE
//   // =====================================================

//   const handleMobileChange = (e) => {
//     const value = e.target.value
//       .replace(/\D/g, "")
//       .slice(0, 10);

//     setMobile(value);
//   };

//   // =====================================================
//   // SEND OTP
//   // =====================================================

//   const sendOtp = async () => {
//     if (!/^\d{10}$/.test(mobile)) {
//       setMessage(
//         "Please enter a valid 10 digit mobile number."
//       );

//       setMessageType("error");

//       return;
//     }

//     try {
//       setLoading(true);
//       setMessage("");

//       const response = await fetch(
//         `${API_URL}/workers/login/send-otp`,
//         {
//           method: "POST",

//           headers: {
//             "Content-Type": "application/json",
//             Accept: "application/json",
//           },

//           body: JSON.stringify({
//             mobile,
//           }),
//         }
//       );

//       const result =
//         await response.json().catch(() => null);

//       console.log(
//         "📱 Send OTP Response:",
//         result
//       );

//       if (!response.ok) {
//         setMessage(
//           result?.message ||
//             "Unable to send OTP."
//         );

//         setMessageType("error");

//         return;
//       }

//       setOtpSent(true);

//       setMessage(
//         result?.message ||
//           "OTP sent successfully."
//       );

//       setMessageType("success");
//     } catch (error) {
//       console.error(
//         "❌ Send OTP Error:",
//         error
//       );

//       setMessage(
//         "Unable to connect with server."
//       );

//       setMessageType("error");
//     } finally {
//       setLoading(false);
//     }
//   };

//   // =====================================================
//   // VERIFY OTP
//   // =====================================================

//   const verifyOtp = async () => {
//     if (!/^\d{4,8}$/.test(otp)) {
//       setMessage(
//         "Please enter the OTP."
//       );

//       setMessageType("error");

//       return;
//     }

//     try {
//       setLoading(true);
//       setMessage("");

//       const response = await fetch(
//         `${API_URL}/workers/login/verify-otp`,
//         {
//           method: "POST",

//           headers: {
//             "Content-Type": "application/json",
//             Accept: "application/json",
//           },

//           body: JSON.stringify({
//             mobile,
//             otp,
//           }),
//         }
//       );

//       const result =
//         await response.json().catch(() => null);

//       console.log(
//         "🔐 Worker Login Response:",
//         result
//       );

//       // =================================================
//       // API ERROR
//       // =================================================

//       if (!response.ok) {
//         setMessage(
//           result?.message ||
//             "Invalid OTP."
//         );

//         setMessageType("error");

//         return;
//       }

//       // =================================================
//       // GET WORKER
//       // =================================================

//       const worker = result?.worker;

//       if (!worker?._id) {
//         console.error(
//           "❌ Worker information missing:",
//           result
//         );

//         setMessage(
//           "Worker account information not found."
//         );

//         setMessageType("error");

//         return;
//       }

//       console.log(
//         "👤 Logged in Worker:",
//         worker
//       );

//       // =================================================
//       // PAYMENT + STATUS CHECK
//       // =================================================

//       const isPaid =
//         worker.paymentStatus === "PAID";

//       const isActive =
//         worker.status === "Active";

//       console.log(
//         "💰 Payment:",
//         worker.paymentStatus
//       );

//       console.log(
//         "👤 Status:",
//         worker.status
//       );

//       // =================================================
//       // NOT PAID / NOT ACTIVE
//       // =================================================

//       if (!isPaid || !isActive) {
//         console.log(
//           "⛔ Worker cannot login:",
//           {
//             paymentStatus:
//               worker.paymentStatus,
//             status: worker.status,
//           }
//         );

//         // Remove active login
//         localStorage.removeItem(
//           "workerId"
//         );

//         localStorage.removeItem(
//           "workerMobile"
//         );

//         setMessage(
//           "Your ₹250 registration payment is not completed. Please complete registration payment first."
//         );

//         setMessageType("error");

//         return;
//       }

//       // =================================================
//       // SAVE ACTIVE WORKER
//       // =================================================

//       localStorage.setItem(
//         "workerId",
//         String(worker._id)
//       );

//       localStorage.setItem(
//         "workerMobile",
//         mobile
//       );

//       console.log(
//         "✅ Active Worker ID saved:",
//         worker._id
//       );

//       // =================================================
//       // CLEAR PENDING PAYMENT DATA
//       // =================================================

//       localStorage.removeItem(
//         "pendingWorkerId"
//       );

//       localStorage.removeItem(
//         "workerMerchantOrderId"
//       );

//       // =================================================
//       // NOTIFY HEADER
//       // =================================================

//       window.dispatchEvent(
//         new Event("workerLoggedIn")
//       );

//       // =================================================
//       // SUCCESS
//       // =================================================

//       setMessage(
//         "Login successful."
//       );

//       setMessageType("success");

//       // Small delay so Header/state can update
//       setTimeout(() => {
//         navigate("/");
//       }, 300);
//     } catch (error) {
//       console.error(
//         "❌ Verify OTP Error:",
//         error
//       );

//       setMessage(
//         "Unable to connect with server."
//       );

//       setMessageType("error");
//     } finally {
//       setLoading(false);
//     }
//   };

//   // =====================================================
//   // CHANGE MOBILE
//   // =====================================================

//   const changeMobile = () => {
//     setOtpSent(false);
//     setOtp("");
//     setMessage("");
//     setMessageType("normal");
//   };

//   // =====================================================
//   // MESSAGE STYLE
//   // =====================================================

//   const messageClass =
//     messageType === "error"
//       ? "bg-red-50 text-red-700"
//       : messageType === "success"
//       ? "bg-green-50 text-green-700"
//       : "bg-slate-50 text-slate-600";

//   // =====================================================
//   // RETURN
//   // =====================================================

//   return (
//     <>
//       <Header />

//       <main className="min-h-screen bg-slate-50 px-4 py-10">
//         <div className="mx-auto max-w-md">

//           {/* TITLE */}
//           <div className="mb-6 text-center">
//             <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-sky-100 text-2xl">
//               📱
//             </div>

//             <h1 className="text-2xl font-bold text-slate-800">
//               Worker Login
//             </h1>

//             <p className="mt-2 text-sm text-slate-500">
//               Login to receive job notifications
//             </p>
//           </div>

//           {/* FORM */}
//           <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

//             {!otpSent ? (
//               <>
//                 <label className="mb-2 block text-sm font-semibold text-slate-700">
//                   Mobile Number
//                 </label>

//                 <input
//                   type="tel"
//                   value={mobile}
//                   onChange={handleMobileChange}
//                   maxLength={10}
//                   inputMode="numeric"
//                   autoComplete="tel"
//                   placeholder="10 digit mobile number"
//                   className="h-12 w-full rounded-lg border border-slate-300 px-4 outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
//                 />

//                 <button
//                   type="button"
//                   onClick={sendOtp}
//                   disabled={
//                     loading ||
//                     mobile.length !== 10
//                   }
//                   className="mt-5 h-12 w-full rounded-lg bg-sky-500 font-semibold text-white transition hover:bg-sky-600 disabled:cursor-not-allowed disabled:opacity-60"
//                 >
//                   {loading
//                     ? "Sending OTP..."
//                     : "Send OTP"}
//                 </button>
//               </>
//             ) : (
//               <>
//                 <div className="mb-4 rounded-lg bg-green-50 p-3 text-sm text-green-700">
//                   OTP sent to +91 {mobile}
//                 </div>

//                 <label className="mb-2 block text-sm font-semibold text-slate-700">
//                   Enter OTP
//                 </label>

//                 <input
//                   type="tel"
//                   value={otp}
//                   onChange={(e) =>
//                     setOtp(
//                       e.target.value
//                         .replace(/\D/g, "")
//                         .slice(0, 8)
//                     )
//                   }
//                   inputMode="numeric"
//                   autoComplete="one-time-code"
//                   placeholder="Enter OTP"
//                   className="h-12 w-full rounded-lg border border-slate-300 px-4 text-center text-lg tracking-[0.3em] outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
//                 />

//                 <button
//                   type="button"
//                   onClick={verifyOtp}
//                   disabled={
//                     loading ||
//                     otp.length < 4
//                   }
//                   className="mt-5 h-12 w-full rounded-lg bg-sky-500 font-semibold text-white transition hover:bg-sky-600 disabled:cursor-not-allowed disabled:opacity-60"
//                 >
//                   {loading
//                     ? "Verifying..."
//                     : "Verify & Login"}
//                 </button>

//                 <button
//                   type="button"
//                   onClick={changeMobile}
//                   disabled={loading}
//                   className="mt-3 w-full text-sm font-medium text-sky-600 hover:text-sky-700"
//                 >
//                   Change Mobile Number
//                 </button>
//               </>
//             )}

//             {/* MESSAGE */}
//             {message && (
//               <div
//                 className={`mt-4 rounded-lg p-3 text-center text-sm ${messageClass}`}
//               >
//                 {message}
//               </div>
//             )}
//           </div>

//           <p className="mt-5 text-center text-xs text-slate-400">
//             Your mobile number is used to securely
//             access your worker account.
//           </p>
//         </div>
//       </main>
//     </>
//   );
// }

