"use client";

import { useState } from "react";
import {
  AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer,
} from "recharts";
import type { QuoteDetail } from "@/types/finance";
import { useQuote } from "../hooks/useQuote";

/* ─── Constants ─────────────────────────────────────────── */

const TW = ["2330.TW", "0050.TW", "0056.TW", "2454.TW"] as const;
const US = ["SPY", "QQQ", "NVDA", "AAPL", "MSFT", "GOOGL"] as const;
const TW_SET = new Set<string>(TW);

const NAMES: Record<string, string> = {
  "2330.TW": "台積電",
  "0050.TW": "元大台灣50",
  "0056.TW": "元大高股息",
  "2454.TW": "聯發科",
  SPY:   "SPDR S&P 500 ETF",
  QQQ:   "Invesco Nasdaq 100 ETF",
  NVDA:  "NVIDIA Corporation",
  AAPL:  "Apple Inc.",
  MSFT:  "Microsoft Corporation",
  GOOGL: "Alphabet Inc.",
};

/* ─── Colour logic ───────────────────────────────────────── */
function getColor(symbol: string, changePercent: number) {
  const up = changePercent >= 0;
  return TW_SET.has(symbol) ? (up ? "#EF4444" : "#22C55E") : (up ? "#22C55E" : "#EF4444");
}

/* ─── Helpers ────────────────────────────────────────────── */
function formatPrice(price: number, currency: string) {
  return currency === "TWD"
    ? price.toLocaleString("zh-TW", { minimumFractionDigits: 2 })
    : "$" + price.toLocaleString("en-US", { minimumFractionDigits: 2 });
}

function fmtTime(ts: number) {
  return new Date(ts).toLocaleTimeString("zh-TW", { hour: "2-digit", minute: "2-digit", hour12: false });
}

/* ─── Glass style object (reused) ───────────────────────── */
const GLASS: React.CSSProperties = {
  background: "rgba(255,255,255,0.07)",
  backdropFilter: "blur(16px) saturate(130%)",
  WebkitBackdropFilter: "blur(16px) saturate(130%)",
  border: "1px solid rgba(255,255,255,0.12)",
  boxShadow: "inset 0 1px 0 rgba(255,255,255,0.08)",
};

/* ─── Trigger button (no background, glass shows through) ── */
function Trigger({ label, open, onClick }: { label: string; open: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="self-start flex items-center gap-2 px-3 py-1.5 text-xs text-white/75 hover:text-white transition-colors rounded-[10px] border border-white/15 bg-transparent"
    >
      <span>{label}</span>
      <span className="text-white/35 text-[10px]">{open ? "▴" : "▾"}</span>
    </button>
  );
}

/* ─── Options list (rendered in-card, scrollable, no scrollbar) */
function OptionsList({ value, onSelect }: { value: string; onSelect: (s: string) => void }) {
  return (
    <div className="flex-1 min-h-0 overflow-y-auto scrollbar-hide -mx-6 px-4">
      <div className="pt-1 pb-2">
        <div className="text-[10px] text-white/30 px-2 pb-1 pt-0.5 font-bold tracking-widest uppercase">台股</div>
        {TW.map((s) => (
          <button
            key={s}
            onClick={() => onSelect(s)}
            className={`w-full text-left px-2.5 py-2 text-xs rounded-lg transition-colors ${
              value === s ? "bg-white/15 text-white" : "text-white/55 hover:bg-white/8 hover:text-white"
            }`}
          >
            <span className="font-bold">{s.replace(".TW", "")}</span>
            <span className="text-white/40 ml-2">{NAMES[s]}</span>
          </button>
        ))}
      </div>
      <div className="border-t border-white/8 -mx-4 mx-0 mb-2" />
      <div className="pb-2">
        <div className="text-[10px] text-white/30 px-2 pb-1 pt-0.5 font-bold tracking-widest uppercase">美股</div>
        {US.map((s) => (
          <button
            key={s}
            onClick={() => onSelect(s)}
            className={`w-full text-left px-2.5 py-2 text-xs rounded-lg transition-colors ${
              value === s ? "bg-white/15 text-white" : "text-white/55 hover:bg-white/8 hover:text-white"
            }`}
          >
            <span className="font-bold">{s}</span>
            <span className="text-white/40 ml-2">{NAMES[s]}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

/* ─── Tooltip ────────────────────────────────────────────── */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function ChartTooltip({ active, payload }: any) {
  if (!active || !payload?.length) return null;
  const { price, ts } = payload[0].payload;
  return (
    <div style={{ background: "rgba(0,0,0,0.85)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8, padding: "6px 10px" }}>
      {ts ? <div style={{ color: "rgba(255,255,255,0.4)", fontSize: 10, marginBottom: 2 }}>{fmtTime(ts)}</div> : null}
      <div style={{ color: "#fff", fontSize: 12, fontWeight: 700 }}>{price}</div>
    </div>
  );
}

/* ─── Spark area ─────────────────────────────────────────── */
function SparkArea({ data, color, gradientId }: {
  data: { price: number; ts: number }[];
  color: string;
  gradientId: string;
}) {
  const glow = color === "#22C55E"
    ? "drop-shadow(0 0 6px rgba(52,211,153,0.5))"
    : "drop-shadow(0 0 6px rgba(239,68,68,0.5))";

  const tickIndices = data.length > 1
    ? [0, Math.floor(data.length * 0.25), Math.floor(data.length * 0.5), Math.floor(data.length * 0.75), data.length - 1]
    : [];
  const tickTs = [...new Set(tickIndices.map((i) => data[i]?.ts).filter(Boolean))] as number[];

  return (
    <ResponsiveContainer width="100%" height={120}>
      <AreaChart data={data} margin={{ top: 6, right: 0, left: 0, bottom: 0 }}>
        <defs>
          <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity={0.35} />
            <stop offset="100%" stopColor={color} stopOpacity={0} />
          </linearGradient>
        </defs>
        <XAxis
          dataKey="ts" type="number" scale="time"
          domain={["dataMin", "dataMax"]}
          tickFormatter={fmtTime}
          ticks={tickTs}
          tick={{ fill: "rgba(255,255,255,0.25)", fontSize: 10 }}
          axisLine={false} tickLine={false} interval={0}
        />
        <YAxis hide domain={["auto", "auto"]} />
        <Tooltip content={<ChartTooltip />} />
        <Area
          type="monotone" dataKey="price"
          stroke={color} strokeWidth={1.5}
          fill={`url(#${gradientId})`} fillOpacity={1}
          dot={false}
          activeDot={{ r: 3, fill: color, strokeWidth: 0 }}
          style={{ filter: glow }}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}

/* ─── Quote display ──────────────────────────────────────── */
function QuoteDisplay({ data }: { data: QuoteDetail }) {
  const color = getColor(data.symbol, data.changePercent);
  const sign = data.changePercent >= 0 ? "+" : "";
  const isLive = data.marketState === "REGULAR";
  const gradientId = `grad-${data.symbol.replace(/[^a-z0-9]/gi, "")}`;

  return (
    <div className="flex flex-col flex-1 min-h-0">
      <div className="flex items-start justify-between">
        <div>
          <div className="text-base font-bold text-white leading-tight">{NAMES[data.symbol] ?? data.shortName}</div>
          <div className="text-xs text-white/50 mt-0.5">{data.symbol}</div>
        </div>
        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full mt-0.5 shrink-0 ${
          isLive ? "text-emerald-400 bg-emerald-400/10" : "text-white/30 bg-white/5"
        }`}>
          {isLive ? "盤中" : "收盤"}
        </span>
      </div>

      <div className="mt-3">
        <div className="flex items-baseline gap-1.5">
          <span className="text-3xl font-black text-white tracking-tight">{formatPrice(data.price, data.currency)}</span>
          <span className="text-xs text-white/40">{data.currency}</span>
        </div>
        <div className="text-sm font-bold mt-0.5" style={{ color }}>
          {sign}{data.change.toFixed(2)} ({sign}{data.changePercent.toFixed(2)}%)
        </div>
      </div>

      {data.sparkline.length > 1 && (
        <div className="-mx-6 -mb-5 mt-3 overflow-hidden rounded-b-[20px]">
          <SparkArea data={data.sparkline} color={color} gradientId={gradientId} />
        </div>
      )}
    </div>
  );
}

/* ─── Skeleton ───────────────────────────────────────────── */
function Skeleton() {
  return (
    <div className="flex flex-col gap-3 flex-1 animate-pulse">
      <div className="flex items-start justify-between">
        <div className="space-y-2">
          <div className="h-4 w-36 bg-white/10 rounded" />
          <div className="h-3 w-16 bg-white/5 rounded" />
        </div>
        <div className="h-5 w-12 bg-white/5 rounded-full" />
      </div>
      <div className="space-y-2 mt-2">
        <div className="h-8 w-40 bg-white/10 rounded" />
        <div className="h-3 w-24 bg-white/5 rounded" />
      </div>
      <div className="flex-1 bg-white/5 rounded mt-2" />
    </div>
  );
}

/* ─── Main card ──────────────────────────────────────────── */
// 4 cards: 2 × h-[160px] + gap-4(16px) = 336px
export function StocksCard({ className = "" }: { className?: string }) {
  const [selected, setSelected] = useState<string>(TW[0]);
  const [menuOpen, setMenuOpen] = useState(false);
  const { data, isLoading, isError } = useQuote(selected);

  const label = `${selected.replace(".TW", "")} — ${NAMES[selected] ?? selected}`;

  function handleSelect(s: string) {
    setSelected(s);
    setMenuOpen(false);
  }

  return (
    <div className={`card-liquid-glass px-6 py-5 flex flex-col gap-3 h-[336px] overflow-hidden ${className}`}>
      <Trigger label={label} open={menuOpen} onClick={() => setMenuOpen((o) => !o)} />
      <div className="border-t border-white/5" />

      {menuOpen ? (
        <OptionsList value={selected} onSelect={handleSelect} />
      ) : isError ? (
        <div className="flex-1 flex items-center justify-center">
          <span className="text-xs text-white/30">無法載入報價</span>
        </div>
      ) : isLoading ? (
        <Skeleton />
      ) : data ? (
        <QuoteDisplay data={data} />
      ) : null}
    </div>
  );
}
