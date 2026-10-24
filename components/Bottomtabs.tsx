"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

type Tab = {
  label: string;
  href: string;
  icon: ReactNode;
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
  icon: (
    <svg {...svgProps}>
      <circle cx="12" cy="8" r="4" />
      <path d="M4 21c0-4 4-6 8-6s8 2 8 6" />
    </svg>
  ),
};

export default function BottomTabs() {
  const pathname = usePathname();

  const renderTab = (tab: Tab) => {
    const active = pathname === tab.href;
    return (
      <Link
        key={tab.href}
        href={tab.href}
        aria-current={active ? "page" : undefined}
        className={`flex flex-1 flex-col items-center gap-0.5 pt-2 text-[10px] font-medium ${
          active ? "text-rose-500" : "text-slate-400"
        }`}
      >
        {tab.icon}
        {tab.label}
      </Link>
    );
  };

  return (
    <nav
      aria-label="Main"
      className="fixed bottom-0 left-1/2 z-50 flex h-14 w-full max-w-[390px] -translate-x-1/2 items-start border-t border-slate-100 bg-white shadow-[0_-2px_10px_rgba(0,0,0,0.06)]"
    >
      {renderTab(HOME)}

      {/* Centre reward button */}
      <Link
        href="/rewards"
        className="flex flex-1 flex-col items-center"
        aria-label="Get ₹500"
      >
        <span className="-mt-5 flex h-12 w-12 items-center justify-center rounded-full border-4 border-white bg-gradient-to-b from-orange-400 to-rose-500 text-xs font-black text-white shadow-md">
          GO
        </span>
        <span className="mt-0.5 text-[10px] font-bold text-rose-500">
          Get ₹500
        </span>
      </Link>

      {renderTab(ACCOUNT)}
    </nav>
  );
}