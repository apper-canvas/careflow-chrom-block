import { RouterProvider, createBrowserRouter } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import React from "react";
import Dashboard from "@/components/pages/Dashboard";
import Appointments from "@/components/pages/Appointments";
import Reports from "@/components/pages/Reports";
import Patients from "@/components/pages/Patients";
import Departments from "@/components/pages/Departments";
import PatientDetail from "@/components/pages/PatientDetail";
import Layout from "@/components/organisms/Layout";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        index: true,
        element: <Dashboard />,
      },
      {
        path: "appointments",
        element: <Appointments />,
      },
      {
        path: "reports",
        element: <Reports />,
      },
      {
        path: "patients",
        element: <Patients />,
      },
      {
        path: "patients/:id",
        element: <PatientDetail />,
      },
      {
        path: "departments",
        element: <Departments />,
      },
    ],
  },
]);
function App() {
  return (
    <>
      <RouterProvider router={router} />
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </>
  );
}

export default App;