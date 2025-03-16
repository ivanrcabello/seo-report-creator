import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { LocalSeoReportView } from "@/components/LocalSeoReportView";
import { SeoLocalReport, ClientDocument } from "@/types/client";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { Map, FileText, FileUp, Loader2, Settings, FileBarChart } from "lucide-react";
import { FileUploader } from "@/components/FileUploader";
import { useToast } from "@/components/ui/use-toast";
import { extractFileContent, getFileType } from "@/services/documentService";
import { generateLocalSeoAnalysis, createLocalSeoReport } from "@/services/localSeoService";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { LocalSeoSettingsForm } from "./LocalSeoSettingsForm";

interface LocalSeoTabProps {
  isGeneratingReport: boolean;
  localSeoReports: SeoLocalReport[];
  currentLocalSeoReport: SeoLocalReport | null;
  setCurrentLocalSeoReport: (report: SeoLocalReport) => void;
  setActiveTab: (tab: string) => void;
}

export const LocalSeoTab: React.FC<LocalSeoTabProps> = ({
  isGeneratingReport,
  localSeoReports,
  currentLocalSeoReport,
  setCurrentLocalSeoReport,
  setActiveTab
}) => {
  const { id } = useParams<{ id: string }>();
  const clientId = id || "";
  const { toast } = useToast();
  
  const [uploadedDocuments, setUploadedDocuments] = useState<ClientDocument[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [activeLocalTab, setActiveLocalTab] = useState<"report" | "upload" | "settings">("report");
  const [clientName, setClientName] = useState<string>("");

  useEffect(() => {
    if (localSeoReports.length > 0 && localSeoReports[0].businessName) {
      setClientName(localSeoReports[0].businessName);
    } else {
      const fetchClientName = async () => {
        if (!clientId) return;
        
        try {
          const { data, error } = await supabase
            .from('clients')
            .select('name')
            .eq('id', clientId)
            .single();
            
          if (error) throw error;
          if (data) {
            setClientName(data.name);
          }
        } catch (error) {
          console.error("Error fetching client name:", error);
        }
      };
      
      fetchClientName();
    }
  }, [clientId, localSeoReports]);

  useEffect(() => {
    if (localSeoReports.length > 0 && !isGeneratingReport) {
      setActiveLocalTab("report");
    }
  }, [localSeoReports, isGeneratingReport]);

  const handleFileUpload = async (file: File, content: string, type: "pdf" | "image" | "doc" | "text") => {
    if (!clientId) {
      toast({
        title: "Error",
        description: "ID de cliente no disponible",
        variant: "destructive",
      });
      return;
    }

    setIsUploading(true);
    try {
      const fileURL = URL.createObjectURL(file);

      const newDocument: ClientDocument = {
        id: `temp-${Date.now()}`,
        clientId: clientId,
        name: file.name,
        type: type,
        url: fileURL,
        uploadDate: new Date().toISOString(),
        analyzedStatus: "pending",
        content: content,
      };

      setUploadedDocuments(prev => [...prev, newDocument]);
      
      toast({
        title: "Documento añadido",
        description: `${file.name} ha sido añadido para el análisis SEO local.`,
      });
    } catch (error) {
      console.error("Error adding document:", error);
      toast({
        title: "Error",
        description: "No se pudo procesar el documento.",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  const generateSeoReport = async () => {
    if (uploadedDocuments.length === 0) {
      toast({
        title: "No hay documentos",
        description: "Sube al menos un documento para generar el informe SEO local.",
        variant: "destructive",
      });
      return;
    }

    if (!clientId) {
      toast({
        title: "Error",
        description: "ID de cliente no disponible",
        variant: "destructive",
      });
      return;
    }

    setIsAnalyzing(true);
    try {
      const { addDocument } = await import("@/services/documentService");
      
      const documentIds: string[] = [];
      
      for (const doc of uploadedDocuments) {
        if (doc.id.startsWith('temp-')) {
          const savedDoc = await addDocument({
            clientId: doc.clientId,
            name: doc.name,
            type: doc.type,
            url: doc.url,
            uploadDate: doc.uploadDate,
            analyzedStatus: doc.analyzedStatus,
            content: doc.content
          });
          documentIds.push(savedDoc.id);
        } else {
          documentIds.push(doc.id);
        }
      }

      let clientName = "Cliente";
      if (localSeoReports.length > 0 && localSeoReports[0].businessName) {
        clientName = localSeoReports[0].businessName;
      }

      const analysis = await generateLocalSeoAnalysis(documentIds, clientId, clientName);
      
      const report = await createLocalSeoReport(analysis, clientId, clientName);
      
      setUploadedDocuments([]);
      if (setCurrentLocalSeoReport) {
        setCurrentLocalSeoReport(report);
      }
      
      toast({
        title: "Informe generado",
        description: "El informe SEO local ha sido generado exitosamente.",
      });
      
      setActiveLocalTab("report");
      
    } catch (error) {
      console.error("Error generating SEO report:", error);
      toast({
        title: "Error",
        description: "No se pudo generar el informe SEO local.",
        variant: "destructive",
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  if (isGeneratingReport) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-16">
          <div className="w-16 h-16 border-4 border-green-500 border-t-transparent rounded-full animate-spin mb-6"></div>
          <p className="text-xl font-medium text-green-700 mb-3">Generando informe SEO local...</p>
          <p className="text-gray-500 max-w-md text-center">
            Estamos analizando los documentos, extrayendo información relevante y consultando datos de posicionamiento local
          </p>
        </CardContent>
      </Card>
    );
  }

  if (localSeoReports.length > 0) {
    const reportToShow = currentLocalSeoReport || localSeoReports[localSeoReports.length - 1];
    const previousReports = localSeoReports.filter(report => report.id !== reportToShow.id);
    
    return (
      <div className="space-y-6">
        <Tabs value={activeLocalTab} onValueChange={(value) => setActiveLocalTab(value as "report" | "upload" | "settings")}>
          <TabsList className="mb-4">
            <TabsTrigger value="report" className="flex items-center gap-1.5">
              <FileBarChart className="h-4 w-4" />
              Ver informe SEO local
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex items-center gap-1.5">
              <Settings className="h-4 w-4" />
              Configuración
            </TabsTrigger>
            <TabsTrigger value="upload" className="flex items-center gap-1.5">
              <FileUp className="h-4 w-4" />
              Subir documentos
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="report">
            <LocalSeoReportView report={reportToShow} />
            
            {previousReports.length > 0 && (
              <Card className="mt-6">
                <CardHeader>
                  <CardTitle className="text-lg">Informes SEO local anteriores</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {previousReports.map((report) => (
                      <div key={report.id} className="p-3 border rounded-lg hover:bg-gray-50 cursor-pointer transition-colors" onClick={() => setCurrentLocalSeoReport(report)}>
                        <div className="flex justify-between items-center">
                          <div>
                            <p className="font-medium">{report.title}</p>
                            <p className="text-sm text-gray-500">{format(new Date(report.date), "d MMM yyyy", { locale: es })}</p>
                          </div>
                          <Button variant="ghost" size="sm">Ver</Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>
          
          <TabsContent value="settings">
            <LocalSeoSettingsForm 
              clientId={clientId} 
              clientName={clientName}
            />
          </TabsContent>
          
          <TabsContent value="upload">
            <Card>
              <CardHeader>
                <CardTitle>Subir documentos para SEO local</CardTitle>
                <CardDescription>
                  Sube documentos relacionados con el negocio para generar un informe SEO local
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <FileUploader 
                  onFileUpload={handleFileUpload}
                  isLoading={isUploading}
                  allowedTypes={[".pdf", ".jpg", ".jpeg", ".png", ".doc", ".docx", ".txt"]}
                  maxSizeMB={25}
                />
                
                {uploadedDocuments.length > 0 && (
                  <div className="space-y-4">
                    <Separator />
                    <h3 className="font-medium text-lg">Documentos añadidos ({uploadedDocuments.length})</h3>
                    <div className="space-y-2">
                      {uploadedDocuments.map((doc) => (
                        <div key={doc.id} className="flex items-center gap-2 p-2 border rounded">
                          <FileText className="h-4 w-4 text-gray-500" />
                          <span className="text-sm">{doc.name}</span>
                        </div>
                      ))}
                    </div>
                    
                    <Button 
                      onClick={generateSeoReport} 
                      disabled={isAnalyzing || uploadedDocuments.length === 0}
                      className="w-full mt-4"
                    >
                      {isAnalyzing ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Generando informe...
                        </>
                      ) : (
                        'Generar informe SEO local'
                      )}
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Tabs defaultValue="settings">
        <TabsList className="mb-4">
          <TabsTrigger value="settings" className="flex items-center gap-1.5">
            <Settings className="h-4 w-4" />
            Configuración
          </TabsTrigger>
          <TabsTrigger value="upload" className="flex items-center gap-1.5">
            <FileUp className="h-4 w-4" />
            Subir documentos
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="settings">
          <LocalSeoSettingsForm 
            clientId={clientId} 
            clientName={clientName}
          />
        </TabsContent>
        
        <TabsContent value="upload">
          <Card>
            <CardHeader>
              <CardTitle>SEO Local</CardTitle>
              <CardDescription>
                Sube documentos relacionados con el negocio para crear un informe SEO local
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="text-center py-4">
                <Map className="w-16 h-16 text-green-200 mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">No hay informes SEO local</h3>
                <p className="text-gray-500 max-w-md mx-auto mb-6">
                  Para generar un informe SEO local, sube documentos relacionados con el negocio del cliente
                </p>
              </div>
              
              <FileUploader 
                onFileUpload={handleFileUpload}
                isLoading={isUploading}
                allowedTypes={[".pdf", ".jpg", ".jpeg", ".png", ".doc", ".docx", ".txt"]}
                maxSizeMB={25}
              />
              
              {uploadedDocuments.length > 0 && (
                <div className="space-y-4">
                  <Separator />
                  <h3 className="font-medium text-lg">Documentos añadidos ({uploadedDocuments.length})</h3>
                  <div className="space-y-2">
                    {uploadedDocuments.map((doc) => (
                      <div key={doc.id} className="flex items-center gap-2 p-2 border rounded">
                        <FileText className="h-4 w-4 text-gray-500" />
                        <span className="text-sm">{doc.name}</span>
                      </div>
                    ))}
                  </div>
                  
                  <Button 
                    onClick={generateSeoReport} 
                    disabled={isAnalyzing || uploadedDocuments.length === 0}
                    className="w-full mt-4"
                  >
                    {isAnalyzing ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Generando informe...
                      </>
                    ) : (
                      'Generar informe SEO local'
                    )}
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
