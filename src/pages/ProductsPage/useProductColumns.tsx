import type { TableColumnsType } from "antd";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { PriceCell } from "@/components/atoms/PriceCell/PriceCell";
import { ProductNameCell } from "@/components/atoms/ProductNameCell/ProductNameCell";
import { ProductRowActions } from "@/components/atoms/ProductRowActions/ProductRowActions";
import { ProductThumbnail } from "@/components/atoms/ProductThumbnail/ProductThumbnail";
import { RatingCell } from "@/components/atoms/RatingCell/RatingCell";
import type { Product, SortBy, SortOrder } from "@/types/product.types";

function mapSortOrder(order?: SortOrder): "ascend" | "descend" | null {
  if (order === "asc") {
    return "ascend";
  }
  if (order === "desc") {
    return "descend";
  }
  return null;
}

export function useProductColumns(sortBy?: SortBy, order?: SortOrder) {
  const { t } = useTranslation();

  return useMemo<TableColumnsType<Product>>(
    () => [
      {
        dataIndex: "thumbnail",
        key: "thumbnail",
        render: (thumbnail: string, record) => (
          <ProductThumbnail alt={record.title} src={thumbnail} />
        ),
        width: 64,
      },
      {
        dataIndex: "title",
        key: "name",
        render: (_value: string, record) => (
          <ProductNameCell category={record.category} title={record.title} />
        ),
        title: t(($) => $.products.columns.name),
      },
      {
        dataIndex: "brand",
        key: "brand",
        render: (brand: string) => (
          <strong style={{ fontFamily: "'Open Sans', sans-serif" }}>
            {brand}
          </strong>
        ),
        title: t(($) => $.products.columns.vendor),
      },
      {
        dataIndex: "sku",
        key: "sku",
        render: (sku: string) => (
          <span style={{ fontFamily: "'Open Sans', sans-serif" }}>{sku}</span>
        ),
        title: t(($) => $.products.columns.sku),
      },
      {
        dataIndex: "rating",
        key: "rating",
        render: (rating: number) => <RatingCell rating={rating} />,
        sortOrder: sortBy === "rating" ? mapSortOrder(order) : null,
        sorter: true,
        title: t(($) => $.products.columns.rating),
      },
      {
        dataIndex: "price",
        key: "price",
        render: (price: number) => <PriceCell price={price} />,
        sortOrder: sortBy === "price" ? mapSortOrder(order) : null,
        sorter: true,
        title: t(($) => $.products.columns.price),
      },
      {
        key: "actions",
        render: () => <ProductRowActions />,
      },
    ],
    [order, sortBy, t]
  );
}
