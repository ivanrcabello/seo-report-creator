
import { SeoContract } from "@/types/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText } from "lucide-react";
import { Separator } from "@/components/ui/separator";

interface ContractContentProps {
  contract: SeoContract;
}

export const ContractContent = ({ contract }: ContractContentProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl flex items-center gap-2">
          <FileText className="h-5 w-5 text-blue-600" />
          Contenido del Contrato
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-8">
          {contract.content.sections.map((section, index) => (
            <div key={index}>
              <h3 className="text-lg font-semibold mb-3">{index + 1}. {section.title}</h3>
              <div className="whitespace-pre-line text-gray-700">{section.content}</div>
              {index < contract.content.sections.length - 1 && (
                <Separator className="my-6" />
              )}
            </div>
          ))}
        </div>
        
        {/* Signatures */}
        <div className="mt-10 pt-6 border-t border-gray-200">
          <div className="flex flex-col md:flex-row justify-between">
            <div className="mb-6 md:mb-0">
              <h4 className="font-medium mb-2">Profesional:</h4>
              <p className="text-gray-600">{contract.content.professionalInfo.name}</p>
              <p className="text-gray-600">{contract.content.professionalInfo.company}</p>
              <p className="text-gray-600 text-sm mt-1">{contract.content.professionalInfo.taxId}</p>
            </div>
            
            <div>
              <h4 className="font-medium mb-2">Cliente:</h4>
              <p className="text-gray-600">{contract.content.clientInfo.name}</p>
              {contract.content.clientInfo.company && (
                <p className="text-gray-600">{contract.content.clientInfo.company}</p>
              )}
              {contract.content.clientInfo.taxId && (
                <p className="text-gray-600 text-sm mt-1">{contract.content.clientInfo.taxId}</p>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
