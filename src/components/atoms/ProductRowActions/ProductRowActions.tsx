import { EllipsisOutlined, PlusOutlined } from "@ant-design/icons";
import { Button, Space } from "antd";

export function ProductRowActions() {
  return (
    <Space>
      <Button
        icon={<PlusOutlined />}
        shape="round"
        size="small"
        style={{ width: 52 }}
        type="primary"
      />
      <Button icon={<EllipsisOutlined />} shape="circle" size="small" />
    </Space>
  );
}
