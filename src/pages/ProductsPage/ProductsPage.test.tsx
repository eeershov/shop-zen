import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { App } from "antd";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { fetchProducts, searchProducts } from "@/api/products";
import "@/i18n/i18n";
import { ProductsPage } from "./ProductsPage";

const mockNavigate = vi.fn().mockResolvedValue(undefined);
const mockUseSearch = vi.fn();

vi.mock("@/api/products", () => ({
  fetchProducts: vi.fn(),
  searchProducts: vi.fn(),
}));
vi.mock("@tanstack/react-router", async (importOriginal) => {
  const actual =
    await importOriginal<typeof import("@tanstack/react-router")>();
  return {
    ...actual,
    useNavigate: () => mockNavigate,
    useSearch: () => mockUseSearch(),
  };
});

const PRICE_REGEX = /48\s652,00/;
const PRICE_TEXT_MATCHER = (_: string, element: Element | null) =>
  PRICE_REGEX.test(element?.textContent ?? "");

const productsResponse = {
  products: [
    {
      id: 1,
      title: "Perfume Oil",
      category: "fragrances",
      brand: "Impression of Acqua Di Gio",
      sku: "RCH45Q1A",
      rating: 2.5,
      price: 48_652,
      thumbnail: "https://example.com/p1.jpg",
    },
    {
      id: 2,
      title: "iPhone 9",
      category: "smartphones",
      brand: "Apple",
      sku: "A1",
      rating: 4.8,
      price: 549,
      thumbnail: "https://example.com/p2.jpg",
    },
  ],
  total: 50,
  skip: 0,
  limit: 20,
};

function renderProductsPage() {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });

  return render(
    <App>
      <QueryClientProvider client={queryClient}>
        <ProductsPage />
      </QueryClientProvider>
    </App>
  );
}

describe("ProductsPage", () => {
  beforeEach(() => {
    mockNavigate.mockClear();
    mockUseSearch.mockReturnValue({
      page: 1,
      sortBy: undefined,
      order: undefined,
      q: undefined,
    });
    vi.mocked(fetchProducts).mockResolvedValue(productsResponse);
    vi.mocked(searchProducts).mockResolvedValue(productsResponse);
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("renders page title", async () => {
    renderProductsPage();

    expect(await screen.findByText("Товары")).toBeInTheDocument();
  });

  it("renders expected table headers", async () => {
    renderProductsPage();

    expect((await screen.findAllByText("Наименование")).length).toBeGreaterThan(
      0
    );
    expect(screen.getAllByText("Вендор").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Артикул").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Оценка").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Цена, Р").length).toBeGreaterThan(0);
  });

  it("renders products from API response", async () => {
    renderProductsPage();

    expect((await screen.findAllByText("Perfume Oil")).length).toBeGreaterThan(
      0
    );
    expect(screen.getAllByText("Apple").length).toBeGreaterThan(0);
  });

  it("shows loading state while fetching", () => {
    vi.mocked(fetchProducts).mockReturnValue(
      new Promise(() => {
        // keep pending
      })
    );

    renderProductsPage();

    expect(screen.getAllByTestId("products-loading").length).toBeGreaterThan(0);
  });

  it("shows ratings below 3 in red, and others not in red", async () => {
    renderProductsPage();

    const lowRating = (await screen.findAllByText("2.5/5"))[0];
    const highRating = screen.getAllByText("4.8/5")[0];

    expect(lowRating).toHaveStyle({ color: "rgb(255, 77, 79)" });
    expect(highRating).not.toHaveStyle({ color: "rgb(255, 77, 79)" });
  });

  it("formats price in ru-RU locale", async () => {
    renderProductsPage();

    expect(
      (await screen.findAllByText(PRICE_TEXT_MATCHER)).length
    ).toBeGreaterThan(0);
  });

  it("opens add product modal on add button click", async () => {
    const user = userEvent.setup();

    renderProductsPage();

    const addButton = screen.getAllByText("Добавить")[0].closest("button");
    expect(addButton).not.toBeNull();
    await user.click(addButton as HTMLButtonElement);

    expect(await screen.findByText("Добавить товар")).toBeInTheDocument();
  });

  it("navigates with sort params when sorting changes", async () => {
    renderProductsPage();

    await screen.findAllByText("Perfume Oil");

    const sorters = document.querySelectorAll(
      "th.ant-table-column-has-sorters"
    );
    const priceSorter = Array.from(sorters).at(-1) as HTMLElement | undefined;
    expect(priceSorter).toBeDefined();
    fireEvent.click(priceSorter as HTMLElement);

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalled();
    });

    const navArg = mockNavigate.mock.calls.at(-1)?.[0] as {
      search: (prev: Record<string, unknown>) => Record<string, unknown>;
    };
    expect(navArg.search({ page: 3, q: "abc" })).toEqual({
      page: 1,
      q: "abc",
      sortBy: "price",
      order: "asc",
    });
  });

  it("navigates with updated page when pagination changes", async () => {
    const user = userEvent.setup();

    renderProductsPage();

    const pageTwoLink = document.querySelector<HTMLAnchorElement>(
      ".ant-pagination-item-2 a"
    );
    expect(pageTwoLink).not.toBeNull();
    await user.click(pageTwoLink as HTMLAnchorElement);

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalled();
    });

    const navArg = mockNavigate.mock.calls.at(-1)?.[0] as {
      search: (prev: Record<string, unknown>) => Record<string, unknown>;
    };
    expect(navArg.search({ q: "abc" })).toEqual({ q: "abc", page: 2 });
  });
});
