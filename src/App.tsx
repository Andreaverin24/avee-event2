import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  AlertTriangle,
  ArrowDown,
  Coins,
  Droplets,
  Gauge,
  Landmark,
  Layers3,
  Lock,
  Network,
  RefreshCw,
  Scale,
  ShieldCheck,
  ShieldAlert,
  TrendingDown,
  Users,
  Wallet,
} from "lucide-react";
import FullscreenSlide from "./components/FullscreenSlide";
import { MetricCard } from "./components/MetricCard";
import { ProgressNav } from "./components/ProgressNav";
import { RecoveryStack } from "./components/RecoveryStack";
import { RichText } from "./components/RichText";
import { RiskFlow } from "./components/RiskFlow";
import { Timeline } from "./components/Timeline";
import {
  aaveFlow,
  aaveMetrics,
  bridgeFlow,
  coalitionMembers,
  comparisonPoints,
  contributions,
  disputedItems,
  headlineMetrics,
  heroChain,
  liquidityPoints,
  mechanicsMetrics,
  outflowNotes,
  overviewBullets,
  pictureMetrics,
  recoveryMetrics,
  recoveryStreams,
  scenarioCards,
  slides,
  timeline18,
  timeline21,
  timeline1920,
  tvlSeries,
  type ScenarioCard,
} from "./data/slides";

const initialShortfall = 163183;
const recoveredAmount = 87955;
const residualGap = 75081;
const chartWidth = 720;
const chartHeight = 320;
const chartMargin = { top: 24, right: 20, bottom: 48, left: 52 };
const chartMaxValue = 28;

const toChartX = (index: number) => {
  const innerWidth = chartWidth - chartMargin.left - chartMargin.right;
  const step = innerWidth / (tvlSeries.length - 1);
  return chartMargin.left + step * index;
};

const toChartY = (value: number) => {
  const innerHeight = chartHeight - chartMargin.top - chartMargin.bottom;
  return chartMargin.top + innerHeight - (value / chartMaxValue) * innerHeight;
};

const buildLinePath = (points: Array<{ x: number; y: number }>) =>
  points.map((point, index) => `${index === 0 ? "M" : "L"} ${point.x} ${point.y}`).join(" ");

const buildAreaPath = (points: Array<{ x: number; y: number }>) => {
  const linePath = buildLinePath(points);
  const bottom = chartHeight - chartMargin.bottom;
  const first = points[0];
  const last = points[points.length - 1];
  return `${linePath} L ${last.x} ${bottom} L ${first.x} ${bottom} Z`;
};

function App() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const sectionRefs = useRef<Array<HTMLElement | null>>([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [selectedScenario, setSelectedScenario] = useState<ScenarioCard["id"]>("socialized");
  const [poolMode, setPoolMode] = useState<"aave" | "morpho">("aave");
  const [hoveredChartIndex, setHoveredChartIndex] = useState<number>(2);

  const scrollToIndex = (index: number) => {
    const clampedIndex = Math.max(0, Math.min(index, slides.length - 1));
    const target = sectionRefs.current[clampedIndex];
    if (!target) {
      return;
    }

    target.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  useEffect(() => {
    const root = containerRef.current;
    if (!root) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const visibleEntry = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

        if (!visibleEntry) {
          return;
        }

        const nextIndex = Number(visibleEntry.target.getAttribute("data-index"));
        if (!Number.isNaN(nextIndex)) {
          setActiveIndex(nextIndex);
        }
      },
      {
        root,
        threshold: [0.35, 0.55, 0.75],
      },
    );

    sectionRefs.current.forEach((section) => {
      if (section) {
        observer.observe(section);
      }
    });

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (["ArrowDown", "ArrowUp", "Space", "PageDown", "PageUp"].includes(event.code)) {
        event.preventDefault();
      }

      if (event.code === "ArrowDown" || event.code === "PageDown") {
        scrollToIndex(activeIndex + 1);
      }

      if (event.code === "ArrowUp" || event.code === "PageUp") {
        scrollToIndex(activeIndex - 1);
      }

      if (event.code === "Space") {
        scrollToIndex(activeIndex + 1);
      }
    };

    window.addEventListener("keydown", handleKeyDown, { passive: false });
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [activeIndex]);

  const activeScenario =
    scenarioCards.find((scenario) => scenario.id === selectedScenario) ?? scenarioCards[0];
  const chartPoints = tvlSeries.map((point, index) => ({
    ...point,
    x: toChartX(index),
    tvlY: toChartY(point.tvl),
    outflowY: toChartY(point.outflow),
  }));
  const hoveredChartPoint = chartPoints[hoveredChartIndex];

  return (
    <div className="relative h-screen bg-ink text-slate-100">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(56,189,248,0.14),transparent_30%),radial-gradient(circle_at_bottom_right,rgba(139,92,246,0.12),transparent_30%)]" />

      <div
        ref={containerRef}
        className="relative h-screen snap-y snap-mandatory overflow-y-auto overflow-x-hidden scroll-smooth"
      >
        {slides.map((slide, index) => (
          <FullscreenSlide
            key={slide.id}
            ref={(node) => {
              sectionRefs.current[index] = node;
              if (node) {
                node.dataset.index = String(index);
              }
            }}
            index={index}
            total={slides.length}
            kicker={slide.kicker}
            title={slide.title}
            summary={slide.summary}
          >
            {slide.id === "hero" ? (
              <div className="grid gap-8 xl:grid-cols-[1.2fr_0.8fr]">
                <div className="flex flex-col justify-between gap-8">
                  <div className="space-y-8">
                    <div className="flex flex-wrap items-center gap-3">
                      {heroChain.map((item, chainIndex) => (
                        <div key={item} className="flex items-center gap-3">
                          <div className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-medium uppercase tracking-[0.22em] text-slate-200 md:px-5 md:py-3">
                            <span className="mr-2 text-cyan-200">{chainIndex + 1}.</span>
                            {item}
                          </div>
                          {chainIndex < heroChain.length - 1 ? (
                            <motion.div
                              animate={{ x: [0, 5, 0] }}
                              transition={{ duration: 1.6, repeat: Infinity }}
                              className="text-cyan-200"
                            >
                              <ArrowDown className="h-4 w-4 rotate-[-90deg] md:h-5 md:w-5" />
                            </motion.div>
                          ) : null}
                        </div>
                      ))}
                    </div>

                    <div className="grid gap-4 md:grid-cols-3">
                      {headlineMetrics.map((metric, metricIndex) => (
                        <MetricCard
                          key={metric.label}
                          {...metric}
                          icon={[Network, Wallet, Gauge][metricIndex]}
                        />
                      ))}
                    </div>
                  </div>

                  <div className="inline-flex items-center gap-3 self-start rounded-full border border-cyan-300/20 bg-cyan-300/10 px-4 py-3 text-xs uppercase tracking-[0.24em] text-cyan-100">
                    <ShieldCheck className="h-4 w-4" />
                    <span>
                      Источник: "Инцидент rsETH, Aave и коалиция DeFi United.pdf". Состояние фактов на 25 апреля 2026.
                    </span>
                  </div>
                </div>

                <div className="grid gap-4 self-stretch">
                  <MetricCard
                    label="Технический слой"
                    value="Сбой вне Aave"
                    note="Проблема возникла в bridge / DVN-маршруте, а не в самих lending-контрактах Aave."
                    detail="Именно поэтому правильная рамка анализа здесь: внешний технический отказ, внутренний экономический ущерб."
                    tone="cyan"
                    icon={ShieldAlert}
                  />
                  <MetricCard
                    label="Экономический слой"
                    value="Удар внутри общих пулов"
                    note="После попадания [[unbacked|необеспеченного]] rsETH в Aave кризис проявился как отток ликвидности из [[reserve|общего резерва]], риск [[bad-debt|безнадежного долга]] и дефицит WETH."
                    detail="То есть проблема быстро перестала быть вопросом только одного токена и превратилась в стресс для всего общего пула."
                    tone="violet"
                    icon={Droplets}
                  />
                  <MetricCard
                    label="Социальный слой"
                    value="Восстановление через координацию"
                    note="Для стабилизации потребовались экстренные заморозки, решения управления, кредиты, публичные обещания помощи и межпротокольное взаимодействие."
                    detail="Ключевой разрыв был между экономически возвратимыми средствами и ликвидностью, которая нужна немедленно."
                    tone="amber"
                    icon={Users}
                  />
                </div>
              </div>
            ) : null}

            {slide.id === "picture" ? (
              <div className="grid gap-8 xl:grid-cols-[0.9fr_1.1fr]">
                <div className="space-y-4">
                  <div className="rounded-[1.9rem] border border-cyan-300/20 bg-cyan-300/10 p-5">
                    <div className="flex items-center gap-3 text-cyan-100">
                      <ShieldCheck className="h-5 w-5" />
                      <span className="text-xs uppercase tracking-[0.25em]">Ключевой тезис</span>
                    </div>
                    <p className="mt-4 text-lg leading-8 text-white md:text-2xl">
                      Это был не <span className="text-cyan-200">взлом</span> Aave. Сначала ошибка произошла во внешнем маршруте, а потом через Aave из системы вывели настоящие деньги.
                    </p>
                  </div>

                  <div className="rounded-[1.9rem] border border-white/10 bg-slate-950/55 p-5">
                    <div className="text-[0.7rem] uppercase tracking-[0.22em] text-slate-400">
                      Что произошло по сути
                    </div>
                    <ul className="mt-4 space-y-3 text-sm leading-7 text-slate-300">
                      {overviewBullets.map((bullet) => (
                        <li key={bullet} className="flex gap-3">
                          <span className="mt-2 h-2 w-2 rounded-full bg-cyan-300" />
                          <span>
                            <RichText text={bullet} />
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="space-y-5">
                  <RiskFlow
                    steps={[
                      bridgeFlow[1],
                      {
                        title: "[[unbacked|Unbacked]] rsETH",
                        subtitle: "Проблема с качеством залога",
                        description:
                          "Токен выглядел пригодным для займа, хотя нормальное обеспечение за ним уже было нарушено.",
                        tone: "amber",
                      },
                      aaveFlow[1],
                      aaveFlow[2],
                    ]}
                    annotations={[
                      "Upstream bridge-сбой",
                      "Этот залог приняли дальше по цепочке",
                      "Реальный WETH уходит из общего резерва",
                    ]}
                  />
                  <div className="grid gap-4 md:grid-cols-3">
                    {pictureMetrics.map((metric, metricIndex) => (
                      <MetricCard
                        key={metric.label}
                        {...metric}
                        icon={[ShieldCheck, Network, Droplets][metricIndex]}
                      />
                    ))}
                  </div>
                </div>
              </div>
            ) : null}

            {slide.id === "mechanics" ? (
              <div className="grid gap-6">
                <RiskFlow
                  steps={bridgeFlow}
                  annotations={[
                    "Маршрут Unichain -> Ethereum",
                    "[[single-DVN|1-of-1]] DVN",
                    "[[fake-packet|fake incoming packet]]",
                    "[[release|release]] без [[burn|burn]]",
                  ]}
                />
                <div className="grid gap-4 lg:grid-cols-3">
                  {mechanicsMetrics.map((metric, metricIndex) => (
                    <MetricCard
                      key={metric.label}
                      {...metric}
                      icon={[Lock, AlertTriangle, Landmark][metricIndex]}
                    />
                  ))}
                </div>
              </div>
            ) : null}

            {slide.id === "aave-impact" ? (
              <div className="grid gap-8 xl:grid-cols-[1.1fr_0.9fr]">
                <div className="space-y-5">
                  <RiskFlow
                    steps={aaveFlow}
                    annotations={[
                      "89,567 rsETH deposited",
                      "82,650 WETH borrowed",
                      "821 wstETH borrowed",
                      "Дренаж WETH-ликвидности",
                    ]}
                  />
                  <div className="rounded-[1.8rem] border border-white/10 bg-slate-950/55 p-5">
                    <div className="text-[0.7rem] uppercase tracking-[0.22em] text-slate-400">
                      Почему не dump, а borrow
                    </div>
                    <p className="mt-4 max-w-3xl text-base leading-8 text-slate-200">
                      <RichText text="Если бы атакующий просто начал массово продавать rsETH, цена быстро бы упала. Гораздо выгоднее было внести токен как [[collateral|залог]] и занять под него настоящий WETH." />
                    </p>
                  </div>
                </div>

                <div className="grid gap-4 md:grid-cols-3 xl:grid-cols-1">
                  {aaveMetrics.map((metric, metricIndex) => (
                    <MetricCard
                      key={metric.label}
                      {...metric}
                      icon={[Coins, Wallet, Layers3][metricIndex]}
                    />
                  ))}
                </div>
              </div>
            ) : null}

            {slide.id === "timeline-18" ? <Timeline events={timeline18} /> : null}

            {slide.id === "timeline-19-20" ? <Timeline events={timeline1920} /> : null}

            {slide.id === "timeline-21-plus" ? <Timeline events={timeline21} /> : null}

            {slide.id === "shared-pool" ? (
              <div className="grid gap-8 xl:grid-cols-[0.95fr_1.05fr]">
                <div className="space-y-5">
                  <div className="inline-flex rounded-full border border-white/10 bg-slate-950/60 p-1">
                    <button
                      type="button"
                      onClick={() => setPoolMode("aave")}
                      className={`rounded-full px-4 py-2 text-xs font-medium uppercase tracking-[0.2em] transition ${
                        poolMode === "aave"
                          ? "bg-cyan-300/20 text-cyan-50"
                          : "text-slate-400 hover:text-white"
                      }`}
                    >
                      Aave: общий пул
                    </button>
                    <button
                      type="button"
                      onClick={() => setPoolMode("morpho")}
                      className={`rounded-full px-4 py-2 text-xs font-medium uppercase tracking-[0.2em] transition ${
                        poolMode === "morpho"
                          ? "bg-cyan-300/20 text-cyan-50"
                          : "text-slate-400 hover:text-white"
                      }`}
                    >
                      Morpho isolated market
                    </button>
                  </div>

                  <AnimatePresence mode="wait">
                    {poolMode === "aave" ? (
                      <motion.div
                        key="aave"
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -12 }}
                        className="rounded-[2rem] border border-white/10 bg-slate-950/55 p-6"
                      >
                        <div className="relative mx-auto flex max-w-xl items-center justify-center py-10">
                          <div className="absolute inset-x-0 top-1/2 h-px -translate-y-1/2 bg-gradient-to-r from-transparent via-cyan-300/40 to-transparent" />
                          <div className="absolute inset-y-0 left-1/2 w-px -translate-x-1/2 bg-gradient-to-b from-transparent via-violet-300/30 to-transparent" />
                          <div className="absolute left-6 top-8 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-slate-200">
                            stETH
                          </div>
                          <div className="absolute right-6 top-8 rounded-2xl border border-red-300/30 bg-red-400/10 px-4 py-3 text-sm text-red-100">
                            toxic rsETH
                          </div>
                          <div className="absolute bottom-8 left-10 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-slate-200">
                            cbETH
                          </div>
                          <div className="absolute bottom-8 right-10 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-slate-200">
                            other LRTs
                          </div>
                          <div className="relative z-10 flex h-44 w-44 items-center justify-center rounded-full border border-cyan-300/30 bg-cyan-300/10 text-center">
                            <div>
                              <div className="text-[0.7rem] uppercase tracking-[0.24em] text-cyan-100">
                        Общий резерв
                              </div>
                              <div className="mt-3 text-3xl font-semibold text-white">WETH</div>
                            </div>
                          </div>
                        </div>
                        <p className="text-sm leading-7 text-slate-300">
                          В Aave все сидят на одном общем запасе ликвидности. Поэтому один плохой залог может ударить даже по тем, кто напрямую с rsETH никак не связан.
                        </p>
                      </motion.div>
                    ) : (
                      <motion.div
                        key="morpho"
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -12 }}
                        className="grid gap-4 md:grid-cols-3"
                      >
                        {[
                          "rsETH / WETH market",
                          "wstETH / WETH market",
                          "cbETH / WETH market",
                        ].map((market) => (
                          <div
                            key={market}
                            className={`rounded-[1.8rem] border p-5 ${
                              market === "rsETH / WETH market"
                                ? "border-amber-300/30 bg-amber-300/10"
                                : "border-white/10 bg-slate-950/55"
                            }`}
                          >
                            <div className="text-[0.68rem] uppercase tracking-[0.22em] text-slate-400">
                              Isolated box
                            </div>
                            <div className="mt-3 text-xl font-semibold text-white">{market}</div>
                            <p className="mt-3 text-sm leading-6 text-slate-300">
                              {market === "rsETH / WETH market"
                                ? "Только этот рынок несет токсичный шок."
                                : "Остальные рынки не наследуют потери rsETH автоматически."}
                            </p>
                          </div>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                <div className="grid gap-4">
                  {comparisonPoints.map((point, pointIndex) => (
                    <MetricCard
                      key={point.title}
                      label={point.title}
                      value={
                        pointIndex === 0 ? "Распространение риска по системе" : "Локальный blast radius"
                      }
                      note={point.bullets[0]}
                      detail={point.bullets.slice(1).join(" ")}
                      tone={point.tone}
                      icon={pointIndex === 0 ? Droplets : Layers3}
                    />
                  ))}
                </div>
              </div>
            ) : null}

            {slide.id === "bad-debt" ? (
              <div className="grid gap-8 xl:grid-cols-[0.9fr_1.1fr]">
                <div className="grid gap-4">
                  {scenarioCards.map((scenario) => {
                    const active = scenario.id === selectedScenario;

                    return (
                      <button
                        key={scenario.id}
                        type="button"
                        onClick={() => setSelectedScenario(scenario.id)}
                        className={`rounded-[1.8rem] border p-5 text-left transition ${
                          active
                            ? "border-cyan-300/35 bg-cyan-300/12 shadow-panel"
                            : "border-white/10 bg-slate-950/55 hover:border-white/20"
                        }`}
                      >
                        <div className="text-[0.68rem] uppercase tracking-[0.22em] text-slate-400">
                          Нажмите для разбора
                        </div>
                        <div className="mt-3 text-xl font-semibold text-white">
                          <RichText text={scenario.title} />
                        </div>
                        <div className="mt-2 text-2xl font-semibold text-cyan-100">
                          <RichText text={scenario.estimate} />
                        </div>
                        <p className="mt-3 text-sm leading-6 text-slate-300">
                          <RichText text={scenario.summary} />
                        </p>
                      </button>
                    );
                  })}
                </div>

                <div className="rounded-[2rem] border border-white/10 bg-slate-950/60 p-6">
                  <div className="flex items-center gap-3 text-cyan-100">
                    <Scale className="h-5 w-5" />
                    <span className="text-xs uppercase tracking-[0.24em]">Активный сценарий</span>
                  </div>
                  <h3 className="mt-4 text-3xl font-semibold text-white">
                    <RichText text={activeScenario.estimate} />
                  </h3>
                  <p className="mt-4 max-w-2xl text-base leading-8 text-slate-200">
                    <RichText text={activeScenario.summary} />
                  </p>
                  <div className="mt-6 grid gap-4 md:grid-cols-3">
                    {activeScenario.bullets.map((bullet) => (
                      <div
                        key={bullet}
                        className="rounded-[1.6rem] border border-white/10 bg-white/5 p-4 text-sm leading-6 text-slate-300"
                      >
                        <RichText text={bullet} />
                      </div>
                    ))}
                  </div>
                  <div className="mt-6 rounded-[1.6rem] border border-amber-300/20 bg-amber-300/10 p-4 text-sm leading-6 text-amber-50">
                    <RichText text="Главная мысль: итоговый ущерб зависел не только от самой атаки, но и от того, на кого потом решат повесить убыток." />
                  </div>
                </div>
              </div>
            ) : null}

            {slide.id === "liquidity-crunch" ? (
              <div className="grid gap-8 xl:grid-cols-[0.78fr_1.22fr]">
                <div className="flex flex-col gap-5">
                  <div className="glass-panel-inner flex flex-col items-center justify-center rounded-[2rem] border border-white/10 bg-slate-950/55 p-8 text-center">
                    <div className="metric-ring flex h-52 w-52 items-center justify-center rounded-full sm:h-64 sm:w-64">
                      <div className="rounded-full border border-white/10 bg-slate-950/90 px-8 py-8 sm:px-10 sm:py-10">
                        <div className="text-[0.68rem] uppercase tracking-[0.24em] text-slate-400">
                          <RichText text="WETH: [[utilization|загрузка пула]]" />
                        </div>
                        <div className="mt-3 text-4xl font-semibold text-white sm:text-5xl">100%</div>
                      </div>
                    </div>
                    <p className="mt-6 max-w-md text-sm leading-7 text-slate-300">
                      Когда резервы уперлись в потолок, принудительное закрытие позиций уже не означало быстрый доступ к WETH, который нужен для стабилизации системы.
                    </p>
                  </div>
                </div>
                <div className="grid gap-4 md:grid-cols-2">
                  {liquidityPoints.map((metric, metricIndex) => (
                    <MetricCard
                      key={metric.label}
                      {...metric}
                      icon={[Gauge, Wallet, RefreshCw, AlertTriangle][metricIndex]}
                    />
                  ))}
                </div>
              </div>
            ) : null}

            {slide.id === "outflow" ? (
              <div className="grid gap-8 xl:grid-cols-[1.15fr_0.85fr]">
                <div className="rounded-[2rem] border border-white/10 bg-slate-950/60 p-5">
                  <div className="text-[0.68rem] uppercase tracking-[0.24em] text-slate-400">
                    TVL против оценок оттока средств
                  </div>
                  <div className="relative mt-6 overflow-hidden rounded-[1.8rem] border border-white/10 bg-slate-950/70 p-4">
                    <div className="absolute right-4 top-4 z-10 rounded-2xl border border-white/10 bg-slate-950/90 px-4 py-3 text-xs">
                      <div className="uppercase tracking-[0.22em] text-slate-400">
                        {hoveredChartPoint.window}
                      </div>
                      <div className="mt-2 text-sm text-slate-200">
                        Aave TVL:{" "}
                        <span className="font-semibold text-white">${hoveredChartPoint.tvl}B</span>
                      </div>
                      <div className="mt-1 text-sm text-slate-200">
                        Оценка оттока средств:{" "}
                        <span className="font-semibold text-white">${hoveredChartPoint.outflow}B</span>
                      </div>
                    </div>

                    <svg
                      viewBox={`0 0 ${chartWidth} ${chartHeight}`}
                      className="h-64 w-full sm:h-[20rem]"
                      role="img"
                      aria-label="График TVL и оценки оттока средств из Aave во время инцидента rsETH"
                    >
                      <defs>
                        <linearGradient id="tvlAreaFill" x1="0" x2="0" y1="0" y2="1">
                          <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.42" />
                          <stop offset="100%" stopColor="#38bdf8" stopOpacity="0.04" />
                        </linearGradient>
                      </defs>

                      {[0, 7, 14, 21, 28].map((value) => {
                        const y = toChartY(value);
                        return (
                          <g key={value}>
                            <line
                              x1={chartMargin.left}
                              x2={chartWidth - chartMargin.right}
                              y1={y}
                              y2={y}
                              stroke="rgba(148,163,184,0.16)"
                              strokeDasharray="5 6"
                            />
                            <text
                              x={12}
                              y={y + 4}
                              fill="#94a3b8"
                              fontSize="11"
                              letterSpacing="0.14em"
                            >
                              ${value}B
                            </text>
                          </g>
                        );
                      })}

                      <path
                        d={buildAreaPath(chartPoints.map((point) => ({ x: point.x, y: point.tvlY })))}
                        fill="url(#tvlAreaFill)"
                      />
                      <path
                        d={buildLinePath(chartPoints.map((point) => ({ x: point.x, y: point.tvlY })))}
                        fill="none"
                        stroke="#38bdf8"
                        strokeWidth="4"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d={buildLinePath(chartPoints.map((point) => ({ x: point.x, y: point.outflowY })))}
                        fill="none"
                        stroke="#8b5cf6"
                        strokeWidth="3"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeDasharray="8 7"
                      />

                      {chartPoints.map((point, chartIndex) => {
                        const isActive = chartIndex === hoveredChartIndex;
                        return (
                          <g key={point.window}>
                            <line
                              x1={point.x}
                              x2={point.x}
                              y1={chartMargin.top}
                              y2={chartHeight - chartMargin.bottom}
                              stroke={isActive ? "rgba(255,255,255,0.18)" : "transparent"}
                            />
                            <circle
                              cx={point.x}
                              cy={point.tvlY}
                              r={isActive ? 7 : 5}
                              fill="#38bdf8"
                              stroke="rgba(15,23,42,0.95)"
                              strokeWidth="3"
                            />
                            <circle
                              cx={point.x}
                              cy={point.outflowY}
                              r={isActive ? 7 : 5}
                              fill="#8b5cf6"
                              stroke="rgba(15,23,42,0.95)"
                              strokeWidth="3"
                            />
                            <rect
                              x={point.x - 48}
                              y={chartMargin.top}
                              width="96"
                              height={chartHeight - chartMargin.top - chartMargin.bottom}
                              fill="transparent"
                              onMouseEnter={() => setHoveredChartIndex(chartIndex)}
                              onFocus={() => setHoveredChartIndex(chartIndex)}
                            />
                            <text
                              x={point.x}
                              y={chartHeight - 16}
                              textAnchor="middle"
                              fill={isActive ? "#e2e8f0" : "#94a3b8"}
                              fontSize="12"
                            >
                              {point.window}
                            </text>
                          </g>
                        );
                      })}
                    </svg>

                    <div className="mt-4 flex flex-wrap gap-4 text-xs uppercase tracking-[0.2em] text-slate-300">
                      <div className="inline-flex items-center gap-2">
                        <span className="h-2.5 w-2.5 rounded-full bg-cyan-300" />
                        <span>Aave TVL</span>
                      </div>
                      <div className="inline-flex items-center gap-2">
                        <span className="h-2.5 w-2.5 rounded-full bg-violet-400" />
                        <span>Отток средств</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="grid gap-4">
                  {outflowNotes.map((metric, metricIndex) => (
                    <MetricCard
                      key={metric.label}
                      {...metric}
                      icon={[TrendingDown, Wallet, Scale][metricIndex]}
                    />
                  ))}
                </div>
              </div>
            ) : null}

            {slide.id === "recovery" ? (
              <div className="grid gap-8 xl:grid-cols-[1.12fr_0.88fr]">
                <RecoveryStack
                  initialShortfall={initialShortfall}
                  recoveredAmount={recoveredAmount}
                  residualGap={residualGap}
                  streams={recoveryStreams}
                />
                <div className="grid gap-4">
                  {recoveryMetrics.map((metric, metricIndex) => (
                    <MetricCard
                      key={metric.label}
                      {...metric}
                      icon={[AlertTriangle, ShieldCheck, Coins][metricIndex]}
                    />
                  ))}
                  <div className="rounded-[1.8rem] border border-cyan-300/20 bg-cyan-300/10 p-5">
                    <div className="text-[0.68rem] uppercase tracking-[0.22em] text-cyan-100">
                      <RichText text="Почему [[bridge-loan|временный кредит]] был важен" />
                    </div>
                    <p className="mt-3 text-sm leading-7 text-slate-100">
                      Было понятно, что часть денег со временем удастся вернуть. Но проблема была срочной: ликвидность нужна была сразу, поэтому рынку пришлось искать живые деньги уже сейчас, а не ждать будущих возвратов.
                    </p>
                  </div>
                </div>
              </div>
            ) : null}

            {slide.id === "defi-united" ? (
              <div className="grid gap-8 xl:grid-cols-[0.9fr_1.1fr]">
                <div className="rounded-[2rem] border border-white/10 bg-slate-950/60 p-6">
                  <div className="flex items-center gap-3 text-cyan-100">
                    <Users className="h-5 w-5" />
                    <span className="text-xs uppercase tracking-[0.24em]">Участники коалиции</span>
                  </div>
                  <div className="mt-6 grid gap-3 sm:grid-cols-2">
                    {coalitionMembers.map((member) => (
                      <div
                        key={member}
                        className="rounded-[1.4rem] border border-white/10 bg-white/5 px-4 py-4 text-sm font-medium text-slate-100"
                      >
                        {member}
                      </div>
                    ))}
                  </div>
                  <p className="mt-6 text-sm leading-7 text-slate-300">
                    Это была не история про красивую поддержку ради репутации. По сути, рынок собирал экстренный стабилизационный фонд: нужно было закрыть дефицит обеспечения rsETH, защитить кредиторов Aave и не дать проблеме KelpDAO перекинуться на остальной DeFi.
                  </p>
                  <p className="mt-4 text-sm leading-7 text-slate-300">
                    Важная деталь: официально крупную кредитную линию давала именно Mantle. Bybit в текущем контуре не выступает как прямой кредитор на этом слайде, но публично поддержали предложение Mantle как стратегический партнер экосистемы.
                  </p>
                </div>

                <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-2">
                  {contributions.map((item, itemIndex) => (
                    <MetricCard
                      key={item.name}
                      label={item.name}
                      value={item.commitment}
                      note={item.description}
                      tone={item.tone}
                      icon={[Users, Landmark, Coins, ShieldCheck, Layers3][itemIndex]}
                    />
                  ))}
                </div>
              </div>
            ) : null}

            {slide.id === "open-questions" ? (
              <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                {disputedItems.map((item, itemIndex) => (
                  <MetricCard
                    key={item.label}
                    {...item}
                    icon={[Scale, Network, Coins, Lock, ShieldAlert][itemIndex]}
                  />
                ))}
              </div>
            ) : null}

            {slide.id === "takeaway" ? (
              <div className="flex flex-col justify-between gap-8">
                <div className="grid gap-8 xl:grid-cols-[1.1fr_0.9fr]">
                  <div className="rounded-[2rem] border border-cyan-300/20 bg-cyan-300/10 p-6">
                    <div className="text-[0.68rem] uppercase tracking-[0.24em] text-cyan-100">
                      Финальная формула
                    </div>
                    <p className="mt-5 text-2xl font-semibold leading-tight text-white md:text-5xl">
                      Aave survived technically, suffered economically, and recovered socially.
                    </p>
                    <p className="mt-5 max-w-3xl text-base leading-8 text-slate-100">
                      Ошибка появилась не в Aave, но деньги ушли именно через Aave. А возвращать баланс системе пришлось уже всем вместе.
                    </p>
                  </div>

                  <div className="grid gap-4">
                    <MetricCard
                      label="Технический слой"
                      value="Сбой во [[cross-chain verification|внешней проверке сообщений между сетями]]"
                      note="Проблема была в мосте и внешнем слое проверки сообщений, а не в самом ядре Aave."
                      tone="cyan"
                      icon={Network}
                    />
                    <MetricCard
                      label="Экономический слой"
                      value="Удар по [[solvency|финансовой устойчивости]] общего пула"
                      note="Убыток превратился в реальную проблему после займа под сомнительный залог против общих WETH-резервов."
                      tone="violet"
                      icon={Droplets}
                    />
                    <MetricCard
                      label="Социальный слой"
                      value="Исход определила координация"
                      note="Kelp, LayerZero, Arbitrum, Aave DAO и участники DeFi United все влияли на то, чем закончится кризис."
                      tone="amber"
                      icon={Users}
                    />
                  </div>
                </div>

                <div className="flex flex-col items-start justify-between gap-4 rounded-[1.8rem] border border-white/10 bg-slate-950/55 p-5 md:flex-row md:items-center">
                  <div>
                    <div className="text-[0.68rem] uppercase tracking-[0.24em] text-slate-400">
                      Интерпретация
                    </div>
                    <p className="mt-3 max-w-4xl text-sm leading-7 text-slate-300">
                      <RichText text="Этот кейс важен потому, что показывает простую вещь: одна ошибка во внешнем мосте может очень быстро превратиться в большую проблему для целого кредитного рынка." />
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => scrollToIndex(0)}
                    className="rounded-full border border-cyan-300/30 bg-cyan-300/10 px-5 py-3 text-xs font-medium uppercase tracking-[0.22em] text-cyan-50 transition hover:bg-cyan-300/20"
                  >
                    Начать сначала
                  </button>
                </div>
              </div>
            ) : null}
          </FullscreenSlide>
        ))}
      </div>

      <ProgressNav
        slides={slides}
        activeIndex={activeIndex}
        onSelect={scrollToIndex}
        onPrev={() => scrollToIndex(activeIndex - 1)}
        onNext={() => scrollToIndex(activeIndex + 1)}
      />
    </div>
  );
}

export default App;
