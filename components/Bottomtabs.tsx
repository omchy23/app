"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useLoginGuard } from "./LoginPopup";

type Tab = {
  label: string;
  href: string;
  icon: ReactNode;
  gated?: boolean;
};

const svgProps = {
  className: "h-5 w-5",
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.8,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

const HOME: Tab = {
  label: "Home",
  href: "/",
  icon: (
    <svg {...svgProps}>
      <path d="M3 11l9-8 9 8v9a1 1 0 0 1-1 1h-5v-6h-6v6H4a1 1 0 0 1-1-1v-9z" />
    </svg>
  ),
};

const ACCOUNT: Tab = {
  label: "Account",
  href: "/Account",
  gated: true,
  icon: (
    <svg {...svgProps}>
      <circle cx="12" cy="8" r="4" />
      <path d="M4 21c0-4 4-6 8-6s8 2 8 6" />
    </svg>
  ),
};

export default function BottomTabs() {
  const pathname = usePathname();
  const { guard, popup } = useLoginGuard();

  const renderTab = (tab: Tab) => {
    const active = pathname === tab.href;
    return (
      <Link
        key={tab.href}
        href={tab.href}
        aria-current={active ? "page" : undefined}
        onClick={tab.gated ? guard : undefined}
        className={`flex flex-1 flex-col items-center gap-0.5 pt-2 text-[10px] font-medium ${
          active ? "text-gold-400" : "text-mint-300"
        }`}
      >
        {tab.icon}
        {tab.label}
      </Link>
    );
  };

  return (
    <>
    <nav
      aria-label="Main"
      className="fixed bottom-0 left-1/2 z-50 flex h-[calc(3.5rem+env(safe-area-inset-bottom))] w-full -translate-x-1/2 items-start rounded-t-2xl border-t border-brand-700 bg-brand-900 pb-[env(safe-area-inset-bottom)] shadow-[0_-4px_14px_rgba(0,0,0,0.35)] min-[480px]:max-w-97.5"
    >
      {renderTab(HOME)}

      {/* Centre reward button */}
      <Link
        href="/rewards"
        onClick={guard}
        className="flex flex-1 flex-col items-center"
        aria-label="Get ₹500"
      >
        <span className="-mt-5 flex h-12 w-12 items-center justify-center rounded-full border-4 border-brand-900 bg-linear-to-b from-amber-300 to-orange-500 text-xs font-black text-white shadow-md">
          GO
        </span>
        <span className="mt-0.5 text-[10px] font-bold text-gold-300">
          Get ₹500
        </span>
      </Link>

      {renderTab(ACCOUNT)}
    </nav>
    {/* outside the nav: a transformed parent would break position:fixed */}
    {popup}
    </>
  );
}