
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Clients from "./pages/Clients";
import ClientDetail from "./pages/ClientDetail";
import ReportDetail from "./pages/ReportDetail";
import ReportForm from "./pages/ReportForm";
import NotFound from "./pages/NotFound";
import SeoReport from "./pages/SeoReport";
import AllReports from "./pages/AllReports";
import Packages from "./pages/Packages";
import Proposals from "./pages/Proposals";
import ProposalForm from "./pages/ProposalForm";
import ProposalDetail from "./pages/ProposalDetail";
import ReportShare from "./pages/ReportShare";
import ProposalShare from "./pages/ProposalShare";
import { Toaster } from "./components/ui/sonner"
import "./App.css";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/clients" element={<Clients />} />
        <Route path="/clients/:id" element={<ClientDetail />} />
        <Route path="/reports/:id" element={<ReportDetail />} />
        <Route path="/reports/edit/:id" element={<ReportForm />} />
        <Route path="/reports/new/:clientId" element={<ReportForm />} />
        <Route path="/report" element={<SeoReport />} />
        <Route path="/reports" element={<AllReports />} />
        <Route path="/packages" element={<Packages />} />
        <Route path="/proposals" element={<Proposals />} />
        <Route path="/proposals/new/:clientId/:packId" element={<ProposalForm />} />
        <Route path="/proposals/edit/:id" element={<ProposalForm />} />
        <Route path="/proposals/:id" element={<ProposalDetail />} />
        <Route path="/report-share/:id" element={<ReportShare />} />
        <Route path="/proposal-share/:id" element={<ProposalShare />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      <Toaster />
    </BrowserRouter>
  );
}

export default App;
