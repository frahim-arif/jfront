import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";

import App from "./App.jsx";

import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";

import Success from "./pages/Success.jsx";
import Failure from "./pages/Failure.jsx";
import Payments from "./pages/Payments.jsx";
import Apply from "./pages/Apply.jsx";
import OfferJob from "./components/OfferJob.jsx";
import Pricing from "./App/Pricing/page.jsx";
import PrivacyPolicy from "./App/Privacy/page.jsx";
import Terms from "./App/Terms/page.jsx";
import Contact from "./App/Contact/page.jsx";
import Disclaimer from "./App/Disclaimer/page.jsx";

import WorkerRegister from "./pages/WorkerRegister.jsx";
// import WorkerLogin from "./pages/WorkerLogin.jsx";
import HealthcareJobs from "./HealthcareJobs";
import AdminDashboard from "./App/Admin/dashboard/page.jsx";
import AdminLogin from "./App/Admin/login/page.jsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
  },

  {
    path: "/apply/:jobId",
    element: <Apply />,
  },

  {
    path: "/success",
    element: <Success />,
  },

  {
    path: "/failure",
    element: <Failure />,
  },

  {
    path: "/payments",
    element: <Payments />,
  },

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

  
  // OFFER JOB
  {
    path: "/offer-job",
    element: <OfferJob />,
  },

  {
  path: "/healthcare-jobs",
  element: <HealthcareJobs />,
},
// WORKER LOGIN
// {
//   path: "/worker-login",
//   element: <WorkerLogin />,
// },
 

  // WORKER REGISTER
  {
    path: "/worker-register",
    element: <WorkerRegister />,
  },
  {
  path: "/admin/dashboard",
  element: <AdminDashboard />,
},
  {
  path: "/admin/login",
  element: <AdminLogin />,
},
]);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);