import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

interface TermTooltipProps {
  term: string;
  explanation: string;
}

interface TooltipPosition {
  left: number;
  top: number;
  placement: "top" | "bottom";
  ready: boolean;
}

const VIEWPORT_MARGIN = 16;
const TOOLTIP_GAP = 12;

export function TermTooltip({ term, explanation }: TermTooltipProps) {
  const triggerRef = useRef<HTMLSpanElement | null>(null);
  const tooltipRef = useRef<HTMLSpanElement | null>(null);
  const [open, setOpen] = useState(false);
  const [position, setPosition] = useState<TooltipPosition>({
    left: 0,
    top: 0,
    placement: "top",
    ready: false,
  });

  const updatePosition = useCallback(() => {
    const trigger = triggerRef.current;
    const tooltip = tooltipRef.current;

    if (!trigger || !tooltip) {
      return;
    }

    const triggerRect = trigger.getBoundingClientRect();
    const tooltipRect = tooltip.getBoundingClientRect();

    const halfWidth = tooltipRect.width / 2;
    const centeredLeft = triggerRect.left + triggerRect.width / 2;
    const left = Math.min(
      window.innerWidth - VIEWPORT_MARGIN - halfWidth,
      Math.max(VIEWPORT_MARGIN + halfWidth, centeredLeft),
    );

    const canPlaceTop = triggerRect.top >= tooltipRect.height + TOOLTIP_GAP + VIEWPORT_MARGIN;
    const placement = canPlaceTop ? "top" : "bottom";
    const top = canPlaceTop
      ? triggerRect.top - TOOLTIP_GAP
      : triggerRect.bottom + TOOLTIP_GAP;

    setPosition({
      left,
      top,
      placement,
      ready: true,
    });
  }, []);

  useEffect(() => {
    if (!open) {
      setPosition((current) => ({ ...current, ready: false }));
      return;
    }

    const frame = window.requestAnimationFrame(updatePosition);
    window.addEventListener("resize", updatePosition);
    window.addEventListener("scroll", updatePosition, true);

    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener("resize", updatePosition);
      window.removeEventListener("scroll", updatePosition, true);
    };
  }, [open, updatePosition]);

  return (
    <>
      <span className="inline-flex">
        <span
          ref={triggerRef}
          tabIndex={0}
          aria-label={`${term}: ${explanation}`}
          onMouseEnter={() => setOpen(true)}
          onMouseLeave={() => setOpen(false)}
          onFocus={() => setOpen(true)}
          onBlur={() => setOpen(false)}
          onKeyDown={(event) => {
            if (event.key === "Escape") {
              setOpen(false);
            }
          }}
          className="cursor-help rounded px-0.5 text-cyan-100 underline decoration-dotted underline-offset-4 transition hover:text-white focus:outline-none focus:ring-2 focus:ring-cyan-300/40"
        >
          {term}
        </span>
      </span>

      {open && typeof document !== "undefined"
        ? createPortal(
            <span
              ref={tooltipRef}
              role="tooltip"
              style={{
                left: position.left,
                top: position.top,
                transform:
                  position.placement === "top"
                    ? "translate(-50%, -100%)"
                    : "translate(-50%, 0)",
                opacity: position.ready ? 1 : 0,
              }}
              className="pointer-events-none fixed z-[120] w-[20rem] max-w-[calc(100vw-2rem)] rounded-2xl border border-cyan-300/20 bg-slate-950/95 px-4 py-3 text-left text-[0.78rem] leading-6 normal-case tracking-normal text-slate-200 shadow-panel backdrop-blur-xl transition-opacity md:w-[26rem]"
            >
              {explanation}
            </span>,
            document.body,
          )
        : null}
    </>
  );
}
