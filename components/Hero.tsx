"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useLoginGuard } from "./LoginPopup";

type Slide = {
  id: number;
  src: string;
  alt: string;
};

// Images live in /public
const SLIDES: Slide[] = [
  { id: 1, src: "/banner.png", alt: "Promotion banner 1" },
  { id: 2, src: "/banner1.png", alt: "Promotion banner 2" },
  { id: 3, src: "/banner2.png", alt: "Promotion banner 3" },
  { id: 4, src: "/banner3.png", alt: "Promotion banner 4" },
];

type Game = {
  id: number;
  slug: string;
  name: string;
  image: string; // files live in /public/games
};

const GAMES: Game[] = [
  { id: 1, slug: "aviator", name: "Aviator", image: "/games/aviator.png" },
  { id: 2, slug: "chicken", name: "Chicken Road", image: "/games/chicken.png" },
  { id: 3, slug: "dice", name: "Dice", image: "/games/dice.png" },
  { id: 4, slug: "limbo", name: "Limbo", image: "/games/limbo.png" },
  { id: 5, slug: "mines", name: "Mines", image: "/games/mines1.png" },
  { id: 6, slug: "pubg", name: "PUBG", image: "/games/pubg.png" },
];

const lottery: Game[] = [
  { id: 1, slug: "wingo", name: "WINGO", image: "/games/wingo.png" },
  { id: 2, slug: "k3", name: "K3", image: "/games/k3.png" },
  { id: 3, slug: "moto", name: "Moto Racing", image: "/games/racing.png" },
]

const INTERVAL_MS = 2000;
const SWIPE_THRESHOLD = 40;

export default function HeroCarousel() {
  const { guard, popup } = useLoginGuard();
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
              className="relative aspect-[2.6/1] w-full shrink-0 bg-brand-800"
              aria-hidden={i !== index}
            >
              <Image
                src={slide.src}
                alt={slide.alt}
                fill
                sizes="(max-width: 480px) 100vw, 390px"
                priority={i === 0}
                loading={i === 0 ? undefined : "eager"}
                draggable={false}
                className="select-none object-cover"
              />
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
              className={`h-1 rounded-full transition-all ${i === index ? "w-4 bg-gold-400" : "w-1 bg-white/40"
                }`}
            />
          ))}
        </div>
      </div>


      {/* Recommended games */}
      <div className="mt-5">
        <h3 className="flex items-center gap-1.5 text-sm font-bold text-gold-300">
          <span className="text-base text-gold-400" aria-hidden="true">
            ★
          </span>
          Recommended Games
        </h3>

        <div className="mt-2.5 grid grid-cols-3 gap-2">
          {GAMES.map((game) => (
            <Link
              key={game.id}
              href={`/games/${game.slug}`}
              onClick={guard}
              className="overflow-hidden rounded-lg border border-brand-700 bg-brand-800 shadow-sm active:scale-[0.97]"
            >
              <div className="relative aspect-[3/4] w-full bg-brand-700">
                <Image
                  src={game.image}
                  alt={game.name}
                  fill
                  sizes="(max-width: 480px) 33vw, 125px"
                  className="select-none object-cover"
                  draggable={false}
                />
              </div>
              <p className="truncate px-1.5 py-1.5 text-[11px] font-bold text-white">
                {game.name}
              </p>
            </Link>
          ))}
        </div>
      </div>


      {/* lottery */}

      <div className="mt-5">
        <h3 className="flex items-center gap-1.5 text-sm font-bold text-gold-300">
          <span className="text-base text-gold-400" aria-hidden="true">
            ★
          </span>
          Lottery
        </h3>

        <div className="mt-2.5 grid grid-cols-3 gap-2">
          {lottery.map((game) => (
            <Link
              key={game.id}
              href={`/games/${game.slug}`}
              onClick={guard}
              className="overflow-hidden rounded-lg border border-brand-700 bg-brand-800 shadow-sm active:scale-[0.97]"
            >
              <div className="relative aspect-[3/4] w-full bg-brand-700">
                <Image
                  src={game.image}
                  alt={game.name}
                  fill
                  sizes="(max-width: 480px) 33vw, 125px"
                  className="select-none object-cover"
                  draggable={false}
                />
              </div>
              <p className="truncate px-1.5 py-1.5 text-[11px] font-bold text-white">
                {game.name}
              </p>
            </Link>
          ))}
        </div>
      </div>

      {/* Info / age notice */}
      {popup}
    </section>
  );
}