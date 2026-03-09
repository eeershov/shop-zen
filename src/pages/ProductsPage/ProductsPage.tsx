import { SearchOutlined } from "@ant-design/icons";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { useNavigate, useSearch } from "@tanstack/react-router";
import type { TableProps } from "antd";
import { App, Input, Progress, Table, Typography } from "antd";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { fetchProducts, searchProducts } from "@/api/products";
import { useDebounce } from "@/hooks/useDebounce";
import type { Product, SortBy, SortOrder } from "@/types/product.types";
import { AddProductModal } from "./AddProductModal";
import "./ProductsPage.global.css";
import styles from "./ProductsPage.module.css";
import { ProductsToolbar } from "./ProductsToolbar";
import { useProductColumns } from "./useProductColumns";

const LIMIT = 20;

function mapAntdOrder(
  order: "ascend" | "descend" | null
): SortOrder | undefined {
  if (order === "ascend") {
    return "asc";
  }
  if (order === "descend") {
    return "desc";
  }
  return undefined;
}

export function ProductsPage() {
  const { t } = useTranslation();
  const { message } = App.useApp();
  const navigate = useNavigate({ from: "/products" });
  const { order, page = 1, q, sortBy } = useSearch({ from: "/products" });

  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [isModalOpen, setModalOpen] = useState(false);
  const [searchValue, setSearchValue] = useState(q ?? "");
  const debouncedSearch = useDebounce(searchValue, 300);

  useEffect(() => {
    setSearchValue(q ?? "");
  }, [q]);

  useEffect(() => {
    const nextQ = debouncedSearch.trim() ? debouncedSearch.trim() : undefined;
    if (nextQ === q) {
      return;
    }

    navigate({
      search: (prev) => ({
        ...prev,
        page: 1,
        q: nextQ,
      }),
    }).catch(() => undefined);
  }, [debouncedSearch, navigate, q]);

  const { data, error, isError, isFetching, refetch } = useQuery({
    queryKey: ["products", { order, page, q, sortBy }],
    queryFn: () => {
      const params = {
        limit: LIMIT,
        skip: (page - 1) * LIMIT,
        sortBy,
        order,
      };

      if (q) {
        return searchProducts({ ...params, q });
      }

      return fetchProducts(params);
    },
    placeholderData: keepPreviousData,
  });

  useEffect(() => {
    if (!isError) {
      return;
    }

    const errorMessage =
      error instanceof Error
        ? error.message
        : t(($) => $.products.errors.loadFailed);
    message.error(errorMessage);
  }, [error, isError, message, t]);

  const columns = useProductColumns(sortBy, order);

  const onTableChange: TableProps<Product>["onChange"] = (
    _pagination,
    _filters,
    sorter,
    extra
  ) => {
    if (extra.action !== "sort") {
      return;
    }

    const singleSorter = Array.isArray(sorter) ? sorter[0] : sorter;
    const sorterField = singleSorter?.field;
    const sorterOrder = mapAntdOrder(singleSorter?.order ?? null);

    const nextSortBy: SortBy | undefined =
      sorterField === "price" || sorterField === "rating"
        ? sorterField
        : undefined;

    navigate({
      search: (prev) => ({
        ...prev,
        page: 1,
        sortBy: nextSortBy,
        order: sorterOrder,
      }),
    }).catch(() => undefined);
  };

  return (
    <div className={styles.root}>
      <header className={`${styles.header} products-header`}>
        <Typography.Title className={styles.pageTitle} level={2}>
          {t(($) => $.products.title)}
        </Typography.Title>

        <Input
          className={styles.searchInput}
          onChange={(event) => {
            setSearchValue(event.target.value);
          }}
          placeholder={t(($) => $.products.search)}
          prefix={
            <span className={styles.searchIcon}>
              <SearchOutlined />
            </span>
          }
          value={searchValue}
        />
      </header>

      <main className={styles.content}>
        {isFetching ? (
          <Progress
            className={`${styles.loadingBar} products-loading-bar`}
            percent={100}
            showInfo={false}
            status="active"
            strokeColor="#242EDB"
          />
        ) : (
          <div className={styles.loadingBarPlaceholder} />
        )}

        <div className={styles.contentCard}>
          <ProductsToolbar
            onAdd={() => {
              setModalOpen(true);
            }}
            onReload={() => {
              refetch().catch(() => undefined);
            }}
            sectionLabel={t(($) => $.products.sectionLabel)}
          />

          <div className="products-table" data-testid="products-loading">
            <Table<Product>
              columns={columns}
              dataSource={data?.products ?? []}
              loading={isFetching}
              onChange={onTableChange}
              pagination={{
                current: page,
                onChange: (nextPage) => {
                  navigate({
                    search: (prev) => ({
                      ...prev,
                      page: nextPage,
                    }),
                  }).catch(() => undefined);
                },
                pageSize: LIMIT,
                showTotal: (total, [from, to]) =>
                  t(($) => $.products.pagination.showing, {
                    from,
                    to,
                    total,
                  }),
                total: data?.total ?? 0,
              }}
              rowKey="id"
              rowSelection={{
                onChange: (keys) => {
                  setSelectedRowKeys(keys);
                },
                selectedRowKeys,
              }}
            />
          </div>
        </div>
      </main>

      <AddProductModal
        onClose={() => {
          setModalOpen(false);
        }}
        open={isModalOpen}
      />
    </div>
  );
}
