"use client";

import { useEffect } from "react";
import {
  Form,
  Input,
  Button,
  Row,
  Col,
  Card,
  DatePicker,
  Select,
} from "antd";
import { ArrowLeftOutlined, ArrowRightOutlined } from "@ant-design/icons";

export type ClientForm = {
  // Fila 1
  pickupAddress: string;
  scheduledAt?: string; // ISO o lo que manejes; DatePicker entregará dayjs, lo mapeamos al final si hace falta

  // Fila 2
  firstName: string;
  lastName: string;
  email?: string;

  // Fila 3
  phoneCode: string; // "503" por defecto
  phoneNumber: string;
  destinationAddress: string;

  // Fila 4
  department?: string;
  municipality?: string;
  referencePoint?: string;

  // Fila 5
  notes?: string;
};

export default function StepClient({
  value,
  onChange,
  onNext,
  onBack,
}: {
  value: Partial<ClientForm>;
  onChange: (v: Partial<ClientForm>) => void;
  onNext: (v: ClientForm) => void;
  onBack: () => void;
}) {
  const [form] = Form.useForm<ClientForm>();

  // Sincroniza valores entrantes (por si vuelves del paso 2)
  useEffect(() => {
    form.setFieldsValue({
      phoneCode: "503",
      ...value,
    } as any);
  }, [value, form]);

  const handleValuesChange = (_: any, all: Partial<ClientForm>) => {
    onChange(all);
  };

  const handleSubmit = async () => {
    try {
      const raw = await form.validateFields();
      // Ant Design DatePicker devuelve dayjs: para el UI no hace falta normalizar aquí.
      onNext(raw as ClientForm);
    } catch {
      /* errores de validación visibles en el form */
    }
  };

  return (
    <div className="order-step">
      {/* Intro (encaja con tu encabezado/intro ya colocado arriba en la página) */}
      <Card
        size="small"
        className="order-card"
        title={<span style={{ fontWeight: 600 }}>Completa los datos</span>}
      >
        <Form
          form={form}
          layout="vertical"
          requiredMark={false}
          onValuesChange={handleValuesChange}
          initialValues={{ phoneCode: "503" }}
        >
          <Row gutter={[16, 16]}>
            {/* Fila 1 */}
            <Col xs={24} md={18}>
              <Form.Item
                label="Dirección de recolección"
                name="pickupAddress"
                rules={[{ required: true, message: "Ingresa la dirección de recolección" }]}
              >
                <Input
                  placeholder="Ej: Calle San Antonio 123, San Salvador"
                  className="h40"
                />
              </Form.Item>
            </Col>
            <Col xs={24} md={6}>
              <Form.Item
                label="Fecha programada"
                name="scheduledAt"
                rules={[{ required: true, message: "Selecciona una fecha" }]}
              >
                <DatePicker
                  className="w-full h40"
                  placeholder="Seleccionar"
                  style={{ width: "100%" }}
                />
              </Form.Item>
            </Col>

            {/* Fila 2 */}
            <Col xs={24} md={8}>
              <Form.Item
                label="Nombres"
                name="firstName"
                rules={[{ required: true, message: "Ingresa los nombres" }]}
              >
                <Input placeholder="Juan Carlos" className="h40" />
              </Form.Item>
            </Col>
            <Col xs={24} md={8}>
              <Form.Item
                label="Apellidos"
                name="lastName"
                rules={[{ required: true, message: "Ingresa los apellidos" }]}
              >
                <Input placeholder="Pérez López" className="h40" />
              </Form.Item>
            </Col>
            <Col xs={24} md={8}>
              <Form.Item
                label="Correo electrónico"
                name="email"
                rules={[
                  { type: "email", message: "Correo no válido" },
                ]}
              >
                <Input placeholder="correo@ejemplo.com" className="h40" />
              </Form.Item>
            </Col>

            {/* Fila 3 */}
            <Col xs={24} md={8}>
              <Form.Item
                label="Teléfono"
                required
                style={{ marginBottom: 0 }}
              >
                <Input.Group compact style={{ display: "flex" }}>
                  <Form.Item
                    name="phoneCode"
                    noStyle
                    rules={[{ required: true, message: "Código" }]}
                  >
                    <Select
                      className="h40"
                      style={{ width: 100 }}
                      options={[{ value: "503", label: "+503" }]}
                    />
                  </Form.Item>
                  <Form.Item
                    name="phoneNumber"
                    noStyle
                    rules={[
                      { required: true, message: "Número" },
                      { pattern: /^\d[\d\s]{6,}$/, message: "Revisa el número" },
                    ]}
                  >
                    <Input
                      className="h40"
                      placeholder="7777 7777"
                      style={{ flex: 1 }}
                    />
                  </Form.Item>
                </Input.Group>
              </Form.Item>
            </Col>

            <Col xs={24} md={16}>
              <Form.Item
                label="Dirección del destinatario"
                name="destinationAddress"
                rules={[{ required: true, message: "Ingresa la dirección del destinatario" }]}
              >
                <Input
                  placeholder="Ej: Colonia Miramonte, casa #24, San Salvador"
                  className="h40"
                />
              </Form.Item>
            </Col>

            {/* Fila 4 */}
            <Col xs={24} md={8}>
              <Form.Item label="Departamento" name="department">
                <Input placeholder="Ej: San Salvador" className="h40" />
              </Form.Item>
            </Col>
            <Col xs={24} md={8}>
              <Form.Item label="Municipio" name="municipality">
                <Input placeholder="Ej: San Salvador" className="h40" />
              </Form.Item>
            </Col>
            <Col xs={24} md={8}>
              <Form.Item label="Punto de referencia" name="referencePoint">
                <Input placeholder="Ej: Frente a la gasolinera X" className="h40" />
              </Form.Item>
            </Col>

            {/* Fila 5 */}
            <Col xs={24}>
              <Form.Item label="Indicaciones" name="notes">
                <Input.TextArea
                  placeholder="Ej: Llamar al llegar, perro en la entrada"
                  autoSize={{ minRows: 3, maxRows: 5 }}
                />
              </Form.Item>
            </Col>

            {/* Botonera */}
            <Col span={24}>
              <div style={{ display: "flex", justifyContent: "flex-end", gap: 8 }}>
                <Button onClick={onBack} icon={<ArrowLeftOutlined />}>
                  Regresar
                </Button>
                <Button type="primary" onClick={handleSubmit} icon={<ArrowRightOutlined />}>
                  Siguiente
                </Button>
              </div>
            </Col>
          </Row>
        </Form>
      </Card>
    </div>
  );
}

