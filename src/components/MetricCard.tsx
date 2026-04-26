import { useState, type ReactNode } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown, type LucideIcon } from "lucide-react";
import type { Tone } from "../data/slides";
import { RichText } from "./RichText";

interface MetricCardProps {
  label: string;
  value: string;
  note: string;
  detail?: string;
  tone?: Tone;
  icon?: LucideIcon;
  footer?: ReactNode;
}

const toneBorders: Record<Tone, string> = {
  cyan: "border-cyan-300/25",
  violet: "border-violet-300/25",
  amber: "border-amber-200/20",
};

const toneOverlays: Record<Tone, string> = {
  cyan: "from-cyan-400/30 via-cyan-400/10 to-transparent",
  violet: "from-violet-500/30 via-violet-500/10 to-transparent",
  amber: "from-amber-400/25 via-amber-300/10 to-transparent",
};

export function MetricCard({
  label,
  value,
  note,
  detail,
  tone = "cyan",
  icon: Icon,
  footer,
}: MetricCardProps) {
  const [open, setOpen] = useState(false);

  return (
    <div
      className={`relative overflow-hidden rounded-3xl border bg-slate-950/55 p-5 shadow-panel backdrop-blur-xl ${toneBorders[tone]}`}
    >
      <div
        className={`pointer-events-none absolute inset-0 bg-gradient-to-br ${toneOverlays[tone]}`}
      />
      <div className="relative">
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="text-[0.7rem] font-medium uppercase tracking-[0.24em] text-slate-400">
              <RichText text={label} />
            </div>
            <div className="mt-3 text-2xl font-semibold leading-tight text-white md:text-3xl">
              <RichText text={value} />
            </div>
          </div>
          {Icon ? (
            <div className="rounded-2xl border border-white/10 bg-white/5 p-2.5 text-slate-200">
              <Icon className="h-5 w-5" />
            </div>
          ) : null}
        </div>

        <p className="mt-4 text-sm leading-6 text-slate-300">
          <RichText text={note} />
        </p>

        {footer ? <div className="mt-4">{footer}</div> : null}

        {detail ? (
          <div className="mt-5">
            <button
              type="button"
              onClick={() => setOpen((current) => !current)}
              className="inline-flex items-center gap-2 text-xs font-medium uppercase tracking-[0.22em] text-cyan-200 transition hover:text-white"
            >
              <span>{open ? "Скрыть пояснение" : "Показать пояснение"}</span>
              <ChevronDown className={`h-4 w-4 transition ${open ? "rotate-180" : ""}`} />
            </button>
            <AnimatePresence initial={false}>
              {open ? (
                <motion.p
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="overflow-hidden pt-3 text-sm leading-6 text-slate-400"
                >
                  <RichText text={detail} />
                </motion.p>
              ) : null}
            </AnimatePresence>
          </div>
        ) : null}
      </div>
    </div>
  );
}
