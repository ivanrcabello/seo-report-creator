import { useState, useMemo } from "react";
import { ClientKeyword } from "@/services/clientKeywordsService";
import { useClientKeywords } from "./useClientKeywords";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { 
  ArrowUp, 
  ArrowDown, 
  Flag, 
  Trash2, 
  Edit2, 
  Check, 
  X, 
  Plus, 
  Search, 
  Target,
  Loader2,
  FileUp,
  ExternalLink,
  Filter,
  FilterX
} from "lucide-react";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter, 
  DialogTrigger 
} from "@/components/ui/dialog";
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Label } from "@/components/ui/label";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
  PaginationEllipsis,
} from "@/components/ui/pagination";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { MetricsCard } from "./MetricsCard";
import { KeywordCSVImport } from "./KeywordCSVImport";
import { toast } from "sonner";

interface KeywordsSectionProps {
  clientId: string;
}

export const KeywordsSection = ({ clientId }: KeywordsSectionProps) => {
  const { 
    keywords, 
    isLoading, 
    isSaving, 
    error, 
    addKeyword, 
    updateKeyword, 
    deleteKeyword,
    importCSV
  } = useClientKeywords(clientId);

  const [newKeyword, setNewKeyword] = useState({
    keyword: '',
    position: 0,
    targetPosition: 10
  });

  const [editingKeyword, setEditingKeyword] = useState<ClientKeyword | null>(null);
  const [keywordToDelete, setKeywordToDelete] = useState<string | null>(null);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isImportDialogOpen, setIsImportDialogOpen] = useState(false);
  
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;
  
  const [positionFilter, setPositionFilter] = useState<string>("all");
  const [isFilterActive, setIsFilterActive] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  
  const filteredKeywords = useMemo(() => {
    let filtered = [...keywords];
    
    if (positionFilter !== "all") {
      if (positionFilter === "no-position") {
        filtered = filtered.filter(kw => kw.position === null);
      } else if (positionFilter === "in-top-10") {
        filtered = filtered.filter(kw => kw.position !== null && kw.position <= 10);
      } else if (positionFilter === "in-top-30") {
        filtered = filtered.filter(kw => kw.position !== null && kw.position <= 30);
      } else if (positionFilter === "below-target") {
        filtered = filtered.filter(kw => 
          kw.position !== null && kw.position > kw.target_position
        );
      } else if (positionFilter === "above-target") {
        filtered = filtered.filter(kw => 
          kw.position !== null && kw.position <= kw.target_position
        );
      }
      setIsFilterActive(true);
    } else {
      setIsFilterActive(false);
    }
    
    return filtered;
  }, [keywords, positionFilter]);
  
  const currentKeywords = useMemo(() => {
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    return filteredKeywords.slice(indexOfFirstItem, indexOfLastItem);
  }, [filteredKeywords, currentPage, itemsPerPage]);
  
  const totalPages = Math.ceil(filteredKeywords.length / itemsPerPage);
  
  useMemo(() => {
    if (currentPage > totalPages && totalPages > 0) {
      setCurrentPage(1);
    }
  }, [totalPages, currentPage]);

  const handleAddSubmit = () => {
    addKeyword(
      newKeyword.keyword, 
      newKeyword.position || undefined, 
      newKeyword.targetPosition
    );
    setNewKeyword({ keyword: '', position: 0, targetPosition: 10 });
    setIsAddDialogOpen(false);
  };

  const handleEditSubmit = () => {
    if (editingKeyword) {
      updateKeyword(editingKeyword.id, {
        keyword: editingKeyword.keyword,
        position: editingKeyword.position,
        target_position: editingKeyword.target_position
      });
      setEditingKeyword(null);
      setIsEditDialogOpen(false);
    }
  };

  const handleConfirmDelete = () => {
    if (keywordToDelete) {
      deleteKeyword(keywordToDelete);
      setKeywordToDelete(null);
      setIsDeleteDialogOpen(false);
    }
  };

  const handleImportCSV = async (file: File) => {
    try {
      return await importCSV(file);
    } catch (error) {
      console.error("Error importing CSV:", error);
      toast.error("Error al importar el archivo CSV");
      return false;
    }
  };
  
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const getPageNumbers = () => {
    const pageNumbers = [];
    const maxPagesToShow = 5;
    
    if (totalPages <= maxPagesToShow) {
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
      }
    } else {
      pageNumbers.push(1);
      
      let startPage = Math.max(2, currentPage - 1);
      let endPage = Math.min(totalPages - 1, currentPage + 1);
      
      if (currentPage <= 2) {
        endPage = Math.min(totalPages - 1, 4);
      }
      
      if (currentPage >= totalPages - 1) {
        startPage = Math.max(2, totalPages - 3);
      }
      
      if (startPage > 2) {
        pageNumbers.push('ellipsis1');
      }
      
      for (let i = startPage; i <= endPage; i++) {
        pageNumbers.push(i);
      }
      
      if (endPage < totalPages - 1) {
        pageNumbers.push('ellipsis2');
      }
      
      pageNumbers.push(totalPages);
    }
    
    return pageNumbers;
  };
  
  const getPositionChangeIcon = (current: number | null, previous: number | null) => {
    if (current === null || previous === null) return null;
    
    if (current < previous) {
      return <ArrowUp className="text-green-500 h-4 w-4" />;
    } else if (current > previous) {
      return <ArrowDown className="text-red-500 h-4 w-4" />;
    }
    return null;
  };
  
  const getPositionStatusColor = (position: number | null, target: number) => {
    if (position === null) return "text-gray-500";
    if (position <= target) return "text-green-500";
    if (position <= target + 10) return "text-amber-500";
    return "text-red-500";
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
      </div>
    );
  }

  return (
    <MetricsCard 
      title="Palabras Clave y Posiciones" 
      icon={<Search className="h-5 w-5 text-seo-purple" />}
    >
      <div className="space-y-4">
        {error && (
          <div className="bg-red-50 text-red-600 p-3 rounded-md mb-4">
            {error}
          </div>
        )}
        
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-medium">
            Total: {keywords.length} palabras clave
            {isFilterActive && (
              <span className="ml-2 text-sm text-blue-600">
                ({filteredKeywords.length} filtradas)
              </span>
            )}
          </h3>
          
          <div className="flex items-center gap-2">
            <Button 
              variant={showFilters ? "default" : "outline"} 
              size="sm" 
              className="flex items-center gap-2"
              onClick={() => setShowFilters(!showFilters)}
            >
              {showFilters ? <FilterX className="h-4 w-4" /> : <Filter className="h-4 w-4" />}
              {showFilters ? "Ocultar filtros" : "Filtrar"}
            </Button>

            <Button 
              variant="outline" 
              size="sm" 
              className="flex items-center gap-2"
              onClick={() => setIsImportDialogOpen(true)}
            >
              <FileUp className="h-4 w-4" />
              Importar CSV
            </Button>
            
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button size="sm" className="flex items-center gap-2">
                  <Plus className="h-4 w-4" />
                  Añadir Palabra Clave
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Añadir Nueva Palabra Clave</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="keyword">Palabra Clave</Label>
                    <Input 
                      id="keyword"
                      placeholder="Ej: servicios seo madrid" 
                      value={newKeyword.keyword}
                      onChange={(e) => setNewKeyword(prev => ({ ...prev, keyword: e.target.value }))}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="position">
                      Posición Actual: {newKeyword.position || "Sin posición"}
                    </Label>
                    <div className="flex items-center gap-4">
                      <Slider
                        id="position"
                        value={[newKeyword.position]}
                        min={0}
                        max={100}
                        step={1}
                        onValueChange={(values) => 
                          setNewKeyword(prev => ({ ...prev, position: values[0] }))
                        }
                        className="flex-1"
                      />
                      <Input 
                        type="number" 
                        className="w-20"
                        value={newKeyword.position}
                        onChange={(e) => 
                          setNewKeyword(prev => ({ 
                            ...prev, 
                            position: e.target.value === '' ? 0 : Number(e.target.value) 
                          }))
                        }
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="targetPosition">
                      Posición Objetivo: {newKeyword.targetPosition}
                    </Label>
                    <div className="flex items-center gap-4">
                      <Slider
                        id="targetPosition"
                        value={[newKeyword.targetPosition]}
                        min={1}
                        max={50}
                        step={1}
                        onValueChange={(values) => 
                          setNewKeyword(prev => ({ ...prev, targetPosition: values[0] }))
                        }
                        className="flex-1"
                      />
                      <Input 
                        type="number" 
                        className="w-20"
                        value={newKeyword.targetPosition}
                        onChange={(e) => 
                          setNewKeyword(prev => ({ 
                            ...prev, 
                            targetPosition: Number(e.target.value) || 10 
                          }))
                        }
                      />
                    </div>
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                    Cancelar
                  </Button>
                  <Button onClick={handleAddSubmit} disabled={!newKeyword.keyword.trim()}>
                    {isSaving ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Plus className="h-4 w-4 mr-2" />}
                    Añadir
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>
        
        {showFilters && (
          <div className="flex flex-wrap gap-4 p-4 bg-slate-50 rounded-md border">
            <div className="w-full sm:w-auto">
              <Label htmlFor="position-filter" className="text-sm">Filtrar por posición</Label>
              <Select 
                value={positionFilter} 
                onValueChange={setPositionFilter}
              >
                <SelectTrigger id="position-filter" className="w-full sm:w-[200px] mt-1">
                  <SelectValue placeholder="Todas las posiciones" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas las posiciones</SelectItem>
                  <SelectItem value="no-position">Sin posición</SelectItem>
                  <SelectItem value="in-top-10">En top 10</SelectItem>
                  <SelectItem value="in-top-30">En top 30</SelectItem>
                  <SelectItem value="above-target">Dentro del objetivo</SelectItem>
                  <SelectItem value="below-target">Fuera del objetivo</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            {isFilterActive && (
              <div className="flex items-end">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={handleClearFilters}
                  className="flex items-center gap-1 mt-[26px]"
                >
                  <FilterX className="h-3 w-3" />
                  Limpiar filtros
                </Button>
              </div>
            )}
          </div>
        )}
        
        {keywords.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <Search className="h-12 w-12 mx-auto mb-4 text-gray-300" />
            <p>No hay palabras clave añadidas todavía.</p>
            <p className="text-sm mt-2">Añade palabras clave para hacer seguimiento de sus posiciones.</p>
          </div>
        ) : filteredKeywords.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <Search className="h-12 w-12 mx-auto mb-4 text-gray-300" />
            <p>No hay palabras clave que coincidan con los filtros.</p>
            <p className="text-sm mt-2">Ajusta los filtros para ver resultados.</p>
          </div>
        ) : (
          <div className="border rounded-md overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-5/12">Palabra Clave</TableHead>
                  <TableHead className="w-2/12 text-center">Posición</TableHead>
                  <TableHead className="w-2/12 text-center">Objetivo</TableHead>
                  <TableHead className="w-1/12 text-center">Estado</TableHead>
                  <TableHead className="w-2/12 text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {currentKeywords.map((keyword) => (
                  <TableRow key={keyword.id}>
                    <TableCell className="font-medium">
                      <div className="flex items-center">
                        <span className="truncate max-w-xs">{keyword.keyword}</span>
                        {keyword.url && (
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <a 
                                href={keyword.url.startsWith('http') ? keyword.url : `https://${keyword.url}`} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="ml-1 text-gray-400 hover:text-blue-500"
                              >
                                <ExternalLink className="h-3 w-3" />
                              </a>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Abrir URL: {keyword.url}</p>
                            </TooltipContent>
                          </Tooltip>
                        )}
                      </div>
                      {keyword.search_volume && (
                        <div className="text-xs text-gray-500 mt-1">
                          Volumen: {keyword.search_volume.toLocaleString()} 
                          {keyword.keyword_difficulty !== undefined && (
                            <span className="ml-2">
                              Dificultad: {keyword.keyword_difficulty}
                            </span>
                          )}
                        </div>
                      )}
                    </TableCell>
                    <TableCell className="text-center">
                      <div className="flex items-center justify-center gap-1">
                        <span className={getPositionStatusColor(keyword.position, keyword.target_position)}>
                          {keyword.position || "-"}
                        </span>
                        {getPositionChangeIcon(keyword.position, keyword.previous_position)}
                      </div>
                    </TableCell>
                    <TableCell className="text-center">
                      <div className="flex items-center justify-center gap-1">
                        <Target className="h-3 w-3 text-gray-400" />
                        <span>{keyword.target_position}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-center">
                      {keyword.position === null ? (
                        <Tooltip>
                          <TooltipTrigger>
                            <Flag className="h-4 w-4 text-gray-400 mx-auto" />
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Sin datos de posición</p>
                          </TooltipContent>
                        </Tooltip>
                      ) : keyword.position <= keyword.target_position ? (
                        <Tooltip>
                          <TooltipTrigger>
                            <Check className="h-4 w-4 text-green-500 mx-auto" />
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Objetivo alcanzado</p>
                          </TooltipContent>
                        </Tooltip>
                      ) : (
                        <Tooltip>
                          <TooltipTrigger>
                            <X className="h-4 w-4 text-red-500 mx-auto" />
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Por debajo del objetivo</p>
                          </TooltipContent>
                        </Tooltip>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button 
                              variant="ghost" 
                              size="icon"
                              onClick={() => {
                                setEditingKeyword(keyword);
                                setIsEditDialogOpen(true);
                              }}
                            >
                              <Edit2 className="h-4 w-4 text-gray-500" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Editar palabra clave</p>
                          </TooltipContent>
                        </Tooltip>
                        
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button 
                              variant="ghost" 
                              size="icon"
                              onClick={() => {
                                setKeywordToDelete(keyword.id);
                                setIsDeleteDialogOpen(true);
                              }}
                            >
                              <Trash2 className="h-4 w-4 text-red-500" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Eliminar palabra clave</p>
                          </TooltipContent>
                        </Tooltip>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
        
        {filteredKeywords.length > 0 && totalPages > 1 && (
          <Pagination className="mt-4">
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious 
                  href="#" 
                  onClick={(e) => {
                    e.preventDefault();
                    if (currentPage > 1) handlePageChange(currentPage - 1);
                  }}
                  className={currentPage === 1 ? "pointer-events-none opacity-50" : ""}
                />
              </PaginationItem>
              
              {getPageNumbers().map((page, index) => (
                page === 'ellipsis1' || page === 'ellipsis2' ? (
                  <PaginationItem key={`ellipsis-${index}`}>
                    <PaginationEllipsis />
                  </PaginationItem>
                ) : (
                  <PaginationItem key={`page-${page}`}>
                    <PaginationLink 
                      href="#" 
                      onClick={(e) => {
                        e.preventDefault();
                        handlePageChange(page as number);
                      }}
                      isActive={currentPage === page}
                    >
                      {page}
                    </PaginationLink>
                  </PaginationItem>
                )
              ))}
              
              <PaginationItem>
                <PaginationNext 
                  href="#" 
                  onClick={(e) => {
                    e.preventDefault();
                    if (currentPage < totalPages) handlePageChange(currentPage + 1);
                  }}
                  className={currentPage === totalPages ? "pointer-events-none opacity-50" : ""}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        )}
        
        <Dialog open={isEditDialogOpen && !!editingKeyword} onOpenChange={setIsEditDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Editar Palabra Clave</DialogTitle>
            </DialogHeader>
            {editingKeyword && (
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-keyword">Palabra Clave</Label>
                  <Input 
                    id="edit-keyword"
                    value={editingKeyword.keyword}
                    onChange={(e) => setEditingKeyword({ ...editingKeyword, keyword: e.target.value })}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="edit-position">
                    Posición Actual: {editingKeyword.position === null ? "Sin posición" : editingKeyword.position}
                  </Label>
                  <div className="flex items-center gap-4">
                    <Slider
                      id="edit-position"
                      value={[editingKeyword.position ?? 0]}
                      min={0}
                      max={100}
                      step={1}
                      onValueChange={(values) => 
                        setEditingKeyword({ ...editingKeyword, position: values[0] })
                      }
                      className="flex-1"
                    />
                    <Input 
                      type="number" 
                      className="w-20"
                      value={editingKeyword.position === null ? '' : editingKeyword.position}
                      onChange={(e) => {
                        const value = e.target.value === '' ? null : Number(e.target.value);
                        setEditingKeyword({ ...editingKeyword, position: value });
                      }}
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="edit-target">
                    Posición Objetivo: {editingKeyword.target_position}
                  </Label>
                  <div className="flex items-center gap-4">
                    <Slider
                      id="edit-target"
                      value={[editingKeyword.target_position]}
                      min={1}
                      max={50}
                      step={1}
                      onValueChange={(values) => 
                        setEditingKeyword({ ...editingKeyword, target_position: values[0] })
                      }
                      className="flex-1"
                    />
                    <Input 
                      type="number" 
                      className="w-20"
                      value={editingKeyword.target_position}
                      onChange={(e) => 
                        setEditingKeyword({ 
                          ...editingKeyword, 
                          target_position: Number(e.target.value) || 10 
                        })
                      }
                    />
                  </div>
                </div>
              </div>
            )}
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                Cancelar
              </Button>
              <Button onClick={handleEditSubmit}>
                {isSaving ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                Guardar Cambios
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>¿Eliminar esta palabra clave?</AlertDialogTitle>
              <AlertDialogDescription>
                Esta acción no se puede deshacer. La palabra clave y todos sus datos de seguimiento se eliminarán permanentemente.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel onClick={() => setKeywordToDelete(null)}>
                Cancelar
              </AlertDialogCancel>
              <AlertDialogAction onClick={handleConfirmDelete} className="bg-red-600 hover:bg-red-700">
                {isSaving ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                Eliminar
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
        
        <KeywordCSVImport
          isOpen={isImportDialogOpen}
          onClose={() => setIsImportDialogOpen(false)}
          onImport={handleImportCSV}
          isImporting={isSaving}
        />
      </div>
    </MetricsCard>
  );
};
