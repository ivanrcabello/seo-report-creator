
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BarChart, LineChart, Line, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { ArrowUpRight } from "lucide-react";

// Sample data for the charts
const keywordData = [
  { month: 'Ene', top3: 2, top10: 12, top30: 28 },
  { month: 'Feb', top3: 3, top10: 15, top30: 31 },
  { month: 'Mar', top3: 5, top10: 18, top30: 34 },
  { month: 'Abr', top3: 6, top10: 18, top30: 37 },
  { month: 'May', top3: 5, top10: 16, top30: 33 },
  { month: 'Jun', top3: 8, top10: 18, top30: 36 },
];

const trafficData = [
  { month: 'Ene', organico: 1200, referral: 400, directo: 200 },
  { month: 'Feb', organico: 1300, referral: 450, directo: 220 },
  { month: 'Mar', organico: 1500, referral: 500, directo: 250 },
  { month: 'Abr', organico: 1700, referral: 550, directo: 280 },
  { month: 'May', organico: 1900, referral: 600, directo: 300 },
  { month: 'Jun', organico: 2200, referral: 650, directo: 350 },
];

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
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={keywordData} margin={{ top: 10, right: 10, left: 0, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip 
                  formatter={(value) => [`${value} keywords`, '']}
                  labelFormatter={(label) => `Mes: ${label}`}
                />
                <Legend />
                <Bar dataKey="top3" name="Top 3" fill="#4ade80" />
                <Bar dataKey="top10" name="Top 10" fill="#60a5fa" />
                <Bar dataKey="top30" name="Top 30" fill="#c4b5fd" />
              </BarChart>
            </ResponsiveContainer>
          </TabsContent>
          
          <TabsContent value="traffic" className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={trafficData} margin={{ top: 10, right: 10, left: 0, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip 
                  formatter={(value) => [`${value} visitas`, '']}
                  labelFormatter={(label) => `Mes: ${label}`}
                />
                <Legend />
                <Line type="monotone" dataKey="organico" name="Tráfico Orgánico" stroke="#4ade80" strokeWidth={2} dot={{ r: 4 }} />
                <Line type="monotone" dataKey="referral" name="Referral" stroke="#60a5fa" strokeWidth={2} dot={{ r: 4 }} />
                <Line type="monotone" dataKey="directo" name="Directo" stroke="#c4b5fd" strokeWidth={2} dot={{ r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
