
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Client } from "@/types/client";

export const useClientForm = (client?: Client) => {
  const form = useForm({
    defaultValues: {
      name: client?.name || "",
      email: client?.email || "",
      phone: client?.phone || "",
      company: client?.company || "",
      isActive: client?.isActive ?? true,
      website: client?.website || "",
      sector: client?.sector || "",
      // Campos tipo objeto que almacenan credenciales
      hostingUrl: client?.hostingDetails?.url || "",
      hostingUsername: client?.hostingDetails?.username || "",
      hostingPassword: client?.hostingDetails?.password || "",
      wordpressUrl: client?.wordpressAccess?.url || "",
      wordpressUsername: client?.wordpressAccess?.username || "",
      wordpressPassword: client?.wordpressAccess?.password || "",
      // Contraseñas adicionales del proyecto (como ejemplo añadimos FTP)
      ftpServer: client?.projectPasswords?.ftpServer || "",
      ftpUsername: client?.projectPasswords?.ftpUsername || "",
      ftpPassword: client?.projectPasswords?.ftpPassword || "",
    },
  });

  const [analyticsConnected, setAnalyticsConnected] = useState(client?.analyticsConnected ?? false);
  const [searchConsoleConnected, setSearchConsoleConnected] = useState(client?.searchConsoleConnected ?? false);
  
  const formatFormData = (data: any) => {
    // Formateamos los datos de credenciales como objetos JSON
    const hostingDetails = {
      url: data.hostingUrl,
      username: data.hostingUsername,
      password: data.hostingPassword
    };
    
    const wordpressAccess = {
      url: data.wordpressUrl,
      username: data.wordpressUsername,
      password: data.wordpressPassword
    };
    
    const projectPasswords = {
      ftpServer: data.ftpServer,
      ftpUsername: data.ftpUsername,
      ftpPassword: data.ftpPassword
    };
    
    // Eliminamos los campos individuales que ya hemos agrupado
    const { 
      hostingUrl, hostingUsername, hostingPassword,
      wordpressUrl, wordpressUsername, wordpressPassword,
      ftpServer, ftpUsername, ftpPassword,
      ...restData 
    } = data;
    
    // Incluimos los datos formateados y el estado de analytics/search console
    return {
      ...restData,
      analyticsConnected,
      searchConsoleConnected,
      hostingDetails,
      wordpressAccess,
      projectPasswords
    };
  };

  return {
    form,
    analyticsConnected,
    setAnalyticsConnected,
    searchConsoleConnected,
    setSearchConsoleConnected,
    formatFormData
  };
};
