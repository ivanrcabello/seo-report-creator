
import React from 'react';
import { Button } from '@/components/ui/button';
import { ClientReport } from '@/types/client';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

export interface ReportDetailHeaderProps {
  report?: ClientReport;
  isNew?: boolean;
}

export const ReportDetailHeader: React.FC<ReportDetailHeaderProps> = ({ 
  report,
  isNew = false,
}) => {
  const navigate = useNavigate();
  
  return (
    <div className="flex justify-between items-center mb-6">
      <div>
        <div className="flex items-center gap-2">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => navigate(-1)}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-2xl font-bold">
            {isNew ? "Nuevo Informe" : report?.title || "Detalle del Informe"}
          </h1>
        </div>
      </div>
    </div>
  );
};
