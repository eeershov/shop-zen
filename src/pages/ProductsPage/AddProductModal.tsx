import { App, Form, Input, Modal } from "antd";
import { useTranslation } from "react-i18next";
import type { AddProductFormValues } from "@/types/product.types";

interface AddProductModalProps {
  onClose: () => void;
  open: boolean;
}

export function AddProductModal({ open, onClose }: AddProductModalProps) {
  const [form] = Form.useForm<AddProductFormValues>();
  const { t } = useTranslation();
  const { message } = App.useApp();

  const handleOk = async () => {
    await form.validateFields();
    message.success(t(($) => $.products.modal.success));
    form.resetFields();
    onClose();
  };

  const handleCancel = () => {
    form.resetFields();
    onClose();
  };

  return (
    <Modal
      destroyOnHidden
      onCancel={handleCancel}
      onOk={() => {
        handleOk().catch(() => undefined);
      }}
      open={open}
      title={t(($) => $.products.modal.title)}
    >
      <Form<AddProductFormValues>
        form={form}
        layout="vertical"
        requiredMark={false}
      >
        <Form.Item
          label={t(($) => $.products.modal.fields.name)}
          name="title"
          rules={[
            {
              required: true,
              message: t(($) => $.products.modal.errors.nameRequired),
            },
          ]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label={t(($) => $.products.modal.fields.price)}
          name="price"
          rules={[
            {
              required: true,
              message: t(($) => $.products.modal.errors.priceRequired),
            },
          ]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label={t(($) => $.products.modal.fields.vendor)}
          name="brand"
          rules={[
            {
              required: true,
              message: t(($) => $.products.modal.errors.vendorRequired),
            },
          ]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label={t(($) => $.products.modal.fields.sku)}
          name="sku"
          rules={[
            {
              required: true,
              message: t(($) => $.products.modal.errors.skuRequired),
            },
          ]}
        >
          <Input />
        </Form.Item>
      </Form>
    </Modal>
  );
}
