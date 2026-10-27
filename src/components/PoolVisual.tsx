"use client";

import { useId } from "react";

type Props = {
  length?: number;
  width?: number;
  shallowDepth?: number;
  deepDepth?: number;
};

// Kullanıcı henüz ölçü girmediyse gösterilecek örnek havuz (soluk görünür).
const DEFAULTS = { length: 8, width: 4, shallowDepth: 1.2, deepDepth: 1.8 };

const COS = Math.cos(Math.PI / 6);
const SIN = Math.sin(Math.PI / 6);
const RIM = 0.6; // havuz kenarındaki zemin genişliği (m)
const BASE = 0.4; // tabanın altındaki beton kalınlığı (m)

type P3 = [number, number, number];

// 3B noktayı (x: uzunluk, y: genişlik, z: yükseklik) izometrik 2B noktaya çevirir.
function iso([x, y, z]: P3): [number, number] {
  return [(x - y) * COS, (x + y) * SIN - z];
}

function toPoints(points: P3[]) {
  return points.map((p) => iso(p).join(",")).join(" ");
}

export default function PoolVisual(props: Props) {
  const clipId = useId();

  const hasInput = props.length !== undefined;
  const L = props.length ?? DEFAULTS.length;
  const W = props.width ?? DEFAULTS.width;
  const ds = props.shallowDepth ?? DEFAULTS.shallowDepth;
  const dd = props.deepDepth ?? props.shallowDepth ?? DEFAULTS.deepDepth;
  const bottom = -(Math.max(ds, dd) + BASE);

  // Dış beton blok
  const deckTop: P3[] = [[-RIM, -RIM, 0], [L + RIM, -RIM, 0], [L + RIM, W + RIM, 0], [-RIM, W + RIM, 0]];
  const sideRight: P3[] = [[L + RIM, -RIM, 0], [L + RIM, W + RIM, 0], [L + RIM, W + RIM, bottom], [L + RIM, -RIM, bottom]];
  const sideFront: P3[] = [[-RIM, W + RIM, 0], [L + RIM, W + RIM, 0], [L + RIM, W + RIM, bottom], [-RIM, W + RIM, bottom]];

  // Havuzun içi (yukarıdan görünen kısımlar)
  const opening: P3[] = [[0, 0, 0], [L, 0, 0], [L, W, 0], [0, W, 0]];
  const floor: P3[] = [[0, 0, -ds], [L, 0, -dd], [L, W, -dd], [0, W, -ds]];
  const backWall: P3[] = [[0, 0, 0], [L, 0, 0], [L, 0, -dd], [0, 0, -ds]];
  const sideWall: P3[] = [[0, 0, 0], [0, W, 0], [0, W, -ds], [0, 0, -ds]];

  // Çizimi her zaman alana sığdırmak için sınırları hesapla
  const all = [...deckTop, ...sideRight, ...sideFront].map(iso);
  const xs = all.map((p) => p[0]);
  const ys = all.map((p) => p[1]);
  const pad = 0.8;
  const minX = Math.min(...xs) - pad;
  const minY = Math.min(...ys) - pad;
  const viewBox = `${minX} ${minY} ${Math.max(...xs) - minX + pad} ${Math.max(...ys) - minY + pad}`;

  const stroke = { stroke: "#64748b", strokeWidth: 1.2, vectorEffect: "non-scaling-stroke" as const };

  return (
    <svg viewBox={viewBox}
      className={`h-full w-full transition-opacity duration-500 ${hasInput ? "opacity-100" : "opacity-40"}`}
      aria-hidden="true"
    >
      <defs>
        <clipPath id={clipId}>
          <polygon points={toPoints(opening)} />
        </clipPath>
        <linearGradient id={`${clipId}-water`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.45" />
          <stop offset="100%" stopColor="#0284c7" stopOpacity="0.6" />
        </linearGradient>
      </defs>

      {/* Dış blok */}
      <polygon points={toPoints(sideFront)} fill="#cbd5e1" {...stroke} />
      <polygon points={toPoints(sideRight)} fill="#94a3b8" {...stroke} />
      <polygon points={toPoints(deckTop)} fill="#e2e8f0" {...stroke} />

      {/* Havuzun içi, sadece açıklıktan görünen kısmı çizilir */}
      <g clipPath={`url(#${clipId})`}>
        <polygon points={toPoints(floor)} fill="#7dd3fc" {...stroke} />
        <polygon points={toPoints(backWall)} fill="#bae6fd" {...stroke} />
        <polygon points={toPoints(sideWall)} fill="#e0f2fe" {...stroke} />
        <polygon points={toPoints(opening)} fill={`url(#${clipId}-water)`} />
      </g>

      <polygon points={toPoints(opening)} fill="none" {...stroke} />
    </svg>
  );
}