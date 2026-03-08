import { useState } from "react";
import { useTranslation } from "react-i18next";

export default function App() {
  const [count, setCount] = useState(0);
  const { t } = useTranslation(["common"]);
  return (
    <>
      <h1>{count}</h1>
      <button onClick={() => setCount((prev) => prev + 1)} type="button">
        {t(($) => $.button.confirm)}
      </button>
    </>
  );
}
