import type { SVGProps } from "react";

export type IconName =
  | "moon"
  | "sun"
  | "book"
  | "arrow"
  | "left"
  | "right"
  | "search"
  | "close"
  | "grid"
  | "check"
  | "shuffle"
  | "eye"
  | "eye-off"
  | "volume"
  | "settings"
  | "phone"
  | "download"
  | "share"
  | "plus"
  | "leaf";

const paths: Record<IconName, React.ReactNode> = {
  moon: <path d="M20.5 13.1A8.5 8.5 0 0 1 10.9 3.5 8.5 8.5 0 1 0 20.5 13.1Z" />,
  sun: (
    <>
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2m0 16v2M2 12h2m16 0h2M5 5l1.5 1.5m11 11L19 19M5 19l1.5-1.5m11-11L19 5" />
    </>
  ),
  phone: (
    <>
      <rect x="6" y="2" width="12" height="20" rx="3" />
      <path d="M10 5h4M11 18h2" />
    </>
  ),
  download: (
    <>
      <path d="M12 3v12m-4-4 4 4 4-4M5 16v4h14v-4" />
    </>
  ),
  share: (
    <>
      <path d="M12 15V2m-4 4 4-4 4 4M7 9H4v12h16V9h-3" />
    </>
  ),
  plus: <path d="M12 5v14M5 12h14" />,
  book: (
    <>
      <path d="M12 5.5C8.5 3.5 5 4 3 5v14c3-1.5 6-1 9 1 3-2 6-2.5 9-1V5c-2-1-5.5-1.5-9 .5Z" />
      <path d="M12 5.5V20M6 8l3 1m-3 3 3 1m6-4 3-1m-3 5 3-1" />
    </>
  ),
  arrow: (
    <>
      <path d="M4 12h16m-6-6 6 6-6 6" />
    </>
  ),
  left: <path d="m14 6-6 6 6 6" />,
  right: <path d="m10 6 6 6-6 6" />,
  search: (
    <>
      <circle cx="10.5" cy="10.5" r="6.5" />
      <path d="m16 16 4 4" />
    </>
  ),
  close: <path d="m6 6 12 12M6 18 18 6" />,
  grid: (
    <>
      <rect x="4" y="4" width="6" height="6" rx="1" />
      <rect x="14" y="4" width="6" height="6" rx="1" />
      <rect x="4" y="14" width="6" height="6" rx="1" />
      <rect x="14" y="14" width="6" height="6" rx="1" />
    </>
  ),
  check: <path d="m5 12 4 4L19 6" />,
  shuffle: (
    <>
      <path d="M3 6h3c5 0 7 12 12 12h3m-4-4 4 4-4 4M3 18h3c1.5 0 2.7-1 3.8-2.5M14 8.5C15.2 7 16.4 6 18 6h3m-4-4 4 4-4 4" />
    </>
  ),
  eye: (
    <>
      <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7Z" />
      <circle cx="12" cy="12" r="3" />
    </>
  ),
  "eye-off": (
    <>
      <path d="m3 3 18 18M10.6 5.1 12 5c6.5 0 10 7 10 7a21 21 0 0 1-3 4M6 6a22 22 0 0 0-4 6s3.5 7 10 7c1.7 0 3.2-.5 4.5-1.1M10 10a3 3 0 0 0 4 4" />
    </>
  ),
  volume: (
    <>
      <path d="m11 4-6 5H2v6h3l6 5V4Zm4 4a6 6 0 0 1 0 8m3-11a10 10 0 0 1 0 14" />
    </>
  ),
  settings: (
    <>
      <path d="M4 7h16M4 17h16" />
      <circle cx="9" cy="7" r="3" fill="currentColor" stroke="none" />
      <circle cx="15" cy="17" r="3" fill="currentColor" stroke="none" />
    </>
  ),
  leaf: (
    <>
      <path d="M19 3C8 2 2 8 5 15s16 5 14-12Z" />
      <path d="M4 21 15 9M8 16l-1-6m5 2h5" />
    </>
  ),
};

export default function Icon({
  name,
  ...props
}: SVGProps<SVGSVGElement> & { name: IconName }) {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...props}
    >
      {paths[name]}
    </svg>
  );
}
