import type { SVGProps } from "react";

export default function TimerIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 18 22" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path
        d="M7 1H11M9 13L12 10"
        stroke="currentColor"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M9 21C13.4183 21 17 17.4183 17 13C17 8.58172 13.4183 5 9 5C4.58172 5 1 8.58172 1 13C1 17.4183 4.58172 21 9 21Z"
        stroke="currentColor"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
