
import { useState } from "react";
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
  Loader2
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
import { MetricsCard } from "./MetricsCard";

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
    deleteKeyword 
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
          <h3 className="text-lg font-medium">Total: {keywords.length} palabras clave</h3>
          
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
        
        {keywords.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <Search className="h-12 w-12 mx-auto mb-4 text-gray-300" />
            <p>No hay palabras clave añadidas todavía.</p>
            <p className="text-sm mt-2">Añade palabras clave para hacer seguimiento de sus posiciones.</p>
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
                {keywords.map((keyword) => (
                  <TableRow key={keyword.id}>
                    <TableCell className="font-medium">{keyword.keyword}</TableCell>
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
        
        {/* Edit Dialog */}
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

        {/* Delete Confirmation Dialog */}
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
      </div>
    </MetricsCard>
  );
};
