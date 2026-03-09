export interface Product {
  brand: string;
  category: string;
  id: number;
  price: number;
  rating: number;
  sku: string;
  thumbnail: string;
  title: string;
}

export interface ProductsResponse {
  limit: number;
  products: Product[];
  skip: number;
  total: number;
}

export type SortBy = "price" | "rating";
export type SortOrder = "asc" | "desc";

export interface ProductsSearchParams {
  order?: SortOrder;
  page?: number;
  q?: string;
  sortBy?: SortBy;
}

export interface AddProductFormValues {
  brand: string;
  price: number;
  sku: string;
  title: string;
}
