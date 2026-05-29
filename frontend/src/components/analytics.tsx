"use client";

import { useEffect } from "react";

const POSTHOG_KEY = process.env.NEXT_PUBLIC_POSTHOG_KEY;
const POSTHOG_HOST = process.env.NEXT_PUBLIC_POSTHOG_HOST || "https://app.posthog.com";

export function Analytics() {
  useEffect(() => {
    if (typeof window === "undefined" || !POSTHOG_KEY) return;

    const script = document.createElement("script");
    script.src = `${POSTHOG_HOST}/static/array.js`;
    script.async = true;
    script.setAttribute("data-ph-capture", "");
    script.setAttribute("data-ph-api-key", POSTHOG_KEY);
    document.head.appendChild(script);

    return () => {
      document.head.removeChild(script);
    };
  }, []);

  return null;
}
