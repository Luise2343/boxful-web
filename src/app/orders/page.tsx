"use client";
import { useEffect, useState } from "react";
import { Table, Card, Input, Select, Flex, Button, message } from "antd";
import { apiFetch } from "@/lib/api";
import Protected from "@/components/Protected";
import Link from "next/link";

type Order = {
  _id: string;
  customerName: string;
  customerPhone: string;
  address: string;
  status: "PENDING" | "IN_PROGRESS" | "DELIVERED" | "CANCELLED";
  createdAt: string;
};

export default function OrdersPage() {
  const [data, setData] = useState<Order[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);

  const [page, setPage] = useState(1);
  const [limit] = useState(10);

  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<string | undefined>(undefined);

  async function load() {
    setLoading(true);
    try {
      const qs = new URLSearchParams({
        page: String(page),
        limit: String(limit),
        ...(search ? { search } : {}),
        ...(status ? { status } : {})
      }).toString();

      const res = await apiFetch<{ items: Order[]; total: number }>(`/orders?${qs}`);
      setData(res.items);
      setTotal(res.total);
    } catch (e: any) {
      message.error(e.message || "Error al cargar órdenes");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, status]);

  return (
    <Protected>
      <Card
        title="Historial de órdenes"
        extra={<Link href="/orders/new"><Button type="primary">Nueva orden</Button></Link>}
      >
        <Flex gap={8} wrap="wrap" style={{ marginBottom: 12 }}>
          <Input.Search
            placeholder="Buscar por cliente o teléfono"
            allowClear
            onSearch={(v) => { setSearch(v); setPage(1); load(); }}
            style={{ maxWidth: 320 }}
          />
          <Select
            allowClear
            placeholder="Estado"
            value={status}
            onChange={(v) => { setStatus(v); setPage(1); }}
            options={[
              { value: "PENDING", label: "PENDING" },
              { value: "IN_PROGRESS", label: "IN_PROGRESS" },
              { value: "DELIVERED", label: "DELIVERED" },
              { value: "CANCELLED", label: "CANCELLED" }
            ]}
            style={{ width: 180 }}
          />
        </Flex>

        <Table
          rowKey="_id"
          loading={loading}
          dataSource={data}
          pagination={{
            current: page,
            pageSize: limit,
            total,
            onChange: (p) => setPage(p)
          }}
          columns={[
            { title: "Cliente", dataIndex: "customerName" },
            { title: "Teléfono", dataIndex: "customerPhone" },
            { title: "Dirección", dataIndex: "address" },
            { title: "Estado", dataIndex: "status" },
            {
              title: "Creado",
              dataIndex: "createdAt",
              render: (v: string) => new Date(v).toLocaleString()
            }
          ]}
        />
      </Card>
    </Protected>
  );
}
