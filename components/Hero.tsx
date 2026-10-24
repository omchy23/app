"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";

type Slide = {
  id: number;
  title: string;
  subtitle: string;
  gradient: string;
  // Optional: set a real banner image, e.g. "/banners/1.jpg"
  image?: string;
};

const SLIDES: Slide[] = [
  {
    id: 1,
    title: "Boost your deposit",
    subtitle: "Earn more on every transaction",
    gradient: "from-red-900 via-red-700 to-orange-600",
  },
  {
    id: 2,
    title: "Welcome bonus",
    subtitle: "Get ₹500 on your first deposit",
    gradient: "from-indigo-900 via-violet-700 to-fuchsia-600",
  },
  {
    id: 3,
    title: "Daily rewards",
    subtitle: "Check in and claim your bonus",
    gradient: "from-emerald-900 via-teal-700 to-cyan-600",
  },
  {
    id: 4,
    title: "Refer & earn",
    subtitle: "Earn on every friend who joins",
    gradient: "from-amber-800 via-orange-600 to-yellow-500",
  },
];

type Game = {
  id: number;
  name: string;
  provider: string;
  gradient: string;
  // Add your card image later, e.g. "/games/game-1.jpg"
  image?: string;
};

const GAMES: Game[] = [
  { id: 1, name: "Game One", provider: "Provider", gradient: "from-red-700 to-orange-500" },
  { id: 2, name: "Game Two", provider: "Provider", gradient: "from-indigo-800 to-violet-500" },
  { id: 3, name: "Game Three", provider: "Provider", gradient: "from-amber-600 to-yellow-400" },
  { id: 4, name: "Game Four", provider: "Provider", gradient: "from-emerald-800 to-teal-500" },
  { id: 5, name: "Game Five", provider: "Provider", gradient: "from-sky-800 to-cyan-500" },
  { id: 6, name: "Game Six", provider: "Provider", gradient: "from-fuchsia-800 to-pink-500" },
];

const INTERVAL_MS = 2000;
const SWIPE_THRESHOLD = 40;

export default function HeroCarousel() {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const touchStartX = useRef<number | null>(null);

  const next = useCallback(
    () => setIndex((i) => (i + 1) % SLIDES.length),
    []
  );
  const prev = useCallback(
    () => setIndex((i) => (i - 1 + SLIDES.length) % SLIDES.length),
    []
  );

  // Auto-advance every 2 seconds
  useEffect(() => {
    if (paused) return;
    const timer = setInterval(next, INTERVAL_MS);
    return () => clearInterval(timer);
  }, [paused, next, index]);

  const onTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    setPaused(true);
  };

  const onTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current !== null) {
      const diff = e.changedTouches[0].clientX - touchStartX.current;
      if (diff > SWIPE_THRESHOLD) prev();
      else if (diff < -SWIPE_THRESHOLD) next();
    }
    touchStartX.current = null;
    setPaused(false);
  };

  return (
    <section className="px-3 pb-4 pt-3">
      {/* Carousel */}
      <div
        className="relative overflow-hidden rounded-lg"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
        role="region"
        aria-roledescription="carousel"
        aria-label="Promotions"
      >
        <div
          className="flex transition-transform duration-500 ease-out motion-reduce:transition-none"
          style={{ transform: `translateX(-${index * 100}%)` }}
        >
          {SLIDES.map((slide, i) => (
            <div
              key={slide.id}
              className={`flex aspect-[2.6/1] w-full shrink-0 flex-col items-center justify-center bg-gradient-to-br px-4 text-center text-white ${slide.gradient}`}
              style={
                slide.image
                  ? {
                      backgroundImage: `url(${slide.image})`,
                      backgroundSize: "cover",
                      backgroundPosition: "center",
                    }
                  : undefined
              }
              aria-hidden={i !== index}
            >
              <h2 className="text-lg font-black leading-tight drop-shadow">
                {slide.title}
              </h2>
              <p className="mt-1.5 rounded-full bg-black/30 px-3 py-0.5 text-[10px] font-semibold">
                {slide.subtitle}
              </p>
            </div>
          ))}
        </div>

        {/* Dots */}
        <div className="absolute inset-x-0 bottom-1.5 flex justify-center gap-1.5">
          {SLIDES.map((s, i) => (
            <button
              key={s.id}
              type="button"
              onClick={() => setIndex(i)}
              aria-label={`Go to slide ${i + 1}`}
              aria-current={i === index}
              className={`h-1 rounded-full transition-all ${
                i === index ? "w-4 bg-white" : "w-1 bg-white/50"
              }`}
            />
          ))}
        </div>
      </div>

      {/* Wallet row */}
      <div className="mt-3 flex items-center justify-between">
        <div>
          <p className="flex items-center gap-1 text-[11px] text-slate-600">
            <span className="h-2.5 w-2.5 rounded-full bg-yellow-400" />
            Wallet balance
          </p>
          <p className="mt-0.5 text-lg font-extrabold text-slate-900">₹28.97</p>
        </div>

        <div className="flex gap-1.5">
          <Link
            href="/withdraw"
            className="flex h-10 w-[72px] flex-col items-center justify-center rounded-md bg-amber-400 text-[11px] leading-tight font-extrabold text-white active:scale-[0.97]"
          >
            <span aria-hidden="true">↑</span>
            Withdraw
          </Link>
          <Link
            href="/deposit"
            className="flex h-10 w-[72px] flex-col items-center justify-center rounded-md bg-rose-500 text-[11px] leading-tight font-extrabold text-white active:scale-[0.97]"
          >
            <span aria-hidden="true">↓</span>
            Deposit
          </Link>
        </div>
      </div>

      {/* Quick action cards */}
      <div className="mt-3 grid grid-cols-2 gap-2">
        <Link
          href="/wheel"
          className="flex h-12 items-center gap-2 rounded-lg bg-gradient-to-r from-rose-400 to-orange-400 px-3 text-white shadow-sm active:scale-[0.98]"
        >
          <span className="text-xl" aria-hidden="true">
            🎡
          </span>
          <span className="text-sm font-extrabold leading-tight">
            Wheel
            <br />
            of fortune
          </span>
        </Link>

        <Link
          href="/vip"
          className="flex h-12 items-center gap-2 rounded-lg bg-gradient-to-r from-fuchsia-500 to-violet-500 px-3 text-white shadow-sm active:scale-[0.98]"
        >
          <span className="text-xl" aria-hidden="true">
            👑
          </span>
          <span className="text-sm font-extrabold leading-tight">
            VIP
            <br />
            privileges
          </span>
        </Link>
      </div>

      {/* Recommended games */}
      <div className="mt-5">
        <h3 className="flex items-center gap-1.5 text-sm font-bold text-slate-900">
          <span className="text-base text-yellow-500" aria-hidden="true">
            ★
          </span>
          Recommended Games
        </h3>

        <div className="mt-2.5 grid grid-cols-3 gap-2">
          {GAMES.map((game) => (
            <Link
              key={game.id}
              href={`/games/${game.id}`}
              className="overflow-hidden rounded-lg bg-white shadow-sm active:scale-[0.97]"
            >
              <div
                className={`aspect-[3/4] w-full bg-gradient-to-b ${game.gradient}`}
                style={
                  game.image
                    ? {
                        backgroundImage: `url(${game.image})`,
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                      }
                    : undefined
                }
              />
              <div className="px-1.5 py-1.5">
                <p className="truncate text-[11px] font-bold text-slate-900">
                  {game.name}
                </p>
                <p className="truncate text-[9px] text-slate-500">
                  {game.provider}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Info / age notice */}
      <div className="mt-5 rounded-2xl bg-white px-4 pb-4 pt-5 shadow-sm">
        <div className="flex justify-center">
          <span className="flex h-11 w-11 items-center justify-center rounded-full border-[3px] border-red-500 text-sm font-extrabold text-slate-800">
            +18
          </span>
        </div>

        <ul className="mt-3 space-y-1.5 text-[11px] leading-snug text-slate-500">
          <li className="flex gap-2">
            <span className="mt-1 h-1 w-1 shrink-0 rounded-full bg-red-500" />
            <span>
              The BRAND platform advocates fairness, justice, and openness. We
              mainly operate fair lottery, blockchain games, live casinos, and
              slot machine games.
            </span>
          </li>
          <li className="flex gap-2">
            <span className="mt-1 h-1 w-1 shrink-0 rounded-full bg-red-500" />
            <span>
              BRAND works with more than 10,000 online live game dealers and
              slot games, all of which are verified fair games.
            </span>
          </li>
          <li className="flex gap-2">
            <span className="mt-1 h-1 w-1 shrink-0 rounded-full bg-red-500" />
            <span>
              BRAND supports fast deposit and withdrawal, and looks forward to
              your visit.
            </span>
          </li>
        </ul>

        <p className="mt-2 pl-3 text-[11px] leading-snug text-red-500">
          Gambling can be addictive, please play rationally.
          <br />
          BRAND only accepts customers above the age of 18.
        </p>
      </div>
    </section>
  );
}