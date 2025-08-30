"use client";

import { DatePicker, Button, Space } from "antd";
import type { Dayjs } from "dayjs";
import dayjs from "dayjs";
import "dayjs/locale/es";

dayjs.locale("es");
const { RangePicker } = DatePicker;

export default function HistoryFilters({
  range,
  onRangeChange,
  onSearch,
  onExport,
}: {
  range?: [Dayjs, Dayjs];
  onRangeChange: (v: [Dayjs, Dayjs] | null) => void;
  onSearch: () => void;
  onExport: () => void;
}) {
  return (
    <div className="history-filters">
      <Space wrap>
        {/* Selector por MES para que el display sea “Enero – Julio” */}
        <RangePicker
          picker="month"
          format="MMMM"
          value={range}
          onChange={(v) => onRangeChange(v as [Dayjs, Dayjs] | null)}
          className="h40"
          allowClear={false}
        />
        <Button type="primary" onClick={onSearch}>
          Buscar
        </Button>
        <Button onClick={onExport}>Descargar órdenes</Button>
      </Space>
    </div>
  );
}
