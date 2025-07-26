export interface Product {
  id: number;
  title: string;
  price: number;
  description: string;
  thumbnail: string;
  quantity?: number;
  category: string;
}

export interface Order {
  id: number;
  userId: number;
  products: { productId: number; quantity: number }[];
  total: number;
  name:string;
  email: string;
  address: string;
}