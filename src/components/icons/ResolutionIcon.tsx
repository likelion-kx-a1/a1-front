import type { SVGProps } from "react";

/**
 * 해상도(품질) 설정 아이콘.
 */
export default function ResolutionIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="-4.5 -4.5 27 27" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path
        d="M11 14H2M16 4H7"
        stroke="currentColor"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M14 17C15.6569 17 17 15.6569 17 14C17 12.3431 15.6569 11 14 11C12.3431 11 11 12.3431 11 14C11 15.6569 12.3431 17 14 17Z"
        stroke="currentColor"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M4 7C5.65685 7 7 5.65685 7 4C7 2.34315 5.65685 1 4 1C2.34315 1 1 2.34315 1 4C1 5.65685 2.34315 7 4 7Z"
        stroke="currentColor"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
