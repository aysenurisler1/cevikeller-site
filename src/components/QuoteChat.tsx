"use client";

import { useEffect, useRef, useState } from "react";
import { FaComments, FaMinus, FaRedo } from "react-icons/fa";
import PoolVisual from "@/components/PoolVisual";
import SelectionCards from "@/components/SelectionCards";

import type { WizardImage } from "@/sanity/queries";
import {
  type Answers,
  buildMaterialList,
  fmt,
  formatAnswer,
  getFilterSize,
  getSteps,
  getVolume,
} from "@/lib/quoteFlow";

function AssistantBubble({ children }: { children: React.ReactNode }) {
  return (
    <div className="max-w-[85%] rounded-2xl rounded-tl-sm bg-white px-4 py-3 text-sm text-ink shadow-sm">
      {children}
    </div>
  );
}

function UserBubble({ children }: { children: React.ReactNode }) {
  return (
    <div className="ml-auto w-fit max-w-[85%] rounded-2xl rounded-tr-sm bg-navy px-4 py-3 text-sm text-white">
      {children}
    </div>
  );
}

export default function QuoteChat({ images = {} }: { images?: Record<string, WizardImage> }) {  const [open, setOpen] = useState(false);
  const [answers, setAnswers] = useState<Answers>({});
  const [stepIndex, setStepIndex] = useState(0);
  const [input, setInput] = useState("");
  const [error, setError] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);

  const steps = getSteps(answers);
  const current = steps[stepIndex];
  const done = stepIndex >= steps.length;

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [stepIndex, open]);

  function saveAnswer(value: string | number) {
    setAnswers((prev) => ({ ...prev, [current.key]: value }));
    setStepIndex((i) => i + 1);
    setInput("");
    setError("");
  }

  function submitNumber() {
    const value = Number(input.replace(",", "."));
    const min = current.min ?? 0;
    const max = current.max ?? Infinity;

    if (!input.trim() || !Number.isFinite(value) || value < min || value > max) {
      setError(`Lütfen ${min} ile ${max} arasında bir değer girin.`);
      return;
    }
    if (current.key === "deepDepth" && value < Number(answers.shallowDepth)) {
      setError("Derin kısım, sığ kısımdan daha az olamaz.");
      return;
    }
    saveAnswer(value);
  }

  function restart() {
    setAnswers({});
    setStepIndex(0);
    setInput("");
    setError("");
  }

  const volume = getVolume(answers);
  const hasFilter = getFilterSize(answers) !== undefined;
  const materialList = buildMaterialList(answers);

  const listGroups = [
    { title: "Ekipmanlar", items: materialList.filter((i) => !i.group) },
    { title: "Tesisat", items: materialList.filter((i) => i.group === "tesisat") },
    { title: "Aydınlatma", items: materialList.filter((i) => i.group === "aydinlatma") },
        { title: "Ek ürünler", items: materialList.filter((i) => i.group === "ekstra") },
  ].filter((g) => g.items.length > 0);

  return (
    <>
           {open && (
        <div className="fixed top-24 left-24 bottom-24 right-[420px] z-40 hidden flex-col gap-4 rounded-2xl border border-line bg-white/85 p-6 shadow-2xl backdrop-blur-sm lg:flex">
          <div className="min-h-0 flex-1">
            <PoolVisual
              length={answers.length !== undefined ? Number(answers.length) : undefined}
              width={answers.width !== undefined ? Number(answers.width) : undefined}
              shallowDepth={answers.shallowDepth !== undefined ? Number(answers.shallowDepth) : undefined}
              deepDepth={answers.deepDepth !== undefined ? Number(answers.deepDepth) : undefined}
            />
          </div>
          <SelectionCards items={materialList} images={images} />        </div>
      )}

      {open && (
        <div className="fixed bottom-24 right-5 z-50 flex h-[560px] max-h-[calc(100vh-8rem)] w-[380px] max-w-[calc(100vw-2.5rem)] flex-col overflow-hidden rounded-2xl border border-line bg-white shadow-2xl">
          <div className="flex items-center justify-between bg-navy-deep px-5 py-4 text-white">
            <div>
              <p className="font-display text-base font-bold">Teklif Asistanı</p>
              <p className="text-xs text-white/60">
                Havuzunuza uygun malzemeleri birlikte seçelim
              </p>
            </div>
            <div className="flex items-center gap-1">
              {stepIndex > 0 && (
                <button type="button" onClick={restart}
                  aria-label="Baştan başla"
                  className="flex h-8 w-8 items-center justify-center rounded-full hover:bg-white/10"
                >
                  <FaRedo className="h-3 w-3" />
                </button>
              )}
              <button type="button" onClick={() => setOpen(false)}
                aria-label="Paneli küçült"
                className="flex h-8 w-8 items-center justify-center rounded-full hover:bg-white/10"
              >
                <FaMinus className="h-3 w-3" />
              </button>
            </div>
          </div>

          <div className="flex-1 space-y-3 overflow-y-auto bg-slate-50 p-4">
            <AssistantBubble>
              Merhaba! Havuzunuz için uygun filtre, pompa ve diğer malzemeleri
              birkaç soruyla belirleyelim.
            </AssistantBubble>

            {steps.slice(0, stepIndex).map((step) => (
              <div key={step.key} className="space-y-3">
                <AssistantBubble>{step.question}</AssistantBubble>
                <UserBubble>{formatAnswer(step, answers[step.key])}</UserBubble>
              </div>
            ))}

            {!done && <AssistantBubble>{current.question}</AssistantBubble>}

            {done && volume !== null && (
              <AssistantBubble>
                {!hasFilter ? (
                  <>
                    Havuzunuzun yaklaşık hacmi <strong>{fmt(volume)} m³</strong>. Bu
                    büyüklükteki havuzlar için lütfen ekibimizle görüşün.
                  </>
                ) : (
                  <>
                    <p className="mb-2 font-bold text-navy">Malzeme listeniz</p>
                    {listGroups.map((g) => (
                      <div key={g.title} className="mt-3 first:mt-0">
                        <p className="text-xs font-bold uppercase tracking-wide text-ink/50">
                          {g.title}
                        </p>
                        <ul className="divide-y divide-line">
                          {g.items.map((item) => (
                            <li key={item.name} className="flex justify-between gap-3 py-1.5">
                              <span>
                                {item.name}
                                {item.note && (
                                  <span className="block text-xs text-ink/60">{item.note}</span>
                                )}
                              </span>
                              <span className="shrink-0 text-right font-medium text-navy">
                                {item.quantity}
                              </span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                    <p className="mt-2 text-ink/60">Sıradaki adımlar yakında burada olacak.</p>
                  </>
                )}
              </AssistantBubble>
            )}

            <div ref={bottomRef} />
          </div>

          <div className="border-t border-line p-4">
            {!done && current.kind === "choice" && (
              <div className={current.options && current.options.length > 4 ? "grid grid-cols-3 gap-2" : "flex flex-col gap-2"}>                {current.options?.map((option) => (
                  <button type="button" key={option.value} onClick={() => saveAnswer(option.value)}
                    className="rounded-xl border border-line px-4 py-2 text-left text-sm text-navy transition-colors hover:border-navy hover:bg-navy hover:text-white"
                  >
                    <span className="block">{option.label}</span>
                    {option.hint && (
                      <span className="mt-0.5 block text-xs opacity-70">{option.hint}</span>
                    )}
                  </button>
                ))}
              </div>
            )}

            {!done && current.kind === "number" && (
              <div>
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <input type="text" inputMode="decimal" value={input}
                      onChange={(e) => setInput(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && submitNumber()}
                      placeholder={current.placeholder ?? "Örn. 8 veya 1,5"}                      className="w-full rounded-xl border border-line px-4 py-2.5 pr-10 text-sm text-ink outline-none focus:border-navy"
                    />
                    <span className="absolute top-1/2 right-4 -translate-y-1/2 text-sm text-ink/50">
                      {current.unit}
                    </span>
                  </div>
                  <button type="button" onClick={submitNumber}
                    className="rounded-xl bg-sun px-4 py-2.5 text-sm font-bold text-white"
                  >
                    Gönder
                  </button>
                </div>
                {error && <p className="mt-2 text-xs text-red-600">{error}</p>}
              </div>
            )}

            {done && (
              <button type="button" onClick={restart}
                className="w-full rounded-xl border border-line px-4 py-2.5 text-sm text-navy hover:bg-slate-50"
              >
                Baştan başla
              </button>
            )}
          </div>
        </div>
      )}

      <button type="button" onClick={() => setOpen((v) => !v)}
        aria-label={open ? "Teklif asistanını gizle" : "Teklif asistanını aç"}
        className="fixed bottom-5 right-5 z-50 flex items-center gap-2 rounded-full bg-sun px-5 py-3.5 font-display text-sm font-bold text-white shadow-lg transition-transform hover:scale-105"
      >
        <FaComments className="h-5 w-5" />
        {open ? "Asistanı Gizle" : "Teklif Asistanı"}
      </button>
    </>
  );
}