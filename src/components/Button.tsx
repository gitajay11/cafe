import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from "react";
import { cn } from "../lib/media";

type Variant = "solid" | "glass" | "ghost";
type Size = "sm" | "md";

interface BaseProps {
  variant?: Variant;
  size?: Size;
  className?: string;
  children: ReactNode;
}

type AnchorProps = BaseProps & { href: string } & Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "href" | "className">;
type NativeButtonProps = BaseProps & { href?: undefined } & Omit<ButtonHTMLAttributes<HTMLButtonElement>, "className">;

const base =
  "group/btn inline-flex items-center justify-center gap-2 rounded-full font-body font-medium uppercase tracking-[0.16em] whitespace-nowrap transition-[background-color,color,transform,box-shadow] duration-500 ease-cinematic focus-visible:outline-offset-4 active:scale-[0.98]";

const sizes: Record<Size, string> = {
  sm: "h-10 px-5 text-[11px]",
  md: "h-12 px-7 text-[12px] sm:h-[52px] sm:px-8",
};

const variants: Record<Variant, string> = {
  solid: "bg-cream text-ink hover:bg-white hover:shadow-[0_12px_40px_-12px_rgba(242,232,219,0.5)]",
  glass: "liquid-glass text-cream hover:bg-white/[0.08]",
  ghost: "text-cream/80 hover:text-cream",
};

/** Site-wide CTA. Renders an `<a>` when `href` is given, else a `<button>`. */
export function Button(props: AnchorProps | NativeButtonProps) {
  const { variant = "solid", size = "md", className, children, ...rest } = props;
  const classes = cn(base, sizes[size], variants[variant], className);

  if (rest.href !== undefined) {
    return (
      <a className={classes} {...(rest as AnchorHTMLAttributes<HTMLAnchorElement>)}>
        {children}
      </a>
    );
  }

  const { type = "button", ...button } = rest as ButtonHTMLAttributes<HTMLButtonElement>;
  return (
    <button type={type} className={classes} {...button}>
      {children}
    </button>
  );
}

/** Arrow that nudges right on hover. Place inside a `Button`. */
export function ArrowRight({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className={cn(
        "h-4 w-4 transition-transform duration-500 ease-cinematic group-hover/btn:translate-x-1",
        className,
      )}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  );
}
