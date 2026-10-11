
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";

import "./index.css";

// Main application
import App from "./App.jsx";

// Payment pages
import Success from "./pages/Success.jsx";
import Failure from "./pages/Failure.jsx";
import Payments from "./pages/Payments.jsx";
import Payment from "./Payment";

// Job pages
import Apply from "./pages/Apply.jsx";
import OfferJob from "./components/OfferJob.jsx";
import WorkingWorkers from "./pages/WorkingWorkers.jsx";
import HealthcareJobs from "./HealthcareJobs";

// Worker pages
import WorkerRegister from "./pages/WorkerRegister.jsx";

// Public information pages
import Pricing from "./App/Pricing/page.jsx";
import PrivacyPolicy from "./App/Privacy/page.jsx";
import Terms from "./App/Terms/page.jsx";
import Contact from "./App/Contact/page.jsx";
import Disclaimer from "./App/Disclaimer/page.jsx";

// Main admin pages
import AdminDashboard from "./App/Admin/dashboard/page.jsx";
import AdminLogin from "./App/Admin/login/page.jsx";
import AdminWorkers from "./App/Admin/workers/page.jsx";

// Dimapur admin pages
import DimapurDashboard from "./App/Admin/dimapur/Dashboard.jsx";
import DimapurWorkers from "./App/Admin/dimapur/DimapurWorkerList.jsx";

// =========================================
// JOBHIR ROUTER
// =========================================

const router = createBrowserRouter([
  // Home
  {
    path: "/",
    element: <App />,
  },

  // Job application
  {
    path: "/apply/:jobId",
    element: <Apply />,
  },

  // Job posting
  {
    path: "/offer-job",
    element: <OfferJob />,
  },

  // Worker registration
  {
    path: "/worker-register",
    element: <WorkerRegister />,
  },

  // Working workers
  {
    path: "/working-workers",
    element: <WorkingWorkers />,
  },

  // Healthcare jobs
  {
    path: "/healthcare-jobs",
    element: <HealthcareJobs />,
  },

  // Payment
  {
    path: "/payment",
    element: <Payment />,
  },
  {
    path: "/payments",
    element: <Payments />,
  },
  {
    path: "/success",
    element: <Success />,
  },
  {
    path: "/failure",
    element: <Failure />,
  },

  // Pricing and policies
  {
    path: "/pricing",
    element: <Pricing />,
  },
  {
    path: "/privacy",
    element: <PrivacyPolicy />,
  },
  {
    path: "/terms",
    element: <Terms />,
  },
  {
    path: "/contact",
    element: <Contact />,
  },
  {
    path: "/disclaimer",
    element: <Disclaimer />,
  },

  // Main admin
  {
    path: "/admin/login",
    element: <AdminLogin />,
  },
  {
    path: "/admin/dashboard",
    element: <AdminDashboard />,
  },
  {
    path: "/admin/workers",
    element: <AdminWorkers />,
  },

  // Dimapur admin
  {
    path: "/admin/dimapur",
    element: <DimapurDashboard />,
  },
  {
    path: "/admin/dimapur/workers",
    element: <DimapurWorkers />,
  },
]);

// =========================================
// APPLICATION ENTRY POINT
// =========================================

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);