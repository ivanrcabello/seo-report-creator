
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { StickyNote, Trash } from "lucide-react";

interface NotesSectionProps {
  clientNotes: string[];
  setClientNotes: React.Dispatch<React.SetStateAction<string[]>>;
  onNoteAdded?: (updatedNotes: string[]) => void;
}

export const NotesSection: React.FC<NotesSectionProps> = ({
  clientNotes,
  setClientNotes,
  onNoteAdded,
}) => {
  const { toast } = useToast();
  const [newNote, setNewNote] = useState("");

  const handleAddNote = () => {
    if (!newNote.trim()) return;

    const updatedNotes = [...clientNotes, newNote.trim()];
    setClientNotes(updatedNotes);
    setNewNote("");
    
    if (onNoteAdded) {
      onNoteAdded(updatedNotes);
    }
    
    toast({
      title: "Nota añadida",
      description: "La nota ha sido añadida correctamente.",
    });
  };

  const handleDeleteNote = (index: number) => {
    const updatedNotes = [...clientNotes];
    updatedNotes.splice(index, 1);
    setClientNotes(updatedNotes);
    
    if (onNoteAdded) {
      onNoteAdded(updatedNotes);
    }
    
    toast({
      title: "Nota eliminada",
      description: "La nota ha sido eliminada correctamente.",
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col space-y-2">
        <Textarea
          placeholder="Añade una nueva nota..."
          value={newNote}
          onChange={(e) => setNewNote(e.target.value)}
          className="resize-y min-h-[100px]"
        />
        <Button onClick={handleAddNote} className="self-end mt-2">
          Añadir Nota
        </Button>
      </div>
      
      {clientNotes.length === 0 ? (
        <div className="text-center py-8">
          <StickyNote className="h-10 w-10 mx-auto text-gray-400 mb-4" />
          <p className="text-gray-500">No hay notas disponibles</p>
        </div>
      ) : (
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Notas ({clientNotes.length})</h3>
          {clientNotes.map((note, index) => (
            <Card key={index} className="overflow-hidden">
              <div className="flex">
                <div className="p-4 flex-grow whitespace-pre-wrap">
                  {note}
                </div>
                <div className="p-2 bg-gray-50 flex flex-col items-center justify-center">
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-8 w-8 text-red-500 hover:text-red-700 hover:bg-red-50"
                    onClick={() => handleDeleteNote(index)}
                  >
                    <Trash className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};
