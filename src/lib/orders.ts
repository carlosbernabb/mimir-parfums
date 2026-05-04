export type OrderStatus =
  | "pending_payment"
  | "paid"
  | "processing"
  | "shipped"
  | "delivered"
  | "cancelled";

export const STATUS_LABELS: Record<OrderStatus, string> = {
  pending_payment: "Pendiente de Pago",
  paid: "Pago Confirmado",
  processing: "En Preparación",
  shipped: "Enviado",
  delivered: "Entregado",
  cancelled: "Cancelado",
};

export const STATUS_ORDER: OrderStatus[] = [
  "paid",
  "processing",
  "shipped",
  "delivered",
];

export function canCancel(status: OrderStatus): boolean {
  return status === "paid" || status === "processing";
}

export function generateOrderId(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let id = "MIM-";
  for (let i = 0; i < 4; i++) {
    id += chars[Math.floor(Math.random() * chars.length)];
  }
  return id;
}

export interface OrderItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

export interface ShippingInfo {
  nombre: string;
  telefono: string;
  email: string;
  calle: string;
  numero: string;
  colonia: string;
  ciudad: string;
  estado: string;
  codigoPostal: string;
}

export interface Order {
  id: string;
  order_id: string;
  status: OrderStatus;
  customer_email: string;
  items: OrderItem[];
  shipping: ShippingInfo;
  stripe_session_id: string | null;
  total_mxn: number;
  notes: string | null;
  tracking_number: string | null;
  carrier: string | null;
  tracking_url: string | null;
  created_at: string;
  updated_at: string;
}
