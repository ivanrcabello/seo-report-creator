
interface TicketOriginalMessageProps {
  message: string;
}

export function TicketOriginalMessage({ message }: TicketOriginalMessageProps) {
  return (
    <div className="bg-gray-50 p-3 rounded-lg mb-4">
      <p className="text-sm">{message}</p>
    </div>
  );
}
