import { motion } from "framer-motion";
import type { TimelineEvent, Tone } from "../data/slides";
import { RichText } from "./RichText";

interface TimelineProps {
  events: TimelineEvent[];
}

const dotStyles: Record<Tone, string> = {
  cyan: "bg-cyan-300 shadow-[0_0_24px_rgba(103,232,249,0.45)]",
  violet: "bg-violet-300 shadow-[0_0_24px_rgba(196,181,253,0.45)]",
  amber: "bg-amber-300 shadow-[0_0_24px_rgba(253,230,138,0.4)]",
};

export function Timeline({ events }: TimelineProps) {
  return (
    <div className="relative max-w-5xl">
      <div className="absolute left-[1rem] top-3 h-[calc(100%-1.5rem)] w-px bg-gradient-to-b from-cyan-300/60 via-violet-300/20 to-transparent" />
      <div className="space-y-4">
        {events.map((event, index) => (
          <motion.div
            key={`${event.time}-${event.title}`}
            initial={{ opacity: 0, x: 24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ amount: 0.3, once: true }}
            transition={{ duration: 0.35, delay: index * 0.05 }}
            className="relative pl-10 md:pl-14"
          >
            <div
              className={`absolute left-0 top-6 h-4 w-4 rounded-full ${
                dotStyles[event.tone ?? "cyan"]
              }`}
            />
            <div className="rounded-[1.8rem] border border-white/10 bg-slate-950/60 p-5 shadow-panel backdrop-blur-xl">
              <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                <div className="text-sm font-medium uppercase tracking-[0.18em] text-slate-400">
                  {event.time}
                </div>
                {event.tag ? (
                  <div className="inline-flex self-start rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[0.65rem] uppercase tracking-[0.2em] text-slate-300">
                    <RichText text={event.tag} />
                  </div>
                ) : null}
              </div>
              <div className="mt-3 text-xl font-semibold text-white">
                <RichText text={event.title} />
              </div>
              <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-300">
                <RichText text={event.description} />
              </p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
