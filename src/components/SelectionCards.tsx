"use client";

/* eslint-disable @next/next/no-img-element */
import { useEffect, useState } from "react";
import type { IconType } from "react-icons";
import {
  FaBolt,
  FaCogs,
  FaCubes,
  FaFilter,
  FaFlask,
  FaGripLines,
  FaLayerGroup,
  FaLightbulb,
  FaPlug,
  FaProjectDiagram,
  FaRobot,
  FaSquare,
  FaStream,
  FaSwimmingPool,
  FaTh,
  FaTimes,
  FaTint,
  FaWater,
} from "react-icons/fa";
import type { ListItem } from "@/lib/quoteFlow";
import type { WizardImage } from "@/sanity/queries";

type Card = {
  key: string;
  title: string;
  detail: string;
  icon: IconType;
  note?: string;
  image?: WizardImage;
  subItems?: ListItem[];
};

// [ürün adında aranan kelime, ikon, Studio'daki rol]
// Sıralama önemli: "filtre pompası" önce pompa, "sıva üstü kapağı" önce kapak olarak yakalanır.
const RULES: [string, IconType, string | undefined][] = [
  ["pompası", FaCogs, "pompa"],
  ["sehpa", FaLayerGroup, "sehpa"],
  ["kum", FaCubes, "kum"],
  ["filtre", FaFilter, "filtre"],
  ["ızgara", FaTh, "izgara"],
  ["skimmer", FaTint, "skimmer"],
  ["savak", FaStream, undefined],
  ["merdiven", FaGripLines, "merdiven"],
  ["şelale", FaWater, "selale"],
  ["pano", FaBolt, "pano"],
  ["kapağı", FaSquare, "kapak"],
  ["gömme", FaLightbulb, "lamba-gomme"],
  ["sıva üstü", FaLightbulb, "lamba-siva"],
  ["trafo", FaPlug, "trafo"],
  ["robot", FaRobot, "robot"],
  ["tuz", FaFlask, "tuz"],
];

// Sanity CDN'den istenen boyutta fotoğraf
function sized(url: string, width: number) {
  return `${url}?w=${width}&fit=max&auto=format`;
}

function toCards(items: ListItem[], images: Record<string, WizardImage>): Card[] {
  const cards: Card[] = items
    .filter((item) => item.group !== "tesisat")
    .map((item) => {
      const name = item.name.toLocaleLowerCase("tr-TR");
      const rule = RULES.find(([word]) => name.includes(word));
      const role = rule?.[2];
      return {
        key: item.name,
        title: item.name,
        detail: item.quantity,
        icon: rule?.[1] ?? FaSwimmingPool,
        note: item.note,
        image: role ? images[role] : undefined,
      };
    });

  const plumbing = items.filter((item) => item.group === "tesisat");
  if (plumbing.length > 0) {
    cards.push({
      key: "tesisat",
      title: "Tesisat seti",
      detail: `${plumbing.length} kalem`,
      icon: FaProjectDiagram,
      image: images["tesisat"],
      subItems: plumbing,
    });
  }

  return cards;
}

function CardModal({ card, onClose }: { card: Card; onClose: () => void }) {
  const Icon = card.icon;

  // Esc tuşuyla kapatma
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/40 p-6"
      onClick={onClose}
    >
      <div className="relative w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <button type="button" onClick={onClose}
          aria-label="Kapat"
          className="absolute top-4 right-4 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-white/80 text-ink/60 hover:bg-slate-100"
        >
          <FaTimes className="h-4 w-4" />
        </button>

        <div className="flex h-56 w-full items-center justify-center overflow-hidden rounded-xl bg-slate-100 text-navy">
          {card.image ? (
            <img src={sized(card.image.imageUrl, 800)} alt={card.title} className="h-full w-full object-contain" />
          ) : (
            <Icon className="h-16 w-16" />
          )}
        </div>

        <div className="mt-4 flex items-start justify-between gap-4">
          <p className="font-display text-lg font-bold text-navy">{card.title}</p>
          <p className="shrink-0 text-sm font-medium text-ink/70">{card.detail}</p>
        </div>

        {card.note && <p className="mt-2 text-sm leading-relaxed text-ink/75">{card.note}</p>}

        {card.subItems && (
          <ul className="mt-3 max-h-60 divide-y divide-line overflow-y-auto">
            {card.subItems.map((item) => (
              <li key={item.name} className="flex justify-between gap-3 py-1.5 text-sm">
                <span>{item.name}</span>
                <span className="shrink-0 font-medium text-navy">{item.quantity}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default function SelectionCards({
  items,
  images = {},
}: {
  items: ListItem[];
  images?: Record<string, WizardImage>;
}) {
  const [selected, setSelected] = useState<Card | null>(null);
  const cards = toCards(items, images);

  if (cards.length === 0) {
    return <p className="text-center text-sm text-ink/50">Seçimleriniz burada görünecek.</p>;
  }

  return (
    <>
      <div className="grid max-h-[50%] grid-cols-4 gap-2 overflow-y-auto xl:grid-cols-5">
        {cards.map((card) => {
          const Icon = card.icon;
          return (
            <button type="button" key={card.key} onClick={() => setSelected(card)}
              className="flex items-center gap-2 rounded-xl border border-line bg-white p-2 text-left shadow-sm transition hover:border-navy hover:shadow-md"
            >
              <div className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-slate-100 text-navy">
                {card.image ? (
                  <img src={sized(card.image.imageUrl, 120)} alt="" className="h-full w-full object-contain" />
                ) : (
                  <Icon className="h-5 w-5" />
                )}
              </div>
              <div className="min-w-0">
                <p className="line-clamp-2 text-xs font-medium leading-snug text-ink" title={card.title}>
                  {card.title}
                </p>
                <p className="truncate text-[11px] text-ink/60">{card.detail}</p>
              </div>
            </button>
          );
        })}
      </div>

      {selected && <CardModal card={selected} onClose={() => setSelected(null)} />}
    </>
  );
}