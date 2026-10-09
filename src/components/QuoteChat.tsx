"use client";

import { useEffect, useRef, useState } from "react";
import { FaComments, FaMinus, FaRedo } from "react-icons/fa";

type Step = {
  key: string;
  question: string;
  kind: "choice" | "number";
  options?: { label: string; value: string }[];
  unit?: string;
  min?: number;
  max?: number;
};

const STEPS: Step[] = [
  {
    key: "poolType",
    question: "Havuzunuz ne amaçla kullanılacak?",
    kind: "choice",
    options: [
      { label: "Özel / Villa havuzu", value: "ozel" },
      { label: "Otel / Ticari havuz", value: "ticari" },
    ],
  },
  { key: "length", question: "Havuzunuzun uzunluğu kaç metre?", kind: "number", unit: "m", min: 1, max: 50 },
  { key: "width", question: "Genişliği kaç metre?", kind: "number", unit: "m", min: 1, max: 25 },
  { key: "shallowDepth", question: "En sığ noktasının derinliği kaç metre?", kind: "number", unit: "m", min: 0.3, max: 3 },
  { key: "deepDepth", question: "En derin noktasının derinliği kaç metre?", kind: "number", unit: "m", min: 0.3, max: 5 },
];

function formatAnswer(step: Step, value: string | number) {
  if (step.kind === "choice") {
    return step.options?.find((o) => o.value === value)?.label ?? String(value);
  }
  return `${String(value).replace(".", ",")} ${step.unit ?? ""}`;
}

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

export default function QuoteChat() {
  const [open, setOpen] = useState(false);
  const [answers, setAnswers] = useState<Record<string, string | number>>({});
  const [stepIndex, setStepIndex] = useState(0);
  const [input, setInput] = useState("");
  const [error, setError] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);

  const current = STEPS[stepIndex];
  const done = stepIndex >= STEPS.length;

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

  const volume = done
    ? (Number(answers.length) * Number(answers.width) *
        (Number(answers.shallowDepth) + Number(answers.deepDepth))) / 2
    : 0;

  return (
    <>
      {open && (
        <div className="fixed bottom-24 left-5 z-50 flex h-[560px] max-h-[calc(100vh-8rem)] w-[380px] max-w-[calc(100vw-2.5rem)] flex-col overflow-hidden rounded-2xl border border-line bg-white shadow-2xl">
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

            {STEPS.slice(0, stepIndex).map((step) => (
              <div key={step.key} className="space-y-3">
                <AssistantBubble>{step.question}</AssistantBubble>
                <UserBubble>{formatAnswer(step, answers[step.key])}</UserBubble>
              </div>
            ))}

            {!done && <AssistantBubble>{current.question}</AssistantBubble>}

            {done && (
              <AssistantBubble>
                Havuzunuzun yaklaşık hacmi{" "}
                <strong>
                  {volume.toLocaleString("tr-TR", { maximumFractionDigits: 1 })} m³
                </strong>
                . Malzeme önerileri bir sonraki adımda burada olacak.
              </AssistantBubble>
            )}

            <div ref={bottomRef} />
          </div>

          <div className="border-t border-line p-4">
            {!done && current.kind === "choice" && (
              <div className="flex flex-col gap-2">
                {current.options?.map((option) => (
                  <button type="button" key={option.value} onClick={() => saveAnswer(option.value)}
                    className="rounded-xl border border-line px-4 py-2.5 text-left text-sm text-navy transition-colors hover:border-navy hover:bg-navy hover:text-white"
                  >
                    {option.label}
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
                      placeholder="Örn. 8 veya 1,5"
                      className="w-full rounded-xl border border-line px-4 py-2.5 pr-10 text-sm text-ink outline-none focus:border-navy"
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
        className="fixed bottom-5 left-5 z-50 flex items-center gap-2 rounded-full bg-sun px-5 py-3.5 font-display text-sm font-bold text-white shadow-lg transition-transform hover:scale-105"
      >
        <FaComments className="h-5 w-5" />
        {open ? "Asistanı Gizle" : "Teklif Asistanı"}
      </button>
    </>
  );
}