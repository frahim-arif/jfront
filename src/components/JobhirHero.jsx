// import { useEffect, useState } from "react";
// import { ArrowRight, MapPin, Search, UserPlus, Plus, Phone, ShieldCheck } from "lucide-react";

// /* ======================================================
//    JOBHIR — HERO + HOW IT WORKS + CLOCK
//    Drop this file next to App.jsx, then:

//    1) import { Hero, HowItWorks, LiveClock } from "./JobhirHero.jsx";
//    2) In App.jsx replace the whole "COMPACT PREMIUM ACTION AREA"
//       <section> with:

//       <Hero
//         stateList={stateList}
//         selectedState={selectedState}
//         workTypes={workTypeCategories.map((c) => c.workType)}
//         selectedWorkType={selectedWorkType}
//         totalJobs={availableJobs.length}
//         onSearch={({ state, workType }) => {
//           setSelectedState(state);
//           setSelectedWorkType(workType);
//           setTimeout(scrollToJobs, 50);
//         }}
//         onPostJob={() => navigate("/offer-job")}
//         onRegister={() => navigate("/worker-register")}
//       />

//    3) Put <HowItWorks /> right after the Worker Registration offer.
//    4) Replace {currentTime} in the marquee with <LiveClock />
//       and delete the currentTime state + its setInterval effect.
//       (Right now the whole App re-renders every second.)
//    5) Add id="jobs" to the <main> tag (scrollToJobs needs it).
//    6) Add to index.html <head> for Hindi text:
//       <link href="https://fonts.googleapis.com/css2?family=Mukta:wght@500;700;800&display=swap" rel="stylesheet">
//    ====================================================== */

// const GOLD = "#c8ae6a";

// /* ---------- Clock (isolated so App does not re-render) ---------- */
// export function LiveClock() {
//   const [now, setNow] = useState("");
//   useEffect(() => {
//     const tick = () =>
//       setNow(
//         new Date().toLocaleString("en-IN", {
//           weekday: "short",
//           day: "2-digit",
//           month: "short",
//           hour: "2-digit",
//           minute: "2-digit",
//         })
//       );
//     tick();
//     const t = setInterval(tick, 30000);
//     return () => clearInterval(t);
//   }, []);
//   return <span className="text-slate-300">{now}</span>;
// }

// /* ---------- Hero ---------- */
// export function Hero({
//   stateList = [],
//   selectedState = "All",
//   workTypes = [],
//   selectedWorkType = null,
//   totalJobs = 0,
//   onSearch,
//   onPostJob,
//   onRegister,
// }) {
//   const [state, setState] = useState(selectedState);
//   const [workType, setWorkType] = useState(selectedWorkType || "");

//   const submit = (e) => {
//     e.preventDefault();
//     onSearch?.({ state, workType: workType || null });
//   };

//   const quick = workTypes.slice(0, 6);

//   return (
//     <section className="w-full px-3 pt-3 sm:px-5 lg:px-8 xl:px-10">
//       <div
//         className="relative overflow-hidden rounded-3xl border p-5 sm:p-8 lg:p-10"
//         style={{
//           borderColor: `${GOLD}66`,
//           background:
//             "radial-gradient(900px 420px at 85% -10%, rgba(200,174,106,.18), transparent 60%), linear-gradient(135deg,#071c19,#0b302a 60%,#123d32)",
//           fontFamily: "'Mukta', 'Poppins', system-ui, sans-serif",
//         }}
//       >
//         <div className="grid items-center gap-8 lg:grid-cols-[1.1fr_1fr]">
//           {/* LEFT — message */}
//           <div>
//             <p className="mb-3 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 py-1 text-xs font-semibold text-emerald-200">
//               <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-400" />
//               {totalJobs > 0 ? `${totalJobs} jobs open right now` : "New jobs added daily"}
//             </p>

//             <h1 className="text-[2rem] font-extrabold leading-[1.15] text-white sm:text-5xl">
//               काम ढूंढिए,
//               <br />
//               अपने शहर में।
//             </h1>
//             <p className="mt-3 max-w-md text-base leading-relaxed text-white/75 sm:text-lg">
//               Mason, electrician, driver, painter and more. Pick your work and
//               your state, then apply in a minute.
//             </p>

//             <div className="mt-6 flex flex-wrap gap-3">
//               <button
//                 type="button"
//                 onClick={onRegister}
//                 className="inline-flex items-center gap-2 rounded-xl px-5 py-3 text-sm font-extrabold text-[#071c19] shadow-lg transition hover:brightness-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-200"
//                 style={{ background: `linear-gradient(90deg,#e2c77e,${GOLD})` }}
//               >
//                 <UserPlus className="h-4 w-4" />
//                 Register as worker
//               </button>

//               <button
//                 type="button"
//                 onClick={onPostJob}
//                 className="inline-flex items-center gap-2 rounded-xl border border-white/25 bg-white/5 px-5 py-3 text-sm font-bold text-white transition hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60"
//               >
//                 <Plus className="h-4 w-4" />
//                 Post a job, free
//               </button>
//             </div>

//             <p className="mt-5 flex items-center gap-2 text-xs text-white/60">
//               <ShieldCheck className="h-4 w-4" style={{ color: GOLD }} />
//               Employers are listed with their address and location on the map.
//             </p>
//           </div>

//           {/* RIGHT — search card (the one memorable element) */}
//           <form
//             onSubmit={submit}
//             className="rounded-2xl bg-[#faf8ef] p-4 shadow-[0_20px_50px_rgba(0,0,0,.35)] sm:p-6"
//           >
//             <h2 className="text-lg font-extrabold text-[#071c19]">
//               Find work near you
//             </h2>
//             <p className="mb-4 text-sm text-[#53665d]">
//               Choose what you do and where.
//             </p>

//             <label className="mb-1 block text-xs font-bold text-[#53665d]" htmlFor="hero-work">
//               Work type
//             </label>
//             <div className="relative mb-3">
//               <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#8d7947]" />
//               <select
//                 id="hero-work"
//                 value={workType}
//                 onChange={(e) => setWorkType(e.target.value)}
//                 className="h-12 w-full cursor-pointer appearance-none rounded-xl border border-[#d9d5c7] bg-white pl-10 pr-3 text-sm font-semibold text-[#172d27] outline-none focus:border-[#c8ae6a] focus:ring-2 focus:ring-[#c8ae6a]/30"
//               >
//                 <option value="">Any work</option>
//                 {workTypes.map((w) => (
//                   <option key={w} value={w}>
//                     {w}
//                   </option>
//                 ))}
//               </select>
//             </div>

//             <label className="mb-1 block text-xs font-bold text-[#53665d]" htmlFor="hero-state">
//               State
//             </label>
//             <div className="relative mb-4">
//               <MapPin className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#8d7947]" />
//               <select
//                 id="hero-state"
//                 value={state}
//                 onChange={(e) => setState(e.target.value)}
//                 className="h-12 w-full cursor-pointer appearance-none rounded-xl border border-[#d9d5c7] bg-white pl-10 pr-3 text-sm font-semibold text-[#172d27] outline-none focus:border-[#c8ae6a] focus:ring-2 focus:ring-[#c8ae6a]/30"
//               >
//                 <option value="All">All India</option>
//                 {stateList.map((s) => (
//                   <option key={s} value={s}>
//                     {s}
//                   </option>
//                 ))}
//               </select>
//             </div>

//             <button
//               type="submit"
//               className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-[#071c19] text-sm font-extrabold text-white transition hover:bg-[#123d32] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#c8ae6a]"
//             >
//               Show jobs
//               <ArrowRight className="h-4 w-4" />
//             </button>

//             {quick.length > 0 && (
//               <div className="mt-4 flex flex-wrap gap-2">
//                 {quick.map((w) => (
//                   <button
//                     key={w}
//                     type="button"
//                     onClick={() => onSearch?.({ state, workType: w })}
//                     className="rounded-full border border-[#e6e0cd] bg-white px-3 py-1.5 text-xs font-bold text-[#172d27] transition hover:border-[#c8ae6a]"
//                   >
//                     {w}
//                   </button>
//                 ))}
//               </div>
//             )}
//           </form>
//         </div>
//       </div>
//     </section>
//   );
// }

// /* ---------- How it works (a real sequence, so numbered) ---------- */
// export function HowItWorks() {
//   const steps = [
//     { t: "Register", d: "Create your worker profile with your trade and mobile number." },
//     { t: "Pick a job", d: "Open a category, check the pay and see the address on the map." },
//     { t: "Apply and get called", d: "Pay the small application fee and the employer can contact you." },
//   ];

//   return (
//     <section className="px-3 pt-6 sm:px-5 lg:px-8 xl:px-10">
//       <h2 className="mb-4 text-xl font-extrabold text-[#071c19] sm:text-2xl">
//         How JobHir works
//       </h2>
//       <ol className="grid gap-3 sm:grid-cols-3">
//         {steps.map((s, i) => (
//           <li
//             key={s.t}
//             className="flex gap-4 rounded-2xl border border-[#e6e0cd] bg-white p-4"
//           >
//             <span
//               className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-lg font-extrabold text-[#071c19]"
//               style={{ background: `linear-gradient(135deg,#e2c77e,${GOLD})` }}
//             >
//               {i + 1}
//             </span>
//             <div>
//               <h3 className="font-extrabold text-[#071c19]">{s.t}</h3>
//               <p className="mt-1 text-sm leading-relaxed text-[#53665d]">{s.d}</p>
//             </div>
//           </li>
//         ))}
//       </ol>
//     </section>
//   );
// }