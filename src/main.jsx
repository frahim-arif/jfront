// import { StrictMode } from 'react'
// import { createRoot } from 'react-dom/client'
// import './index.css'
// import App from './App.jsx'
// import { createBrowserRouter, RouterProvider } from 'react-router-dom'
// import Success from './pages/Success.jsx'
// import Failure from './pages/Failure.jsx'
// import Payments from './pages/Payments.jsx'

// const router = createBrowserRouter([
//   { path: '/', element: <App /> },
//   { path: '/success', element: <Success /> },
//   { path: '/failure', element: <Failure /> },
//   { path: '/payments', element: <Payments /> },
// ])

// createRoot(document.getElementById('root')).render(
//   <StrictMode>
//     <RouterProvider router={router} />
//   </StrictMode>,
// )

import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'

import Success from './pages/Success.jsx'
import Failure from './pages/Failure.jsx'
import Payments from './pages/Payments.jsx'
import Apply from './pages/Apply.jsx'
import OfferJob from './components/OfferJob.jsx'  // ✅ NEW IMPORT
import Pricing from './App/Pricing/page.jsx';
import PrivacyPolicy from './App/Privacy/page.jsx'
import Terms from './App/Terms/page.jsx'
import Contact from './App/Contact/page.jsx'
import Disclaimer from './App/Disclaimer/page.jsx'
import Admin from './App/Admin/page.jsx'

const router = createBrowserRouter([
  { path: '/', element: <App /> },
  { path: '/apply/:jobId', element: <Apply /> },
  { path: '/success', element: <Success /> },
  { path: '/failure', element: <Failure /> },
  { path: '/payments', element: <Payments /> },
   { path: '/pricing', element: <Pricing /> },
    { path: '/privacy', element: <PrivacyPolicy /> },
    { path: '/terms', element: <Terms /> },
    { path: '/contact', element: <Contact /> },
    { path: '/disclaimer', element: <Disclaimer /> },
    { path: '/admin', element: <Admin /> },
  // ✅ NEW ROUTE
  { path: '/offer-job', element: <OfferJob /> },
])

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
)
