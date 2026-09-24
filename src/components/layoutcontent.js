"use client";

import { usePathname } from "next/navigation";

import Header from "./header";
import Footer from "./footer";

export default function layoutContent({ children }) {
  const pathname = usePathname();

  const isLoginPage = pathname === "/";

  return (
    <>
      {!isLoginPage && <Header />}

      <main className="flex-1">
        {children}
      </main>

      {!isLoginPage && <Footer />}
    </>
  );
}