// src/app/layout.tsx
import type { Metadata } from "next";
import "./globals.css"; // Ojo: ruta relativa correcta al globals.css del directorio /app

export const metadata: Metadata = {
  title: "Boxful Web",
  description: "MVP UI"
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body>
        <header style={{ padding: "12px 16px", background: "#111", color: "#fff", fontWeight: 700 }}>
          Boxful • Web
        </header>
        <main style={{ maxWidth: 1100, margin: "24px auto", padding: "0 16px" }}>
          {children}
        </main>
      </body>
    </html>
  );
}
