import { forwardRef, type ReactNode } from "react";
import { motion } from "framer-motion";
import { RichText } from "./RichText";

interface FullscreenSlideProps {
  kicker: string;
  title: string;
  summary: string;
  index: number;
  total: number;
  children: ReactNode;
}

const pad = (value: number) => value.toString().padStart(2, "0");

const FullscreenSlide = forwardRef<HTMLElement, FullscreenSlideProps>(
  ({ kicker, title, summary, index, total, children }, ref) => {
    return (
      <section
        ref={ref}
        className="relative flex min-h-screen snap-start items-stretch px-3 py-3 sm:px-4 sm:py-5 md:px-8 md:py-7"
      >
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute left-[-8%] top-[-15%] h-72 w-72 rounded-full bg-cyan-400/10 blur-3xl md:h-96 md:w-96" />
          <div className="absolute bottom-[-10%] right-[-5%] h-72 w-72 rounded-full bg-violet-500/10 blur-3xl md:h-[28rem] md:w-[28rem]" />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ amount: 0.35, once: true }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="glass-panel grid-line relative flex w-full flex-col overflow-hidden rounded-[1.6rem] p-4 pb-32 sm:rounded-[2rem] sm:p-6 sm:pb-28 md:rounded-[2.5rem] md:p-10 md:pb-24"
        >
          <div className="flex flex-col gap-5 md:flex-row md:items-start md:justify-between">
            <div className="max-w-4xl">
              <div className="eyebrow">{kicker}</div>
              <h2 className="mt-3 max-w-5xl text-2xl font-semibold leading-tight text-white sm:text-3xl md:text-5xl">
                <RichText text={title} />
              </h2>
              <p className="mt-4 max-w-3xl text-sm leading-6 text-slate-300 md:text-base md:leading-7">
                <RichText text={summary} />
              </p>
            </div>
            <div className="flex items-center gap-3 self-start rounded-full border border-white/10 bg-slate-950/60 px-4 py-2 text-xs uppercase tracking-[0.28em] text-slate-400">
              <span>{pad(index + 1)}</span>
              <span className="h-px w-8 bg-white/15" />
              <span>{pad(total)}</span>
            </div>
          </div>

          <div className="mt-8 flex-1">{children}</div>
        </motion.div>
      </section>
    );
  },
);

FullscreenSlide.displayName = "FullscreenSlide";

export default FullscreenSlide;
