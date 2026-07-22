import type { SVGProps } from "react";

/** 생성 버튼에 쓰이는 아이콘 */
export default function StarIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path
        d="M12 2L14.1 8.4C14.3 9 14.8 9.5 15.4 9.7L22 12L15.4 14.1C14.8 14.3 14.3 14.8 14.1 15.4L12 22L9.9 15.4C9.7 14.8 9.2 14.3 8.6 14.1L2 12L8.6 9.9C9.2 9.7 9.7 9.2 9.9 8.6L12 2Z"
        fill="currentColor"
      />
    </svg>
  );
}
