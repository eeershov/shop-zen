import { PlusOutlined, ReloadOutlined } from "@ant-design/icons";
import { Button, Space, Typography } from "antd";
import { useTranslation } from "react-i18next";
import styles from "./ProductsPage.module.css";

interface ProductsToolbarProps {
  onAdd: () => void;
  onReload: () => void;
  sectionLabel: string;
}

export function ProductsToolbar({
  onAdd,
  onReload,
  sectionLabel,
}: ProductsToolbarProps) {
  const { t } = useTranslation();

  return (
    <div className={`${styles.sectionHeader} products-toolbar`}>
      <Typography.Text className={styles.sectionLabel}>
        {sectionLabel}
      </Typography.Text>

      <Space>
        <Button icon={<ReloadOutlined />} onClick={onReload} />
        <Button icon={<PlusOutlined />} onClick={onAdd} type="primary">
          {t(($) => $.products.add)}
        </Button>
      </Space>
    </div>
  );
}
