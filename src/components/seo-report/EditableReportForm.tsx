
import { useState, useEffect } from "react";
import { AIReport } from "@/services/aiReportService";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ReportSection } from "./ReportSection";
import { BarChart, FileText, Globe, Settings, Phone, Mail, PlusCircle, Trash2 } from "lucide-react";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";

interface EditableReportFormProps {
  initialReport: AIReport;
  onSave: (updatedReport: AIReport) => void;
}

export const EditableReportForm = ({ initialReport, onSave }: EditableReportFormProps) => {
  const [report, setReport] = useState<AIReport>(initialReport);
  const { toast } = useToast();

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

      <Card>
        <CardHeader>
          <CardTitle>Introducción</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <Label htmlFor="introduction">Texto de introducción</Label>
              <Textarea 
                id="introduction" 
                value={report.introduction || ""} 
                onChange={(e) => updateReport("introduction", e.target.value)}
                className="min-h-[120px]"
                placeholder="Describe brevemente la empresa del cliente y el propósito del informe..."
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Análisis Actual de la Web</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div>
              <Label htmlFor="authorityScore">Authority Score (0-100)</Label>
              <Input 
                id="authorityScore" 
                type="number" 
                min="0" 
                max="100"
                value={report.authorityScore || 0} 
                onChange={(e) => updateReport("authorityScore", parseInt(e.target.value))}
              />
            </div>
            <div>
              <Label htmlFor="authorityScoreComment">Comentario sobre Authority Score</Label>
              <Input 
                id="authorityScoreComment" 
                value={report.authorityScoreComment || ""} 
                onChange={(e) => updateReport("authorityScoreComment", e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="organicTraffic">Tráfico orgánico mensual</Label>
              <Input 
                id="organicTraffic" 
                value={report.organicTraffic || ""} 
                onChange={(e) => updateReport("organicTraffic", e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="organicTrafficComment">Comentario sobre tráfico</Label>
              <Input 
                id="organicTrafficComment" 
                value={report.organicTrafficComment || ""} 
                onChange={(e) => updateReport("organicTrafficComment", e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="keywordsPositioned">Palabras clave posicionadas</Label>
              <Input 
                id="keywordsPositioned" 
                value={report.keywordsPositioned || ""} 
                onChange={(e) => updateReport("keywordsPositioned", e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="keywordsComment">Comentario sobre palabras clave</Label>
              <Input 
                id="keywordsComment" 
                value={report.keywordsComment || ""} 
                onChange={(e) => updateReport("keywordsComment", e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="backlinksCount">Backlinks actuales</Label>
              <Input 
                id="backlinksCount" 
                value={report.backlinksCount || ""} 
                onChange={(e) => updateReport("backlinksCount", e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="backlinksComment">Comentario sobre backlinks</Label>
              <Input 
                id="backlinksComment" 
                value={report.backlinksComment || ""} 
                onChange={(e) => updateReport("backlinksComment", e.target.value)}
              />
            </div>
          </div>

          <h3 className="text-lg font-medium mb-2">Palabras Clave Prioritarias</h3>
          {report.priorityKeywords && report.priorityKeywords.map((keyword, index) => (
            <div key={index} className="border p-4 rounded-md mb-4">
              <div className="flex justify-between mb-2">
                <h4 className="font-medium">Palabra clave #{index + 1}</h4>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => removePriorityKeyword(index)}
                >
                  <Trash2 className="h-4 w-4 text-red-500" />
                </Button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <Label>Palabra clave</Label>
                  <Input 
                    value={keyword.keyword} 
                    onChange={(e) => updatePriorityKeyword(index, "keyword", e.target.value)}
                  />
                </div>
                <div>
                  <Label>Posición</Label>
                  <Input 
                    type="number" 
                    value={keyword.position || 0} 
                    onChange={(e) => updatePriorityKeyword(index, "position", parseInt(e.target.value))}
                  />
                </div>
                <div>
                  <Label>Volumen</Label>
                  <Input 
                    type="number" 
                    value={keyword.volume || 0} 
                    onChange={(e) => updatePriorityKeyword(index, "volume", parseInt(e.target.value))}
                  />
                </div>
                <div>
                  <Label>Dificultad</Label>
                  <Input 
                    type="number" 
                    min="0" 
                    max="100" 
                    value={keyword.difficulty || 0} 
                    onChange={(e) => updatePriorityKeyword(index, "difficulty", parseInt(e.target.value))}
                  />
                </div>
                <div className="col-span-2">
                  <Label>Recomendación</Label>
                  <Textarea 
                    value={keyword.recommendation || ""} 
                    onChange={(e) => updatePriorityKeyword(index, "recommendation", e.target.value)}
                  />
                </div>
              </div>
            </div>
          ))}
          <Button 
            variant="outline" 
            onClick={addPriorityKeyword} 
            className="w-full mt-2"
          >
            <PlusCircle className="h-4 w-4 mr-2" /> Añadir palabra clave
          </Button>

          <h3 className="text-lg font-medium mt-6 mb-2">Análisis de Competidores</h3>
          {report.competitors && report.competitors.map((competitor, index) => (
            <div key={index} className="border p-4 rounded-md mb-4">
              <div className="flex justify-between mb-2">
                <h4 className="font-medium">Competidor #{index + 1}</h4>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => removeCompetitor(index)}
                >
                  <Trash2 className="h-4 w-4 text-red-500" />
                </Button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <Label>Nombre</Label>
                  <Input 
                    value={competitor.name} 
                    onChange={(e) => updateCompetitor(index, "name", e.target.value)}
                  />
                </div>
                <div>
                  <Label>Tráfico (score)</Label>
                  <Input 
                    type="number" 
                    value={competitor.trafficScore || 0} 
                    onChange={(e) => updateCompetitor(index, "trafficScore", parseInt(e.target.value))}
                  />
                </div>
                <div>
                  <Label>Número de keywords</Label>
                  <Input 
                    type="number" 
                    value={competitor.keywordsCount || 0} 
                    onChange={(e) => updateCompetitor(index, "keywordsCount", parseInt(e.target.value))}
                  />
                </div>
                <div>
                  <Label>Número de backlinks</Label>
                  <Input 
                    type="number" 
                    value={competitor.backlinksCount || 0} 
                    onChange={(e) => updateCompetitor(index, "backlinksCount", parseInt(e.target.value))}
                  />
                </div>
                <div className="col-span-2">
                  <Label>Análisis</Label>
                  <Textarea 
                    value={competitor.analysis || ""} 
                    onChange={(e) => updateCompetitor(index, "analysis", e.target.value)}
                  />
                </div>
              </div>
            </div>
          ))}
          <Button 
            variant="outline" 
            onClick={addCompetitor} 
            className="w-full mt-2"
          >
            <PlusCircle className="h-4 w-4 mr-2" /> Añadir competidor
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Estrategia Propuesta</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium mb-3">Optimización Técnica y On-Page</h3>
              {report.strategy && report.strategy.technicalOptimization && report.strategy.technicalOptimization.map((item, index) => (
                <div key={index} className="flex items-center gap-2 mb-2">
                  <Input 
                    value={item} 
                    onChange={(e) => updateStrategy("technicalOptimization", index, e.target.value)}
                    className="flex-1"
                  />
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => removeStrategyItem("technicalOptimization", index)}
                  >
                    <Trash2 className="h-4 w-4 text-red-500" />
                  </Button>
                </div>
              ))}
              <Button 
                variant="outline" 
                onClick={() => addStrategyItem("technicalOptimization")} 
                className="w-full mt-2"
              >
                <PlusCircle className="h-4 w-4 mr-2" /> Añadir recomendación técnica
              </Button>
            </div>

            <div>
              <h3 className="text-lg font-medium mb-3">SEO Local y Geolocalización</h3>
              {report.strategy && report.strategy.localSeo && report.strategy.localSeo.map((item, index) => (
                <div key={index} className="flex items-center gap-2 mb-2">
                  <Input 
                    value={item} 
                    onChange={(e) => updateStrategy("localSeo", index, e.target.value)}
                    className="flex-1"
                  />
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => removeStrategyItem("localSeo", index)}
                  >
                    <Trash2 className="h-4 w-4 text-red-500" />
                  </Button>
                </div>
              ))}
              <Button 
                variant="outline" 
                onClick={() => addStrategyItem("localSeo")} 
                className="w-full mt-2"
              >
                <PlusCircle className="h-4 w-4 mr-2" /> Añadir recomendación local
              </Button>
            </div>

            <div>
              <h3 className="text-lg font-medium mb-3">Creación de Contenido y Blog</h3>
              {report.strategy && report.strategy.contentCreation && report.strategy.contentCreation.map((item, index) => (
                <div key={index} className="flex items-center gap-2 mb-2">
                  <Input 
                    value={item} 
                    onChange={(e) => updateStrategy("contentCreation", index, e.target.value)}
                    className="flex-1"
                  />
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => removeStrategyItem("contentCreation", index)}
                  >
                    <Trash2 className="h-4 w-4 text-red-500" />
                  </Button>
                </div>
              ))}
              <Button 
                variant="outline" 
                onClick={() => addStrategyItem("contentCreation")} 
                className="w-full mt-2"
              >
                <PlusCircle className="h-4 w-4 mr-2" /> Añadir recomendación de contenido
              </Button>
            </div>

            <div>
              <h3 className="text-lg font-medium mb-3">Estrategia de Linkbuilding</h3>
              {report.strategy && report.strategy.linkBuilding && report.strategy.linkBuilding.map((item, index) => (
                <div key={index} className="flex items-center gap-2 mb-2">
                  <Input 
                    value={item} 
                    onChange={(e) => updateStrategy("linkBuilding", index, e.target.value)}
                    className="flex-1"
                  />
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => removeStrategyItem("linkBuilding", index)}
                  >
                    <Trash2 className="h-4 w-4 text-red-500" />
                  </Button>
                </div>
              ))}
              <Button 
                variant="outline" 
                onClick={() => addStrategyItem("linkBuilding")} 
                className="w-full mt-2"
              >
                <PlusCircle className="h-4 w-4 mr-2" /> Añadir recomendación de enlaces
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Conclusión y Contacto</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <Label htmlFor="conclusion">Conclusión y siguientes pasos</Label>
              <Textarea 
                id="conclusion" 
                value={report.conclusion || ""} 
                onChange={(e) => updateReport("conclusion", e.target.value)}
                className="min-h-[120px]"
                placeholder="Breve recomendación sobre qué plan elegir según objetivos y presupuesto..."
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="contactEmail">Email de contacto</Label>
                <Input 
                  id="contactEmail" 
                  value={report.contactEmail || ""} 
                  onChange={(e) => updateReport("contactEmail", e.target.value)}
                  placeholder="email@ejemplo.com"
                />
              </div>
              <div>
                <Label htmlFor="contactPhone">Teléfono de contacto</Label>
                <Input 
                  id="contactPhone" 
                  value={report.contactPhone || ""} 
                  onChange={(e) => updateReport("contactPhone", e.target.value)}
                  placeholder="+34 123 456 789"
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button onClick={handleSave}>Guardar Cambios</Button>
      </div>
    </div>
  );
};
