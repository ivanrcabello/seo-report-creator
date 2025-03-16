
import { PageSpeedAudit } from "@/services/pageSpeedService";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { CircleCheck, CircleX, CircleDashed, Filter } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface PageSpeedAuditListProps {
  audits: PageSpeedAudit[];
}

export const PageSpeedAuditList = ({ audits }: PageSpeedAuditListProps) => {
  const [filter, setFilter] = useState<string>("all");
  
  const getCategoryLabel = (category: string) => {
    switch (category) {
      case 'performance': return 'Rendimiento';
      case 'accessibility': return 'Accesibilidad';
      case 'best-practices': return 'Buenas Prácticas';
      case 'seo': return 'SEO';
      default: return category;
    }
  };
  
  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'performance': return 'bg-purple-100 text-purple-800';
      case 'accessibility': return 'bg-blue-100 text-blue-800';
      case 'best-practices': return 'bg-green-100 text-green-800';
      case 'seo': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };
  
  const getScoreIcon = (score: number) => {
    if (score >= 0.9) return <CircleCheck className="h-5 w-5 text-green-500" />;
    if (score >= 0.5) return <CircleDashed className="h-5 w-5 text-orange-500" />;
    return <CircleX className="h-5 w-5 text-red-500" />;
  };
  
  const categories = ['all', 'performance', 'accessibility', 'best-practices', 'seo'];
  
  const filteredAudits = audits.filter(
    audit => filter === 'all' || audit.category === filter
  );
  
  const passedAudits = filteredAudits.filter(audit => audit.score >= 0.9);
  const improvementAudits = filteredAudits.filter(audit => audit.score < 0.9 && audit.score >= 0.5);
  const failedAudits = filteredAudits.filter(audit => audit.score < 0.5);
  
  return (
    <div className="space-y-4">
      <div className="bg-white rounded-lg border border-gray-100 p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium">Auditorías</h3>
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-gray-500" />
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="text-sm border-gray-200 rounded-md"
            >
              {categories.map(category => (
                <option key={category} value={category}>
                  {category === 'all' ? 'Todas las categorías' : getCategoryLabel(category)}
                </option>
              ))}
            </select>
          </div>
        </div>
        
        <div className="grid grid-cols-3 gap-2 text-center text-sm mb-4">
          <div className="bg-green-50 p-2 rounded-md">
            <p className="font-medium text-green-600">Correctas</p>
            <p className="text-2xl font-bold text-green-600">{passedAudits.length}</p>
          </div>
          <div className="bg-orange-50 p-2 rounded-md">
            <p className="font-medium text-orange-600">A mejorar</p>
            <p className="text-2xl font-bold text-orange-600">{improvementAudits.length}</p>
          </div>
          <div className="bg-red-50 p-2 rounded-md">
            <p className="font-medium text-red-600">Fallidas</p>
            <p className="text-2xl font-bold text-red-600">{failedAudits.length}</p>
          </div>
        </div>
      </div>
      
      <Tabs defaultValue="failed" className="w-full">
        <TabsList>
          <TabsTrigger value="failed">Fallidas</TabsTrigger>
          <TabsTrigger value="improvement">A mejorar</TabsTrigger>
          <TabsTrigger value="passed">Correctas</TabsTrigger>
        </TabsList>
        
        <TabsContent value="failed">
          {failedAudits.length === 0 ? (
            <p className="text-center py-4 text-gray-500">No hay auditorías fallidas en esta categoría</p>
          ) : (
            <Accordion type="multiple" className="w-full">
              {failedAudits.map((audit) => (
                <AccordionItem key={audit.id} value={audit.id}>
                  <AccordionTrigger className="hover:bg-gray-50">
                    <div className="flex items-center gap-3 text-left">
                      {getScoreIcon(audit.score)}
                      <div>
                        <span className="font-medium">{audit.title}</span>
                        {audit.displayValue && (
                          <span className="ml-2 text-gray-500 text-sm">
                            {audit.displayValue}
                          </span>
                        )}
                      </div>
                    </div>
                    <Badge className={getCategoryColor(audit.category)}>
                      {getCategoryLabel(audit.category)}
                    </Badge>
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="p-3 bg-gray-50 rounded-md">
                      <p className="text-sm">{audit.description}</p>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          )}
        </TabsContent>
        
        <TabsContent value="improvement">
          {improvementAudits.length === 0 ? (
            <p className="text-center py-4 text-gray-500">No hay auditorías a mejorar en esta categoría</p>
          ) : (
            <Accordion type="multiple" className="w-full">
              {improvementAudits.map((audit) => (
                <AccordionItem key={audit.id} value={audit.id}>
                  <AccordionTrigger className="hover:bg-gray-50">
                    <div className="flex items-center gap-3 text-left">
                      {getScoreIcon(audit.score)}
                      <div>
                        <span className="font-medium">{audit.title}</span>
                        {audit.displayValue && (
                          <span className="ml-2 text-gray-500 text-sm">
                            {audit.displayValue}
                          </span>
                        )}
                      </div>
                    </div>
                    <Badge className={getCategoryColor(audit.category)}>
                      {getCategoryLabel(audit.category)}
                    </Badge>
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="p-3 bg-gray-50 rounded-md">
                      <p className="text-sm">{audit.description}</p>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          )}
        </TabsContent>
        
        <TabsContent value="passed">
          {passedAudits.length === 0 ? (
            <p className="text-center py-4 text-gray-500">No hay auditorías correctas en esta categoría</p>
          ) : (
            <Accordion type="multiple" className="w-full">
              {passedAudits.map((audit) => (
                <AccordionItem key={audit.id} value={audit.id}>
                  <AccordionTrigger className="hover:bg-gray-50">
                    <div className="flex items-center gap-3 text-left">
                      {getScoreIcon(audit.score)}
                      <div>
                        <span className="font-medium">{audit.title}</span>
                        {audit.displayValue && (
                          <span className="ml-2 text-gray-500 text-sm">
                            {audit.displayValue}
                          </span>
                        )}
                      </div>
                    </div>
                    <Badge className={getCategoryColor(audit.category)}>
                      {getCategoryLabel(audit.category)}
                    </Badge>
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="p-3 bg-gray-50 rounded-md">
                      <p className="text-sm">{audit.description}</p>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};
