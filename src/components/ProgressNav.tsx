import { ChevronLeft, ChevronRight, ChevronUp, ChevronDown } from "lucide-react";
import type { SlideMeta } from "../data/slides";
import { RichText, stripRichText } from "./RichText";

interface ProgressNavProps {
  slides: SlideMeta[];
  activeIndex: number;
  onSelect: (index: number) => void;
  onNext: () => void;
  onPrev: () => void;
}

export function ProgressNav({
  slides,
  activeIndex,
  onSelect,
  onNext,
  onPrev,
}: ProgressNavProps) {
  const activeSlide = slides[activeIndex];

  return (
    <>
      <div className="pointer-events-none fixed right-5 top-1/2 z-50 hidden -translate-y-1/2 lg:block">
        <div className="pointer-events-auto rounded-[2rem] border border-white/10 bg-slate-950/75 p-3 shadow-panel backdrop-blur-xl">
          <div className="flex flex-col items-center gap-2">
            <button
              type="button"
              onClick={onPrev}
              className="rounded-full border border-white/10 bg-white/5 p-2 text-slate-200 transition hover:border-cyan-300/50 hover:text-white"
              aria-label="Предыдущий экран"
            >
              <ChevronUp className="h-4 w-4" />
            </button>
            {slides.map((slide, index) => {
              const isActive = index === activeIndex;
              return (
                <button
                  key={slide.id}
                  type="button"
                  onClick={() => onSelect(index)}
                  className={`group relative h-10 w-10 rounded-full border transition ${
                    isActive
                      ? "border-cyan-300/70 bg-cyan-300/20"
                      : "border-white/10 bg-white/5 hover:border-white/25"
                  }`}
                  aria-label={`Перейти к экрану ${index + 1}: ${stripRichText(slide.title)}`}
                >
                  <span
                    className={`text-[0.65rem] font-medium ${
                      isActive ? "text-white" : "text-slate-400"
                    }`}
                  >
                    {index + 1}
                  </span>
                  <span className="pointer-events-none absolute right-full top-1/2 mr-3 hidden -translate-y-1/2 whitespace-nowrap rounded-full border border-white/10 bg-slate-950/90 px-3 py-1 text-[0.65rem] uppercase tracking-[0.18em] text-slate-300 shadow-panel group-hover:block">
                    <RichText text={slide.kicker} />
                  </span>
                </button>
              );
            })}
            <button
              type="button"
              onClick={onNext}
              className="rounded-full border border-white/10 bg-white/5 p-2 text-slate-200 transition hover:border-cyan-300/50 hover:text-white"
              aria-label="Следующий экран"
            >
              <ChevronDown className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      <div className="pointer-events-none fixed inset-x-0 bottom-0 z-50 px-3 pb-3 sm:px-4 sm:pb-4">
        <div className="pointer-events-auto mx-auto flex max-w-3xl items-center gap-1.5 rounded-[1.4rem] border border-white/10 bg-slate-950/75 p-1.5 shadow-panel backdrop-blur-xl sm:gap-2 sm:rounded-full sm:p-2">
          <button
            type="button"
            onClick={onPrev}
            className="inline-flex shrink-0 items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-3 text-sm font-medium text-slate-200 transition hover:border-cyan-300/40 hover:text-white disabled:cursor-not-allowed disabled:opacity-40 sm:px-4"
            disabled={activeIndex === 0}
          >
            <ChevronLeft className="h-4 w-4" />
            <span>Назад</span>
          </button>

          <button
            type="button"
            onClick={() => onSelect(activeIndex)}
            className="min-w-0 flex-1 rounded-full border border-white/10 bg-white/5 px-3 py-3 text-left sm:px-4"
          >
            <div className="text-[0.65rem] uppercase tracking-[0.22em] text-slate-400">
              {String(activeIndex + 1).padStart(2, "0")} / {String(slides.length).padStart(2, "0")}
            </div>
            <div className="mt-1 text-[0.6rem] uppercase tracking-[0.2em] text-cyan-200">
              <RichText text={activeSlide.kicker} />
            </div>
            <div className="mt-0.5 truncate text-xs font-medium text-white sm:text-sm">
              <RichText text={activeSlide.title} />
            </div>
          </button>

          <button
            type="button"
            onClick={onNext}
            className="inline-flex shrink-0 items-center gap-2 rounded-full border border-cyan-300/30 bg-cyan-300/15 px-3 py-3 text-sm font-medium text-cyan-50 transition hover:border-cyan-200/70 hover:bg-cyan-300/25 disabled:cursor-not-allowed disabled:opacity-40 sm:px-4"
            disabled={activeIndex === slides.length - 1}
          >
            <span>Далее</span>
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </>
  );
}
