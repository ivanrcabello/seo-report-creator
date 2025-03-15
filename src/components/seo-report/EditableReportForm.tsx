
import { useState, useEffect } from "react";
import { AIReport } from "@/services/aiReportService";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { getSeoPacks } from "@/services/packService";
import { SeoPack } from "@/types/client";
import { EditableFormIntroduction } from "./EditableFormIntroduction";
import { EditableFormWebAnalysis } from "./EditableFormWebAnalysis";
import { EditableFormStrategy } from "./EditableFormStrategy";
import { EditableFormPackages } from "./EditableFormPackages";
import { EditableFormConclusion } from "./EditableFormConclusion";

interface EditableReportFormProps {
  initialReport: AIReport;
  onSave: (updatedReport: AIReport) => void;
}

export const EditableReportForm = ({ initialReport, onSave }: EditableReportFormProps) => {
  const [report, setReport] = useState<AIReport>(initialReport);
  const [availablePacks, setAvailablePacks] = useState<SeoPack[]>([]);
  const [isLoadingPacks, setIsLoadingPacks] = useState(false);
  const { toast } = useToast();

  // Fetch available SEO packages
  useEffect(() => {
    const loadPacks = async () => {
      setIsLoadingPacks(true);
      try {
        const packs = await getSeoPacks();
        setAvailablePacks(packs);
      } catch (error) {
        console.error("Error loading SEO packages:", error);
        toast({
          title: "Error",
          description: "No se pudieron cargar los paquetes disponibles",
          variant: "destructive"
        });
      } finally {
        setIsLoadingPacks(false);
      }
    };
    
    loadPacks();
  }, [toast]);

  // Helper function to update nested objects
  const updateReport = (field: string, value: any) => {
    setReport(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Helper function to update strategy sections
  const updateStrategy = (section: "technicalOptimization" | "localSeo" | "contentCreation" | "linkBuilding", index: number, value: string) => {
    if (!report.strategy) return;
    
    const updatedSection = [...(report.strategy[section] || [])];
    updatedSection[index] = value;
    
    setReport(prev => ({
      ...prev,
      strategy: {
        ...prev.strategy,
        [section]: updatedSection
      }
    }));
  };

  // Add new item to a strategy section
  const addStrategyItem = (section: "technicalOptimization" | "localSeo" | "contentCreation" | "linkBuilding") => {
    if (!report.strategy) return;
    
    const updatedSection = [...(report.strategy[section] || []), "Nueva recomendación"];
    
    setReport(prev => ({
      ...prev,
      strategy: {
        ...prev.strategy,
        [section]: updatedSection
      }
    }));
  };

  // Remove item from a strategy section
  const removeStrategyItem = (section: "technicalOptimization" | "localSeo" | "contentCreation" | "linkBuilding", index: number) => {
    if (!report.strategy) return;
    
    const updatedSection = [...(report.strategy[section] || [])];
    updatedSection.splice(index, 1);
    
    setReport(prev => ({
      ...prev,
      strategy: {
        ...prev.strategy,
        [section]: updatedSection
      }
    }));
  };

  // Add new priority keyword
  const addPriorityKeyword = () => {
    const newKeyword = {
      keyword: "",
      position: 0,
      volume: 0,
      difficulty: 0,
      recommendation: ""
    };
    
    setReport(prev => ({
      ...prev,
      priorityKeywords: [...(prev.priorityKeywords || []), newKeyword]
    }));
  };

  // Update priority keyword
  const updatePriorityKeyword = (index: number, field: string, value: any) => {
    if (!report.priorityKeywords) return;
    
    const updatedKeywords = [...report.priorityKeywords];
    updatedKeywords[index] = {
      ...updatedKeywords[index],
      [field]: value
    };
    
    setReport(prev => ({
      ...prev,
      priorityKeywords: updatedKeywords
    }));
  };

  // Remove priority keyword
  const removePriorityKeyword = (index: number) => {
    if (!report.priorityKeywords) return;
    
    const updatedKeywords = [...report.priorityKeywords];
    updatedKeywords.splice(index, 1);
    
    setReport(prev => ({
      ...prev,
      priorityKeywords: updatedKeywords
    }));
  };

  // Add new competitor
  const addCompetitor = () => {
    const newCompetitor = {
      name: "",
      trafficScore: 0,
      keywordsCount: 0,
      backlinksCount: 0,
      analysis: ""
    };
    
    setReport(prev => ({
      ...prev,
      competitors: [...(prev.competitors || []), newCompetitor]
    }));
  };

  // Update competitor
  const updateCompetitor = (index: number, field: string, value: any) => {
    if (!report.competitors) return;
    
    const updatedCompetitors = [...report.competitors];
    updatedCompetitors[index] = {
      ...updatedCompetitors[index],
      [field]: value
    };
    
    setReport(prev => ({
      ...prev,
      competitors: updatedCompetitors
    }));
  };

  // Remove competitor
  const removeCompetitor = (index: number) => {
    if (!report.competitors) return;
    
    const updatedCompetitors = [...report.competitors];
    updatedCompetitors.splice(index, 1);
    
    setReport(prev => ({
      ...prev,
      competitors: updatedCompetitors
    }));
  };

  // Add new package
  const addPackage = () => {
    const newPackage = {
      name: "Nuevo Paquete",
      price: 0,
      features: ["Característica 1"]
    };
    
    setReport(prev => ({
      ...prev,
      packages: [...(prev.packages || []), newPackage]
    }));
  };

  // Add package from available packs
  const addPackageFromAvailable = (packId: string) => {
    const selectedPack = availablePacks.find(pack => pack.id === packId);
    
    if (!selectedPack) return;
    
    const newPackage = {
      name: selectedPack.name,
      price: selectedPack.price,
      features: [...selectedPack.features]
    };
    
    setReport(prev => ({
      ...prev,
      packages: [...(prev.packages || []), newPackage]
    }));
    
    toast({
      title: "Paquete añadido",
      description: `Se ha añadido el paquete ${selectedPack.name} al informe.`
    });
  };

  // Update package
  const updatePackage = (index: number, field: string, value: any) => {
    if (!report.packages) return;
    
    const updatedPackages = [...report.packages];
    updatedPackages[index] = {
      ...updatedPackages[index],
      [field]: value
    };
    
    setReport(prev => ({
      ...prev,
      packages: updatedPackages
    }));
  };

  // Update package feature
  const updatePackageFeature = (packageIndex: number, featureIndex: number, value: string) => {
    if (!report.packages) return;
    
    const updatedPackages = [...report.packages];
    const updatedFeatures = [...updatedPackages[packageIndex].features];
    updatedFeatures[featureIndex] = value;
    
    updatedPackages[packageIndex] = {
      ...updatedPackages[packageIndex],
      features: updatedFeatures
    };
    
    setReport(prev => ({
      ...prev,
      packages: updatedPackages
    }));
  };

  // Add feature to package
  const addPackageFeature = (packageIndex: number) => {
    if (!report.packages) return;
    
    const updatedPackages = [...report.packages];
    updatedPackages[packageIndex] = {
      ...updatedPackages[packageIndex],
      features: [...updatedPackages[packageIndex].features, "Nueva característica"]
    };
    
    setReport(prev => ({
      ...prev,
      packages: updatedPackages
    }));
  };

  // Remove feature from package
  const removePackageFeature = (packageIndex: number, featureIndex: number) => {
    if (!report.packages) return;
    
    const updatedPackages = [...report.packages];
    const updatedFeatures = [...updatedPackages[packageIndex].features];
    updatedFeatures.splice(featureIndex, 1);
    
    updatedPackages[packageIndex] = {
      ...updatedPackages[packageIndex],
      features: updatedFeatures
    };
    
    setReport(prev => ({
      ...prev,
      packages: updatedPackages
    }));
  };

  // Remove package
  const removePackage = (index: number) => {
    if (!report.packages) return;
    
    const updatedPackages = [...report.packages];
    updatedPackages.splice(index, 1);
    
    setReport(prev => ({
      ...prev,
      packages: updatedPackages
    }));
  };

  // Handle save
  const handleSave = () => {
    onSave(report);
    toast({
      title: "Informe guardado",
      description: "Los cambios han sido guardados correctamente."
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Editar Informe SEO</h2>
        <Button onClick={handleSave}>Guardar Cambios</Button>
      </div>

      <EditableFormIntroduction 
        introduction={report.introduction || ""}
        onUpdate={(value) => updateReport("introduction", value)}
      />

      <EditableFormWebAnalysis 
        authorityScore={report.authorityScore || 0}
        authorityScoreComment={report.authorityScoreComment || ""}
        organicTraffic={report.organicTraffic || ""}
        organicTrafficComment={report.organicTrafficComment || ""}
        keywordsPositioned={report.keywordsPositioned || ""}
        keywordsComment={report.keywordsComment || ""}
        backlinksCount={report.backlinksCount || ""}
        backlinksComment={report.backlinksComment || ""}
        priorityKeywords={report.priorityKeywords}
        competitors={report.competitors}
        onUpdateField={updateReport}
        onUpdatePriorityKeyword={updatePriorityKeyword}
        onAddPriorityKeyword={addPriorityKeyword}
        onRemovePriorityKeyword={removePriorityKeyword}
        onUpdateCompetitor={updateCompetitor}
        onAddCompetitor={addCompetitor}
        onRemoveCompetitor={removeCompetitor}
      />

      <EditableFormStrategy 
        strategy={report.strategy}
        onUpdateStrategy={updateStrategy}
        onAddStrategyItem={addStrategyItem}
        onRemoveStrategyItem={removeStrategyItem}
      />

      <EditableFormPackages 
        packages={report.packages}
        availablePacks={availablePacks}
        isLoadingPacks={isLoadingPacks}
        onUpdatePackage={updatePackage}
        onUpdatePackageFeature={updatePackageFeature}
        onAddPackageFeature={addPackageFeature}
        onRemovePackageFeature={removePackageFeature}
        onAddPackage={addPackage}
        onAddPackageFromAvailable={addPackageFromAvailable}
        onRemovePackage={removePackage}
      />

      <EditableFormConclusion 
        conclusion={report.conclusion || ""}
        contactEmail={report.contactEmail || ""}
        contactPhone={report.contactPhone || ""}
        onUpdateField={updateReport}
      />

      <div className="flex justify-end">
        <Button onClick={handleSave}>Guardar Cambios</Button>
      </div>
    </div>
  );
};
