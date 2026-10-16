import { MATERIAL_LABEL } from "@/lib/filters";
import { formatInt, formatSize } from "@/lib/utils";
import type { Product } from "@/types";

export function SpecsTable({ product: p }: { product: Product }) {
  const rows: [string, string][] = [
    ["SKU", p.sku],
    ...Object.entries(p.specs),
    ["Format", p.format === "roll" ? "Roll" : p.format === "fanfold" ? "Fanfold stack" : p.format === "sheet" ? "Sheet" : "Integrated sheet"],
    ...(p.specs["Label size"] ? [] : ([["Label size", `${formatSize(p.widthIn, p.lengthIn)} in`]] as [string, string][])),
    ...(p.specs.Material ? [] : ([["Material", MATERIAL_LABEL[p.material]]] as [string, string][])),
    ["Sold by", `${p.unitName} (${formatInt(p.labelsPerUnit)} labels)`],
  ];
  return (
    <div className="overflow-x-auto rounded-[12px] border border-line">
      <table className="w-full min-w-[420px] text-left text-[15px]">
        <caption className="sr-only">Specifications for {p.name}</caption>
        <tbody>
          {rows.map(([k, v], i) => (
            <tr key={k} className={i % 2 ? "bg-white" : "bg-navy-50/60"}>
              <th scope="row" className="w-2/5 px-4 py-3 font-medium text-ink-600">
                {k}
              </th>
              <td className="px-4 py-3 font-medium text-navy-900">{v}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
