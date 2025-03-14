
import { CompanySettingsForm } from "@/components/CompanySettingsForm";

const CompanySettings = () => {
  return (
    <div className="container py-8">
      <h1 className="text-2xl font-bold mb-6">Configuración de la Empresa</h1>
      <CompanySettingsForm />
    </div>
  );
};

export default CompanySettings;
