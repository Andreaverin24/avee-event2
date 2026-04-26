import { motion } from "framer-motion";
import type { RecoveryStream, Tone } from "../data/slides";
import { RichText } from "./RichText";

interface RecoveryStackProps {
  initialShortfall: number;
  recoveredAmount: number;
  residualGap: number;
  streams: RecoveryStream[];
}

const segmentStyles: Record<Tone, string> = {
  cyan: "bg-cyan-300",
  violet: "bg-violet-400",
  amber: "bg-amber-300",
};

export function RecoveryStack({
  initialShortfall,
  recoveredAmount,
  residualGap,
  streams,
}: RecoveryStackProps) {
  return (
    <div className="space-y-6">
      <div className="rounded-[1.4rem] border border-white/10 bg-slate-950/55 p-4 backdrop-blur-xl sm:rounded-[1.8rem] sm:p-5">
        <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
          <div>
            <div className="text-[0.7rem] uppercase tracking-[0.24em] text-slate-400">
              Ход восстановления
            </div>
            <div className="mt-2 text-xl font-semibold text-white sm:text-2xl">
              Уже найдено или ожидается к возврату {recoveredAmount.toLocaleString()} ETH
            </div>
          </div>
          <div className="text-sm leading-6 text-slate-300">
            Это примерно {Math.round((recoveredAmount / initialShortfall) * 100)}% от
            исходного дефицита в {initialShortfall.toLocaleString()} ETH
          </div>
        </div>

        <div className="mt-5 overflow-hidden rounded-full border border-white/10 bg-slate-900/80">
          <div className="flex h-5">
            {streams.map((stream) => (
              <motion.div
                key={stream.label}
                initial={{ width: 0 }}
                whileInView={{
                  width: `${(stream.amount / initialShortfall) * 100}%`,
                }}
                viewport={{ amount: 0.4, once: true }}
                transition={{ duration: 0.5 }}
                className={segmentStyles[stream.tone]}
                title={`${stream.label}: ${stream.display}`}
              />
            ))}
            <motion.div
              initial={{ width: 0 }}
              whileInView={{ width: `${(residualGap / initialShortfall) * 100}%` }}
              viewport={{ amount: 0.4, once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="bg-slate-700"
              title={`Остаточный дефицит: ${residualGap.toLocaleString()} ETH`}
            />
          </div>
        </div>
      </div>

      <div className="grid gap-4 xl:grid-cols-2">
        {streams.map((stream) => (
          <div
            key={stream.label}
            className="rounded-[1.4rem] border border-white/10 bg-slate-950/55 p-4 backdrop-blur-xl sm:rounded-[1.7rem] sm:p-5"
          >
            <div className="text-[0.68rem] uppercase tracking-[0.24em] text-slate-400">
              <RichText text={stream.label} />
            </div>
            <div className="mt-3 text-xl font-semibold text-white sm:text-2xl">
              <RichText text={stream.display} />
            </div>
            <p className="mt-3 text-sm leading-6 text-slate-300">
              <RichText text={stream.note} />
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
