"use client";

import { useState, useEffect } from "react";
import Splash from "@/components/Splash";
import GlobalBackground from "@/components/GlobalBackground";
import SidePillars from "@/components/SidePillars";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import ProductGrid from "@/components/ProductGrid";
import CartDrawer from "@/components/CartDrawer";
import Footer from "@/components/Footer";

export default function HomePage() {
  const [splashDone, setSplashDone] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  if (!mounted) return null;

  return (
    <>
      <GlobalBackground />
      <SidePillars />

      {!splashDone && <Splash onComplete={() => setSplashDone(true)} />}

      <div
        style={{
          opacity: splashDone ? 1 : 0,
          transition: "opacity 0.6s ease",
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          position: "relative",
          zIndex: 1,
        }}
      >
        <Header />
        <main style={{ flex: 1, maxWidth: 600, margin: "0 auto", width: "100%" }}>
          <Hero />
          <ProductGrid />
        </main>
        <Footer />
        <CartDrawer />
      </div>
    </>
  );
}
