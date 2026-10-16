import type { Format } from "@/types";
import { cn } from "@/lib/utils";

/**
 * Pure SVG product drawing from data (spec 9.5) - every product has a sharp image with zero downloads.
 * fanfold = isometric stack with perforations; roll = cylinder with core sized by coreIn;
 * sheet = page with label grid; integrated = label + receipt areas.
 */
export interface ProductVisualProps {
  format: Format;
  widthIn: number;
  lengthIn: number;
  core?: 1 | 3 | null;
  labelsPerSheet?: number;
  size?: "sm" | "md" | "lg";
  accent?: string;
  view?: "front" | "side" | "scene";
  className?: string;
  title?: string;
}

const C = {
  navy900: "var(--color-navy-900)",
  navy700: "var(--color-navy-700)",
  navy50: "var(--color-navy-50)",
  line: "var(--color-line)",
  ink400: "var(--color-ink-400)",
  ink600: "var(--color-ink-600)",
  white: "#FFFFFF",
  bg: "var(--color-bg)",
};

const BARS = [2, 1, 1, 3, 1, 2, 1, 1, 2, 3, 1, 1, 2, 1, 3, 1, 2, 2, 1, 1, 3, 1, 1, 2, 1, 2, 3, 1];

function Barcode({ x, y, w, h }: { x: number; y: number; w: number; h: number }) {
  const total = BARS.reduce((s, b) => s + b, 0) * 1.6;
  const unit = w / total;
  let cx = x;
  return (
    <g>
      {BARS.map((b, i) => {
        const bw = b * unit;
        const rect = i % 2 === 0 ? <rect key={i} x={cx} y={y} width={bw} height={h} fill={C.navy900} /> : null;
        cx += bw + unit * 0.6 * (i % 3 === 0 ? 1.4 : 1);
        return rect;
      })}
    </g>
  );
}

/** A flat label face: 'SHIP TO' block + barcode; simplified when small. */
function LabelFace({
  x,
  y,
  w,
  h,
  detail,
  accent,
  rx = 4,
}: {
  x: number;
  y: number;
  w: number;
  h: number;
  detail: boolean;
  accent?: string;
  rx?: number;
}) {
  const pad = Math.max(2, Math.min(w, h) * 0.08);
  const showText = detail && h > 34 && w > 34;
  const barH = Math.max(3, Math.min(h * (showText ? 0.22 : 0.5), 22));
  return (
    <g>
      <rect x={x} y={y} width={w} height={h} rx={rx} fill={C.white} stroke={C.line} strokeWidth={0.8} />
      {accent && <rect x={x} y={y} width={w} height={Math.max(2, h * 0.05)} rx={rx} fill={accent} />}
      {showText && (
        <g>
          <text
            x={x + pad}
            y={y + pad + Math.min(8, h * 0.1)}
            fontSize={Math.min(8, h * 0.1)}
            fontWeight={700}
            fill={C.navy900}
            fontFamily="Inter, sans-serif"
          >
            SHIP TO
          </text>
          {[0, 1, 2].map((i) => (
            <rect
              key={i}
              x={x + pad}
              y={y + pad + Math.min(8, h * 0.1) + 4 + i * Math.max(4, h * 0.07)}
              width={(w - pad * 2) * (i === 0 ? 0.7 : i === 1 ? 0.85 : 0.5)}
              height={Math.max(1.5, h * 0.03)}
              rx={1}
              fill={C.ink400}
            />
          ))}
          <line
            x1={x + pad}
            x2={x + w - pad}
            y1={y + h * 0.56}
            y2={y + h * 0.56}
            stroke={C.navy900}
            strokeWidth={0.8}
          />
        </g>
      )}
      <Barcode x={x + pad} y={y + h - pad - barH} w={w - pad * 2} h={barH} />
    </g>
  );
}

/* ---------- Fanfold: isometric stack ---------- */
function Fanfold({ widthIn, lengthIn, detail, accent }: { widthIn: number; lengthIn: number; detail: boolean; accent?: string }) {
  const c = 0.866;
  const hh = 0.5;
  const s = 170 / ((widthIn + lengthIn) * c);
  const W = widthIn * s;
  const L = lengthIn * s;
  const D = 46;
  const tx = (240 - (W + L) * c) / 2 + L * c;
  const ty = 20;
  const P = (x: number, y: number, d = 0) => [tx + (x - y) * c, ty + (x + y) * hh + d] as const;
  const pts = (arr: (readonly [number, number])[]) => arr.map((p) => p.join(",")).join(" ");
  const sheets = 9;
  return (
    <g>
      <ellipse cx={120} cy={ty + (W + L) * hh + D + 8} rx={(W + L) * c * 0.5} ry={8} fill={C.navy900} opacity={0.08} />
      {/* left face */}
      <polygon points={pts([P(0, L), P(W, L), P(W, L, D), P(0, L, D)])} fill={C.white} stroke={C.line} />
      {/* right face */}
      <polygon points={pts([P(W, 0), P(W, L), P(W, L, D), P(W, 0, D)])} fill="#EDF1F6" stroke={C.line} />
      {Array.from({ length: sheets - 1 }, (_, i) => {
        const d = ((i + 1) * D) / sheets;
        return (
          <g key={i}>
            <polyline points={pts([P(0, L, d), P(W, L, d), P(W, 0, d)])} fill="none" stroke={C.line} strokeWidth={0.7} />
            {/* fold perforation marks on the long side */}
            {i % 2 === 0 && (
              <line
                x1={P(W, L * 0.15, d)[0]}
                y1={P(W, L * 0.15, d)[1]}
                x2={P(W, L * 0.85, d)[0]}
                y2={P(W, L * 0.85, d)[1]}
                stroke={C.ink400}
                strokeWidth={0.6}
                strokeDasharray="2 2"
              />
            )}
          </g>
        );
      })}
      {/* top face: flat label drawn through an isometric matrix */}
      <g transform={`matrix(${c} ${hh} ${-c} ${hh} ${tx} ${ty})`}>
        <rect x={0} y={0} width={W} height={L} fill={C.white} stroke={C.line} />
        <LabelFace x={W * 0.06} y={L * 0.05} w={W * 0.88} h={L * 0.9} detail={detail} accent={accent} rx={5} />
        <line x1={0} x2={W} y1={0.5} y2={0.5} stroke={C.ink400} strokeDasharray="3 3" strokeWidth={0.8} />
      </g>
    </g>
  );
}

/* ---------- Roll: cylinder with core + feeding label ---------- */
function Roll({
  widthIn,
  lengthIn,
  core,
  detail,
  accent,
}: {
  widthIn: number;
  lengthIn: number;
  core?: 1 | 3 | null;
  detail: boolean;
  accent?: string;
}) {
  const R = 58;
  const depth = Math.max(46, Math.min(100, widthIn * 24));
  const cy = 76;
  const cx1 = 120 - depth / 2 - 6;
  const cx2 = cx1 + depth;
  const k = 0.32;
  const coreR = core === 3 ? 22 : 11;
  const lw = depth;
  const lh = Math.max(16, Math.min(70, (lengthIn / widthIn) * lw));
  return (
    <g>
      <ellipse cx={120} cy={196} rx={80} ry={6} fill={C.navy900} opacity={0.08} />
      {/* feeding web */}
      <path d={`M${cx1} ${cy + R} L${cx1} 186 L${cx2} 186 L${cx2} ${cy + R} Z`} fill={C.white} stroke={C.line} />
      <LabelFace x={cx1 + 3} y={cy + R + 8} w={lw - 6} h={Math.min(lh, 186 - (cy + R + 10))} detail={detail} accent={accent} rx={3} />
      <line x1={cx1} x2={cx2} y1={cy + R + 4} y2={cy + R + 4} stroke={C.ink400} strokeDasharray="3 2" strokeWidth={0.8} />
      {/* body */}
      <rect x={cx1} y={cy - R} width={depth} height={R * 2} fill="#EDF1F6" />
      <ellipse cx={cx1} cy={cy} rx={R * k} ry={R} fill="#E4EAF2" stroke={C.line} />
      {/* label edges along the body */}
      {Array.from({ length: Math.floor(depth / 14) }, (_, i) => (
        <line key={i} x1={cx1 + 7 + i * 14} x2={cx1 + 7 + i * 14} y1={cy - R} y2={cy + R} stroke={C.line} strokeWidth={0.6} />
      ))}
      <line x1={cx1} x2={cx2} y1={cy - R} y2={cy - R} stroke={C.line} />
      <line x1={cx1} x2={cx2} y1={cy + R} y2={cy + R} stroke={C.line} />
      {/* front face with rings and core */}
      <ellipse cx={cx2} cy={cy} rx={R * k} ry={R} fill={C.white} stroke={C.line} />
      {[0.82, 0.64, 0.48].map((f) => (
        <ellipse key={f} cx={cx2} cy={cy} rx={R * k * f} ry={R * f} fill="none" stroke={C.line} strokeWidth={0.6} />
      ))}
      <ellipse cx={cx2} cy={cy} rx={coreR * k + 2} ry={coreR + 2} fill={C.navy50} stroke={C.navy700} strokeWidth={1.2} />
      <ellipse cx={cx2} cy={cy} rx={coreR * k - 1} ry={coreR - 3} fill={C.bg} />
      {detail && (
        <text x={cx2 + 14} y={cy - R + 6} fontSize={9} fontWeight={600} fill={C.ink600} fontFamily="Inter, sans-serif">
          {core ? `${core}" core` : ""}
        </text>
      )}
    </g>
  );
}

/* ---------- Roll side view: face-on core ---------- */
function RollSide({ core }: { core?: 1 | 3 | null }) {
  const coreR = core === 3 ? 30 : 15;
  return (
    <g>
      <circle cx={120} cy={100} r={78} fill={C.white} stroke={C.line} />
      {[0.86, 0.72, 0.58, 0.46].map((f) => (
        <circle key={f} cx={120} cy={100} r={78 * f} fill="none" stroke={C.line} strokeWidth={0.7} />
      ))}
      <circle cx={120} cy={100} r={coreR + 4} fill={C.navy50} stroke={C.navy700} strokeWidth={1.5} />
      <circle cx={120} cy={100} r={coreR} fill={C.bg} />
      <text x={120} y={196} textAnchor="middle" fontSize={11} fontWeight={600} fill={C.ink600} fontFamily="Inter, sans-serif">
        {core ? `${core}-inch core` : ""}
      </text>
    </g>
  );
}

/* ---------- Fanfold side view: zig-zag folds ---------- */
function FanfoldSide() {
  const rows = 12;
  return (
    <g>
      <ellipse cx={120} cy={186} rx={90} ry={6} fill={C.navy900} opacity={0.08} />
      {Array.from({ length: rows }, (_, i) => {
        const y = 40 + i * 11;
        return (
          <g key={i}>
            <rect x={40} y={y} width={160} height={9} rx={2} fill={i % 2 ? C.white : "#F2F5F9"} stroke={C.line} />
            <path
              d={i % 2 ? `M200 ${y + 4.5} q8 5.5 0 11` : `M40 ${y + 4.5} q-8 5.5 0 11`}
              fill="none"
              stroke={C.ink400}
              strokeDasharray="2 2"
              strokeWidth={0.8}
            />
          </g>
        );
      })}
    </g>
  );
}

/* ---------- Sheet and integrated pages ---------- */
function Page({
  format,
  widthIn,
  labelsPerSheet = 1,
  detail,
  accent,
}: {
  format: "sheet" | "integrated";
  widthIn: number;
  labelsPerSheet?: number;
  detail: boolean;
  accent?: string;
}) {
  const ph = 176;
  const pw = ph * (8.5 / 11);
  const px = (240 - pw) / 2;
  const py = 12;
  const back = (
    <>
      <rect x={px + 8} y={py + 6} width={pw} height={ph} rx={4} fill="#E9EEF5" stroke={C.line} />
      <rect x={px + 4} y={py + 3} width={pw} height={ph} rx={4} fill="#F2F5F9" stroke={C.line} />
      <rect x={px} y={py} width={pw} height={ph} rx={4} fill={C.white} stroke={C.line} />
    </>
  );
  if (format === "integrated") {
    const lh = ph * 0.52;
    return (
      <g>
        {back}
        <LabelFace x={px + 8} y={py + 8} w={pw - 16} h={lh - 12} detail={detail} accent={accent} rx={4} />
        <line x1={px} x2={px + pw} y1={py + lh} y2={py + lh} stroke={C.ink400} strokeDasharray="4 3" />
        {detail && (
          <text x={px + 10} y={py + lh + 16} fontSize={8} fontWeight={700} fill={C.navy700} fontFamily="Inter, sans-serif">
            RECEIPT
          </text>
        )}
        {[0, 1, 2, 3, 4, 5].map((i) => (
          <g key={i}>
            <rect x={px + 10} y={py + lh + 24 + i * 11} width={pw * 0.45} height={2.5} rx={1} fill={C.line} />
            <rect x={px + pw - 10 - pw * 0.16} y={py + lh + 24 + i * 11} width={pw * 0.16} height={2.5} rx={1} fill={C.line} />
          </g>
        ))}
      </g>
    );
  }
  const cols = Math.max(1, Math.floor(8.5 / widthIn + 0.01));
  const rows = Math.max(1, Math.ceil(labelsPerSheet / cols));
  const mx = labelsPerSheet > 6 ? 5 : 8;
  const my = labelsPerSheet > 6 ? 8 : 8;
  const gap = labelsPerSheet > 6 ? 3 : 4;
  const cw = (pw - mx * 2 - gap * (cols - 1)) / cols;
  const ch = (ph - my * 2 - gap * (rows - 1)) / rows;
  return (
    <g>
      {back}
      {Array.from({ length: rows * cols }, (_, i) => {
        const r = Math.floor(i / cols);
        const cI = i % cols;
        const x = px + mx + cI * (cw + gap);
        const y = py + my + r * (ch + gap);
        return ch > 22 ? (
          <LabelFace key={i} x={x} y={y} w={cw} h={ch} detail={detail && labelsPerSheet <= 6} accent={accent} rx={3} />
        ) : (
          <g key={i}>
            <rect x={x} y={y} width={cw} height={ch} rx={2} fill={C.white} stroke={C.line} strokeWidth={0.7} />
            <rect x={x + 3} y={y + ch * 0.3} width={cw * 0.55} height={1.6} rx={0.8} fill={C.ink400} />
            <rect x={x + 3} y={y + ch * 0.6} width={cw * 0.4} height={1.6} rx={0.8} fill={C.line} />
          </g>
        );
      })}
      {labelsPerSheet === 1 && (
        <line x1={px + pw / 2} x2={px + pw / 2} y1={py} y2={py + ph} stroke={C.ink400} strokeDasharray="3 3" strokeWidth={0.8} />
      )}
    </g>
  );
}

/* ---------- 'In use' scene: shipping box with the label applied ---------- */
function Scene({ widthIn, lengthIn, accent }: { widthIn: number; lengthIn: number; accent?: string }) {
  const lw = Math.min(90, Math.max(40, widthIn * 18));
  const lh = Math.min(80, Math.max(22, (lengthIn / widthIn) * lw * 0.75));
  return (
    <g>
      <ellipse cx={120} cy={186} rx={96} ry={7} fill={C.navy900} opacity={0.08} />
      <polygon points="30,70 120,40 210,70 120,100" fill="#D9B98C" />
      <polygon points="30,70 120,100 120,184 30,154" fill="#C9A675" />
      <polygon points="120,100 210,70 210,154 120,184" fill="#BD9764" />
      <polygon points="74,55 165,85 165,92 74,62" fill="#E8D3AE" opacity={0.7} />
      <g transform={`matrix(0.95 -0.32 0 1 ${165 - lw / 2} ${134 - lh / 2 + 6})`}>
        <LabelFace x={0} y={0} w={lw} h={lh} detail={lh > 36} accent={accent} rx={3} />
      </g>
    </g>
  );
}

export function ProductVisual({
  format,
  widthIn,
  lengthIn,
  core,
  labelsPerSheet,
  size = "md",
  accent,
  view = "front",
  className,
  title,
}: ProductVisualProps) {
  const detail = size !== "sm";
  let body: React.ReactNode;
  if (view === "scene") body = <Scene widthIn={format === "sheet" || format === "integrated" ? 4 : widthIn} lengthIn={format === "sheet" || format === "integrated" ? 6 : lengthIn} accent={accent} />;
  else if (view === "side")
    body =
      format === "roll" ? (
        <RollSide core={core} />
      ) : format === "fanfold" ? (
        <FanfoldSide />
      ) : (
        <Page format={format} widthIn={widthIn} labelsPerSheet={labelsPerSheet} detail={false} accent={accent} />
      );
  else if (format === "fanfold") body = <Fanfold widthIn={widthIn} lengthIn={lengthIn} detail={detail} accent={accent} />;
  else if (format === "roll") body = <Roll widthIn={widthIn} lengthIn={lengthIn} core={core} detail={detail} accent={accent} />;
  else body = <Page format={format} widthIn={widthIn} labelsPerSheet={labelsPerSheet} detail={detail} accent={accent} />;

  return (
    <svg
      viewBox="0 0 240 200"
      className={cn("h-auto w-full", className)}
      role={title ? "img" : undefined}
      aria-label={title}
      aria-hidden={title ? undefined : true}
    >
      {body}
    </svg>
  );
}

export const visualProps = (p: {
  format: Format;
  widthIn: number;
  lengthIn: number;
  coreIn?: 1 | 3 | null;
  labelsPerSheet?: number;
}) => ({
  format: p.format,
  widthIn: p.widthIn,
  lengthIn: p.lengthIn,
  core: p.coreIn ?? null,
  labelsPerSheet: p.labelsPerSheet,
});
