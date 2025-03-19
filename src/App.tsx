
import React from "react";
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import "./App.css";
import ClientDetail from "./pages/ClientDetail";
import Dashboard from "./pages/Dashboard";
import { TooltipProvider } from "@radix-ui/react-tooltip";
import { Toaster } from "sonner";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "./contexts/auth";
import Clients from "./pages/Clients";

function App() {
  return (
    <TooltipProvider>
      <Toaster position="top-center" />
      <RouterProvider router={router} />
    </TooltipProvider>
  );
}

// Create a router with only the routes that we have components for
const router = createBrowserRouter([
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
]);

// Main app initialization
function MainApp() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <App />
      </AuthProvider>
    </BrowserRouter>
  );
}

export default MainApp;
