// Товар у кошику (одна позиція = товар + розмір)
export interface BasketItem {
  goodId: string;
  name: string;
  image?: string;
  price: number;
  currency: string;
  size: string;
  quantity: number;
  rating: number;
  feedbacksCount: number;
}
