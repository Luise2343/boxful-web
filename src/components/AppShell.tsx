"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Layout, Menu } from "antd";
import { PlusOutlined, SlidersOutlined } from "@ant-design/icons";

const { Sider, Header, Content } = Layout;

export default function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname() || "/";
  const [displayName, setDisplayName] = useState<string>("{Tunombre}");

  const pageTitle =
    pathname.startsWith("/orders/new")
      ? "Crear orden"
      : pathname.startsWith("/orders")
      ? "Mis envíos"
      : "Boxful";

  const selected =
    pathname.startsWith("/orders/new")
      ? "create"
      : pathname.startsWith("/orders")
      ? "history"
      : "";

  useEffect(() => {
    try {
      const raw = typeof window !== "undefined" && localStorage.getItem("user");
      if (raw) {
        const u = JSON.parse(raw);
        setDisplayName(u?.email || u?.username || "{Tunombre}");
      }
    } catch {
      /* noop */
    }
  }, []);

  return (
    <Layout style={{ minHeight: "100vh" }}>
      {/* Sidebar */}
      <Sider
        width={208}
        theme="light"
        className="app-sider"
        style={{ background: "#F3F4F6", borderRight: "1px solid #E5E7EB" }}
      >
        {/* Branding */}
        <div className="brand">
          <img src="/favicon.ico" alt="boxful" className="brand__icon" />
          <div className="brand__text">boxful</div>
        </div>

        {/* MENÚ */}
        <div className="sidebar-section-title">Menú</div>

        <Menu
          mode="inline"
          selectedKeys={[selected]}
          className="sidebar-menu pill"
          items={[
            {
              key: "create",
              icon: <PlusOutlined />,
              label: <Link href="/orders/new">Crear orden</Link>,
            },
            {
              key: "history",
              icon: <SlidersOutlined />, // icono de sliders como en Figma
              label: <Link href="/orders">Historial</Link>,
            },
          ]}
        />
      </Sider>

      {/* Área principal */}
      <Layout style={{ background: "#F8F9FA" }}>
        <Header className="app-header">
          <div className="app-header__title">{pageTitle}</div>
          <div className="app-header__right">{displayName}</div>
        </Header>

        <Content style={{ padding: 24 }}>
          <div style={{ maxWidth: 1024, margin: "0 auto" }}>{children}</div>
        </Content>
      </Layout>
    </Layout>
  );
}
