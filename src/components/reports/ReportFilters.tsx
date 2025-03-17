
import { useState } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";

interface ReportFiltersProps {
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  selectedType: string;
  setSelectedType: (value: string) => void;
  reportTypes: string[];
}

export const ReportFilters = ({
  searchTerm,
  setSearchTerm,
  selectedType,
  setSelectedType,
  reportTypes,
}: ReportFiltersProps) => {
  return (
    <Card className="mb-6">
      <CardContent className="flex flex-col sm:flex-row gap-4 pt-6">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
          <Input
            type="search"
            placeholder="Buscar informes..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="w-full sm:w-[200px]">
          <Select
            value={selectedType}
            onValueChange={setSelectedType}
          >
            <SelectTrigger>
              <SelectValue placeholder="Tipo de informe" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos los tipos</SelectItem>
              {reportTypes.map((type) => (
                <SelectItem key={type} value={type}>
                  {type}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </CardContent>
    </Card>
  );
};
