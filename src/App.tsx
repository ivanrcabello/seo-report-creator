import React from "react";
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import "./App.css";
import ClientsList from "./components/ClientsList";
import ClientForm from "./pages/ClientForm";
import ClientDetail from "./pages/ClientDetail";
import ReportsList from "./components/ReportsList";
import ReportDetail from "./pages/ReportDetail";
import ReportForm from "./pages/ReportForm";
import ContractsList from "./components/contracts/ContractsList";
import ContractForm from "./components/contracts/ContractForm";
import ContractDetail from "./components/contracts/ContractDetail";
import InvoicesList from "./components/invoice/InvoicesList";
import InvoiceForm from "./components/invoice/InvoiceForm";
import InvoiceDetail from "./components/invoice/InvoiceDetail";
import ProposalsList from "./components/ClientProposalsList";
import ProposalForm from "./components/ProposalForm";
import ProposalDetail from "./components/ProposalDetail";
import { AppLayout } from "./components/layout/AppLayout";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import { useAuth } from "./contexts/AuthContext";
import { ProtectedRoute } from "./components/auth/ProtectedRoute";
import { PublicRoute } from "./components/auth/PublicRoute";
import { MantineProvider } from "@mantine/core";
import { ModalsProvider } from "@mantine/modals";
import { Notifications } from "@mantine/notifications";
import { LicenseAgreement } from "./components/legal/LicenseAgreement";
import { TermsOfService } from "./components/legal/TermsOfService";
import { PrivacyPolicy } from "./components/legal/PrivacyPolicy";
import { Support } from "./pages/Support";
import { Profile } from "./pages/Profile";
import { ForgotPassword } from "./pages/ForgotPassword";
import { ResetPassword } from "./pages/ResetPassword";
import { TicketsList } from "./components/tickets/TicketsList";
import { TicketDetail } from "./components/tickets/TicketDetail";
import { Settings } from "./pages/Settings";
import { UsersList } from "./components/users/UsersList";
import { UserForm } from "./components/users/UserForm";
import { Pricing } from "./pages/Pricing";
import { Upgrade } from "./pages/Upgrade";
import { GoogleAnalytics } from "./integrations/analytics/GoogleAnalytics";

function App() {
  return (
    <MantineProvider withGlobalStyles withNormalizeCSS theme={{ colorScheme: 'light' }}>
      <ModalsProvider>
        <Notifications position="top-center" />
        <GoogleAnalytics />
        <MainApp />
      </ModineProvider>
  );
}

function MainApp() {
  const { isLoggedIn } = useAuth();

  const router = createBrowserRouter([
    {
      path: "/login",
      element: <PublicRoute><Login /></PublicRoute>
    },
    {
      path: "/forgot-password",
      element: <PublicRoute><ForgotPassword /></PublicRoute>
    },
    {
      path: "/reset-password",
      element: <PublicRoute><ResetPassword /></PublicRoute>
    },
    {
      path: "/license",
      element: <LicenseAgreement />
    },
    {
      path: "/terms",
      element: <TermsOfService />
    },
    {
      path: "/privacy",
      element: <PrivacyPolicy />
    },
    {
      path: "/",
      element: <ProtectedRoute><AppLayout><Dashboard /></AppLayout></ProtectedRoute>
    },
    {
      path: "/dashboard",
      element: <ProtectedRoute><AppLayout><Dashboard /></AppLayout></ProtectedRoute>
    },
    {
      path: "/clients",
      element: <ProtectedRoute><AppLayout><ClientsList /></AppLayout></ProtectedRoute>
    },
    {
      path: "/clients/new",
      element: <ProtectedRoute><AppLayout><ClientForm /></AppLayout></ProtectedRoute>
    },
    {
      path: "/clients/edit/:clientId",
      element: <ProtectedRoute><AppLayout><ClientForm /></AppLayout></ProtectedRoute>
    },
    {
      path: "/clients/:clientId",
      element: <ProtectedRoute><AppLayout><ClientDetail /></AppLayout></ProtectedRoute>
    },
    {
      path: "/reports",
      element: <ProtectedRoute><AppLayout><ReportsList /></AppLayout></ProtectedRoute>
    },
    {
      path: "/reports/new",
      element: <ProtectedRoute><AppLayout><ReportForm /></AppLayout></ProtectedRoute>
    },
    {
      path: "/reports/edit/:reportId",
      element: <ProtectedRoute><AppLayout><ReportForm /></AppLayout></ProtectedRoute>
    },
    {
      path: "/reports/:reportId",
      element: <ProtectedRoute><AppLayout><ReportDetail /></AppLayout></ProtectedRoute>
    },
    {
      path: "/contracts",
      element: <ProtectedRoute><AppLayout><ContractsList /></AppLayout></ProtectedRoute>
    },
    {
      path: "/contracts/new",
      element: <ProtectedRoute><AppLayout><ContractForm /></AppLayout></ProtectedRoute>
    },
    {
      path: "/contracts/edit/:contractId",
      element: <ProtectedRoute><AppLayout><ContractForm /></AppLayout></ProtectedRoute>
    },
    {
      path: "/contracts/:contractId",
      element: <ProtectedRoute><AppLayout><ContractDetail /></AppLayout></ProtectedRoute>
    },
    {
      path: "/invoices",
      element: <ProtectedRoute><AppLayout><InvoicesList /></AppLayout></ProtectedRoute>
    },
    {
      path: "/invoices/new",
      element: <ProtectedRoute><AppLayout><InvoiceForm /></AppLayout></ProtectedRoute>
    },
    {
      path: "/invoices/edit/:invoiceId",
      element: <ProtectedRoute><AppLayout><InvoiceForm /></AppLayout></ProtectedRoute>
    },
    {
      path: "/invoices/:invoiceId",
      element: <ProtectedRoute><AppLayout><InvoiceDetail /></AppLayout></ProtectedRoute>
    },
    {
      path: "/proposals",
      element: <ProtectedRoute><AppLayout><ProposalsList /></AppLayout></ProtectedRoute>
    },
    {
      path: "/proposals/new",
      element: <ProtectedRoute><AppLayout><ProposalForm /></AppLayout></ProtectedRoute>
    },
    {
      path: "/proposals/edit/:proposalId",
      element: <ProtectedRoute><AppLayout><ProposalForm /></AppLayout></ProtectedRoute>
    },
    {
      path: "/proposals/:proposalId",
      element: <ProtectedRoute><AppLayout><ProposalDetail /></AppLayout></ProtectedRoute>
    },
    {
      path: "/support",
      element: <ProtectedRoute><AppLayout><Support /></AppLayout></ProtectedRoute>
    },
    {
      path: "/profile",
      element: <ProtectedRoute><AppLayout><Profile /></AppLayout></ProtectedRoute>
    },
    {
      path: "/tickets",
      element: <ProtectedRoute><AppLayout><TicketsList /></AppLayout></ProtectedRoute>
    },
    {
      path: "/tickets/:ticketId",
      element: <ProtectedRoute><AppLayout><TicketDetail /></AppLayout></ProtectedRoute>
    },
    {
      path: "/settings",
      element: <ProtectedRoute><AppLayout><Settings /></AppLayout></ProtectedRoute>
    },
    {
      path: "/users",
      element: <ProtectedRoute><AppLayout><UsersList /></AppLayout></ProtectedRoute>
    },
    {
      path: "/users/new",
      element: <ProtectedRoute><AppLayout><UserForm /></AppLayout></ProtectedRoute>
    },
    {
      path: "/users/edit/:userId",
      element: <ProtectedRoute><AppLayout><UserForm /></AppLayout></ProtectedRoute>
    },
    {
      path: "/pricing",
      element: <ProtectedRoute><AppLayout><Pricing /></AppLayout></ProtectedRoute>
    },
    {
      path: "/upgrade",
      element: <ProtectedRoute><AppLayout><Upgrade /></AppLayout></ProtectedRoute>
    }
  ]);

  return <RouterProvider router={router} />;
}

export default App;
