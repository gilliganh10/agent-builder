import type { LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

interface DataTableEmptyProps {
  icon: LucideIcon;
  title: string;
  description: string;
  ctaLabel?: string;
  onCta?: () => void;
}

export function DataTableEmpty({
  icon: Icon,
  title,
  description,
  ctaLabel,
  onCta,
}: DataTableEmptyProps) {
  const showCta = Boolean(ctaLabel && onCta);

  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border/70 bg-card px-6 py-16 text-center shadow-sm">
      <div className="mb-4 rounded-2xl bg-muted/40 p-3">
        <Icon className="h-6 w-6 text-muted-foreground/70" />
      </div>
      <h3 className="text-sm font-semibold">{title}</h3>
      <p className="mt-1.5 max-w-sm text-sm leading-6 text-muted-foreground">
        {description}
      </p>
      {showCta && (
        <Button className="mt-5 rounded-xl" size="sm" onClick={onCta}>
          {ctaLabel}
        </Button>
      )}
    </div>
  );
}
