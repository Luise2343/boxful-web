"use client";

import { useState } from "react";
import { Form, message } from "antd";
import { useRouter } from "next/navigation";

import Protected from "@/components/Protected";
import { apiFetch } from "@/lib/api";

import StepClient, { type ClientForm } from "./StepClient";
import StepPackages from "./StepPackages";
import type { Pkg } from "./types";

type Step = 1 | 2;

export default function NewOrderPage() {
  const router = useRouter();

  // Paso actual
  const [step, setStep] = useState<Step>(1);

  // Datos del cliente (Paso 1)
  const [client, setClient] = useState<Partial<ClientForm>>({
    phoneCode: "503",
  });

  // Paquetes (Paso 2)
  const [packages, setPackages] = useState<Pkg[]>([]);
  const [addForm] = Form.useForm<Pkg>();

  // Handlers Step 1
  function handleClientChange(v: Partial<ClientForm>) {
    setClient((prev) => ({ ...prev, ...v }));
  }

  function handleClientNext(data: ClientForm) {
    setClient(data);
    setStep(2);
  }

  // Handlers Step 2
  function handleAddPackage(p: Pkg) {
    setPackages((prev) => [...prev, p]);
  }

  function handleRemovePackage(idx: number) {
    setPackages((prev) => prev.filter((_, i) => i !== idx));
  }

  // Submit final → POST /orders
  async function handleSubmit() {
    try {
      if (!packages.length) {
        message.warning("Agrega al menos un paquete.");
        return;
      }

      const customerName = `${client.firstName ?? ""} ${client.lastName ?? ""}`
        .trim()
        .replace(/\s+/g, " ");

      const customerPhone = `${client.phoneCode ?? ""}${
        (client.phoneNumber ?? "").replace(/\s+/g, "")
      }`;

      // Dirección principal (usamos la del destinatario si existe)
      const address =
        (client as any).destinationAddress ||
        (client as any).recipientAddress ||
        client.pickupAddress ||
        "";

      // Requeridos por el backend
      const department = (client.department ?? "").trim();
      const municipality = (client.municipality ?? "").trim();

      if (!department || !municipality) {
        message.warning("Completa Departamento y Municipio.");
        setStep(1);
        return;
      }

      const payload = {
        customerName,
        customerPhone,
        address,
        department,
        municipality,
        status: "PENDING",
        packages: packages.map((p) => ({
          description: p.description,
          weight: p.weight,
          dimensions: { l: p.l, w: p.w, h: p.h },
        })),
      };

      await apiFetch("/orders", {
        method: "POST",
        body: JSON.stringify(payload),
      });

      message.success("Orden creada correctamente.");
      router.push("/orders");
    } catch (err: any) {
      console.error(err);
      message.error("No se pudo crear la orden.");
    }
  }

  return (
    <Protected>
      {/* Intro de la pantalla (siempre visible como en Figma) */}
      <div className="intro-header" style={{ marginBottom: 12 }}>
        <div className="intro-header__title">Crea una orden</div>
        <p className="intro-header__subtitle">
          Dale una ventaja competitiva a tu negocio con entregas el{" "}
          <b>mismo día</b> (Área Metropolitana) y el <b>día siguiente</b> a
          nivel nacional.
        </p>
      </div>

      {step === 1 ? (
        <StepClient
          value={client}
          onChange={handleClientChange}
          onNext={handleClientNext}
          onBack={() => router.push("/orders")}
        />
      ) : (
        <StepPackages
          addForm={addForm}
          packages={packages}
          onAdd={handleAddPackage}
          onRemove={handleRemovePackage}
          onBack={() => setStep(1)}
          onSubmit={handleSubmit}
        />
      )}
    </Protected>
  );
}
