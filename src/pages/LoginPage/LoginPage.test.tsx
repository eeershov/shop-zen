import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { App } from "antd";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { InvalidCredentialsError, loginApi } from "@/api/auth";
import { setToken } from "@/utils/auth";
import "@/i18n/i18n";
import { LoginPage } from "./LoginPage";

const mockNavigate = vi.fn().mockResolvedValue(undefined);

const RE_USERNAME = /логин/i;
const RE_PASSWORD = /пароль/i;
const RE_SUBMIT = /войти/i;

vi.mock("@/api/auth", async (importOriginal) => {
  const actual = await importOriginal<typeof import("@/api/auth")>();
  return { ...actual, loginApi: vi.fn() };
});
vi.mock("@/utils/auth", () => ({
  setToken: vi.fn(),
  getToken: vi.fn(),
  clearToken: vi.fn(),
}));
vi.mock("@tanstack/react-router", async (importOriginal) => {
  const actual =
    await importOriginal<typeof import("@tanstack/react-router")>();
  return { ...actual, useRouter: () => ({ navigate: mockNavigate }) };
});

function renderLoginPage() {
  const queryClient = new QueryClient({
    defaultOptions: { mutations: { retry: false } },
  });
  return render(
    <App>
      <QueryClientProvider client={queryClient}>
        <LoginPage />
      </QueryClientProvider>
    </App>
  );
}

describe("LoginPage", () => {
  beforeEach(() => {
    vi.mocked(loginApi).mockReset();
    vi.mocked(setToken).mockClear();
    mockNavigate.mockClear();
  });

  it("renders the login page title", async () => {
    renderLoginPage();
    expect(await screen.findByText("Добро пожаловать!")).toBeInTheDocument();
  });

  it("renders username field, password field, and submit button", () => {
    renderLoginPage();
    expect(
      screen.getByRole("textbox", { name: RE_USERNAME })
    ).toBeInTheDocument();
    expect(screen.getByLabelText(RE_PASSWORD)).toBeInTheDocument();
    expect(
      screen.getAllByRole("button", { name: RE_SUBMIT })[0]
    ).toBeInTheDocument();
  });

  it("shows validation errors when submitting empty form", async () => {
    const user = userEvent.setup();
    renderLoginPage();

    await user.click(screen.getAllByRole("button", { name: RE_SUBMIT })[0]);

    expect(await screen.findByText("Введите логин")).toBeInTheDocument();
    expect(await screen.findByText("Введите пароль")).toBeInTheDocument();
    expect(vi.mocked(loginApi)).not.toHaveBeenCalled();
  });

  it("on successful login, stores token and navigates to /products", async () => {
    const user = userEvent.setup();
    vi.mocked(loginApi).mockResolvedValue({ accessToken: "test-token-123" });

    renderLoginPage();

    await user.type(
      screen.getByRole("textbox", { name: RE_USERNAME }),
      "admin"
    );
    await user.type(screen.getByLabelText(RE_PASSWORD), "secret");
    await user.click(screen.getAllByRole("button", { name: RE_SUBMIT })[0]);

    await waitFor(() => {
      expect(vi.mocked(setToken)).toHaveBeenCalledWith("test-token-123", false);
      expect(mockNavigate).toHaveBeenCalledWith({ to: "/products" });
    });
  });

  it("displays API error message when login fails", async () => {
    const user = userEvent.setup();
    vi.mocked(loginApi).mockRejectedValue(new InvalidCredentialsError());

    renderLoginPage();

    await user.type(
      screen.getByRole("textbox", { name: RE_USERNAME }),
      "baduser"
    );
    await user.type(screen.getByLabelText(RE_PASSWORD), "wrongpass");
    await user.click(screen.getAllByRole("button", { name: RE_SUBMIT })[0]);

    expect(
      await screen.findByText("Неверный логин или пароль")
    ).toBeInTheDocument();
    expect(vi.mocked(setToken)).not.toHaveBeenCalled();
  });

  it("shows loading state on submit button while login is pending", async () => {
    const user = userEvent.setup();
    vi.mocked(loginApi).mockReturnValue(
      new Promise(() => {
        /* never resolves */
      })
    );

    renderLoginPage();

    await user.type(
      screen.getByRole("textbox", { name: RE_USERNAME }),
      "admin"
    );
    await user.type(screen.getByLabelText(RE_PASSWORD), "secret");
    await user.click(screen.getAllByRole("button", { name: RE_SUBMIT })[0]);

    await waitFor(() => {
      expect(screen.getAllByRole("button", { name: RE_SUBMIT })[0]).toHaveClass(
        "ant-btn-loading"
      );
    });
  });
});
