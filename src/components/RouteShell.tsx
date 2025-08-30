"use client";
import { usePathname } from "next/navigation";
import AppShell from "@/components/AppShell";

export default function RouteShell({ children }: { children: React.ReactNode }) {
  const p = usePathname() || "/";
  const isAuth = p === "/login" || p === "/register";
  if (isAuth) return <>{children}</>;       // layout limpio para auth
  return <AppShell>{children}</AppShell>;   // sidebar/header para el resto
}

