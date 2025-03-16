
import { ScoreIcon } from "./ScoreIcon";

interface AuditStatsProps {
  passedCount: number;
  improvementCount: number;
  failedCount: number;
}

export const AuditStats = ({ passedCount, improvementCount, failedCount }: AuditStatsProps) => {
  // Asegurar que todos los valores son números
  const passed = typeof passedCount === 'number' ? passedCount : 0;
  const improvement = typeof improvementCount === 'number' ? improvementCount : 0;
  const failed = typeof failedCount === 'number' ? failedCount : 0;
  
  const totalCount = passed + improvement + failed;
  
  return (
    <div className="grid grid-cols-3 gap-2 text-center text-sm mb-4">
      <div className="bg-green-50 p-2 rounded-md">
        <div className="flex items-center justify-center gap-1 mb-1">
          <ScoreIcon score={1} size="sm" />
          <p className="font-medium text-green-600">Correctas</p>
        </div>
        <p className="text-2xl font-bold text-green-600">{passed}</p>
        {totalCount > 0 && (
          <p className="text-xs text-green-600">
            {Math.round((passed / totalCount) * 100)}%
          </p>
        )}
      </div>
      
      <div className="bg-orange-50 p-2 rounded-md">
        <div className="flex items-center justify-center gap-1 mb-1">
          <ScoreIcon score={0.7} size="sm" />
          <p className="font-medium text-orange-600">A mejorar</p>
        </div>
        <p className="text-2xl font-bold text-orange-600">{improvement}</p>
        {totalCount > 0 && (
          <p className="text-xs text-orange-600">
            {Math.round((improvement / totalCount) * 100)}%
          </p>
        )}
      </div>
      
      <div className="bg-red-50 p-2 rounded-md">
        <div className="flex items-center justify-center gap-1 mb-1">
          <ScoreIcon score={0.2} size="sm" />
          <p className="font-medium text-red-600">Fallidas</p>
        </div>
        <p className="text-2xl font-bold text-red-600">{failed}</p>
        {totalCount > 0 && (
          <p className="text-xs text-red-600">
            {Math.round((failed / totalCount) * 100)}%
          </p>
        )}
      </div>
    </div>
  );
};
