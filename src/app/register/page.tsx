"use client";
import { useState } from "react";
import {
  Card,
  Form,
  Input,
  Button,
  Typography,
  Row,
  Col,
  Select,
  DatePicker,
  Space,
  Modal,
  message
} from "antd";
import { WarningFilled } from "@ant-design/icons";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { apiFetch } from "@/lib/api";
import { auth } from "@/lib/auth";

type FormValues = {
  firstName: string;
  lastName: string;
  gender?: string;
  birthdate?: any;
  email: string;
  phoneCode: string;
  phoneNumber: string;
  password: string;
  confirm: string;
};

const GENDER_OPTS = [
  { value: "F", label: "Femenino" },
  { value: "M", label: "Masculino" },
  { value: "N", label: "Prefiero no decirlo" }
];

export default function RegisterPage() {
  const [form] = Form.useForm<FormValues>();
  const [loading, setLoading] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [pendingValues, setPendingValues] = useState<FormValues | null>(null);
  const router = useRouter();

  async function doRegister(values: FormValues) {
    setLoading(true);
    try {
      const { access_token, user } = await apiFetch("/auth/register", {
        method: "POST",
        body: JSON.stringify({ email: values.email, password: values.password })
      });
      auth.save(access_token, user);
      message.success("Registro exitoso");
      router.replace("/orders");
    } catch (e: any) {
      message.error(e?.message || "No se pudo registrar");
    } finally {
      setLoading(false);
      setConfirmOpen(false);
    }
  }

  function onFinish(values: FormValues) {
    setPendingValues(values);
    setConfirmOpen(true);
  }

  const phonePretty =
    pendingValues ? `+${pendingValues.phoneCode} ${pendingValues.phoneNumber}` : "";

  return (
    <div className="register-page">
      <div className="register-grid">
        {/* Izquierda */}
        <div className="register-left">
          <div className="register-panel">
            <Space direction="vertical" size={2} style={{ width: "100%" }}>
              <div className="register-head">
            <Link href="/login" className="backicon" aria-label="Volver" title="Volver">
              {/* Chevron fino como en Figma */}
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden>
                <path d="M15 18l-6-6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </Link>
            <h2 className="register-title">Cuéntanos de ti</h2>
          </div>
          <p className="register-subtitle">Completa la información de registro</p>
            </Space>

            <Card bordered className="register-card" bodyStyle={{ padding: 16 }}>
              <Form
                form={form}
                layout="vertical"
                initialValues={{ phoneCode: "503" }}
                requiredMark={false}
                onFinish={onFinish}
              >
                <Row gutter={16}>
                  <Col xs={24} md={12}>
                    <Form.Item label="Nombre" name="firstName" rules={[{ required: true }]}>
                      <Input placeholder="Digita tu nombre" size="large" />
                    </Form.Item>
                  </Col>
                  <Col xs={24} md={12}>
                    <Form.Item label="Apellido" name="lastName" rules={[{ required: true }]}>
                      <Input placeholder="Digita tu apellido" size="large" />
                    </Form.Item>
                  </Col>

                  <Col xs={24} md={12}>
                    <Form.Item label="Sexo" name="gender">
                      <Select placeholder="Seleccionar" options={GENDER_OPTS} size="large" />
                    </Form.Item>
                  </Col>
                  <Col xs={24} md={12}>
                    <Form.Item label="Fecha de nacimiento" name="birthdate">
                      <DatePicker style={{ width: "100%" }} placeholder="Seleccionar" size="large" />
                    </Form.Item>
                  </Col>

                  <Col xs={24} md={12}>
                    <Form.Item
                      label="Correo electrónico"
                      name="email"
                      rules={[{ required: true }, { type: "email", message: "Correo inválido" }]}
                    >
                      <Input placeholder="Digitar correo" size="large" />
                    </Form.Item>
                  </Col>

                  <Col xs={24} md={12}>
                    <Form.Item label="Número de whatsapp" required>
                      <Space.Compact style={{ width: "100%" }}>
                        <Form.Item name="phoneCode" noStyle>
                          <Select style={{ width: 110 }} options={[{ value: "503", label: "503" }]} size="large" />
                        </Form.Item>
                        <Form.Item
                          name="phoneNumber"
                          noStyle
                          rules={[{ required: true, message: "Digita número" }]}
                        >
                          <Input placeholder="???? ?????" size="large" />
                        </Form.Item>
                      </Space.Compact>
                    </Form.Item>
                  </Col>

                  <Col xs={24} md={12}>
                    <Form.Item
                      label="Contraseña"
                      name="password"
                      rules={[{ required: true, min: 8, message: "Mínimo 8 caracteres" }]}
                    >
                      <Input.Password placeholder="Digitar contraseña" size="large" />
                    </Form.Item>
                  </Col>
                  <Col xs={24} md={12}>
                    <Form.Item
                      label="Repetir contraseña"
                      name="confirm"
                      dependencies={["password"]}
                      rules={[
                        { required: true, message: "Confirma tu contraseña" },
                        ({ getFieldValue }) => ({
                          validator(_, value) {
                            if (!value || getFieldValue("password") === value) return Promise.resolve();
                            return Promise.reject(new Error("Las contraseñas no coinciden"));
                          }
                        })
                      ]}
                    >
                      <Input.Password placeholder="Digitar contraseña" size="large" />
                    </Form.Item>
                  </Col>
                </Row>

                <Button type="primary" htmlType="submit" className="register-btn">
                  Siguiente
                </Button>
              </Form>
            </Card>
          </div>
        </div>

        {/* Derecha (panel gris) */}
        <div className="register-right" />
      </div>

      {/* Modal confirmación */}
      <Modal
  className="confirm-phone-modal"
  centered
  open={confirmOpen}
  onCancel={() => setConfirmOpen(false)}
  okText="Aceptar"
  cancelText="Cancelar"
  okButtonProps={{ loading }}
  width={500}
  title={
  <div className="confirmphone__head">
    <span className="confirmphone__icon"><WarningFilled /></span>
    <span className="confirmphone__title">
      Confirmar número <strong>de teléfono</strong>
    </span>
  </div>
}
  onOk={() => pendingValues && doRegister(pendingValues)}
>
  <p className="confirmphone__text">
    ¿Está seguro de que desea continuar con el número <strong>{phonePretty}</strong>?
  </p>
</Modal>

    </div>
  );
}
