import Link from "next/link";

const USER = {
  name: "MEMBERNNGJWKEI",
  vip: "VIP0",
  uid: "14547490",
  lastLogin: "2026-10-24 11:31:16",
  balance: "₹28.97",
  // Add later, e.g. "/avatars/me.jpg"
  avatar: undefined as string | undefined,
};

const QUICK_ACTIONS = [
  { label: "ARWallet", href: "/wallet", icon: "👛", tint: "bg-rose-100" },
  { label: "Deposit", href: "/deposit", icon: "🟧", tint: "bg-orange-100" },
  { label: "Withdraw", href: "/withdraw", icon: "💳", tint: "bg-sky-100" },
  { label: "VIP", href: "/vip", icon: "🛡️", tint: "bg-emerald-100" },
];

const HISTORY = [
  { title: "Game History", sub: "My game history", href: "/history/games", icon: "📘", tint: "bg-blue-500" },
  { title: "Transaction", sub: "My transaction history", href: "/history/transactions", icon: "📗", tint: "bg-emerald-400" },
  { title: "Deposit", sub: "My deposit history", href: "/history/deposits", icon: "🔖", tint: "bg-rose-300" },
  { title: "Withdraw", sub: "My withdraw history", href: "/history/withdrawals", icon: "👜", tint: "bg-amber-300" },
];

const MENU = [
  { label: "Notification", href: "/notifications", icon: "✉️" },
  { label: "Gifts", href: "/gifts", icon: "🎁" },
  { label: "My Top-Up Coupons", href: "/coupons", icon: "🎟️" },
  { label: "Game statistics", href: "/statistics", icon: "📊" },
  { label: "Language", href: "/language", icon: "🌐", value: "English" },
];

const SERVICES = [
  { label: "Settings", href: "/settings", icon: "⚙️" },
  { label: "Feedback", href: "/feedback", icon: "📝" },
  { label: "Announcement", href: "/announcements", icon: "📣" },
  { label: "Customer Service", href: "/support", icon: "💬" },
  { label: "Beginner's Guide", href: "/guide", icon: "📖" },
  { label: "About us", href: "/about", icon: "📦" },
];

function Chevron() {
  return (
    <svg
      className="h-4 w-4 text-slate-500"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M9 6l6 6-6 6" />
    </svg>
  );
}

export default function AccountPage() {
  return (
    <div className="pb-4">
      {/* Header */}
      <header className="rounded-b-[32px] bg-gradient-to-b from-rose-500 to-rose-400 px-4 pb-24 pt-6 text-white">
        <div className="flex items-center gap-3">
          <div
            className="h-14 w-14 shrink-0 rounded-full bg-gradient-to-br from-slate-200 to-slate-400 ring-2 ring-white/70"
            style={
              USER.avatar
                ? {
                    backgroundImage: `url(${USER.avatar})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                  }
                : undefined
            }
            aria-hidden="true"
          />
          <div className="min-w-0">
            <p className="flex items-center gap-1.5 text-sm font-semibold">
              <span className="truncate">{USER.name}</span>
              <span className="rounded-full bg-slate-500/80 px-1.5 py-0.5 text-[9px] font-bold">
                {USER.vip}
              </span>
            </p>
            <p className="mt-1 inline-flex items-center gap-1 rounded-full bg-amber-400 px-2 py-0.5 text-[10px] font-semibold text-white">
              UID | {USER.uid}
            </p>
            <p className="mt-1 text-[10px] text-white/90">
              Last login: {USER.lastLogin}
            </p>
          </div>
        </div>
      </header>

      {/* Balance card (overlaps the header) */}
      <section className="-mt-[72px] px-3">
        <div className="rounded-2xl bg-white p-3.5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[11px] text-slate-500">Total balance</p>
              <p className="mt-0.5 text-xl font-extrabold text-slate-900">
                {USER.balance}
              </p>
            </div>
            <Link
              href="/wallet"
              className="rounded-full bg-rose-500 px-4 py-1.5 text-xs font-semibold text-white active:bg-rose-600"
            >
              Enter wallet
            </Link>
          </div>

          <div className="mt-3 grid grid-cols-4 gap-1 border-t border-slate-100 pt-3">
            {QUICK_ACTIONS.map((a) => (
              <Link
                key={a.label}
                href={a.href}
                className="flex flex-col items-center gap-1.5 text-[11px] text-slate-800"
              >
                <span
                  className={`flex h-9 w-9 items-center justify-center rounded-xl text-lg ${a.tint}`}
                  aria-hidden="true"
                >
                  {a.icon}
                </span>
                {a.label}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* History shortcuts */}
      <section className="mt-3 grid grid-cols-2 gap-2.5 px-3">
        {HISTORY.map((h) => (
          <Link
            key={h.title}
            href={h.href}
            className="flex items-center gap-2.5 rounded-xl bg-white p-3 shadow-sm active:scale-[0.98]"
          >
            <span
              className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-base ${h.tint}`}
              aria-hidden="true"
            >
              {h.icon}
            </span>
            <span className="min-w-0">
              <span className="block text-xs font-semibold text-slate-900">
                {h.title}
              </span>
              <span className="block text-[10px] leading-tight text-slate-500">
                {h.sub}
              </span>
            </span>
          </Link>
        ))}
      </section>

      {/* Menu list */}
      <section className="mx-3 mt-3 rounded-2xl bg-white px-3 shadow-sm">
        <ul>
          {MENU.map((m) => (
            <li key={m.label} className="border-b border-slate-100 last:border-b-0">
              <Link href={m.href} className="flex items-center gap-3 py-3">
                <span
                  className="flex h-7 w-7 items-center justify-center rounded-lg bg-rose-100 text-sm"
                  aria-hidden="true"
                >
                  {m.icon}
                </span>
                <span className="flex-1 text-[13px] text-slate-900">
                  {m.label}
                </span>
                {m.value && (
                  <span className="text-xs text-slate-800">{m.value}</span>
                )}
                <Chevron />
              </Link>
            </li>
          ))}
        </ul>
      </section>

      {/* Service center */}
      <section className="mx-3 mt-3 rounded-2xl bg-white p-3.5 shadow-sm">
        <h2 className="text-[13px] text-slate-900">Service center</h2>
        <div className="mt-3 grid grid-cols-3 gap-y-3">
          {SERVICES.map((s) => (
            <Link
              key={s.label}
              href={s.href}
              className="flex flex-col items-center gap-1 text-center text-[10px] text-slate-500"
            >
              <span
                className="flex h-8 w-8 items-center justify-center rounded-lg bg-rose-100 text-base"
                aria-hidden="true"
              >
                {s.icon}
              </span>
              {s.label}
            </Link>
          ))}
        </div>
      </section>

      {/* Log out */}
      <div className="px-3 pt-5">
        <button
          type="button"
          className="flex w-full items-center justify-center gap-2 rounded-full border border-rose-500 bg-white py-2.5 text-sm text-rose-500 active:bg-rose-50"
        >
          <svg
            className="h-4 w-4"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            strokeLinecap="round"
            aria-hidden="true"
          >
            <path d="M12 3v9M6.3 6.3a8 8 0 1 0 11.4 0" />
          </svg>
          Log out
        </button>
      </div>
    </div>
  );
}