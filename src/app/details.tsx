"use client";

import { usePathname, useSearchParams } from "next/navigation";
import { useEffect } from "react";

const GA_TRACKING_ID = "G-TMGD28RZK5"; // replace with your GA ID

export default function Analytics() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (!pathname) return;

    const url = pathname + (searchParams.toString() ? `?${searchParams.toString()}` : "");

    // ✅ log page view on route change
    window.gtag?.("config", GA_TRACKING_ID, {
      page_path: url,
    });
  }, [pathname, searchParams]);

  return null ;
}
