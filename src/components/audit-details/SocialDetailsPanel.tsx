import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Share2 } from "lucide-react";
import { SocialPresence } from "@/services/pdfAnalyzer";
import { CheckCircle2, XCircle, AlertTriangle } from "lucide-react";

interface SocialDetailsPanelProps {
  socialPresence: SocialPresence;
  keywordsCount: number;
}

const renderStatusIcon = (status: boolean | 'Válido' | 'Inválido' | 'No implementado') => {
  if (status === true || status === 'Válido') {
    return <CheckCircle2 className="w-5 h-5 text-green-500" />;
  } else if (status === false || status === 'Inválido') {
    return <XCircle className="w-5 h-5 text-red-500" />;
  } else {
    return <AlertTriangle className="w-5 h-5 text-amber-500" />;
  }
};

export const SocialDetailsPanel = ({ socialPresence, keywordsCount }: SocialDetailsPanelProps) => {
  return (
    <>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Share2 className="w-5 h-5 text-purple-500" />
          Presencia Social y Keywords
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-4">
            <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
              <span className="text-sm font-medium">Facebook</span>
              {renderStatusIcon(socialPresence.facebook)}
            </div>
            <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
              <span className="text-sm font-medium">Instagram</span>
              {renderStatusIcon(socialPresence.instagram)}
            </div>
            <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
              <span className="text-sm font-medium">LinkedIn</span>
              {renderStatusIcon(socialPresence.linkedin)}
            </div>
          </div>
          <div className="space-y-4">
            <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
              <span className="text-sm font-medium">Twitter</span>
              {renderStatusIcon(socialPresence.twitter)}
            </div>
            <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
              <span className="text-sm font-medium">Google Business</span>
              {renderStatusIcon(socialPresence.googleBusiness)}
            </div>
            <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
              <span className="text-sm font-medium">Palabras Clave</span>
              <span className="text-sm font-medium">{keywordsCount}</span>
            </div>
          </div>
        </div>
      </CardContent>
    </>
  );
};
