import styles from "./ProductThumbnail.module.css";

interface ProductThumbnailProps {
  alt: string;
  src: string;
}

export function ProductThumbnail({ src, alt }: ProductThumbnailProps) {
  return (
    <img
      alt={alt}
      className={styles.thumbnail}
      height={48}
      src={src}
      width={48}
    />
  );
}
