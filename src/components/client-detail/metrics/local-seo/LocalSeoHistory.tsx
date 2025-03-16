
import { Star } from "lucide-react";
import { useLocalSeoData } from "./useLocalSeoData";

interface LocalSeoHistoryProps {
  clientId: string;
}

export const LocalSeoHistory = ({ clientId }: LocalSeoHistoryProps) => {
  const { metricHistory } = useLocalSeoData(clientId);

  if (metricHistory.length === 0) {
    return (
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 text-center">
        <p className="text-gray-600">No hay datos históricos disponibles aún.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg p-4 border">
      <h3 className="text-md font-medium mb-4 flex items-center gap-2">
        <Star className="h-4 w-4" />
        Historial de Métricas
      </h3>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Fecha
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Pos. Maps
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Reseñas
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Puntuación
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Directorios
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {metricHistory.map((metric: any, index: number) => (
              <tr key={index}>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {new Date(metric.date).toLocaleDateString('es-ES')}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  #{metric.google_maps_ranking || 'N/A'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {metric.google_reviews_count || 0}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {metric.google_reviews_average?.toFixed(1) || '0.0'} <Star className="inline h-3 w-3 text-amber-500 fill-amber-500" />
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {metric.listings_count || 0}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
