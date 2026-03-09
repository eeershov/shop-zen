import type {
  ProductsResponse,
  SortBy,
  SortOrder,
} from "@/types/product.types";
import { getToken } from "@/utils/auth";

const BASE_URL = "https://dummyjson.com";

export class ProductsApiError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ProductsApiError";
  }
}

interface FetchProductsParams {
  limit: number;
  order?: SortOrder;
  skip: number;
  sortBy?: SortBy;
}

interface SearchProductsParams extends FetchProductsParams {
  q: string;
}

function authHeaders(): HeadersInit {
  const token = getToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export async function fetchProducts(
  params: FetchProductsParams
): Promise<ProductsResponse> {
  const qs = new URLSearchParams({
    limit: String(params.limit),
    skip: String(params.skip),
  });
  if (params.sortBy) {
    qs.set("sortBy", params.sortBy);
  }
  if (params.order) {
    qs.set("order", params.order);
  }

  const response = await fetch(`${BASE_URL}/products?${qs}`, {
    headers: authHeaders(),
  });
  const data = (await response.json()) as Record<string, unknown>;

  if (!response.ok) {
    const message =
      typeof data.message === "string" ? data.message : "Server error";
    throw new ProductsApiError(message);
  }

  return data as unknown as ProductsResponse;
}

export async function searchProducts(
  params: SearchProductsParams
): Promise<ProductsResponse> {
  const qs = new URLSearchParams({
    q: params.q,
    limit: String(params.limit),
    skip: String(params.skip),
  });
  if (params.sortBy) {
    qs.set("sortBy", params.sortBy);
  }
  if (params.order) {
    qs.set("order", params.order);
  }

  const response = await fetch(`${BASE_URL}/products/search?${qs}`, {
    headers: authHeaders(),
  });
  const data = (await response.json()) as Record<string, unknown>;

  if (!response.ok) {
    const message =
      typeof data.message === "string" ? data.message : "Server error";
    throw new ProductsApiError(message);
  }

  return data as unknown as ProductsResponse;
}
