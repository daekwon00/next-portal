"use client";

import { useEffect, useState } from "react";
import { initMsw } from "@/lib/msw";

export function MswProvider({ children }: { children: React.ReactNode }) {
  const [ready, setReady] = useState(
    process.env.NEXT_PUBLIC_API_MOCKING !== "true"
  );

  useEffect(() => {
    if (process.env.NEXT_PUBLIC_API_MOCKING === "true") {
      initMsw().then(() => setReady(true));
    }
  }, []);

  if (!ready) return null;

  return <>{children}</>;
}
