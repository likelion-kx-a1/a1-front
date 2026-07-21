import type { SVGProps } from "react";

interface ClockArrowIconProps extends SVGProps<SVGSVGElement> {
  /** 화살표 방향 — 최신순은 "down", 오래된순은 "up" */
  direction: "down" | "up";
}

/** 정렬 순서를 나타내는 시계+화살표 아이콘 */
export default function ClockArrowIcon({ direction, ...props }: ClockArrowIconProps) {
  const down = direction === "down";

  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      {down ? (
        <>
          <path d="M12.338 21.994A10 10 0 1 1 21.925 13.227" />
          <path d="M12 6v6l2 1" />
          <path d="m14 18 4 4 4-4" />
          <path d="M18 14v8" />
        </>
      ) : (
        <>
          <path d="M13.228 21.925A10 10 0 1 1 21.994 12.338" />
          <path d="M12 6v6l1.562.781" />
          <path d="m14 18 4-4 4 4" />
          <path d="M18 22v-8" />
        </>
      )}
    </svg>
  );
}
