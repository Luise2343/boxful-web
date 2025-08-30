"use client";
import { useState } from "react";
import { Steps, Card, Form, Input, Button, Space, InputNumber, message } from "antd";
import Protected from "@/components/Protected";
import { apiFetch } from "@/lib/api";
import { useRouter } from "next/navigation";

export default function NewOrderPage() {
  const [step, setStep] = useState(0);
  const [formClient] = Form.useForm();
  const [formPkgs] = Form.useForm();
  const router = useRouter();

  const next = async () => {
    const ok = await formClient.validateFields().then(() => true).catch(() => false);
    if (ok) setStep(1);
  };
  const back = () => setStep(0);

  async function submit() {
    const client = formClient.getFieldsValue();
    const { packages } = formPkgs.getFieldsValue();

    if (!packages?.length) {
      message.warning("Agrega al menos 1 paquete");
      return;
    }

    try {
        await apiFetch("/orders", {
    method: "POST",
    body: JSON.stringify({
        customerName: String(client.customerName || "").trim(),
        customerPhone: String(client.customerPhone || "").replace(/\D/g, ""), // solo dígitos
        address: String(client.address || "").trim(),
        packages: (packages || []).map((p: any) => ({
        description: p.description,
        weight: Number(p.weight || 0),
        dimensions: { l: Number(p.l || 0), w: Number(p.w || 0), h: Number(p.h || 0) }
        }))
    })
    });
      message.success("Orden creada");
      router.replace("/orders");
    } catch (e: any) {
      message.error(e.message || "Error al crear orden");
    }
  }

  return (
    <Protected>
      <Card title="Nueva orden">
        <Steps current={step} items={[{ title: "Cliente" }, { title: "Paquetes" }]} style={{ marginBottom: 24 }} />

        {step === 0 && (
          <Form form={formClient} layout="vertical" initialValues={{ customerName: "", customerPhone: "", address: "" }}>
            <Form.Item label="Nombre del cliente" name="customerName" rules={[{ required: true }]}>
              <Input />
            </Form.Item>
            <Form.Item label="Teléfono" name="customerPhone" rules={[{ required: true }]}>
              <Input />
            </Form.Item>
            <Form.Item label="Dirección" name="address" rules={[{ required: true }]}>
              <Input.TextArea rows={3} />
            </Form.Item>
            <Space>
              <Button type="primary" onClick={next}>Siguiente</Button>
            </Space>
          </Form>
        )}

        {step === 1 && (
          <Form form={formPkgs} layout="vertical" initialValues={{ packages: [{ description: "" }] }}>
            <Form.List name="packages">
              {(fields, { add, remove }) => (
                <>
                  {fields.map(({ key, name }) => (
                    <Card key={key} size="small" style={{ marginBottom: 12 }} title={`Paquete #${name + 1}`}
                      extra={<Button danger onClick={() => remove(name)}>Eliminar</Button>}>
                      <Form.Item label="Descripción" name={[name, "description"]} rules={[{ required: true }]}>
                        <Input placeholder="Caja mediana" />
                      </Form.Item>
                      <Form.Item label="Peso (kg)" name={[name, "weight"]} rules={[{ required: true }]}>
                        <InputNumber min={0} style={{ width: 160 }} />
                      </Form.Item>
                      <Space wrap>
                        <Form.Item label="Largo" name={[name, "l"]}><InputNumber min={0} /></Form.Item>
                        <Form.Item label="Ancho" name={[name, "w"]}><InputNumber min={0} /></Form.Item>
                        <Form.Item label="Alto"  name={[name, "h"]}><InputNumber min={0} /></Form.Item>
                      </Space>
                    </Card>
                  ))}
                  <Button onClick={() => add()}>Agregar paquete</Button>
                </>
              )}
            </Form.List>

            <Space style={{ marginTop: 16 }}>
              <Button onClick={back}>Atrás</Button>
              <Button type="primary" onClick={submit}>Crear orden</Button>
            </Space>
          </Form>
        )}
      </Card>
    </Protected>
  );
}
