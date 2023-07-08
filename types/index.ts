export interface ProductType {
  _id: string;
  name: string;
  price: number;
  description?: string | undefined;
  images: string[];
}

export interface CategoryType {
  _id: string;
  name: string;
  parent?: CategoryType;
}
