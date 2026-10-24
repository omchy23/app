"use client";

import { useEffect, useState, type MouseEvent } from "react";
import Image from "next/image";
import { useUser, useClerk } from "@clerk/nextjs";

// Put your image at: public/gift-box.png
const GIFT_SRC = "/gift-box.png";

export function LoginPopup({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const { openSignIn } = useClerk();
  const [imgFailed, setImgFailed] = useState(false);

  // Close on Escape
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="backdrop fixed inset-0 z-[60] bg-black/75 backdrop-blur-[3px]"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Event rewards"
        className="sheet fixed bottom-0 left-1/2 w-full -translate-x-1/2 min-[480px]:max-w-97.5"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="relative rounded-t-[28px] border-t border-gold-400/40 bg-linear-to-b from-brand-700 via-brand-900 to-brand-950 px-6 pb-[calc(1.5rem+env(safe-area-inset-bottom))] text-center shadow-[0_-12px_40px_rgba(246,196,69,0.12)]">
          {/* Close */}
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="absolute right-4 top-4 flex h-7 w-7 items-center justify-center rounded-full bg-white/10 text-sm text-mint-300 active:bg-white/20"
          >
            ✕
          </button>

          {/* Gift area */}
          <div className="relative -mt-16 flex justify-center">
            {/* soft golden glow behind the gift */}
            <div
              className="glow absolute top-6 h-32 w-32 rounded-full bg-gold-400/30 blur-3xl"
              aria-hidden="true"
            />

            {/* sparkles */}
            <span className="spark absolute left-[22%] top-3 text-sm text-gold-300">✦</span>
            <span className="spark d2 absolute right-[20%] top-10 text-xs text-gold-400">✦</span>
            <span className="spark d3 absolute left-[30%] top-24 text-[10px] text-gold-300">✦</span>
            <span className="spark d4 absolute right-[28%] top-1 text-[10px] text-white">✦</span>

            {/* gift tilted to the right (clockwise) and gently floating */}
            <div className="gift relative">
              {imgFailed ? (
                <span
                  className="block text-[104px] leading-none drop-shadow-[0_10px_24px_rgba(246,196,69,0.45)]"
                  aria-hidden="true"
                >
                  🎁
                </span>
              ) : (
                <Image
                  src={GIFT_SRC}
                  alt=""
                  width={150}
                  height={150}
                  priority
                  onError={() => setImgFailed(true)}
                  className="h-[132px] w-[132px] object-contain drop-shadow-[0_12px_24px_rgba(246,196,69,0.45)]"
                />
              )}
            </div>
          </div>

          {/* Title */}
          <h2 className="mt-2 flex items-center justify-center gap-3 text-xl font-extrabold tracking-wide text-gold-300">
            <Coin />
            Event Rewards
            <Coin />
          </h2>

          <p className="mx-auto mt-3 max-w-[290px] text-[13px] leading-relaxed text-mint-300">
            Log in to participate in the event rewards and unlock all{" "}
            <span className="font-bold text-gold-300">exclusive rewards</span>
          </p>

          {/* Primary button */}
          <button
            type="button"
            onClick={() => {
              onClose();
              openSignIn();
            }}
            className="shine relative mt-6 w-full overflow-hidden rounded-full bg-linear-to-r from-gold-500 via-gold-400 to-gold-300 py-3.5 text-sm font-extrabold text-brand-950 shadow-[0_6px_20px_rgba(246,196,69,0.35)] active:scale-[0.98]"
          >
            Log in now to participate
          </button>

          {/* Secondary */}
          <button
            type="button"
            onClick={onClose}
            className="mt-4 text-xs font-semibold text-gold-300/90 active:opacity-70"
          >
            Don&apos;t log in yet, continue browsing
          </button>
        </div>
      </div>

      <style jsx>{`
        .backdrop {
          animation: fade-in 0.25s ease-out;
        }
        .sheet {
          animation: sheet-up 0.35s cubic-bezier(0.22, 1, 0.36, 1);
        }
        .gift {
          animation: gift-float 3.2s ease-in-out infinite;
        }
        .glow {
          animation: glow-pulse 3.2s ease-in-out infinite;
        }
        .spark {
          animation: twinkle 2.2s ease-in-out infinite;
        }
        .spark.d2 {
          animation-delay: 0.5s;
        }
        .spark.d3 {
          animation-delay: 1s;
        }
        .spark.d4 {
          animation-delay: 1.5s;
        }
        .shine::after {
          content: "";
          position: absolute;
          inset: 0;
          width: 40%;
          background: linear-gradient(
            100deg,
            transparent,
            rgba(255, 255, 255, 0.55),
            transparent
          );
          transform: translateX(-150%) skewX(-20deg);
          animation: shine 3s ease-in-out infinite;
        }

        @keyframes fade-in {
          from {
            opacity: 0;
          }
        }
        @keyframes sheet-up {
          from {
            transform: translate(-50%, 100%);
          }
        }
        /* rotate(12deg) = tilted to the right */
        @keyframes gift-float {
          0%,
          100% {
            transform: translateY(0) rotate(12deg);
          }
          50% {
            transform: translateY(-8px) rotate(15deg);
          }
        }
        @keyframes glow-pulse {
          0%,
          100% {
            opacity: 0.55;
          }
          50% {
            opacity: 1;
          }
        }
        @keyframes twinkle {
          0%,
          100% {
            opacity: 0.2;
            transform: scale(0.7);
          }
          50% {
            opacity: 1;
            transform: scale(1.15);
          }
        }
        @keyframes shine {
          0%,
          60% {
            transform: translateX(-150%) skewX(-20deg);
          }
          100% {
            transform: translateX(350%) skewX(-20deg);
          }
        }
        @media (prefers-reduced-motion: reduce) {
          .backdrop,
          .sheet,
          .glow,
          .spark,
          .shine::after {
            animation: none;
          }
          .gift {
            animation: none;
            transform: rotate(12deg);
          }
        }
      `}</style>
    </div>
  );
}

function Coin() {
  return (
    <span
      aria-hidden="true"
      className="flex h-5 w-5 items-center justify-center rounded-full bg-linear-to-b from-gold-300 to-gold-500 text-[10px] font-black text-brand-950 shadow-[0_0_10px_rgba(246,196,69,0.5)] ring-1 ring-gold-300/60"
    >
      ₹
    </span>
  );
}

/**
 * const { guard, popup } = useLoginGuard();
 *   <Link href="/x" onClick={guard}>…</Link>   → blocked + popup if no user
 *   {popup}                                     → render once, outside any transformed parent
 */
export function useLoginGuard() {
  const { user } = useUser();
  const [open, setOpen] = useState(false);

  const guard = (e: MouseEvent) => {
    if (!user) {
      e.preventDefault();
      setOpen(true);
    }
  };

  const popup = <LoginPopup open={open} onClose={() => setOpen(false)} />;

  return { guard, popup };
}