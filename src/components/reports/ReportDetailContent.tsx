
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getReport } from '@/services/reports';
import { ReportLoadingState } from './ReportLoadingState';
import { ReportErrorState } from './ReportErrorState';
import { ReportNotFoundState } from './ReportNotFoundState';
import { ReportDetailHeader } from './ReportDetailHeader';

export interface ReportDetailContentProps {
  reportId?: string;
  isNew?: boolean;
}

export const ReportDetailContent: React.FC<ReportDetailContentProps> = ({ 
  reportId,
  isNew = false 
}) => {
  const [isRetrying, setIsRetrying] = useState(false);
  
  const { data: report, isLoading, isError, error, refetch } = useQuery({
    queryKey: ['report', reportId],
    queryFn: () => getReport(reportId as string),
    enabled: !!reportId,
  });

  const handleRetry = async () => {
    setIsRetrying(true);
    await refetch();
    setIsRetrying(false);
  };

  if (!reportId) {
    return <ReportNotFoundState />;
  }

  if (isLoading) {
    return <ReportLoadingState />;
  }

  if (isError) {
    return <ReportErrorState error={error} isRetrying={isRetrying} handleRetry={handleRetry} />;
  }

  if (!report) {
    return <ReportNotFoundState />;
  }
  
  return (
    <div className="space-y-6">
      <ReportDetailHeader 
        report={report} 
        isNew={isNew}
      />
      
      <div>
        <h3 className="text-xl font-semibold mb-4">Contenido del Informe</h3>
        <div className="prose max-w-none">
          {report?.content ? (
            <div dangerouslySetInnerHTML={{ __html: report.content }} />
          ) : (
            <p>No hay contenido disponible para este informe.</p>
          )}
        </div>
      </div>
    </div>
  );
};
