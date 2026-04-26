import { Fragment } from "react";
import { motion } from "framer-motion";
import { ArrowDown, ArrowRight } from "lucide-react";
import type { FlowStep, Tone } from "../data/slides";
import { RichText } from "./RichText";

interface RiskFlowProps {
  steps: FlowStep[];
  annotations?: string[];
}

const tones: Record<Tone, string> = {
  cyan: "border-cyan-300/25 bg-cyan-400/10 text-cyan-100",
  violet: "border-violet-300/25 bg-violet-500/10 text-violet-100",
  amber: "border-amber-200/25 bg-amber-300/10 text-amber-100",
};

export function RiskFlow({ steps, annotations }: RiskFlowProps) {
  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-3 xl:flex-row xl:items-stretch">
        {steps.map((step, index) => (
          <Fragment key={`${step.title}-${step.subtitle}`}>
            <motion.div
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ amount: 0.35, once: true }}
              transition={{ duration: 0.35, delay: index * 0.06 }}
              className={`flex-1 rounded-[1.7rem] border p-5 backdrop-blur-xl ${
                tones[step.tone ?? "cyan"]
              }`}
            >
              <div className="text-[0.68rem] uppercase tracking-[0.24em] text-slate-400">
                <RichText text={step.subtitle} />
              </div>
              <div className="mt-3 text-xl font-semibold text-white">
                <RichText text={step.title} />
              </div>
              <p className="mt-3 text-sm leading-6 text-slate-300">
                <RichText text={step.description} />
              </p>
            </motion.div>

            {index < steps.length - 1 ? (
              <div className="flex items-center justify-center text-cyan-200/80">
                <ArrowDown className="h-5 w-5 xl:hidden" />
                <ArrowRight className="hidden h-5 w-5 xl:block" />
              </div>
            ) : null}
          </Fragment>
        ))}
      </div>

      {annotations ? (
        <div className="flex flex-wrap gap-2">
          {annotations.map((annotation) => (
            <div
              key={annotation}
              className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-medium uppercase tracking-[0.18em] text-slate-300"
            >
              <RichText text={annotation} />
            </div>
          ))}
        </div>
      ) : null}
    </div>
  );
}
