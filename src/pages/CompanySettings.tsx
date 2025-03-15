
import { CompanySettingsForm } from "@/components/CompanySettingsForm";

const CompanySettings = () => {
  return (
    <div className="container py-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-gradient-to-r from-seo-blue to-seo-purple text-white p-6 rounded-t-lg">
          <h1 className="text-2xl font-bold">Configuración de la Empresa</h1>
          <p className="text-white/80 mt-1">Personaliza la información de tu empresa para facturas y documentos</p>
        </div>
        <div className="bg-white p-6 rounded-b-lg shadow-md">
          <CompanySettingsForm />
        </div>
      </div>
    </div>
  );
};

export default CompanySettings;
