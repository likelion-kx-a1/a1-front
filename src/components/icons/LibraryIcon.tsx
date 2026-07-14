import type { SVGProps } from "react";

export default function LibraryIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path
        d="M8 1H2C1.44772 1 1 1.44772 1 2V18C1 18.5523 1.44772 19 2 19H8C8.55228 19 9 18.5523 9 18V2C9 1.44772 8.55228 1 8 1Z"
        stroke="currentColor"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M5 1V19M18.4 16.9C18.6 17.4 18.3 18 17.8 18.2L15.9 18.9C15.4 19.1 14.8 18.8 14.6 18.3L9.1 3.1C8.9 2.6 9.2 2 9.7 1.8L11.6 1.1C12.1 0.9 12.7 1.2 12.9 1.7L18.4 16.9Z"
        stroke="currentColor"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
