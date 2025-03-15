
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { StarRating } from "./StarRating";
import { MessageSquare, Send } from "lucide-react";
import { toast } from "sonner";

export function FeedbackForm() {
  const [rating, setRating] = useState(0);
  const [feedback, setFeedback] = useState("");
  const [isSending, setIsSending] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (rating === 0) {
      toast.error("Por favor selecciona una valoración antes de enviar");
      return;
    }

    setIsSending(true);
    
    // Simulate sending data
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    toast.success("¡Gracias por tu feedback!");
    setRating(0);
    setFeedback("");
    setIsSending(false);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MessageSquare className="h-5 w-5 text-blue-500" />
          Feedback
        </CardTitle>
        <CardDescription>
          ¿Cómo valorarías nuestro trabajo hasta ahora?
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <StarRating value={rating} onChange={setRating} />
          </div>
          <Textarea
            placeholder="Comparte tu opinión o sugerencias..."
            className="mb-4"
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
          />
          <Button type="submit" className="w-full" disabled={isSending}>
            {isSending ? (
              "Enviando..."
            ) : (
              <>
                <Send className="mr-2 h-4 w-4" />
                Enviar feedback
              </>
            )}
          </Button>
        </form>
      </CardContent>
      <CardFooter className="pt-0 pb-4 px-6">
        <div className="text-xs text-center text-gray-500 w-full">
          Tu feedback nos ayuda a mejorar nuestros servicios y a brindarte una mejor experiencia.
        </div>
      </CardFooter>
    </Card>
  );
}
