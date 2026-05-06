"use client";

import GlobalBackground from "@/components/GlobalBackground";
import SidePillars from "@/components/SidePillars";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import ScentGuide from "@/components/ScentGuide";
import ProductGrid from "@/components/ProductGrid";
import CartDrawer from "@/components/CartDrawer";
import Footer from "@/components/Footer";

export default function HomePage() {
  return (
    <>
      <GlobalBackground />
      <SidePillars />

      <div
        style={{
          opacity: 1,
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
          <ScentGuide />
          <ProductGrid />
        </main>
        <Footer />
        <CartDrawer />
      </div>
    </>
  );
}
