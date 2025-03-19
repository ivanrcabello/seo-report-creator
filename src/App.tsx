
import React from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./App.css";
import ClientDetail from "./pages/ClientDetail";
import Dashboard from "./pages/Dashboard";
import { Toaster } from "sonner";
import { AuthProvider } from "./contexts/auth";
import Clients from "./pages/Clients";
import Login from "./pages/Login";
import Register from "./pages/Register";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { AppLayout } from "./components/AppLayout";
import { TooltipProvider } from "@radix-ui/react-tooltip";

// Create a router with the correct route structure
const router = createBrowserRouter([
  {
    path: "/login",
    element: <Login />
  },
  {
    path: "/register",
    element: <Register />
  },
  {
    path: "/",
    element: <ProtectedRoute />,
    children: [
      {
        element: <AppLayout />,
        children: [
          {
            path: "/",
            element: <Dashboard />
          },
          {
            path: "/dashboard",
            element: <Dashboard />
          },
          {
            path: "/clients",
            element: <Clients />
          },
          {
            path: "/clients/new",
            element: <Clients />
          },
          {
            path: "/clients/edit/:id",
            element: <Clients />
          },
          {
            path: "/clients/:clientId",
            element: <ClientDetail />
          }
        ]
      }
    ]
  }
]);

function App() {
  console.log("App component rendering");
  
  return (
    <AuthProvider>
      <TooltipProvider>
        <Toaster position="top-center" />
        <RouterProvider router={router} />
      </TooltipProvider>
    </AuthProvider>
  );
}

export default App;
