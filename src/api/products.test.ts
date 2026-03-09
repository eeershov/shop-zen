import { afterEach, describe, expect, it, vi } from "vitest";
import { getToken } from "@/utils/auth";
import { fetchProducts, ProductsApiError, searchProducts } from "./products";

vi.mock("@/utils/auth", () => ({ getToken: vi.fn() }));

const mockProductsResponse = {
  products: [
    {
      id: 1,
      title: "Test Product",
      category: "electronics",
      brand: "TestBrand",
      sku: "SKU-001",
      rating: 4.5,
      price: 100,
      thumbnail: "https://example.com/img.jpg",
    },
  ],
  total: 1,
  skip: 0,
  limit: 20,
};

function mockFetch(body: unknown, ok = true, status = 200) {
  vi.stubGlobal(
    "fetch",
    vi.fn().mockResolvedValue({
      ok,
      status,
      json: () => Promise.resolve(body),
    })
  );
}

describe("fetchProducts", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
    vi.mocked(getToken).mockReset();
  });

  it("returns products response on success", async () => {
    mockFetch(mockProductsResponse);

    const result = await fetchProducts({ limit: 20, skip: 0 });

    expect(result).toEqual(mockProductsResponse);
  });

  it("calls /products with limit and skip params", async () => {
    mockFetch(mockProductsResponse);

    await fetchProducts({ limit: 20, skip: 40 });

    const url = vi.mocked(fetch).mock.calls[0][0] as string;
    expect(url).toContain("/products?");
    expect(url).toContain("limit=20");
    expect(url).toContain("skip=40");
  });

  it("includes sortBy and order when provided", async () => {
    mockFetch(mockProductsResponse);

    await fetchProducts({ limit: 20, skip: 0, sortBy: "price", order: "asc" });

    const url = vi.mocked(fetch).mock.calls[0][0] as string;
    expect(url).toContain("sortBy=price");
    expect(url).toContain("order=asc");
  });

  it("omits sortBy and order when not provided", async () => {
    mockFetch(mockProductsResponse);

    await fetchProducts({ limit: 20, skip: 0 });

    const url = vi.mocked(fetch).mock.calls[0][0] as string;
    expect(url).not.toContain("sortBy");
    expect(url).not.toContain("order");
  });

  it("attaches Authorization header when token exists", async () => {
    vi.mocked(getToken).mockReturnValue("my-token");
    mockFetch(mockProductsResponse);

    await fetchProducts({ limit: 20, skip: 0 });

    const init = vi.mocked(fetch).mock.calls[0][1] as RequestInit;
    expect((init.headers as Record<string, string>).Authorization).toBe(
      "Bearer my-token"
    );
  });

  it("throws ProductsApiError on non-ok response", async () => {
    mockFetch({ message: "Not found" }, false, 404);

    await expect(fetchProducts({ limit: 20, skip: 0 })).rejects.toBeInstanceOf(
      ProductsApiError
    );
  });
});

describe("searchProducts", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
    vi.mocked(getToken).mockReset();
  });

  it("calls /products/search with q param", async () => {
    mockFetch(mockProductsResponse);

    await searchProducts({ q: "phone", limit: 20, skip: 0 });

    const url = vi.mocked(fetch).mock.calls[0][0] as string;
    expect(url).toContain("/products/search?");
    expect(url).toContain("q=phone");
  });

  it("includes sortBy and order in search request", async () => {
    mockFetch(mockProductsResponse);

    await searchProducts({
      q: "phone",
      limit: 20,
      skip: 0,
      sortBy: "rating",
      order: "desc",
    });

    const url = vi.mocked(fetch).mock.calls[0][0] as string;
    expect(url).toContain("sortBy=rating");
    expect(url).toContain("order=desc");
  });

  it("attaches Authorization header when token exists", async () => {
    vi.mocked(getToken).mockReturnValue("my-token");
    mockFetch(mockProductsResponse);

    await searchProducts({ q: "phone", limit: 20, skip: 0 });

    const init = vi.mocked(fetch).mock.calls[0][1] as RequestInit;
    expect((init.headers as Record<string, string>).Authorization).toBe(
      "Bearer my-token"
    );
  });

  it("returns products response on success", async () => {
    mockFetch(mockProductsResponse);

    const result = await searchProducts({ q: "phone", limit: 20, skip: 0 });

    expect(result).toEqual(mockProductsResponse);
  });

  it("throws ProductsApiError on non-ok response", async () => {
    mockFetch({ message: "Server error" }, false, 500);

    await expect(
      searchProducts({ q: "phone", limit: 20, skip: 0 })
    ).rejects.toBeInstanceOf(ProductsApiError);
  });
});
