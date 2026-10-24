import type { ReactNode } from "react";

/**
 * Responsive phone frame (dark green theme).
 * - Under 480px (phones): full width.
 * - 480px and wider: centred 390px column on a black backdrop.
 */
export default function PhoneShell({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-dvh bg-black">
      <div className="mx-auto min-h-dvh w-full bg-brand-950 text-white min-[480px]:max-w-97.5 min-[480px]:shadow-2xl">
        {children}
      </div>
    </div>
  );
}