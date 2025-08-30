"use client";
import { Form, Input, Button, Card, Typography, message } from "antd";
import { apiFetch } from "@/lib/api";
import { auth } from "@/lib/auth";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  async function onFinish(values: any) {
    try {
      const { access_token, user } = await apiFetch("/auth/login", {
        method: "POST",
        body: JSON.stringify(values)
      });
      auth.save(access_token, user);
      message.success("Ingreso exitoso");
      router.replace("/orders");
    } catch (e: any) {
      message.error(e.message || "Error al ingresar");
    }
  }
  return (
    <Card title="Iniciar sesión" style={{ maxWidth: 420, margin: "32px auto" }}>
      <Typography.Paragraph>Usa credenciales del seed o regístrate.</Typography.Paragraph>
      <Form layout="vertical" onFinish={onFinish}>
        <Form.Item label="Email" name="email" rules={[{ required: true, type: "email" }]}>
          <Input placeholder="tucorreo@dominio.com" />
        </Form.Item>
        <Form.Item label="Contraseña" name="password" rules={[{ required: true, min: 8 }]}>
          <Input.Password placeholder="********" />
        </Form.Item>
        <Button type="primary" htmlType="submit" block>Entrar</Button>
      </Form>
    </Card>
  );
}
