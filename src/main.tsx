import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { RouterProvider } from "@tanstack/react-router";
import { App, ConfigProvider } from "antd";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./i18n/i18n.ts";
import "./styles/global.css";
import { antdTheme } from "./config/antdTheme.ts";
import { router } from "./router";

const queryClient = new QueryClient();

// biome-ignore lint/style/noNonNullAssertion: its the root
const root = createRoot(document.getElementById("root")!);
root.render(
  <StrictMode>
    <ConfigProvider theme={antdTheme}>
      <App>
        <QueryClientProvider client={queryClient}>
          <RouterProvider router={router} />
        </QueryClientProvider>
      </App>
    </ConfigProvider>
  </StrictMode>
);
