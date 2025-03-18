
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { TrafficData } from "./types";

interface TrafficSourceChartProps {
  data: TrafficData[];
}

export function TrafficSourceChart({ data }: TrafficSourceChartProps) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 20 }}>
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
  );
}
