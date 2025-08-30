"use client";
import { ReactNode } from "react";

export default function PageTopBar({
  title,
  right,
}: { title: string; right?: ReactNode }) {
  return (
    <div className="page-topbar">
      <h1 className="page-topbar__title">{title}</h1>
      <div className="page-topbar__right">{right}</div>
    </div>
  );
}
