export interface ProductPropertyType {
  name: string;
  values: string | string[];
}

export interface ProductType {
  _id: string;
  name: string;
  price: number;
  description?: string | undefined;
  images: string[];
  category?: string;
  properties: { [key: string]: string };
}

export interface CategoryType {
  _id: string;
  name: string;
  parent?: CategoryType;
  properties: ProductPropertyType[];
}

export interface OrderType {
  _id: string;
  line_items: StripeOrder[];
  name: string;
  email: string;
  city: string;
  postalCode: string;
  streetAddress: string;
  country: string;
  paid: boolean;
  createdAt: string;
}

export interface StripeOrder {
  quantity: number;
  price_data: {
    currency: string;
    product_data: {
      name: string;
    };
    unit_amount: number;
  };
}
