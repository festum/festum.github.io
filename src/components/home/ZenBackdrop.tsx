import { useEffect, useRef, useState } from 'react';

const stalks = [
  { x: 45, w: 10, lean: -1.5, d: 0.5 },
  { x: 120, w: 18, lean: 1, d: 1 },
  { x: 210, w: 9, lean: -0.6, d: 0.45 },
  { x: 300, w: 14, lean: 1.6, d: 0.8 },
  { x: 395, w: 8, lean: -1.2, d: 0.45 },
  { x: 470, w: 20, lean: 0.4, d: 1 },
  { x: 565, w: 11, lean: 1.8, d: 0.6 },
  { x: 660, w: 9, lean: -1, d: 0.45 },
  { x: 745, w: 16, lean: -1.6, d: 0.85 },
  { x: 840, w: 10, lean: 1.2, d: 0.5 },
  { x: 930, w: 19, lean: -0.5, d: 1 },
  { x: 1030, w: 9, lean: 1.4, d: 0.45 },
  { x: 1120, w: 13, lean: -1.8, d: 0.75 },
];

function Stalk({ x, w, lean, d, i }: { x: number; w: number; lean: number; d: number; i: number }) {
  const nodes: number[] = [];
  for (let y = -20; y <= 620; y += 92) nodes.push(y + ((i * 37) % 60));
  const leaves = [160 + ((i * 67) % 130), 330 + ((i * 43) % 150), 510 + ((i * 29) % 100)];
  return (
    <g transform={`rotate(${lean} ${x} 620)`}>
      <g
        className="bamboo-sway"
        style={{
          transformOrigin: `${x}px 620px`,
          animationDuration: `${11 + (i % 5) * 1.5}s`,
          animationDelay: `${(i % 7) * 0.9}s`,
        }}
      >
        <rect x={x - w / 2} y={-30} width={w} height={660} rx={w / 2} fill="#12121a" opacity={d} />
        <line
          x1={x - w / 2 + 1.5}
          x2={x - w / 2 + 1.5}
          y1={-30}
          y2={630}
          stroke="rgba(240,235,225,0.05)"
          strokeWidth="1.5"
          opacity={d}
        />
        {nodes.map((ny) => (
          <line
            key={ny}
            x1={x - w / 2}
            x2={x + w / 2}
            y1={ny}
            y2={ny}
            stroke="rgba(240,235,225,0.06)"
            strokeWidth="1.4"
            opacity={d}
          />
        ))}
        {leaves.map((ly, j) => {
          const dir = (i + j) % 2 === 0 ? 1 : -1;
          const ang = dir === 1 ? -28 - ((i + j) % 3) * 14 : 28 + ((i + j) % 3) * 14;
          return (
            <g
              key={ly}
              transform={`translate(${x + (dir * w) / 2} ${ly}) rotate(${ang}) scale(${dir} 1)`}
              opacity={d * 0.95}
            >
              <path d="M0 0 q16 -7 42 -4 q-24 9 -42 4 z" fill="#191922" />
            </g>
          );
        })}
      </g>
    </g>
  );
}

const koiPaths = [
  {
    path: 'M -140 160 C 260 110 460 250 800 190 S 1240 100 1560 170',
    dur: 52,
    w: 96,
    o: 0.55,
  },
  {
    path: 'M 1560 320 C 1140 370 870 240 530 300 S 90 380 -140 330',
    dur: 64,
    w: 74,
    o: 0.38,
  },
];

function Koi({ path, dur, w, o }: { path: string; dur: number; w: number; o: number }) {
  return (
    <div
      className="koi"
      style={{ offsetPath: `path("${path}")`, animationDuration: `${dur}s`, opacity: o }}
    >
      <svg width={w} height={w * 0.375} viewBox="0 0 96 36" fill="none">
        <g className="koi-tail">
          <path
            d="M26 18 C 16 10 8 6 2 5 C 7 12 7 24 2 31 C 8 30 16 26 26 18 Z"
            fill="rgba(240,235,225,0.4)"
          />
        </g>
        <path
          d="M26 18 C 32 8 50 4 64 6 C 78 8 90 13 94 18 C 90 23 78 28 64 30 C 50 32 32 28 26 18 Z"
          fill="rgba(222,190,126,0.45)"
        />
        <path
          d="M44 9 C 54 6 64 6 72 9 C 64 12 52 12 44 9 Z"
          fill="rgba(240,235,225,0.35)"
        />
        <circle cx="84" cy="15.5" r="1.6" fill="#0a0a0d" opacity="0.7" />
      </svg>
    </div>
  );
}

const BURST_DELAY = 600;
const MAX_BURSTS = 5;
export default function ZenBackdrop() {
  const [bursts, setBursts] = useState<{ id: number; x: number; y: number }[]>([]);
  const rootRef = useRef<HTMLDivElement>(null);
  const nextId = useRef(0);
  const timers = useRef<number[]>([]);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      const host = rootRef.current;
      if (!host) return;
      const r = host.getBoundingClientRect();
      const x = e.clientX - r.left;
      const y = e.clientY - r.top;
      const id = nextId.current++;
      const t = window.setTimeout(() => {
        setBursts((prev) => [...prev, { id, x, y }].slice(-MAX_BURSTS));
      }, BURST_DELAY);
      timers.current.push(t);
    };

    document.addEventListener('click', onClick);
    return () => {
      document.removeEventListener('click', onClick);
      timers.current.forEach((t) => clearTimeout(t));
    };
  }, []);

  return (
    <div
      ref={rootRef}
      className="absolute inset-0 -z-10 overflow-hidden pointer-events-none"
      aria-hidden="true"
    >
      <div className="zen-glow zen-glow-1" />
      <div className="zen-glow zen-glow-2" />
      <div className="zen-glow zen-glow-3" />

      <div className="absolute top-0 left-0 w-full h-[85vh] overflow-hidden">
        <svg className="w-full h-full" viewBox="0 0 1200 640" preserveAspectRatio="xMidYMax slice">
          {stalks.map((s, i) => (
            <Stalk key={s.x} {...s} i={i} />
          ))}
        </svg>

        <div className="zen-mist zen-mist-1" />
        <div className="zen-mist zen-mist-2" />

        <div className="absolute inset-x-0 bottom-0 h-44 bg-gradient-to-t from-ink to-transparent" />
      </div>

      <div className="absolute inset-x-0 bottom-0 h-[50vh] overflow-hidden">
        {koiPaths.map((k) => (
          <Koi key={k.path} {...k} />
        ))}
      </div>


      {bursts.map((b) => (
        <div
          key={b.id}
          className="drop-point"
          style={{ left: 0, top: 0, transform: `translate3d(${b.x}px, ${b.y}px, 0)` }}
        >
          <span className="drop" />
          <span className="ripple-ring" />
          <span className="ripple-ring ripple-ring-delayed" />
        </div>
      ))}

      <div className="drop-point" style={{ left: '30%', top: '62vh' }}>
        <span className="drop drop-slow" />
        <span className="ripple-ring ripple-ring-slow" />
      </div>
    </div>
  );
}
