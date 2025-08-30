import type { Metadata } from "next";
import "@/app/globals.css";
import RouteShell from "@/components/RouteShell";

export const metadata: Metadata = { title: "Boxful Web", description: "MVP UI" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body>
        <RouteShell>{children}</RouteShell>
      </body>
    </html>
  );
}
