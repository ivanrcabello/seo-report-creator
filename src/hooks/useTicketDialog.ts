
import { useState } from "react";

interface TicketFormData {
  subject: string;
  message: string;
  priority: string;
}

interface UseTicketDialogProps {
  onCreateTicket: (data: TicketFormData) => Promise<void>;
}

export function useTicketDialog({ onCreateTicket }: UseTicketDialogProps) {
  const [showDialog, setShowDialog] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const openDialog = () => setShowDialog(true);
  const closeDialog = () => setShowDialog(false);

  const handleCreateTicket = async (formData: TicketFormData) => {
    try {
      setIsSubmitting(true);
      await onCreateTicket(formData);
      closeDialog();
    } catch (error) {
      console.error("Error creating ticket:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    showDialog,
    isSubmitting,
    openDialog,
    closeDialog,
    handleCreateTicket
  };
}
