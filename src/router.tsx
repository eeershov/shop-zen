import {
  createRootRoute,
  createRoute,
  createRouter,
  Outlet,
  redirect,
} from "@tanstack/react-router";
import { LoginPage } from "@/pages/LoginPage/LoginPage";
import { ProductsPage } from "@/pages/ProductsPage/ProductsPage";
import type { ProductsSearchParams } from "@/types/product.types";
import { getToken } from "@/utils/auth";

const rootRoute = createRootRoute({ component: Outlet });

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  beforeLoad: () => {
    throw redirect({ to: getToken() ? "/products" : "/login" });
  },
});

const loginRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/login",
  beforeLoad: () => {
    if (getToken()) {
      throw redirect({ to: "/products" });
    }
  },
  component: LoginPage,
});

const productsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/products",
  validateSearch: (search: Record<string, unknown>): ProductsSearchParams => ({
    page: typeof search.page === "number" ? search.page : 1,
    sortBy:
      search.sortBy === "price" || search.sortBy === "rating"
        ? search.sortBy
        : undefined,
    order:
      search.order === "asc" || search.order === "desc"
        ? search.order
        : undefined,
    q: typeof search.q === "string" && search.q ? search.q : undefined,
  }),
  beforeLoad: () => {
    if (!getToken()) {
      throw redirect({ to: "/login" });
    }
  },
  component: ProductsPage,
});

const routeTree = rootRoute.addChildren([
  indexRoute,
  loginRoute,
  productsRoute,
]);

export const router = createRouter({ routeTree });

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}
