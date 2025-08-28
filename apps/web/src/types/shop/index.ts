export interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  stock: number;
}

export interface Member {
  id: string;
  name: string;
  phone: string;
  points: number;
  level: number;
  joinDate: string;
}

export interface Order {
  id: string;
  items: OrderItem[];
  total: number;
  status: string;
  createdAt: string;
}

export interface OrderItem {
  id: string;
  productId: string;
  quantity: number;
  price: number;
  subtotal: number;
}

export interface Store {
  id: string;
  name: string;
  address: string;
}
