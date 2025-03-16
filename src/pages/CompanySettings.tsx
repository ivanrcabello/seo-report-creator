
import React from "react";
import { SettingsNavigation } from "@/components/settings/SettingsNavigation";
import CompanySettingsForm from "@/components/settings/CompanySettingsForm";

const CompanySettings = () => {
  return (
    <div className="container py-8">
      <SettingsNavigation />
      <CompanySettingsForm />
    </div>
  );
};

export default CompanySettings;
