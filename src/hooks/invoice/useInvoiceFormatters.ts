
import { format } from "date-fns";
import { es } from "date-fns/locale";

export const useInvoiceFormatters = () => {
  const formatCurrency = (amount: number) => {
    return amount.toLocaleString('es-ES', {
      style: 'currency',
      currency: 'EUR'
    });
  };

  const formatDate = (dateString: string) => {
    return format(new Date(dateString), 'd MMMM yyyy', { locale: es });
  };

  return { formatCurrency, formatDate };
};
