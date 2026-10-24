"use client";
import { useState, type ChangeEvent } from "react";

/* Mines-style game UI — demo only, play-money credits, no real payments. */

type Phase = "idle" | "playing" | "over";
const SIZE = 25;

const CSS = `
.mn{--bg:#0f212e;--panel:#213743;--panel2:#1a2c38;--tile:#2f4553;--tileh:#557086;--green:#00e701;--green2:#1fff20;--red:#ff4d4f;--muted:#b1bad3;
 min-height:100vh;background:var(--bg);color:#fff;font-family:Inter,"Segoe UI",Arial,sans-serif;font-size:14px;padding:16px}
.mn *{box-sizing:border-box}
.mn-top{max-width:1000px;margin:0 auto 12px;display:flex;justify-content:space-between;align-items:center}
.mn-logo{font-weight:800;font-size:22px}
.mn-bal{background:var(--panel2);border:1px solid #2f4553;border-radius:8px;padding:8px 14px;font-weight:700}
.mn-bal small{color:var(--muted);font-weight:400;margin-left:6px}
.mn-card{max-width:1000px;margin:auto;display:grid;grid-template-columns:320px 1fr;background:var(--panel2);border-radius:12px;overflow:hidden;box-shadow:0 8px 30px #0006}
.mn-ctl{background:var(--panel);padding:14px;display:flex;flex-direction:column;gap:12px}
.mn-seg{display:flex;background:#0f212e;border-radius:24px;padding:4px}
.mn-seg button{flex:1;border:0;background:none;color:var(--muted);padding:9px 0;border-radius:20px;font-weight:700;cursor:pointer}
.mn-seg button.on{background:var(--tile);color:#fff}
.mn-lbl{display:flex;justify-content:space-between;color:var(--muted);font-weight:600;font-size:12px;margin-bottom:5px}
.mn-in{display:flex;background:#0f212e;border:2px solid #2f4553;border-radius:8px;overflow:hidden}
.mn-in:focus-within{border-color:#557086}
.mn-in input,.mn-in select{flex:1;min-width:0;background:none;border:0;color:#fff;padding:10px;font-size:14px;font-weight:600;outline:none}
.mn-in select option{background:#0f212e}
.mn-in button{border:0;background:var(--tile);color:#fff;font-weight:700;padding:0 14px;cursor:pointer;border-left:2px solid #0f212e}
.mn-in button:hover:not(:disabled){background:var(--tileh)}
.mn-in button:disabled,.mn-in input:disabled,.mn-in select:disabled{opacity:.55;cursor:not-allowed}
.mn-two{display:grid;grid-template-columns:1fr 1fr;gap:10px}
.mn-box{background:#0f212e;border:2px solid #2f4553;border-radius:8px;padding:10px;font-weight:700}
.mn-btn{border:0;border-radius:8px;padding:15px;font-size:16px;font-weight:800;cursor:pointer;color:#05202e;background:var(--green);box-shadow:0 4px 0 #00a800}
.mn-btn:hover{background:var(--green2)}
.mn-btn:active{transform:translateY(2px);box-shadow:0 2px 0 #00a800}
.mn-btn.alt{background:var(--tile);color:#fff;box-shadow:0 4px 0 #1b2b36;margin-top:2px}
.mn-btn.alt:hover{background:var(--tileh)}
.mn-btn:disabled{opacity:.5;cursor:not-allowed}
.mn-profit{background:#0f212e;border-radius:8px;padding:10px 12px}
.mn-profit div{display:flex;justify-content:space-between;color:var(--muted);font-size:12px;margin-bottom:6px;font-weight:600}
.mn-profit b{color:#fff;font-size:15px}
.mn-stage{padding:22px;display:flex;flex-direction:column;align-items:center;justify-content:center;position:relative;min-height:560px}
.mn-grid{display:grid;grid-template-columns:repeat(5,1fr);gap:10px;width:100%;max-width:520px}
.mn-t{aspect-ratio:1;border:0;border-radius:10px;background:var(--tile);box-shadow:0 5px 0 #1b2b36;cursor:pointer;display:flex;align-items:center;justify-content:center;transition:background .12s,transform .12s;padding:0}
.mn-t:hover:not(:disabled){background:var(--tileh);transform:translateY(-2px)}
.mn-t:disabled{cursor:default}
.mn-t.rev{background:#071824;box-shadow:none;animation:pop .28s ease}
.mn-t.dim{opacity:.45}
.mn-t.hit{background:#3b1219;animation:shake .35s ease}
.mn-t svg{width:56%;height:56%}
.mn-win{position:absolute;left:50%;top:50%;transform:translate(-50%,-50%);background:#0f212e;border:3px solid var(--green);border-radius:14px;padding:14px 30px;text-align:center;box-shadow:0 0 30px #00e70055;animation:pop .3s ease;pointer-events:none}
.mn-win b{display:block;color:var(--green);font-size:30px}
.mn-win span{color:#cfe;font-size:13px}
.mn-strip{display:flex;gap:8px;margin-bottom:18px;overflow:hidden;max-width:520px;width:100%}
.mn-strip span{flex:1;min-width:70px;text-align:center;background:#0f212e;border:2px solid #2f4553;border-radius:8px;padding:6px 0;font-size:12px;font-weight:700;color:var(--muted)}
.mn-strip span.on{border-color:var(--green);color:#fff}
@keyframes pop{0%{transform:scale(.7)}60%{transform:scale(1.08)}100%{transform:scale(1)}}
@keyframes shake{25%{transform:translateX(-5px)}50%{transform:translateX(5px)}75%{transform:translateX(-3px)}}
@media(max-width:820px){.mn-card{grid-template-columns:1fr}.mn-stage{min-height:0;padding:14px}}
`;

const Gem = () => (
  <svg viewBox="0 0 64 64" aria-label="gem">
    <defs><linearGradient id="gm" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#7dffa0" /><stop offset="1" stopColor="#00c853" /></linearGradient></defs>
    <path d="M16 8h32l12 16-28 34L4 24z" fill="url(#gm)" />
    <path d="M4 24h56M22 24l10 34 10-34M16 8l6 16 10-16 10 16 6-16" fill="none" stroke="#00000033" strokeWidth="2" />
    <path d="M16 8l6 16-18 0z" fill="#ffffff55" />
  </svg>
);
const Bomb = () => (
  <svg viewBox="0 0 64 64" aria-label="mine">
    <circle cx="30" cy="38" r="20" fill="#2b2f3a" />
    <circle cx="23" cy="31" r="6" fill="#ffffff33" />
    <rect x="38" y="10" width="8" height="12" rx="2" fill="#6b7280" transform="rotate(35 42 16)" />
    <path d="M48 8c4-4 8 0 6 4" stroke="#ffb020" strokeWidth="3" fill="none" strokeLinecap="round" />
    <circle cx="56" cy="8" r="3" fill="#ff6b3d" />
  </svg>
);

const fmt = (n: number) => n.toFixed(2);

/** Fair multiplier after `k` safe picks with `m` mines, 1% house edge. */
const multiplier = (k: number, m: number): number => {
  let r = 1;
  for (let i = 0; i < k; i++) r *= (SIZE - i) / (SIZE - m - i);
  return r * 0.99;
};

export default function Mines() {
  const [bal, setBal] = useState(1000);
  const [bet, setBet] = useState(10);
  const [mines, setMines] = useState(3);
  const [phase, setPhase] = useState<Phase>("idle");
  const [mineSet, setMineSet] = useState<boolean[]>(Array(SIZE).fill(false));
  const [open, setOpen] = useState<boolean[]>(Array(SIZE).fill(false));
  const [hit, setHit] = useState(-1);
  const [won, setWon] = useState<{ mult: number; amt: number } | null>(null);

  const safeCount = open.filter(Boolean).length;
  const gems = SIZE - mines - safeCount;
  const curMult = safeCount ? multiplier(safeCount, mines) : 1;
  const nextMult = multiplier(safeCount + 1, mines);
  const playing = phase === "playing";

  const start = () => {
    if (bet <= 0 || bet > bal) return;
    const arr: boolean[] = Array(SIZE).fill(false);
    let placed = 0;
    while (placed < mines) {
      const i = Math.floor(Math.random() * SIZE);
      if (!arr[i]) { arr[i] = true; placed++; }
    }
    setBal((b) => +(b - bet).toFixed(2));
    setMineSet(arr); setOpen(Array(SIZE).fill(false)); setHit(-1); setWon(null); setPhase("playing");
  };

  const pick = (i: number) => {
    if (!playing || open[i]) return;
    const next = open.slice(); next[i] = true; setOpen(next);
    if (mineSet[i]) { setHit(i); setPhase("over"); return; }
    if (next.filter(Boolean).length === SIZE - mines) cashout(next); // cleared the board
  };

  const cashout = (o: boolean[] = open) => {
    const k = o.filter(Boolean).length;
    if (!playing || k === 0) return;
    const m = multiplier(k, mines), amt = +(bet * m).toFixed(2);
    setBal((b) => +(b + amt).toFixed(2));
    setWon({ mult: m, amt }); setPhase("over");
  };

  const randomPick = () => {
    const left = open.map((v, i) => (v ? -1 : i)).filter((i) => i >= 0);
    if (left.length) pick(left[Math.floor(Math.random() * left.length)]);
  };

  const strip = Array.from({ length: 5 }, (_, j) => safeCount + j + 1).filter((k) => k <= SIZE - mines);

  return (
    <div className="mn">
      <style>{CSS}</style>
      <div className="mn-top">
        <div className="mn-logo">Mines</div>
        <div className="mn-bal">{fmt(bal)}<small>demo credits</small></div>
      </div>

      <div className="mn-card">
        <aside className="mn-ctl">
          <div className="mn-seg"><button className="on">Manual</button><button disabled title="Not in this demo">Auto</button></div>

          <div>
            <div className="mn-lbl"><span>Bet Amount</span><span>{fmt(bet)}</span></div>
            <div className="mn-in">
              <input type="number" min={0} value={bet} disabled={playing}
                onChange={(e: ChangeEvent<HTMLInputElement>) => setBet(Math.max(0, +e.target.value || 0))} />
              <button disabled={playing} onClick={() => setBet((b) => +(b / 2).toFixed(2))}>½</button>
              <button disabled={playing} onClick={() => setBet((b) => Math.min(bal, +(b * 2).toFixed(2)))}>2×</button>
            </div>
          </div>

          {playing ? (
            <>
              <div className="mn-two">
                <div><div className="mn-lbl">Mines</div><div className="mn-box">{mines}</div></div>
                <div><div className="mn-lbl">Gems</div><div className="mn-box">{gems}</div></div>
              </div>
              <div className="mn-profit">
                <div><span>Total profit ({fmt(curMult)}×)</span><b>{fmt(bet * curMult - bet)}</b></div>
                <div style={{ marginBottom: 0 }}><span>Next tile ({fmt(nextMult)}×)</span><b>{fmt(bet * nextMult - bet)}</b></div>
              </div>
              <button className="mn-btn alt" onClick={randomPick}>Pick random tile</button>
              <button className="mn-btn" disabled={safeCount === 0} onClick={() => cashout()}>
                Cashout {safeCount ? fmt(bet * curMult) : ""}
              </button>
            </>
          ) : (
            <>
              <div>
                <div className="mn-lbl"><span>Mines</span></div>
                <div className="mn-in">
                  <select value={mines} onChange={(e) => setMines(+e.target.value)}>
                    {Array.from({ length: 24 }, (_, i) => i + 1).map((n) => <option key={n} value={n}>{n}</option>)}
                  </select>
                </div>
              </div>
              <button className="mn-btn" disabled={bet <= 0 || bet > bal} onClick={start}>Bet</button>
              {bet > bal && <div style={{ color: "var(--red)", fontSize: 12 }}>Bet is higher than your balance.</div>}
            </>
          )}
        </aside>

        <section className="mn-stage">
          {playing && (
            <div className="mn-strip">
              {strip.map((k, j) => <span key={k} className={j === 0 ? "on" : ""}>{fmt(multiplier(k, mines))}×</span>)}
            </div>
          )}
          <div className="mn-grid">
            {Array.from({ length: SIZE }, (_, i) => {
              const isOpen = open[i], over = phase === "over", showMine = over && mineSet[i];
              const cls = "mn-t" + (isOpen || over ? " rev" : "") + (i === hit ? " hit" : "") + (over && !isOpen ? " dim" : "");
              return (
                <button key={i} className={cls} disabled={!playing || isOpen} onClick={() => pick(i)} aria-label={`Tile ${i + 1}`}>
                  {isOpen || over ? (showMine ? <Bomb /> : <Gem />) : null}
                </button>
              );
            })}
          </div>
          {won && (
            <div className="mn-win"><b>{fmt(won.mult)}×</b><span>You won {fmt(won.amt)}</span></div>
          )}
        </section>
      </div>
    </div>
  );
}