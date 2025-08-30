"use client";
import { Form, Input, Button, Typography, message } from "antd";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { apiFetch } from "@/lib/api";
import { auth } from "@/lib/auth";

export default function LoginPage() {
  const router = useRouter();

  async function onFinish(values: any) {
    try {
      const { access_token, user } = await apiFetch("/auth/login", {
        method: "POST",
        body: JSON.stringify(values),
      });
      auth.save(access_token, user);
      message.success("Ingreso exitoso");
      router.replace("/orders");
    } catch (e: any) {
      message.error(e?.message || "Credenciales inválidas");
    }
  }

  return (
    <div className="login-page">
      <div className="login-grid">
        {/* Columna izquierda (form) */}
        <div className="login-left">
          <div className="login-box">
            <Typography.Title level={5} className="login-title">Bienvenido</Typography.Title>
            <Typography.Paragraph className="login-subtitle">
              Por favor ingresa tus credenciales
            </Typography.Paragraph>

            <Form layout="vertical" onFinish={onFinish} requiredMark={false}>
              <Form.Item label="Correo electrónico" name="email" rules={[{ required: true, type: "email" }]}>
                <Input placeholder="Digita tu correo" size="large" />
              </Form.Item>

              <Form.Item label="Contraseña" name="password" rules={[{ required: true, min: 8 }]}>
                {/* placeholder exacto del mockup */}
                <Input.Password placeholder="Digita el NIT del comercio" size="large" />
              </Form.Item>

              <Button
                type="primary"
                htmlType="submit"
                className="login-btn"
              >
                Iniciar sesión
              </Button>

              <div className="login-foot">
                ¿Necesitas una cuenta?{" "}
                <Link href="/register" className="login-link">Regístrate aquí</Link>
              </div>
            </Form>
          </div>
        </div>

        {/* Columna derecha (panel gris) */}
        <div className="login-right" />
      </div>
    </div>
  );
}
