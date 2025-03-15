
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { PlusCircle, Trash2 } from "lucide-react";
import { AIReport } from "@/services/aiReportService";

interface EditableFormWebAnalysisProps {
  authorityScore: number;
  authorityScoreComment: string;
  organicTraffic: string;
  organicTrafficComment: string;
  keywordsPositioned: string;
  keywordsComment: string;
  backlinksCount: string;
  backlinksComment: string;
  priorityKeywords: AIReport["priorityKeywords"];
  competitors: AIReport["competitors"];
  onUpdateField: (field: string, value: any) => void;
  onUpdatePriorityKeyword: (index: number, field: string, value: any) => void;
  onAddPriorityKeyword: () => void;
  onRemovePriorityKeyword: (index: number) => void;
  onUpdateCompetitor: (index: number, field: string, value: any) => void;
  onAddCompetitor: () => void;
  onRemoveCompetitor: (index: number) => void;
}

export const EditableFormWebAnalysis = ({
  authorityScore,
  authorityScoreComment,
  organicTraffic,
  organicTrafficComment,
  keywordsPositioned,
  keywordsComment,
  backlinksCount,
  backlinksComment,
  priorityKeywords,
  competitors,
  onUpdateField,
  onUpdatePriorityKeyword,
  onAddPriorityKeyword,
  onRemovePriorityKeyword,
  onUpdateCompetitor,
  onAddCompetitor,
  onRemoveCompetitor
}: EditableFormWebAnalysisProps) => {
  return (
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
              value={authorityScore || 0} 
              onChange={(e) => onUpdateField("authorityScore", parseInt(e.target.value))}
            />
          </div>
          <div>
            <Label htmlFor="authorityScoreComment">Comentario sobre Authority Score</Label>
            <Input 
              id="authorityScoreComment" 
              value={authorityScoreComment || ""} 
              onChange={(e) => onUpdateField("authorityScoreComment", e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="organicTraffic">Tráfico orgánico mensual</Label>
            <Input 
              id="organicTraffic" 
              value={organicTraffic || ""} 
              onChange={(e) => onUpdateField("organicTraffic", e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="organicTrafficComment">Comentario sobre tráfico</Label>
            <Input 
              id="organicTrafficComment" 
              value={organicTrafficComment || ""} 
              onChange={(e) => onUpdateField("organicTrafficComment", e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="keywordsPositioned">Palabras clave posicionadas</Label>
            <Input 
              id="keywordsPositioned" 
              value={keywordsPositioned || ""} 
              onChange={(e) => onUpdateField("keywordsPositioned", e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="keywordsComment">Comentario sobre palabras clave</Label>
            <Input 
              id="keywordsComment" 
              value={keywordsComment || ""} 
              onChange={(e) => onUpdateField("keywordsComment", e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="backlinksCount">Backlinks actuales</Label>
            <Input 
              id="backlinksCount" 
              value={backlinksCount || ""} 
              onChange={(e) => onUpdateField("backlinksCount", e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="backlinksComment">Comentario sobre backlinks</Label>
            <Input 
              id="backlinksComment" 
              value={backlinksComment || ""} 
              onChange={(e) => onUpdateField("backlinksComment", e.target.value)}
            />
          </div>
        </div>

        <PriorityKeywords 
          keywords={priorityKeywords}
          onUpdate={onUpdatePriorityKeyword}
          onAdd={onAddPriorityKeyword}
          onRemove={onRemovePriorityKeyword}
        />

        <CompetitorsAnalysis 
          competitors={competitors}
          onUpdate={onUpdateCompetitor}
          onAdd={onAddCompetitor}
          onRemove={onRemoveCompetitor}
        />
      </CardContent>
    </Card>
  );
};

interface PriorityKeywordsProps {
  keywords: AIReport["priorityKeywords"];
  onUpdate: (index: number, field: string, value: any) => void;
  onAdd: () => void;
  onRemove: (index: number) => void;
}

const PriorityKeywords = ({ keywords, onUpdate, onAdd, onRemove }: PriorityKeywordsProps) => {
  return (
    <div className="mb-6">
      <h3 className="text-lg font-medium mb-2">Palabras Clave Prioritarias</h3>
      {keywords && keywords.map((keyword, index) => (
        <div key={index} className="border p-4 rounded-md mb-4">
          <div className="flex justify-between mb-2">
            <h4 className="font-medium">Palabra clave #{index + 1}</h4>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => onRemove(index)}
            >
              <Trash2 className="h-4 w-4 text-red-500" />
            </Button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <Label>Palabra clave</Label>
              <Input 
                value={keyword.keyword} 
                onChange={(e) => onUpdate(index, "keyword", e.target.value)}
              />
            </div>
            <div>
              <Label>Posición</Label>
              <Input 
                type="number" 
                value={keyword.position || 0} 
                onChange={(e) => onUpdate(index, "position", parseInt(e.target.value))}
              />
            </div>
            <div>
              <Label>Volumen</Label>
              <Input 
                type="number" 
                value={keyword.volume || 0} 
                onChange={(e) => onUpdate(index, "volume", parseInt(e.target.value))}
              />
            </div>
            <div>
              <Label>Dificultad</Label>
              <Input 
                type="number" 
                min="0" 
                max="100" 
                value={keyword.difficulty || 0} 
                onChange={(e) => onUpdate(index, "difficulty", parseInt(e.target.value))}
              />
            </div>
            <div className="col-span-2">
              <Label>Recomendación</Label>
              <Textarea 
                value={keyword.recommendation || ""} 
                onChange={(e) => onUpdate(index, "recommendation", e.target.value)}
              />
            </div>
          </div>
        </div>
      ))}
      <Button 
        variant="outline" 
        onClick={onAdd} 
        className="w-full mt-2"
      >
        <PlusCircle className="h-4 w-4 mr-2" /> Añadir palabra clave
      </Button>
    </div>
  );
};

interface CompetitorsAnalysisProps {
  competitors: AIReport["competitors"];
  onUpdate: (index: number, field: string, value: any) => void;
  onAdd: () => void;
  onRemove: (index: number) => void;
}

const CompetitorsAnalysis = ({ competitors, onUpdate, onAdd, onRemove }: CompetitorsAnalysisProps) => {
  return (
    <div>
      <h3 className="text-lg font-medium mt-6 mb-2">Análisis de Competidores</h3>
      {competitors && competitors.map((competitor, index) => (
        <div key={index} className="border p-4 rounded-md mb-4">
          <div className="flex justify-between mb-2">
            <h4 className="font-medium">Competidor #{index + 1}</h4>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => onRemove(index)}
            >
              <Trash2 className="h-4 w-4 text-red-500" />
            </Button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <Label>Nombre</Label>
              <Input 
                value={competitor.name} 
                onChange={(e) => onUpdate(index, "name", e.target.value)}
              />
            </div>
            <div>
              <Label>Tráfico (score)</Label>
              <Input 
                type="number" 
                value={competitor.trafficScore || 0} 
                onChange={(e) => onUpdate(index, "trafficScore", parseInt(e.target.value))}
              />
            </div>
            <div>
              <Label>Número de keywords</Label>
              <Input 
                type="number" 
                value={competitor.keywordsCount || 0} 
                onChange={(e) => onUpdate(index, "keywordsCount", parseInt(e.target.value))}
              />
            </div>
            <div>
              <Label>Número de backlinks</Label>
              <Input 
                type="number" 
                value={competitor.backlinksCount || 0} 
                onChange={(e) => onUpdate(index, "backlinksCount", parseInt(e.target.value))}
              />
            </div>
            <div className="col-span-2">
              <Label>Análisis</Label>
              <Textarea 
                value={competitor.analysis || ""} 
                onChange={(e) => onUpdate(index, "analysis", e.target.value)}
              />
            </div>
          </div>
        </div>
      ))}
      <Button 
        variant="outline" 
        onClick={onAdd} 
        className="w-full mt-2"
      >
        <PlusCircle className="h-4 w-4 mr-2" /> Añadir competidor
      </Button>
    </div>
  );
};
