export interface AttributeOption {
  id: int;
  label: string;
  value: string;
}
export interface Attribute {
  id: int;
  name: string;
  label: string;
  options: AttributeOption[];
}

export interface Category {
  id: int;
  name: string;
  attributes: Attribute[];
}

export interface Product {
  id: int;
  name: string;
  slug: string;
  description: string;
  category: string;
  show: boolean;
  price: string;
  type: string;
  product_image: string;
  is_one_time_purchase: boolean;
  items: Product[];
}
