
import React from "react";
import { SettingsNavigation } from "@/components/settings/SettingsNavigation";
import ApiKeysSettingsForm from "@/components/settings/ApiKeysSettingsForm";

const ApiSettings = () => {
  return (
    <div className="container py-8">
      <SettingsNavigation />
      <ApiKeysSettingsForm />
    </div>
  );
};

export default ApiSettings;
