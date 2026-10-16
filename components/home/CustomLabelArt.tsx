import { cn } from "@/lib/utils";

/** SVG mock custom labels for invented brands only. */
export type CustomArtId = "pine" | "coastal" | "harbor" | "meadow" | "summit" | "orchard";

export const CUSTOM_SAMPLES: { id: CustomArtId; name: string; detail: string }[] = [
  { id: "pine", name: "Pine & Co. Candles", detail: "3 x 2 in rectangle, gloss paper" },
  { id: "coastal", name: "Coastal Roast Coffee", detail: "3 in circle, matte paper" },
  { id: "harbor", name: "Harbor Hot Sauce", detail: "2.5 x 4 in oval, gloss paper" },
  { id: "meadow", name: "Meadow Honey Co.", detail: "2 in square, matte paper" },
  { id: "summit", name: "Summit Supply", detail: "4 x 2 in rectangle, thermal transfer" },
  { id: "orchard", name: "Orchard Soap Works", detail: "2.5 in circle, matte paper" },
];

export function CustomLabelArt({ id, className }: { id: CustomArtId; className?: string }) {
  const common = { className: cn("h-auto w-full drop-shadow-[0_12px_20px_rgba(0,0,0,0.25)]", className), "aria-hidden": true };
  switch (id) {
    case "pine":
      return (
        <svg viewBox="0 0 180 120" {...common}>
          <rect x="2" y="2" width="176" height="116" rx="12" fill="#F4EFE6" stroke="#2F4A3A" strokeWidth="3" />
          <path d="M40 78l14-26 14 26z M48 64l6-12 6 12z" fill="#2F4A3A" />
          <rect x="52" y="78" width="4" height="8" fill="#2F4A3A" />
          <text x="80" y="58" fontFamily="Georgia, serif" fontSize="17" fontWeight="700" fill="#2F4A3A">Pine &amp; Co.</text>
          <text x="80" y="76" fontFamily="Inter, sans-serif" fontSize="9" letterSpacing="2.4" fill="#6B7F72">CANDLES</text>
          <line x1="80" x2="160" y1="86" y2="86" stroke="#C9B48A" />
          <text x="80" y="99" fontFamily="Inter, sans-serif" fontSize="7.5" fill="#6B7F72">Cedar &amp; Smoke · 8 oz</text>
        </svg>
      );
    case "coastal":
      return (
        <svg viewBox="0 0 140 140" {...common}>
          <circle cx="70" cy="70" r="67" fill="#123B53" />
          <circle cx="70" cy="70" r="58" fill="none" stroke="#F2C14E" strokeWidth="1.5" strokeDasharray="3 3" />
          <path d="M34 82c10-8 20-8 30 0s20 8 30 0 14-6 14-6" fill="none" stroke="#7BC4D6" strokeWidth="3" />
          <circle cx="70" cy="50" r="10" fill="#F2C14E" />
          <text x="70" y="104" textAnchor="middle" fontFamily="Inter, sans-serif" fontSize="10.5" fontWeight="800" fill="#FFFFFF">COASTAL ROAST</text>
          <text x="70" y="117" textAnchor="middle" fontFamily="Inter, sans-serif" fontSize="7" letterSpacing="2" fill="#7BC4D6">COFFEE CO.</text>
        </svg>
      );
    case "harbor":
      return (
        <svg viewBox="0 0 120 170" {...common}>
          <ellipse cx="60" cy="85" rx="57" ry="82" fill="#B3261E" />
          <ellipse cx="60" cy="85" rx="48" ry="72" fill="none" stroke="#FFD8A8" strokeWidth="1.5" />
          <path d="M60 40c8 10 14 20 6 34-4 7-12 7-16 0-6-10 2-22 10-34z" fill="#FFD8A8" />
          <text x="60" y="104" textAnchor="middle" fontFamily="Georgia, serif" fontSize="15" fontWeight="700" fill="#FFFFFF">HARBOR</text>
          <text x="60" y="120" textAnchor="middle" fontFamily="Inter, sans-serif" fontSize="8" letterSpacing="2" fill="#FFD8A8">HOT SAUCE</text>
          <text x="60" y="136" textAnchor="middle" fontFamily="Inter, sans-serif" fontSize="7" fill="#FFFFFF">Extra hot · 5 fl oz</text>
        </svg>
      );
    case "meadow":
      return (
        <svg viewBox="0 0 140 140" {...common}>
          <rect x="2" y="2" width="136" height="136" rx="14" fill="#FFF4D6" stroke="#C98B12" strokeWidth="3" />
          <path d="M70 34l14 8v16l-14 8-14-8V42z" fill="#F2B632" stroke="#C98B12" strokeWidth="2" />
          <text x="70" y="96" textAnchor="middle" fontFamily="Georgia, serif" fontSize="16" fontWeight="700" fill="#6B4A0B">Meadow</text>
          <text x="70" y="112" textAnchor="middle" fontFamily="Inter, sans-serif" fontSize="8" letterSpacing="2" fill="#A06E10">RAW HONEY</text>
        </svg>
      );
    case "summit":
      return (
        <svg viewBox="0 0 200 100" {...common}>
          <rect x="2" y="2" width="196" height="96" rx="8" fill="#FFFFFF" stroke="#111827" strokeWidth="2" />
          <path d="M16 70l22-36 14 22 8-12 18 26z" fill="#111827" />
          <text x="90" y="44" fontFamily="Inter, sans-serif" fontSize="15" fontWeight="800" fill="#111827">SUMMIT</text>
          <text x="90" y="58" fontFamily="Inter, sans-serif" fontSize="8" letterSpacing="2" fill="#4B5563">SUPPLY CO.</text>
          <g fill="#111827">
            {[0, 3, 5, 9, 11, 14, 18, 20, 23, 27, 29, 32, 36, 38, 41, 45, 47, 50, 54, 57, 60, 63, 66, 70, 72, 76, 79, 83, 86, 90, 92, 96].map((x, i) => (
              <rect key={x} x={90 + x} y={66} width={i % 3 === 0 ? 2 : 1} height={20} />
            ))}
          </g>
        </svg>
      );
    case "orchard":
      return (
        <svg viewBox="0 0 140 140" {...common}>
          <circle cx="70" cy="70" r="67" fill="#E8F3E1" stroke="#3F7D3A" strokeWidth="3" />
          <circle cx="70" cy="56" r="16" fill="#D94F3D" />
          <path d="M70 40c2-6 6-8 10-8-1 5-5 8-10 8z" fill="#3F7D3A" />
          <text x="70" y="98" textAnchor="middle" fontFamily="Georgia, serif" fontSize="14" fontWeight="700" fill="#2E5B2A">Orchard</text>
          <text x="70" y="112" textAnchor="middle" fontFamily="Inter, sans-serif" fontSize="7.5" letterSpacing="2" fill="#3F7D3A">SOAP WORKS</text>
        </svg>
      );
  }
}
