import type { ThemeConfig } from "antd";

export const antdTheme: ThemeConfig = {
  token: {
    colorPrimary: "#242EDB",
    borderRadius: 8,
    fontFamily: "'Inter', sans-serif",
  },
  components: {
    Button: {
      borderRadius: 12,
      controlHeight: 54,
      fontSize: 18,
    },
    Card: {
      borderRadiusLG: 40,
    },
    Checkbox: {
      fontSize: 16,
    },
    Form: {
      labelFontSize: 18,
    },
    Input: {
      borderRadius: 12,
      colorBorder: "#ededed",
      controlHeight: 55,
      fontSize: 18,
      lineWidth: 1.5,
    },
  },
};
