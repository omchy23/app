"use client";

import Link from "next/link";
import { useUser, useClerk, UserButton } from "@clerk/nextjs";
import { PackageIcon } from "lucide-react";
import { useRouter } from "next/navigation";

const NOTICE =
  "If you have not received your withdrawal within 3 days, please contact our self-service center with your bank statement (PDF/VIDEO) and PDF password.";

export default function Navbar() {
  const { user } = useUser();
  const { openSignIn } = useClerk();
  const router = useRouter();

  return (
    <header className="sticky top-0 z-50 w-full bg-brand-950">
      {/* Top bar */}
      <nav className="flex h-12 items-center justify-between px-3">
        <Link href="/" className="flex items-center gap-1.5" aria-label="Home">
          <span className="flex h-7 w-7 items-center justify-center rounded-full bg-linear-to-b from-gold-300 to-gold-500 text-sm font-black text-brand-950">
            W
          </span>
          <span className="text-xl font-black italic tracking-tight text-gold-300">
            Win99
          </span>
        </Link>

        <div className="flex items-center gap-1.5">
          {!user ? (
            <button
              onClick={() => openSignIn()}
              className="rounded-lg bg-action-500 px-3 py-1.5 text-xs font-bold text-white active:bg-action-600"
            >
              Login
            </button>
          ) : (
            <UserButton>
              <UserButton.MenuItems>
                <UserButton.Action
                  labelIcon={<PackageIcon size={16} />}
                  label="My Account"
                  onClick={() => router.push("/account")}
                />
              </UserButton.MenuItems>
            </UserButton>
          )}
        </div>
      </nav>

      {/* Notice ticker */}
      <div className="mx-3 mb-2 flex items-center gap-2 rounded-xl bg-brand-800 px-3 py-2">
        <svg
          className="h-4 w-4 shrink-0 text-mint-300"
          viewBox="0 0 24 24"
          fill="currentColor"
          aria-hidden="true"
        >
          <path d="M3 10v4h4l5 4V6L7 10H3zm13.5 2a4.5 4.5 0 0 0-2.5-4v8a4.5 4.5 0 0 0 2.5-4z" />
        </svg>

        <div className="relative flex-1 overflow-hidden">
          <p className="ticker whitespace-nowrap text-[11px] text-mint-300">
            {NOTICE}
          </p>
        </div>

        <button
          type="button"
          aria-label="Messages"
          className="relative shrink-0 text-mint-300"
        >
          <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
            <path d="M20 4H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2zm0 4-8 5-8-5V6l8 5 8-5v2z" />
          </svg>
          <span className="absolute -right-0.5 -top-0.5 h-2 w-2 rounded-full bg-gold-400" />
        </button>
      </div>

      <style jsx>{`
        .ticker {
          display: inline-block;
          padding-left: 100%;
          animation: scroll-left 18s linear infinite;
        }
        @keyframes scroll-left {
          to {
            transform: translateX(-100%);
          }
        }
        @media (prefers-reduced-motion: reduce) {
          .ticker {
            animation: none;
            padding-left: 0;
          }
        }
      `}</style>
    </header>
  );
}