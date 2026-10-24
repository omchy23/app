import type { CSSProperties } from "react";

type Player = {
  rank: number;
  name: string;
  amount: number;
  // Add avatar later, e.g. "/avatars/1.jpg"
  avatar?: string;
};

const PLAYERS: Player[] = [
  { rank: 1, name: "Mem***WC6", amount: 13021044.4 },
  { rank: 2, name: "Mem***J0E", amount: 11537081.1 },
  { rank: 3, name: "Mem***IPY", amount: 1706977.72 },
  { rank: 4, name: "Mem***3OZ", amount: 1047448.5 },
  { rank: 5, name: "Mem***U2R", amount: 1027498 },
  { rank: 6, name: "Blo*** ID", amount: 978727.86 },
  { rank: 7, name: "Mem***RVQ", amount: 874215.81 },
];

const formatINR = (n: number) =>
  "₹" +
  n.toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

function Avatar({
  player,
  size,
  ring,
}: {
  player: Player;
  size: number;
  ring?: string;
}) {
  const style: CSSProperties = {
    width: size,
    height: size,
    ...(player.avatar
      ? {
          backgroundImage: `url(${player.avatar})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }
      : undefined),
  };

  return (
    <div
      style={style}
      className={`flex shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-brand-700 to-emerald-600 text-xs font-bold text-white ${
        ring ?? ""
      }`}
      aria-hidden="true"
    >
      {!player.avatar && player.name.charAt(0)}
    </div>
  );
}

export default function EarningsChart() {
  const first = PLAYERS[0];
  const second = PLAYERS[1];
  const third = PLAYERS[2];
  const rest = PLAYERS.slice(3);

  return (
    <section className="px-3 pb-6">
      <h3 className="flex items-center gap-1.5 text-sm font-bold text-gold-300">
        <span aria-hidden="true">📊</span>
        Today&apos;s earnings chart
      </h3>

      <div className="mt-2.5 rounded-2xl border border-brand-700 bg-brand-800 px-3 pb-2 pt-9 shadow-sm">
        {/* Podium */}
        <div className="flex items-end">
          {/* 2nd */}
          <div className="relative flex h-[104px] flex-1 flex-col items-center justify-end rounded-tl-2xl bg-linear-to-b from-mint-300/30 to-transparent pb-2">
            <div className="absolute -top-5">
              <Avatar player={second} size={40} ring="ring-2 ring-mint-300" />
            </div>
            <span className="text-3xl font-black leading-none text-mint-300/60">
              2
            </span>
            <p className="mt-1 text-[11px] font-extrabold text-mint-300">
              {second.name}
            </p>
            <p className="text-[9px] text-mint-300">
              {formatINR(second.amount)}
            </p>
          </div>

          {/* 1st */}
          <div className="relative z-10 flex h-[128px] flex-[1.15] flex-col items-center justify-end rounded-t-2xl bg-linear-to-b from-gold-400/40 to-transparent pb-2">
            <div className="absolute -top-8 flex flex-col items-center">
              <span className="-mb-1.5 ml-6 text-base" aria-hidden="true">
                👑
              </span>
              <Avatar player={first} size={50} ring="ring-2 ring-gold-400" />
            </div>
            <span className="text-4xl font-black leading-none text-gold-400/60">
              1
            </span>
            <p className="mt-1 text-xs font-extrabold text-gold-300">
              {first.name}
            </p>
            <p className="text-[10px] font-semibold text-gold-400">
              {formatINR(first.amount)}
            </p>
          </div>

          {/* 3rd */}
          <div className="relative flex h-[104px] flex-1 flex-col items-center justify-end rounded-tr-2xl bg-linear-to-b from-orange-500/30 to-transparent pb-2">
            <div className="absolute -top-5">
              <Avatar player={third} size={40} ring="ring-2 ring-orange-400" />
            </div>
            <span className="text-3xl font-black leading-none text-orange-400/60">
              3
            </span>
            <p className="mt-1 text-[11px] font-extrabold text-orange-400">
              {third.name}
            </p>
            <p className="text-[9px] text-mint-300">
              {formatINR(third.amount)}
            </p>
          </div>
        </div>

        {/* Rank 4+ */}
        <ul className="mt-1">
          {rest.map((p) => (
            <li
              key={p.rank}
              className="flex items-center gap-2.5 border-b border-brand-700 py-2.5 last:border-b-0"
            >
              <span className="w-4 text-xs font-bold text-gold-300">
                {p.rank}
              </span>
              <Avatar player={p} size={32} />
              <span className="flex-1 truncate text-xs text-white">
                {p.name}
              </span>
              <span className="text-xs font-medium text-gold-400">
                {formatINR(p.amount)}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}