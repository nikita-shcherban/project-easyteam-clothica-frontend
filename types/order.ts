export type OrderStatus =
  'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';

export interface Order {
  _id: string;
  createdAt: string;
  totalPrice: number;
  status: OrderStatus;
}

export interface UserOrdersResponse {
  success: boolean;
  count: number;
  orders: Order[];
}
