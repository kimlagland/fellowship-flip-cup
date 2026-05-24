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
    <section className="space-y-6">
      {eyebrow && (
        <div className="text-xs uppercase tracking-[0.4em] text-accent">{eyebrow}</div>
      )}
      <h2 className="text-4xl md:text-5xl text-gradient-gold">{title}</h2>
      <div className="space-y-4 text-foreground/85 leading-relaxed text-lg">{children}</div>
    </section>
  );
}
