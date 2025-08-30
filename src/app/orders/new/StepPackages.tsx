"use client";

import { useMemo } from "react";
import {
  Form,
  Input,
  Button,
  Space,
  InputNumber,
  Row,
  Col,
  Card,
  Divider,
} from "antd";
import {
  PlusOutlined,
  DeleteOutlined,
  ArrowLeftOutlined,
  SendOutlined,
} from "@ant-design/icons";
import type { FormInstance } from "antd/es/form";
import type { Pkg } from "./types";

type Props = {
  addForm: FormInstance<Pkg>;
  packages: Pkg[];
  onAdd: (p: Pkg) => void;
  onRemove: (idx: number) => void;
  onBack: () => void;
  onSubmit: () => void;
  submitIcon?: React.ReactNode;
};

export default function StepPackages({
  addForm,
  packages,
  onAdd,
  onRemove,
  onBack,
  onSubmit,
  submitIcon,
}: Props) {
  async function handleAdd() {
    try {
      const p = (await addForm.validateFields()) as Pkg;
      onAdd({
        ...p,
        l: Number(p.l),
        w: Number(p.w),
        h: Number(p.h),
        weight: Number(p.weight),
      });
      addForm.resetFields();
    } catch {
      /* errores se muestran en el form */
    }
  }

  const hasItems = useMemo(() => packages.length > 0, [packages]);

  return (
    <Card
      size="small"
      className="order-card"
      title={<span style={{ fontWeight: 600 }}>Agrega tus productos</span>}
    >
      {/* Bloque gris superior con la fila de agregado */}
      <div className="pkg-addbox">
        <Form form={addForm} layout="vertical" requiredMark={false}>
          <Row gutter={[16, 8]} align="bottom">
            <Col xs={24} md={3}>
              <Form.Item
                label="Largo"
                name="l"
                rules={[{ required: true, message: "Ingresa el largo" }]}
              >
                <InputNumber
                  min={0}
                  className="h40 w-full"
                  addonAfter="cm"
                  controls={false}
                />
              </Form.Item>
            </Col>

            <Col xs={24} md={3}>
              <Form.Item
                label="Alto"
                name="h"
                rules={[{ required: true, message: "Ingresa el alto" }]}
              >
                <InputNumber
                  min={0}
                  className="h40 w-full"
                  addonAfter="cm"
                  controls={false}
                />
              </Form.Item>
            </Col>

            <Col xs={24} md={3}>
              <Form.Item
                label="Ancho"
                name="w"
                rules={[{ required: true, message: "Ingresa el ancho" }]}
              >
                <InputNumber
                  min={0}
                  className="h40 w-full"
                  addonAfter="cm"
                  controls={false}
                />
              </Form.Item>
            </Col>

            <Col xs={24} md={4}>
              <Form.Item
                label="Peso en libras"
                name="weight"
                rules={[{ required: true, message: "Ingresa el peso" }]}
              >
                <InputNumber
                  min={0}
                  className="h40 w-full"
                  addonAfter="libras"
                  controls={false}
                />
              </Form.Item>
            </Col>

            <Col xs={24} md={8}>
              <Form.Item
                label="Contenido"
                name="description"
                rules={[{ required: true, message: "Describe el contenido" }]}
              >
                <Input placeholder="iPhone 14 Pro Max" className="h40" />
              </Form.Item>
            </Col>

            {/* Agregar (pill + círculo) */}
            <Col
              xs={24}
              md={3}
              style={{
                display: "flex",
                alignItems: "flex-end",
                justifyContent: "flex-end",
              }}
            >
              <div className="btn-add-group">
                <button
                  type="button"
                  className="btn-add-left"
                  onClick={handleAdd}
                >
                  Agregar
                </button>
                <button
                  type="button"
                  className="btn-add-right"
                  onClick={handleAdd}
                >
                  <PlusOutlined />
                </button>
              </div>
            </Col>
          </Row>
        </Form>
      </div>

      {/* Lista de paquetes agregados */}
      {hasItems && (
        <>
          <Divider style={{ margin: "16px 0" }} />
          {packages.map((p, idx) => (
            <div key={idx} className="pkg-row">
              <Row gutter={[12, 8]} align="middle" wrap>
                {/* Izquierda: peso + contenido */}
                <Col xs={24} md={8}>
                  <Space
                    direction="vertical"
                    size={8}
                    style={{ width: "100%" }}
                  >
                    <Input
                      value={`${p.weight} libras`}
                      readOnly
                      className="h40 readonly"
                    />
                    <Input
                      value={p.description}
                      readOnly
                      className="h40 readonly"
                    />
                  </Space>
                </Col>

                {/* Derecha: dimensiones */}
                <Col xs={24} md={14}>
                  <Row gutter={[12, 8]}>
                    <Col xs={8}>
                      <Input
                        value={`${p.l} cm`}
                        readOnly
                        className="h40 readonly"
                      />
                    </Col>
                    <Col xs={8}>
                      <Input
                        value={`${p.h} cm`}
                        readOnly
                        className="h40 readonly"
                      />
                    </Col>
                    <Col xs={8}>
                      <Input
                        value={`${p.w} cm`}
                        readOnly
                        className="h40 readonly"
                      />
                    </Col>
                  </Row>
                </Col>

                {/* Eliminar */}
                <Col
                  xs={24}
                  md={2}
                  style={{ display: "flex", justifyContent: "flex-end" }}
                >
                  <Button
                    danger
                    icon={<DeleteOutlined />}
                    onClick={() => onRemove(idx)}
                  />
                </Col>
              </Row>
            </div>
          ))}
        </>
      )}

      {/* Botonera */}
      <div className="pkg-actions">
        <Button onClick={onBack} icon={<ArrowLeftOutlined />}>
          Regresar
        </Button>
        <Button
          type="primary"
          onClick={onSubmit}
          icon={submitIcon ?? <SendOutlined />}
        >
          Enviar
        </Button>
      </div>
    </Card>
  );
}
