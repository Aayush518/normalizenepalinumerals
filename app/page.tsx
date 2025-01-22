"use client";

import { useState } from "react";
import { NumberConverter } from "@/components/number-converter";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-background to-muted">
      <Header />
      <div className="container mx-auto px-4 py-8">
        <NumberConverter />
      </div>
      <Footer />
    </main>
  );
}