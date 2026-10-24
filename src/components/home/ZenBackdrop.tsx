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
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

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
        <div className="absolute inset-x-0 bottom-0 h-44 bg-gradient-to-t from-ink to-transparent" />
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
