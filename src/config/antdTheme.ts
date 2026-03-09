import type { ThemeConfig } from "antd";

export const antdTheme: ThemeConfig = {
  token: {
    colorPrimary: "#242EDB",
    borderRadius: 8,
    fontFamily: "'Inter', sans-serif",
  },
  components: {
    Card: {
      borderRadiusLG: 40,
    },
    Input: {
      borderRadius: 12,
      controlHeight: 55,
      fontSize: 18,
      lineWidth: 1.5,
      colorBorder: "#ededed",
    },
    Button: {
      borderRadius: 12,
      fontSize: 18,
      controlHeight: 54,
    },
    Checkbox: {
      fontSize: 16,
    },
    Form: {
      labelFontSize: 18,
    },
  },
};
