"use client";

interface SectionHeaderProps {
  label?: string;
  title: string;
  meta?: React.ReactNode;
}

export default function SectionHeader({ label, title, meta }: SectionHeaderProps) {
  return (
    <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-[#252B34] pb-6">
      <div>
        {label && (
          <p className="text-[#9DA7B3] text-xs font-bold uppercase tracking-wider mb-1">{label}</p>
        )}
        <h1 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight">
          {title}
        </h1>
      </div>
      {meta && <div>{meta}</div>}
    </div>
  );
}
