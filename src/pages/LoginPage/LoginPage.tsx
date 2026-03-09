import { LockOutlined, UserOutlined } from "@ant-design/icons";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "@tanstack/react-router";
import {
  App,
  Button,
  Card,
  Checkbox,
  Divider,
  Form,
  Input,
  Typography,
} from "antd";
import { useTranslation } from "react-i18next";
import { InvalidCredentialsError, loginApi } from "@/api/auth";
import IconLogo from "@/assets/logo.svg?react";
import type { LoginPayload } from "@/types/auth.types";
import { setToken } from "@/utils/auth";
import styles from "./LoginPage.module.css";

interface FormValues {
  password: string;
  remember: boolean;
  username: string;
}

export function LoginPage() {
  const { t } = useTranslation();
  const router = useRouter();
  const { message } = App.useApp();

  const { mutate: login, isPending } = useMutation({
    mutationFn: (payload: LoginPayload) => loginApi(payload),
    onSuccess: (data, variables) => {
      setToken(data.accessToken, variables.remember);
      router.navigate({ to: "/products" }).catch(() => undefined);
    },
    onError: (err) => {
      if (err instanceof InvalidCredentialsError) {
        message.error(t(($) => $.login.errors.invalidCredentials));
      } else {
        message.error(t(($) => $.login.errors.serverError));
      }
    },
  });

  const handleFinish = (values: FormValues) => {
    login({
      username: values.username,
      password: values.password,
      remember: values.remember ?? false,
    });
  };

  return (
    <div className={styles.root}>
      <Card className={styles.card}>
        <div className={styles.innerFrame}>
          <div className={styles.logo}>
            <IconLogo />
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <Typography.Title className={styles.title} level={2}>
              {t(($) => $.login.title)}
            </Typography.Title>

            <Typography.Text className={styles.subtitle}>
              {t(($) => $.login.subtitle)}
            </Typography.Text>
          </div>

          <Form<FormValues>
            className={styles.form}
            layout="vertical"
            onFinish={handleFinish}
            requiredMark={false}
          >
            <Form.Item
              label={t(($) => $.login.fields.username)}
              name="username"
              rules={[
                {
                  required: true,
                  message: t(($) => $.login.errors.usernameRequired),
                },
              ]}
            >
              <Input
                allowClear
                prefix={<UserOutlined className={styles.prefixIcon} />}
                size="large"
              />
            </Form.Item>

            <Form.Item
              label={t(($) => $.login.fields.password)}
              name="password"
              rules={[
                {
                  required: true,
                  message: t(($) => $.login.errors.passwordRequired),
                },
              ]}
            >
              <Input.Password
                prefix={<LockOutlined className={styles.prefixIcon} />}
                size="large"
              />
            </Form.Item>

            <Form.Item name="remember" valuePropName="checked">
              <Checkbox>{t(($) => $.login.remember)}</Checkbox>
            </Form.Item>

            <Form.Item>
              <Button
                block
                className={styles.submitBtn}
                htmlType="submit"
                loading={isPending}
                size="large"
                type="primary"
              >
                {t(($) => $.login.button.submit)}
              </Button>
            </Form.Item>

            <Divider plain>
              <Typography.Text type="secondary">
                {t(($) => $.login.divider)}
              </Typography.Text>
            </Divider>
          </Form>

          <div className={styles.footer}>
            <Typography.Text type="secondary">
              {t(($) => $.login.noAccount)}{" "}
            </Typography.Text>
            <Typography.Link>{t(($) => $.login.button.create)}</Typography.Link>
          </div>
        </div>
      </Card>
    </div>
  );
}
