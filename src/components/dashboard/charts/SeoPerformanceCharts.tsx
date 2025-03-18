
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowUpRight } from "lucide-react";
import { KeywordRankingChart } from "./KeywordRankingChart";
import { TrafficSourceChart } from "./TrafficSourceChart";
import { keywordData, trafficData } from "./chartData";

export function SeoPerformanceCharts() {
  const [activeTab, setActiveTab] = useState('keywords');

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Panel SEO Interactivo</span>
          <ArrowUpRight className="h-4 w-4 text-blue-500" />
        </CardTitle>
        <CardDescription>
          Haz clic en los gráficos para ver más detalles
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="keywords" onValueChange={setActiveTab} value={activeTab}>
          <TabsList className="grid w-full grid-cols-2 mb-4">
            <TabsTrigger value="keywords">Ranking Keywords</TabsTrigger>
            <TabsTrigger value="traffic">Tráfico por Fuente</TabsTrigger>
          </TabsList>
          
          <TabsContent value="keywords" className="h-80">
            <KeywordRankingChart data={keywordData} />
          </TabsContent>
          
          <TabsContent value="traffic" className="h-80">
            <TrafficSourceChart data={trafficData} />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
