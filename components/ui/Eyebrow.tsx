import { cn } from "@/lib/cn";

interface Props {
  children: React.ReactNode;
  className?: string;
  /** Flip color to --gold-dark when rendered on a --paper (cream) section. */
  onPaper?: boolean;
}

export function Eyebrow({ children, className, onPaper = false }: Props) {
  return (
    <span className={cn("eyebrow", onPaper && "on-paper", className)}>
      {children}
    </span>
  );
}
