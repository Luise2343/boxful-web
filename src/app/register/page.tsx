"use client";
import { Form, Input, Button, Card, message } from "antd";
import { apiFetch } from "@/lib/api";
import { auth } from "@/lib/auth";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const router = useRouter();
  async function onFinish(values: any) {
    try {
      const { access_token, user } = await apiFetch("/auth/register", {
        method: "POST",
        body: JSON.stringify(values)
      });
      auth.save(access_token, user);
      message.success("Registro exitoso");
      router.replace("/orders");
    } catch (e: any) {
      message.error(e.message || "Error al registrar");
    }
  }
  return (
    <Card title="Crear cuenta" style={{ maxWidth: 460, margin: "32px auto" }}>
      <Form layout="vertical" onFinish={onFinish}>
        <Form.Item label="Email" name="email" rules={[{ required: true, type: "email" }]}>
          <Input />
        </Form.Item>
        <Form.Item label="Contraseña" name="password" rules={[{ required: true, min: 8 }]}>
          <Input.Password />
        </Form.Item>
        <Button type="primary" htmlType="submit" block>Registrarme</Button>
      </Form>
    </Card>
  );
}
