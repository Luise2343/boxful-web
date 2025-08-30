import Image from "next/image";
import styles from "./page.module.css";
import Link from "next/link";


export default function Home() {
  return (
    <>
      <h1>Bienvenido a Boxful Web</h1>
      <p>
        Comienza con <Link href="/login">Login</Link> o <Link href="/register">Registro</Link>.
      </p>
    </>
  );
}
