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
}

export interface CategoryType {
  _id: string;
  name: string;
  parent?: CategoryType;
  properties: ProductPropertyType[];
}
