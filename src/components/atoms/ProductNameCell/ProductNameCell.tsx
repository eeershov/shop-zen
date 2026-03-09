import styles from "./ProductNameCell.module.css";

interface ProductNameCellProps {
  category: string;
  title: string;
}

export function ProductNameCell({ title, category }: ProductNameCellProps) {
  return (
    <div>
      <strong>{title}</strong>
      <span className={styles.category}>{category}</span>
    </div>
  );
}
