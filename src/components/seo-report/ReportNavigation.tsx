
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { List, Download } from "lucide-react";
import { toast } from "sonner";

interface ReportSection {
  title: string;
  id: string;
}

interface ReportNavigationProps {
  sections: ReportSection[];
  onDownload?: () => Promise<void>;
  reportId?: string;
}

export const ReportNavigation = ({ sections, onDownload, reportId }: ReportNavigationProps) => {
  if (sections.length === 0) return null;
  
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    } else {
      console.error(`Element with id '${sectionId}' not found`);
    }
  };
  
  const handleDownload = async () => {
    if (onDownload) {
      try {
        toast.loading("Preparando descarga...");
        await onDownload();
        toast.dismiss();
        toast.success("Informe descargado correctamente");
      } catch (error) {
        console.error("Error downloading report:", error);
        toast.dismiss();
        toast.error("Error al descargar el informe");
      }
    } else {
      toast.error("Función de descarga no disponible");
    }
  };
  
  return (
    <div className="mb-6 flex justify-between items-center print:hidden">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="gap-2">
            <List className="h-4 w-4" />
            Navegar por secciones
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="w-64 bg-white">
          {sections.map((section, index) => (
            <DropdownMenuItem 
              key={index}
              onClick={() => scrollToSection(section.id)}
              className="cursor-pointer"
            >
              {section.title}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
      
      {onDownload && (
        <Button 
          onClick={handleDownload} 
          variant="default" 
          className="gap-2"
        >
          <Download className="h-4 w-4" />
          Descargar PDF
        </Button>
      )}
    </div>
  );
};
