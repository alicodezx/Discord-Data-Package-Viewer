// Shared UI constants — eliminates tooltip/animation duplication across sections

export const CHART_TOOLTIP_STYLE = {
  contentStyle: {
    backgroundColor: "#171B21",
    border: "1px solid var(--border)",
    borderRadius: "8px",
    color: "white",
    fontSize: "12px",
    boxShadow: "0 4px 12px rgba(0,0,0,0.5)",
  },
  itemStyle: { color: "white", fontWeight: "bold" as const },
  labelStyle: { color: "var(--text-secondary)" },
} as const;

export const FADE_UP = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0 },
  transition: { ease: [0.16, 1, 0.3, 1] as [number, number, number, number] },
} as const;

export const FADE_UP_DELAY = (delay: number) => ({
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0 },
  transition: { delay, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] },
}) as const;
