import type { ReactNode } from "react";

/**
 * Keeps the whole app at phone width.
 * - On a phone: fills the screen.
 * - On a laptop/desktop: a centred 480px column on a grey backdrop.
 */
export default function PhoneShell({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-neutral-200">
      <div className="mx-auto min-h-screen w-full max-w-[390px] bg-slate-50 shadow-2xl">
        {children}
      </div>
    </div>
  );
}