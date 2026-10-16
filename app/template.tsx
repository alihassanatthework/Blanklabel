/** Route change: content fade 150 ms. CSS-driven so it starts at first paint (no hydration wait); off under reduced motion. */
export default function Template({ children }: { children: React.ReactNode }) {
  return <div className="route-fade">{children}</div>;
}
