
interface AuditStatsProps {
  passedCount: number;
  improvementCount: number;
  failedCount: number;
}

export const AuditStats = ({ passedCount, improvementCount, failedCount }: AuditStatsProps) => {
  return (
    <div className="grid grid-cols-3 gap-2 text-center text-sm mb-4">
      <div className="bg-green-50 p-2 rounded-md">
        <p className="font-medium text-green-600">Correctas</p>
        <p className="text-2xl font-bold text-green-600">{passedCount}</p>
      </div>
      <div className="bg-orange-50 p-2 rounded-md">
        <p className="font-medium text-orange-600">A mejorar</p>
        <p className="text-2xl font-bold text-orange-600">{improvementCount}</p>
      </div>
      <div className="bg-red-50 p-2 rounded-md">
        <p className="font-medium text-red-600">Fallidas</p>
        <p className="text-2xl font-bold text-red-600">{failedCount}</p>
      </div>
    </div>
  );
};
