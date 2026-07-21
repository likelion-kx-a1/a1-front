import type { SVGProps } from "react";

/** 위쪽을 가리키는 삼각형 아이콘 */
export default function CaretIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path
        d="M12.5657 9.43431L17.7314 14.6C18.3611 15.2297 17.9151 16.3071 17.0245 16.3071H6.97554C6.08495 16.3071 5.63892 15.2297 6.26863 14.6L11.4343 9.43431C11.7467 9.12189 12.2533 9.12189 12.5657 9.43431Z"
        fill="currentColor"
      />
    </svg>
  );
}
