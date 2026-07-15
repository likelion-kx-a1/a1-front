import type { SVGProps } from "react";

/** 위쪽을 가리키는 삼각형 아이콘 */
export default function CaretIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path
        d="M12.7071 9.70711L16.9757 13.9757C17.3537 14.3537 17.086 15 16.5515 15H7.44853C6.91399 15 6.64629 14.3537 7.02426 13.9757L11.2929 9.70711C11.6834 9.31658 12.3166 9.31658 12.7071 9.70711Z"
        fill="currentColor"
      />
    </svg>
  );
}
