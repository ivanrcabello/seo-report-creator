
import { Search } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { useLocalSeoData } from "./useLocalSeoData";

export const LocalSeoKeywords = () => {
  const { currentReport } = useLocalSeoData("", "");
  
  if (!currentReport?.keywordRankings || currentReport.keywordRankings.length === 0) {
    return (
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 text-center">
        <p className="text-gray-600">No hay datos de palabras clave disponibles.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg p-4 border">
      <h3 className="text-md font-medium mb-4 flex items-center gap-2">
        <Search className="h-4 w-4" />
        Palabras Clave Locales
      </h3>
      <div className="space-y-4">
        {currentReport.keywordRankings.map((kw: any, index: number) => (
          <div key={index} className="space-y-2">
            <div className="flex justify-between">
              <span className="font-medium">{kw.keyword}</span>
              <span className={
                kw.position <= 3 ? "text-green-600 font-semibold" : 
                kw.position <= 10 ? "text-amber-600 font-semibold" : 
                "text-gray-600"
              }>
                {kw.position === 0 ? "No posicionada" : `#${kw.position}`}
              </span>
            </div>
            <Progress value={kw.position === 0 ? 0 : Math.max(5, 100 - (kw.position * 5))} />
          </div>
        ))}
      </div>
    </div>
  );
};
