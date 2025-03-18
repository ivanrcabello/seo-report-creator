
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { KeywordData } from "./types";

interface KeywordRankingChartProps {
  data: KeywordData[];
}

export function KeywordRankingChart({ data }: KeywordRankingChartProps) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 20 }}>
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
  );
}
