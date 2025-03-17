
import React from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { StickyNote, Trash } from "lucide-react";

interface NotesSectionProps {
  notes: string[];
  newNote: string;
  onNoteChange: React.Dispatch<React.SetStateAction<string>>;
  onAddNote: () => void;
  onRemoveNote: (index: number) => void;
}

export const NotesSection: React.FC<NotesSectionProps> = ({
  notes,
  newNote,
  onNoteChange,
  onAddNote,
  onRemoveNote,
}) => {
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && e.ctrlKey) {
      onAddNote();
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col space-y-2">
        <Textarea
          placeholder="Añade una nueva nota..."
          value={newNote}
          onChange={(e) => onNoteChange(e.target.value)}
          onKeyDown={handleKeyDown}
          className="resize-y min-h-[100px]"
        />
        <div className="flex justify-between items-center">
          <small className="text-muted-foreground">
            Presiona Ctrl+Enter para añadir rápidamente
          </small>
          <Button onClick={onAddNote} className="self-end mt-2">
            Añadir Nota
          </Button>
        </div>
      </div>
      
      {notes.length === 0 ? (
        <div className="text-center py-8">
          <StickyNote className="h-10 w-10 mx-auto text-gray-400 mb-4" />
          <p className="text-gray-500">No hay notas disponibles</p>
        </div>
      ) : (
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Notas ({notes.length})</h3>
          {notes.map((note, index) => (
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
                    onClick={() => onRemoveNote(index)}
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
