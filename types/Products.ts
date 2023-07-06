export interface ProductType {
  _id: string;
  name: string;
  price: number;
  description?: string | undefined;
  images: string[];
}
