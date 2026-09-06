import type { ReactNode } from "react";

export function RuleSection({
  eyebrow,
  title,
  children,
}: {
  eyebrow?: string;
  title: string;
  children: ReactNode;
}) {
  return (
    <section className="border-t border-border/60 py-8 sm:py-10 space-y-5">
      {eyebrow && (
        <div className="text-xs font-semibold uppercase tracking-[0.3em] text-primary">{eyebrow}</div>
      )}
      <h2 className="text-4xl md:text-5xl text-foreground uppercase">{title}</h2>
      <div className="space-y-4 text-foreground/80 leading-relaxed text-base sm:text-lg">
        {children}
      </div>
    </section>
  );
}
