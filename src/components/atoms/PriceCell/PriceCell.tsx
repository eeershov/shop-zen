import styles from "./PriceCell.module.css";

interface PriceCellProps {
  price: number;
}

export function PriceCell({ price }: PriceCellProps) {
  const formatted = price.toLocaleString("ru-RU", {
    maximumFractionDigits: 2,
    minimumFractionDigits: 2,
  });
  const commaIndex = formatted.lastIndexOf(",");
  const intPart = formatted.slice(0, commaIndex);
  const decPart = formatted.slice(commaIndex);

  return (
    <span className={styles.price}>
      {intPart}
      <span className={styles.priceCents}>{decPart}</span>
    </span>
  );
}
