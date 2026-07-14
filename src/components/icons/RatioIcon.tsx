interface RatioIconProps {
  /** "16:9" 형식의 가로:세로 비율 */
  ratio: string;
  className?: string;
}

/** 비율 문자열에 맞춰 가로/세로 모양이 실제로 달라지는 사각형 아이콘 */
export default function RatioIcon({ ratio, className }: RatioIconProps) {
  const [w, h] = ratio.split(":").map(Number);
  const wide = w >= h;

  return (
    <span aria-hidden className={className ?? "flex size-8 shrink-0 items-center justify-center"}>
      <span
        className="bg-gray-400"
        style={{
          aspectRatio: `${w} / ${h}`,
          width: wide ? "100%" : "auto",
          height: wide ? "auto" : "100%",
        }}
      />
    </span>
  );
}
