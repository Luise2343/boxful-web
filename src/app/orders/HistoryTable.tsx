"use client";

import { Table } from "antd";
import type { ColumnsType } from "antd/es/table";

type Order = {
  _id: string;
  code?: string;
  customerName: string;
  address?: string;
  packages?: any[];
  createdAt?: string;
  department?: string;   // <-- leemos estos campos si vienen del API
  municipality?: string; // <--
};

function splitName(full?: string) {
  const parts = (full || "").trim().split(/\s+/);
  return { first: parts[0] || "", last: parts.slice(1).join(" ") };
}

export default function HistoryTable({
  data,
  loading,
}: {
  data: Order[];
  loading: boolean;
}) {
  const columns: ColumnsType<Order> = [
    {
      title: "No. de orden",
      dataIndex: "_id",
      key: "code",
      render: (_, r) => r.code ?? (r._id ? r._id.slice(-6) : ""),
    },
    {
      title: "Nombre",
      dataIndex: "customerName",
      key: "first",
      render: (v) => splitName(v).first,
    },
    {
      title: "Apellidos",
      dataIndex: "customerName",
      key: "last",
      render: (v) => splitName(v).last,
    },
    {
      title: "Departamento",
      dataIndex: "department",
      key: "department",
      render: (v) => v || "—",
    },
    {
      title: "Municipio",
      dataIndex: "municipality",
      key: "municipality",
      render: (v) => v || "—",
    },
    {
      title: "Paquetes en orden",
      key: "pkgs",
      align: "right",
      render: (_, r) => (
        <span className="badge-green">{r.packages?.length ?? 0}</span>
      ),
    },
  ];

  return (
    <Table
      rowKey={(r) => r._id}
      columns={columns}
      dataSource={data}
      loading={loading}
      pagination={false}
      rowSelection={{ type: "radio" }}
    />
  );
}
