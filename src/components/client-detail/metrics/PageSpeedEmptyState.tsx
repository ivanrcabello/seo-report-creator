
export const PageSpeedEmptyState = () => {
  return (
    <div className="bg-amber-50 border border-amber-200 rounded-md p-4">
      <p>No hay datos de PageSpeed para este cliente.</p>
      <p className="text-sm text-gray-500 mt-1">
        Introduce una URL y haz clic en "Analizar" para obtener métricas de rendimiento.
      </p>
    </div>
  );
};
