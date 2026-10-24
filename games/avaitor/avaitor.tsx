import { useEffect, useRef, useState, type ChangeEvent } from "react";

/* Aviator-style crash game UI — demo only, play-money credits, no real payments. */

type Phase = "wait" | "fly" | "crash";
type PanelState = "idle" | "queued" | "live";
type Tab = "All Bets" | "Previous" | "Top";

interface Panel {
  amt: number;
  auto: boolean;
  st: PanelState;
  won: { m: number; win: number } | null;
}
interface Player { n: string; amt: number; cashAt: number | null }
interface Row extends Player { won: boolean }
interface Game {
  phase: Phase;
  waitEnd: number;
  crashEnd: number;
  start: number;
  crash: number;
  mult: number;
  bal: number;
  tab: Tab;
  hist: number[];
  panels: Panel[];
  players: Player[];
}

const CSS = `
.av{--bg:#0e0e0e;--panel:#1b1c1d;--panel2:#141516;--line:#2c2d30;--green:#28a909;--green2:#3ccf1c;--red:#e50539;--orange:#d07206;--muted:#9ea0a3;
 background:var(--bg);color:#fff;min-height:100vh;font-family:Roboto,"Segoe UI",Arial,sans-serif;font-size:14px}
.av *{box-sizing:border-box}
.av-top{display:flex;align-items:center;justify-content:space-between;padding:8px 16px;background:#252528;border-bottom:1px solid #000}
.av-logo{font-size:26px;font-weight:900;font-style:italic;color:var(--red);letter-spacing:-1px}
.av-bal{display:flex;align-items:center;gap:10px}
.av-bal b{color:var(--green2);font-size:16px}.av-bal span{color:var(--muted);font-size:12px}
.av-wrap{display:grid;grid-template-columns:320px 1fr;gap:8px;padding:8px;max-width:1300px;margin:auto}
.av-side{background:var(--panel);border-radius:10px;overflow:hidden;display:flex;flex-direction:column;height:calc(100vh - 70px);min-height:520px}
.av-tabs{display:flex;margin:8px;background:#000;border-radius:20px;padding:2px}
.av-tabs button{flex:1;border:0;background:none;color:var(--muted);padding:6px 0;border-radius:18px;cursor:pointer;font-size:12px}
.av-tabs button.on{background:#2c2d30;color:#fff}
.av-cnt{display:flex;justify-content:space-between;padding:4px 12px 8px;font-size:12px;color:var(--muted)}
.av-cnt b{color:#fff;font-size:15px}
.av-list{overflow:auto;flex:1;padding:0 6px 6px}
.av-row{display:grid;grid-template-columns:1.2fr 1fr .7fr 1fr;gap:4px;align-items:center;background:#101112;border-radius:8px;padding:6px 8px;margin-bottom:3px;font-size:12px}
.av-row.win{background:#123a0b;border:1px solid #1f6a10}
.av-row i{font-style:normal;color:var(--muted)}
.av-pill{padding:1px 8px;border-radius:10px;font-size:12px;font-weight:700;text-align:center;background:#000}
.av-main{display:flex;flex-direction:column;gap:8px;min-width:0}
.av-hist{display:flex;gap:6px;overflow:hidden;padding:4px 2px;background:var(--panel2);border-radius:10px}
.av-hist span{padding:2px 10px;border-radius:12px;font-weight:700;font-size:12px;background:#000;white-space:nowrap}
.av-stage{position:relative;height:400px;background:#0b0b0c;border:1px solid var(--line);border-radius:12px;overflow:hidden}
.av-stage canvas{width:100%;height:100%;display:block}
.av-mid{position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center;pointer-events:none;text-align:center}
.av-mult{font-size:84px;font-weight:700;line-height:1}
.av-fly{font-size:30px;color:#fff;font-weight:700;margin-bottom:6px}
.av-wait{font-size:22px;font-weight:700;color:#fff}
.av-bar{width:200px;height:6px;border-radius:3px;background:#2c2d30;margin-top:14px;overflow:hidden}
.av-bar div{height:100%;background:var(--red)}
.av-logo-big{font-size:54px;font-weight:900;font-style:italic;color:var(--red);margin-bottom:12px}
.av-bets{display:grid;grid-template-columns:1fr 1fr;gap:8px}
.av-bp{background:var(--panel);border:1px solid var(--line);border-radius:12px;padding:10px 12px}
.av-bp.live{border-color:var(--orange)}
.av-bp.won{border-color:var(--green)}
.av-mode{display:flex;justify-content:space-between;align-items:center;margin-bottom:8px}
.av-seg{display:flex;background:#000;border-radius:16px;padding:2px}
.av-seg button{border:0;background:none;color:var(--muted);padding:4px 18px;border-radius:14px;cursor:pointer;font-size:12px}
.av-seg button.on{background:#2c2d30;color:#fff}
.av-tg{display:flex;align-items:center;gap:6px;color:var(--muted);font-size:12px}
.av-tg u{width:30px;height:16px;border-radius:8px;background:#3a3b3e;position:relative;cursor:pointer;display:block}
.av-tg u:after{content:"";position:absolute;top:2px;left:2px;width:12px;height:12px;border-radius:50%;background:#bbb;transition:.15s}
.av-tg u.on{background:var(--green)}.av-tg u.on:after{left:16px;background:#fff}
.av-ctl{display:flex;gap:10px}
.av-amt{width:150px;flex-shrink:0}
.av-inp{display:flex;align-items:center;background:#000;border-radius:20px;padding:3px}
.av-inp button{width:24px;height:24px;border-radius:50%;border:1px solid #555;background:none;color:#aaa;cursor:pointer;font-size:16px;line-height:1}
.av-inp input{flex:1;min-width:0;background:none;border:0;color:#fff;text-align:center;font-weight:700;font-size:16px;outline:none}
.av-q{display:grid;grid-template-columns:1fr 1fr;gap:4px;margin-top:6px}
.av-q button{background:#2c2d30;border:0;color:#bbb;border-radius:12px;padding:3px 0;cursor:pointer;font-size:12px}
.av-go{flex:1;border:2px solid #7ee26a55;border-radius:12px;color:#fff;cursor:pointer;display:flex;flex-direction:column;align-items:center;justify-content:center;font-weight:700;font-size:20px;background:var(--green);box-shadow:inset 0 -3px 0 #0003;min-height:88px;text-shadow:0 1px 2px #0006}
.av-go small{font-size:13px;font-weight:400}
.av-go.cancel{background:var(--red);border-color:#ff7a9a55}
.av-go.cash{background:var(--orange);border-color:#ffb86655}
.av-go.cash b{font-size:22px}
.av-go:disabled{opacity:.5;cursor:not-allowed}
@media(max-width:900px){.av-wrap{grid-template-columns:1fr}.av-side{height:360px;order:2}.av-bets{grid-template-columns:1fr}.av-mult{font-size:60px}}
`;

const fmt = (n: number) => n.toFixed(2);
const histColor = (m: number) => (m < 2 ? "#34b4ff" : m < 10 ? "#913ef8" : "#c017b4");
const genCrash = (): number => {
  const r = Math.random();
  return Math.min(Math.max(1, 0.97 / (1 - r)), 200);
};
const NAMES = "abcdefghjkmnpqrstuvwxyz";
const genPlayers = (crash: number): Player[] =>
  Array.from({ length: 22 }, () => {
    const n = NAMES[(Math.random() * NAMES.length) | 0] + "***" + ((Math.random() * 10) | 0);
    const amt = [10, 20, 50, 100, 200, 500, 1000][(Math.random() * 7) | 0];
    const cashAt = 1.1 + Math.random() * Math.random() * 12;
    return { n, amt, cashAt: cashAt < crash ? cashAt : null };
  });

const newPanel = (): Panel => ({ amt: 100, auto: false, st: "idle", won: null });

export default function Aviator() {
  const canvas = useRef<HTMLCanvasElement>(null);
  const [, force] = useState(0);
  const g = useRef<Game>({
    phase: "wait", waitEnd: performance.now() + 5000, crashEnd: 0, start: 0, crash: 2,
    mult: 1, bal: 3000, tab: "All Bets",
    hist: [1.52, 3.4, 1.12, 12.7, 2.05, 1.01, 5.6, 1.88, 1.33, 24.1, 2.9, 1.2],
    panels: [newPanel(), newPanel()], players: genPlayers(2),
  }).current;
  const rerender = () => force((x) => x + 1);

  /* ---------- game loop ---------- */
  useEffect(() => {
    let raf = 0;
    const loop = () => {
      const now = performance.now();
      if (g.phase === "wait" && now >= g.waitEnd) {
        g.phase = "fly"; g.start = now; g.crash = genCrash(); g.mult = 1;
        g.players = genPlayers(g.crash);
        g.panels.forEach((p) => { if (p.st === "queued") { p.st = "live"; p.won = null; } });
      } else if (g.phase === "fly") {
        const t = (now - g.start) / 1000;
        g.mult = Math.exp(0.1 * t);
        if (g.mult >= g.crash) {
          g.mult = g.crash; g.phase = "crash"; g.crashEnd = now + 3200;
          g.hist = [g.crash, ...g.hist].slice(0, 20);
          g.panels.forEach((p) => { if (p.st === "live") p.st = "idle"; });
        }
      } else if (g.phase === "crash" && now >= g.crashEnd) {
        g.phase = "wait"; g.waitEnd = now + 5000;
        g.panels.forEach((p) => {
          if (p.auto && g.bal >= p.amt) { g.bal -= p.amt; p.st = "queued"; }
          else p.won = null;
        });
        g.players = genPlayers(2);
      }
      draw(now);
      rerender();
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, []);

  /* ---------- canvas ---------- */
  const draw = (now: number) => {
    const c = canvas.current; if (!c) return;
    const dpr = window.devicePixelRatio || 1;
    const w = c.clientWidth, h = c.clientHeight;
    if (c.width !== w * dpr) { c.width = w * dpr; c.height = h * dpr; }
    const x = c.getContext("2d");
    if (!x) return;
    x.setTransform(dpr, 0, 0, dpr, 0, 0);
    x.clearRect(0, 0, w, h);
    // rotating sunburst from bottom-left corner
    x.save();
    x.translate(0, h);
    const rot = g.phase === "crash" ? 0 : now * 0.00012;
    const n = 28, R = Math.hypot(w, h) * 1.2;
    for (let i = 0; i < n; i += 2) {
      x.beginPath(); x.moveTo(0, 0);
      x.arc(0, 0, R, rot + (i * 2 * Math.PI) / n, rot + ((i + 1) * 2 * Math.PI) / n);
      x.closePath(); x.fillStyle = "#ffffff07"; x.fill();
    }
    x.restore();
    // axes dots
    x.fillStyle = "#3a3b3e";
    for (let i = 0; i < 9; i++) { x.beginPath(); x.arc(30 + i * ((w - 60) / 8), h - 14, 2, 0, 7); x.fill(); }
    for (let i = 0; i < 6; i++) { x.beginPath(); x.arc(14, h - 30 - i * ((h - 60) / 6), 2, 0, 7); x.fill(); }

    if (g.phase === "wait") return;
    const t = Math.log(g.mult) / 0.1;
    const Tc = 8, K = 1.6, EK = Math.exp(K) - 1;
    const W = w - 170, H = h - 150, ox = 30, oy = h - 30;
    const span = Math.max(t, Tc);                       // graph rescales smoothly after Tc seconds
    const settle = Math.min(Math.max((t - Tc) / 2.5, 0), 1);
    const bob = Math.sin(now / 650) * 9 * settle;       // gentle hover once it reaches the top
    const pt = (s: number): [number, number] => {
      const q = s / span;
      return [ox + W * q, oy - H * ((Math.exp(K * q) - 1) / EK) - bob * q * q * q];
    };
    const steps = 80, pts: [number, number][] = [];
    for (let i = 0; i <= steps; i++) pts.push(pt((t * i) / steps));
    const last = pts.length - 1;
    const out = g.phase === "crash" ? Math.max(0, now - (g.crashEnd - 3200)) / 1000 : 0;
    // filled area
    x.beginPath(); x.moveTo(ox, oy);
    pts.forEach(([a, b]) => x.lineTo(a, b));
    x.lineTo(pts[last][0], oy); x.closePath();
    const gr = x.createLinearGradient(0, 0, 0, h);
    gr.addColorStop(0, "#e5053966"); gr.addColorStop(1, "#e5053911");
    x.fillStyle = gr; x.fill();
    // curve line
    x.beginPath(); pts.forEach(([a, b], i) => (i ? x.lineTo(a, b) : x.moveTo(a, b)));
    x.strokeStyle = "#e50539"; x.lineWidth = 4; x.stroke();
    // plane
    {
      const [bx0, by0] = pts[last];
      const q = Math.min(t / span, 1);
      const slope = (H * K * Math.exp(K * q)) / (EK * W);
      const base = -Math.atan(slope);                   // follows the curve tangent
      const ang = base + (-0.2 - base) * settle + Math.cos(now / 650) * 0.05 * settle - Math.min(out * 0.4, 0.4);
      const bx = bx0 + out * w * 0.9, by = by0 - out * w * 0.28; // flies off screen on crash
      x.save(); x.translate(bx, by); x.rotate(ang);
      x.shadowColor = "#e50539"; x.shadowBlur = 18;
      // far wing (behind body)
      x.fillStyle = "#9c0224";
      x.beginPath(); x.moveTo(-4, -4); x.lineTo(-20, -24); x.lineTo(-4, -26); x.lineTo(16, -4); x.closePath(); x.fill();
      // tail fin + stabilizer
      x.fillStyle = "#e50539";
      x.beginPath(); x.moveTo(-50, -3); x.lineTo(-62, -26); x.lineTo(-46, -26); x.lineTo(-30, -3); x.closePath(); x.fill();
      x.beginPath(); x.moveTo(-48, 2); x.lineTo(-64, 12); x.lineTo(-48, 12); x.lineTo(-34, 4); x.closePath(); x.fill();
      // fuselage
      x.beginPath();
      x.moveTo(-52, 0);
      x.bezierCurveTo(-40, -14, 10, -16, 40, -8);
      x.lineTo(46, 0);
      x.lineTo(40, 8);
      x.bezierCurveTo(10, 14, -40, 10, -52, 0);
      x.closePath(); x.fill();
      x.shadowBlur = 0;
      // belly shade
      x.fillStyle = "#b8032c";
      x.beginPath(); x.moveTo(-48, 2); x.bezierCurveTo(-30, 10, 20, 12, 42, 4); x.lineTo(44, 0); x.bezierCurveTo(10, 6, -30, 6, -48, 2); x.fill();
      // cockpit glass
      x.fillStyle = "#ffb3c4";
      x.beginPath(); x.moveTo(4, -11); x.bezierCurveTo(10, -20, 22, -18, 28, -9); x.closePath(); x.fill();
      x.fillStyle = "#ffffff88";
      x.beginPath(); x.ellipse(15, -14, 5, 2, -0.3, 0, 7); x.fill();
      // near wing (in front of body)
      x.fillStyle = "#ff2a5c";
      x.beginPath(); x.moveTo(-14, 2); x.lineTo(-34, 30); x.lineTo(-12, 32); x.lineTo(18, 3); x.closePath(); x.fill();
      x.fillStyle = "#ffffff55";
      x.beginPath(); x.moveTo(-8, 4); x.lineTo(-22, 24); x.lineTo(-16, 24); x.lineTo(2, 4); x.closePath(); x.fill();
      // nose cowl
      x.fillStyle = "#7a0119";
      x.beginPath(); x.ellipse(45, 0, 5, 9, 0, 0, 7); x.fill();
      // spinning propeller (blur disc + blade)
      x.fillStyle = "#ffffff33";
      x.beginPath(); x.ellipse(52, 0, 4, 26, 0, 0, 7); x.fill();
      x.fillStyle = "#e8e8e8";
      const bl = 4 + 22 * Math.abs(Math.sin(now / 45));
      x.beginPath(); x.ellipse(52, 0, 3, bl, 0, 0, 7); x.fill();
      x.restore();
    }
  };

  /* ---------- actions ---------- */
  const setP = (i: number, patch: Partial<Panel>) => Object.assign(g.panels[i], patch);
  const press = (i: number) => {
    const p = g.panels[i];
    if (p.st === "idle") {
      if (g.bal < p.amt || p.amt <= 0) return;
      g.bal -= p.amt; p.st = "queued"; p.won = null;
    } else if (p.st === "queued") { g.bal += p.amt; p.st = "idle"; }
    else if (p.st === "live" && g.phase === "fly") {
      const win = p.amt * g.mult; g.bal += win; p.st = "idle"; p.won = { m: g.mult, win };
    }
  };
  const adj = (i: number, v: number) => { const p = g.panels[i]; setP(i, { amt: Math.max(0, Math.min(10000, +(p.amt + v).toFixed(2))) }); };

  const crashed = g.phase === "crash";
  const rows: Row[] = g.players.map((p) => ({
    ...p,
    won: !!(p.cashAt && g.phase !== "wait" && g.mult >= p.cashAt),
  }));
  const tabs: Tab[] = ["All Bets", "Previous", "Top"];

  return (
    <div className="av">
      <style>{CSS}</style>
      <div className="av-top">
        <div className="av-logo">Aviator</div>
        <div className="av-bal"><b>{fmt(g.bal)}</b><span>INR (demo credits)</span></div>
      </div>

      <div className="av-wrap">
        <aside className="av-side">
          <div className="av-tabs">
            {tabs.map((t) => (
              <button key={t} className={g.tab === t ? "on" : ""} onClick={() => (g.tab = t)}>{t}</button>
            ))}
          </div>
          <div className="av-cnt"><div><b>{rows.length}/{rows.length + 1180}</b><br />Bets</div><div style={{ textAlign: "right" }}>Total win INR<br /><b>{fmt(rows.filter((r) => r.won).reduce((a, r) => a + r.amt * (r.cashAt ?? 0), 0))}</b></div></div>
          <div className="av-list">
            {g.tab === "Previous"
              ? g.hist.map((m, i) => <div key={i} className="av-row" style={{ gridTemplateColumns: "1fr" }}><span className="av-pill" style={{ color: histColor(m) }}>{fmt(m)}x</span></div>)
              : [...rows].sort((a, b) => (g.tab === "Top" ? b.amt - a.amt : 0)).map((r, i) => (
                <div key={i} className={"av-row" + (r.won ? " win" : "")}>
                  <span>{r.n}</span><span>{fmt(r.amt)}</span>
                  <span>{r.won ? <span className="av-pill" style={{ color: histColor((r.cashAt ?? 0)) }}>{fmt((r.cashAt ?? 0))}x</span> : <i>-</i>}</span>
                  <span>{r.won ? fmt(r.amt * (r.cashAt ?? 0)) : <i>-</i>}</span>
                </div>
              ))}
          </div>
        </aside>

        <main className="av-main">
          <div className="av-hist">
            {g.hist.map((m, i) => <span key={i} style={{ color: histColor(m) }}>{fmt(m)}x</span>)}
          </div>

          <div className="av-stage">
            <canvas ref={canvas} />
            <div className="av-mid">
              {g.phase === "wait" && (
                <>
                  <div className="av-logo-big">Aviator</div>
                  <div className="av-wait">WAITING FOR NEXT ROUND</div>
                  <div className="av-bar"><div style={{ width: `${Math.max(0, Math.min(100, ((g.waitEnd - performance.now()) / 5000) * 100))}%` }} /></div>
                </>
              )}
              {g.phase === "fly" && <div className="av-mult">{fmt(g.mult)}x</div>}
              {crashed && (
                <>
                  <div className="av-fly">FLEW AWAY!</div>
                  <div className="av-mult" style={{ color: "var(--red)" }}>{fmt(g.mult)}x</div>
                </>
              )}
            </div>
          </div>

          <div className="av-bets">
            {g.panels.map((p, i) => {
              const live = p.st === "live";
              return (
                <div key={i} className={"av-bp" + (live ? " live" : "") + (p.won ? " won" : "")}>
                  <div className="av-mode">
                    <div className="av-seg">
                      {["Bet", "Auto"].map((m) => (
                        <button key={m} className={(m === "Auto") === p.auto ? "on" : ""} onClick={() => setP(i, { auto: m === "Auto" })}>{m}</button>
                      ))}
                    </div>
                    <div className="av-tg">Auto rebet<u className={p.auto ? "on" : ""} onClick={() => setP(i, { auto: !p.auto })} /></div>
                  </div>
                  <div className="av-ctl">
                    <div className="av-amt">
                      <div className="av-inp">
                        <button onClick={() => adj(i, -10)}>−</button>
                        <input value={p.amt} disabled={p.st !== "idle"} onChange={(e: ChangeEvent<HTMLInputElement>) => setP(i, { amt: Math.max(0, Math.min(10000, +e.target.value || 0)) })} />
                        <button onClick={() => adj(i, 10)}>+</button>
                      </div>
                      <div className="av-q">
                        {[100, 200, 500, 1000].map((v) => (
                          <button key={v} disabled={p.st !== "idle"} onClick={() => setP(i, { amt: v })}>{v}</button>
                        ))}
                      </div>
                    </div>
                    {live && g.phase === "fly" ? (
                      <button className="av-go cash" onClick={() => press(i)}>CASH OUT<b>{fmt(p.amt * g.mult)} INR</b></button>
                    ) : p.st === "queued" ? (
                      <button className="av-go cancel" onClick={() => press(i)}>
                        <small>Waiting for next round</small>CANCEL
                      </button>
                    ) : (
                      <button className="av-go" onClick={() => press(i)}>BET<small>{fmt(p.amt)} INR</small></button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </main>
      </div>
    </div>
  );
}