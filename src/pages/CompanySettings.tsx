import React from "react";
import CompanySettingsForm from "@/components/settings/CompanySettingsForm";
import { SettingsNavigation } from "@/components/settings/SettingsNavigation";

const CompanySettings = () => {
  return (
    <div className="container py-8">
      <SettingsNavigation />
      <CompanySettingsForm />
    </div>
  );
};

export default CompanySettings;
