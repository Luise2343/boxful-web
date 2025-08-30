"use client";

import { useEffect, useState } from "react";
import { Card, Pagination, message } from "antd";
import dayjs, { Dayjs } from "dayjs";

import Protected from "@/components/Protected";
import { apiFetch } from "@/lib/api";

import HistoryFilters from "./HistoryFilters";
import HistoryTable from "./HistoryTable";

type OrderDto = {
  _id: string;
  customerName: string;
  customerPhone?: string;
  address?: string;
  status?: string;
  packages?: any[];
  createdAt?: string;
  code?: string;
};

export default function OrdersHistoryPage() {
  const [range, setRange] = useState<[Dayjs, Dayjs]>([
    dayjs().startOf("year"),
    dayjs(),
  ]);

  const [data, setData] = useState<OrderDto[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [total, setTotal] = useState(0);

  async function fetchOrders(p = page) {
    setLoading(true);
    try {
      const qs = new URLSearchParams({
        page: String(p),
        limit: String(limit),
        // Opcional: si luego filtras por fecha, añade from/to aquí
      }).toString();

      const res = await apiFetch(`/orders?${qs}`);
      // Adapta a tu shape real (items/total o data/count)
      const items = (res?.items ?? res?.data ?? res) as OrderDto[];
      const count = res?.total ?? res?.count ?? items?.length ?? 0;

      setData(items || []);
      setTotal(count);
    } catch (e) {
      console.error(e);
      message.error("No se pudieron cargar las órdenes.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchOrders(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function handleSearch() {
    setPage(1);
    fetchOrders(1);
  }

  function handleExport() {
    // Exporta las filas actuales visibles
    const rows = (data || []).map((o) => {
      const parts = (o.customerName || "").trim().split(/\s+/);
      const first = parts[0] || "";
      const last = parts.slice(1).join(" ");
      const code = o.code ?? (o._id ? o._id.slice(-6) : "");
      const count = o.packages?.length ?? 0;
      const dt = o.createdAt ? dayjs(o.createdAt).format("YYYY-MM-DD HH:mm") : "";
      return { code, first, last, department: "", municipality: "", packages: count, date: dt };
    });

    const header =
      "No. de orden,Nombre,Apellidos,Departamento,Municipio,Paquetes,Fecha";
    const csv = [
      header,
      ...rows.map((r) =>
        [r.code, r.first, r.last, r.department, r.municipality, r.packages, r.date].join(",")
      ),
    ].join("\n");

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "ordenes.csv";
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <Protected>
      <Card
        className="order-card"
        title={<span style={{ fontWeight: 600 }}>Mis envíos</span>}
      >
        <HistoryFilters
          range={range}
          onRangeChange={(r) => r && setRange(r as [Dayjs, Dayjs])}
          onSearch={handleSearch}
          onExport={handleExport}
        />

        <HistoryTable data={data} loading={loading} />

        <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 12 }}>
          <Pagination
            current={page}
            pageSize={limit}
            total={total}
            onChange={(p) => {
              setPage(p);
              fetchOrders(p);
            }}
          />
        </div>
      </Card>
    </Protected>
  );
}
