
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { List } from "lucide-react";

interface ReportSection {
  title: string;
  id: string;
}

interface ReportNavigationProps {
  sections: ReportSection[];
}

export const ReportNavigation = ({ sections }: ReportNavigationProps) => {
  if (sections.length === 0) return null;
  
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };
  
  return (
    <div className="mb-6 flex justify-end print:hidden">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="gap-2">
            <List className="h-4 w-4" />
            Navegar por secciones
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-64 bg-white">
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
    </div>
  );
};
