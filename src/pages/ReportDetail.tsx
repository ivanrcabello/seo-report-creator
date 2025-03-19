
import React from 'react';
import { useParams } from 'react-router-dom';
import { ReportDetailContent } from '@/components/reports';

export interface ReportDetailProps {
  isNew?: boolean;
}

const ReportDetail = ({ isNew }: ReportDetailProps) => {
  const { reportId } = useParams<{ reportId: string }>();
  
  return (
    <div className="container mx-auto py-6">
      <ReportDetailContent reportId={reportId} isNew={isNew} />
    </div>
  );
};

export default ReportDetail;
