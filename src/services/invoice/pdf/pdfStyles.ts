
/**
 * PDF styling utilities for invoice generation
 */

/**
 * Maps invoice status to display text
 */
export const getStatusText = (status: string): string => {
  switch (status) {
    case "paid":
      return "PAGADA";
    case "pending":
      return "PENDIENTE";
    case "cancelled":
      return "CANCELADA";
    default:
      return "PENDIENTE";
  }
};

/**
 * Maps invoice status to color
 */
export const getStatusColor = (status: string): { r: number, g: number, b: number } => {
  switch (status) {
    case "paid":
      return { r: 34, g: 197, b: 94 }; // Green
    case "pending":
      return { r: 234, g: 179, b: 8 }; // Yellow
    case "cancelled":
      return { r: 239, g: 68, b: 68 }; // Red
    default:
      return { r: 107, g: 114, b: 128 }; // Gray
  }
};
