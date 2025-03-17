
import { ClientReport } from "@/types/client";
import { 
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger
} from "@/components/ui/accordion";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Search, ArrowUp, ArrowDown, Minus } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";

interface KeywordsAccordionProps {
  report: ClientReport;
  isPrintView?: boolean;
}

export const KeywordsAccordion = ({ report, isPrintView = false }: KeywordsAccordionProps) => {
  const keywords = report.analyticsData?.auditResult?.keywords || [];
  
  if (keywords.length === 0) {
    return null;
  }

  // Sort keywords by position (best positions first)
  const sortedKeywords = [...keywords].sort((a, b) => {
    // Handle undefined or null positions (put them at the end)
    if (!a.position && b.position) return 1;
    if (a.position && !b.position) return -1;
    if (!a.position && !b.position) return 0;
    
    // Sort by position
    return (a.position || 999) - (b.position || 999);
  });

  const getPositionTrend = (keyword: any) => {
    if (!keyword.previousPosition || !keyword.position) return null;
    
    const diff = keyword.previousPosition - keyword.position;
    
    if (diff > 0) return { icon: <ArrowUp className="h-4 w-4 text-green-500" />, text: `+${diff}` };
    if (diff < 0) return { icon: <ArrowDown className="h-4 w-4 text-red-500" />, text: `${diff}` };
    return { icon: <Minus className="h-4 w-4 text-gray-400" />, text: "0" };
  };
  
  const getPositionBadge = (position: number | undefined) => {
    if (!position) return <Badge variant="outline">No data</Badge>;
    
    if (position <= 3) return <Badge className="bg-green-500">Top 3</Badge>;
    if (position <= 10) return <Badge className="bg-blue-500">Top 10</Badge>;
    if (position <= 30) return <Badge className="bg-yellow-500">Top 30</Badge>;
    return <Badge className="bg-red-500">Position {position}</Badge>;
  };

  return (
    <div className={`mt-8 ${isPrintView ? 'print-section' : ''}`}>
      <h2 className="text-2xl font-bold text-blue-600 mb-4">Palabras Clave Analizadas</h2>
      
      <Accordion type="single" collapsible defaultValue="keywords" className="border rounded-md">
        <AccordionItem value="keywords" className="border-none">
          <AccordionTrigger className="px-4 py-2 hover:bg-gray-50">
            <div className="flex items-center gap-2">
              <Search className="h-5 w-5 text-blue-500" />
              <span className="font-medium">Seguimiento de Palabras Clave ({keywords.length})</span>
            </div>
          </AccordionTrigger>
          <AccordionContent className="px-4 pb-4">
            <ScrollArea className="h-[400px] rounded-md">
              <div className="px-1">
                <Table>
                  <TableHeader className="sticky top-0 bg-white z-10">
                    <TableRow>
                      <TableHead>Palabra Clave</TableHead>
                      <TableHead className="w-[120px]">Posición</TableHead>
                      <TableHead className="w-[100px]">Evolución</TableHead>
                      <TableHead className="w-[120px]">Vol. Búsqueda</TableHead>
                      <TableHead className="w-[100px]">Dificultad</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {sortedKeywords.map((keyword, index) => {
                      const trend = getPositionTrend(keyword);
                      
                      return (
                        <TableRow key={index}>
                          <TableCell className="font-medium">{keyword.word}</TableCell>
                          <TableCell>{getPositionBadge(keyword.position)}</TableCell>
                          <TableCell>
                            {trend && (
                              <div className="flex items-center gap-1">
                                {trend.icon}
                                <span>{trend.text}</span>
                              </div>
                            )}
                          </TableCell>
                          <TableCell>{keyword.searchVolume || "N/A"}</TableCell>
                          <TableCell>
                            {keyword.difficulty !== undefined ? (
                              <div className="flex items-center">
                                <div className="h-2 w-16 bg-gray-200 rounded-full overflow-hidden">
                                  <div 
                                    className={`h-2 ${
                                      keyword.difficulty < 30 ? "bg-green-500" : 
                                      keyword.difficulty < 60 ? "bg-yellow-500" : "bg-red-500"
                                    }`}
                                    style={{ width: `${keyword.difficulty}%` }}
                                  />
                                </div>
                                <span className="ml-2 text-xs">{keyword.difficulty}</span>
                              </div>
                            ) : (
                              "N/A"
                            )}
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>
            </ScrollArea>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
};
