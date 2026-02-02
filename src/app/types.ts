export interface Product {
  id: string;
  name: string;
  category: 'core' | 'seasonal';
  description: string;
  tastingNotes: {
    aroma: string;
    flavor: string;
    body: string;
    finish: string;
  };
  price: number;
  image: string;
  beanType: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface ShippingOption {
  type: 'standard' | 'priority';
  cost: number;
}

export interface OrderSummary {
  items: CartItem[];
  subtotal: number;
  shipping: ShippingOption;
  total: number;
}
