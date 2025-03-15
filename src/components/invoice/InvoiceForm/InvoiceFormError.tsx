
import { FileSpreadsheet, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from "@/components/ui/card";

interface InvoiceFormErrorProps {
  error: string;
  onGoBack: () => void;
}

export const InvoiceFormError = ({ error, onGoBack }: InvoiceFormErrorProps) => {
  return (
    <Card className="shadow-sm">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <FileSpreadsheet className="h-5 w-5 text-blue-600" />
            Error
          </CardTitle>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={onGoBack}
            className="gap-1"
          >
            <ArrowLeft className="h-4 w-4" />
            Volver
          </Button>
        </div>
        <CardDescription>
          {error}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex justify-center items-center py-12">
        <div className="text-center">
          <p className="text-gray-500 mb-4">Se produjo un error al cargar los datos</p>
          <Button onClick={onGoBack} className="gap-1">
            Volver
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
