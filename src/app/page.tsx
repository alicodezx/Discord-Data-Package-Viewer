"use client";

import { useDataStore } from "@/store/dataStore";
import LandingPage from "@/components/LandingPage";
import Dashboard from "@/components/Dashboard";

export default function Home() {
  const { isParsed } = useDataStore();
  return isParsed ? <Dashboard /> : <LandingPage />;
}
