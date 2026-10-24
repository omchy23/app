"use client";

import type { ReactNode } from "react";
import { useRouter } from "next/navigation";
import { useUser, useClerk } from "@clerk/nextjs";

// Optional: put a real gift image in /public and set it here, e.g. "/images/gift.png"
const GIFT_IMAGE: string | undefined = undefined;

function LoginSheet() {
  const { openSignIn } = useClerk();
  const router = useRouter();

  return (
    <div className="fixed inset-0 z-[60] bg-black/70">
      <div className="fixed bottom-0 left-1/2 w-full -translate-x-1/2 min-[480px]:max-w-97.5">
        <div className="rounded-t-3xl bg-linear-to-b from-brand-700 via-brand-900 to-brand-950 px-6 pb-[calc(1.5rem+env(safe-area-inset-bottom))] text-center">
          {/* Gift pops out above the sheet */}
          <div className="-mt-14 flex justify-center">
            {GIFT_IMAGE ? (
              <div
                className="h-32 w-32"
                style={{
                  backgroundImage: `url(${GIFT_IMAGE})`,
                  backgroundSize: "contain",
                  backgroundRepeat: "no-repeat",
                  backgroundPosition: "center",
                }}
                aria-hidden="true"
              />
            ) : (
              <span
                className="text-[96px] leading-none drop-shadow-[0_8px_24px_rgba(246,196,69,0.45)]"
                aria-hidden="true"
              >
                🎁
              </span>
            )}
          </div>

          <h2 className="mt-3 flex items-center justify-center gap-3 text-lg font-extrabold text-gold-300">
            <span aria-hidden="true">🪙</span>
            Event Rewards
            <span aria-hidden="true">🪙</span>
          </h2>

          <p className="mt-4 text-sm leading-relaxed text-mint-300">
            Log in to participate in the event rewards and unlock all 8
            exclusive rewards
          </p>

          <button
            type="button"
            onClick={() => openSignIn()}
            className="mt-6 w-full rounded-full bg-linear-to-r from-gold-400 to-gold-300 py-3 text-sm font-extrabold text-brand-950 shadow-md active:opacity-90"
          >
            Log in now to participate
          </button>

          <button
            type="button"
            onClick={() => router.replace("/")}
            className="mt-4 text-xs font-semibold text-gold-300 active:opacity-80"
          >
            Don&apos;t log in yet, continue browsing
          </button>
        </div>
      </div>
    </div>
  );
}

/** Wrap any page: signed in → shows the page, otherwise → shows the login sheet. */
export default function RequireAuth({ children }: { children: ReactNode }) {
  const { isLoaded, user } = useUser();

  if (!isLoaded) return null; // wait for Clerk, avoids a flash of the sheet
  if (!user) return <LoginSheet />;
  return <>{children}</>;
}