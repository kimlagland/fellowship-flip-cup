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
    <section className="bento p-6 sm:p-10 space-y-6">
      {eyebrow && (
        <div className="text-xs uppercase tracking-[0.35em] text-muted-foreground">{eyebrow}</div>
      )}
      <h2 className="text-3xl md:text-4xl text-gradient-gold">{title}</h2>
      <div className="space-y-4 text-foreground/80 leading-relaxed text-base sm:text-lg">
        {children}
      </div>
    </section>
  );
}
