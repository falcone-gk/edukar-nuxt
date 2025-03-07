export interface AttributeOption {
  id: number;
  label: string;
  value: string;
}
export interface Attribute {
  id: number;
  name: string;
  label: string;
  options: AttributeOption[];
}

export interface Category {
  id: number;
  name: string;
  attributes: Attribute[];
}

export interface Product {
  id: number;
  name: string;
  slug: string;
  description: string;
  category: string;
  show: boolean;
  price: string;
  type: number;
  product_image: string;
  is_one_time_purchase: boolean;
  items: Product[];
  identifier: string;
  comments: {
    user: Author;
    comment: string;
    created_at: string;
  }[];
}

type Sell = {
  id: number;
  user_name: string;
  user_last_name: string;
  user_email: string;
  user_phone_number: string;
  products: number[];
  order_id: string;
  total_cost: string;
};
