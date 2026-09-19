import type { SVGProps } from "react";

type IconProps = SVGProps<SVGSVGElement>;

const defaults: IconProps = {
  "aria-hidden": true,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.5,
  strokeLinecap: "round",
  strokeLinejoin: "round",
};

export const PhoneIcon = (props: IconProps) => (
  <svg {...defaults} {...props}>
    <path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2z" />
  </svg>
);

export const MailIcon = (props: IconProps) => (
  <svg {...defaults} {...props}>
    <rect x="3" y="5" width="18" height="14" rx="2" />
    <path d="m3 7 9 6 9-6" />
  </svg>
);

export const InstagramIcon = (props: IconProps) => (
  <svg {...defaults} {...props}>
    <rect x="3" y="3" width="18" height="18" rx="5" />
    <circle cx="12" cy="12" r="4" />
    <circle cx="17.5" cy="6.5" r="0.8" fill="currentColor" stroke="none" />
  </svg>
);

export const FacebookIcon = (props: IconProps) => (
  <svg {...defaults} {...props}>
    <path d="M14 8h2V5h-2a3 3 0 0 0-3 3v2H9v3h2v7h3v-7h2l1-3h-3V8z" />
  </svg>
);

export const PinIcon = (props: IconProps) => (
  <svg {...defaults} {...props}>
    <path d="M12 21s-6-5.5-6-11a6 6 0 1 1 12 0c0 5.5-6 11-6 11z" />
    <circle cx="12" cy="10" r="2.2" />
  </svg>
);

export const ClockIcon = (props: IconProps) => (
  <svg {...defaults} {...props}>
    <circle cx="12" cy="12" r="9" />
    <path d="M12 7v5l3 2" />
  </svg>
);

export const ChevronDownIcon = (props: IconProps) => (
  <svg {...defaults} {...props}>
    <path d="m6 9 6 6 6-6" />
  </svg>
);

export const CheckIcon = (props: IconProps) => (
  <svg {...defaults} {...props}>
    <path d="m5 12 4.5 4.5L19 7" />
  </svg>
);

export const AlertIcon = (props: IconProps) => (
  <svg {...defaults} {...props}>
    <circle cx="12" cy="12" r="9" />
    <path d="M12 8v5M12 16h.01" />
  </svg>
);

export const SoundIcon = ({ on = false, ...props }: IconProps & { on?: boolean }) => (
  <svg {...defaults} {...props}>
    <path d="M4 10v4h3l4 3V7L7 10H4z" />
    {on ? (
      <>
        <path d="M15 9.5a3.5 3.5 0 0 1 0 5" />
        <path d="M17.5 7a7 7 0 0 1 0 10" />
      </>
    ) : (
      <path d="m15 9.5 4 5M19 9.5l-4 5" />
    )}
  </svg>
);

export const InfoIcon = (props: IconProps) => (
  <svg {...defaults} {...props}>
    <circle cx="12" cy="12" r="9" />
    <path d="M12 11v5M12 8h.01" />
  </svg>
);

export const CloseIcon = (props: IconProps) => (
  <svg {...defaults} {...props}>
    <path d="M6 6l12 12M18 6 6 18" />
  </svg>
);

export const LeafIcon = (props: IconProps) => (
  <svg {...defaults} {...props}>
    <path d="M5 19c0-8 5-13 14-14-1 9-6 14-14 14z" />
    <path d="M5 19c3-4 6-7 10-10" />
  </svg>
);
