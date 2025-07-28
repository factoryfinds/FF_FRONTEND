// app/profile/cart/page.tsx
"use client";

import SharedCartComponent from "@/components/SharedCartComponent";

export default function CartPage() {
  return <SharedCartComponent isDrawer={false} />;
}