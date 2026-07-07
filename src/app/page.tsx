"use client";

import { useEffect, useState } from "react";
import { useDataStore } from "@/store/dataStore";
import LandingPage from "@/components/LandingPage";
import Dashboard from "@/components/Dashboard";
import SharedWrappedView from "@/components/SharedWrappedView";

export default function Home() {
  const { isParsed } = useDataStore();
  const [sharedPayload, setSharedPayload] = useState<any>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const shared = params.get("shared");
      if (shared) {
        try {
          
          let base64 = shared.replace(/-/g, "+").replace(/_/g, "/");
          
          base64 = base64.replace(/ /g, "+");
          
          while (base64.length % 4) {
            base64 += "=";
          }
          const decodedJson = decodeURIComponent(escape(atob(base64)));
          const parsed = JSON.parse(decodedJson);
          if (parsed && parsed.stats) {
            setSharedPayload(parsed);
          }
        } catch (e) {
          console.error("Failed to decode shared stats:", e);
        }
      }
    }
  }, []);

  if (sharedPayload) {
    return (
      <SharedWrappedView 
        payload={sharedPayload} 
        onClear={() => {
          setSharedPayload(null);
          if (typeof window !== "undefined") {
            window.history.replaceState({}, document.title, window.location.pathname);
          }
        }} 
      />
    );
  }

  return isParsed ? <Dashboard /> : <LandingPage />;
}
