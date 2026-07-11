import Link from "next/link";

/** href가 있으면 해당 페이지로 이동, 없으면 아직 준비 전 */
const featureCards: { label: string; href: string | null }[] = [
  { label: "이미지 생성", href: "/image" },
  { label: "비디오 생성", href: "/video" },
  { label: "역 프롬프트", href: null },
];

const cardStyle =
  "flex cursor-pointer items-center justify-center rounded-xl bg-gray-600 text-gray-300";

export default function Home() {
  return (
    <div className="flex flex-col gap-4 pt-2">
      {/* 랜딩 히어로 (좌: 랜딩 비디오, 우: 스택 2개) */}
      <div className="grid h-[400px] grid-cols-3 grid-rows-2 gap-4">
        <div className="col-span-2 row-span-2 flex cursor-pointer items-center justify-center rounded-xl bg-gray-600 text-gray-300">
          랜딩 비디오
        </div>
        <div className="cursor-pointer rounded-xl bg-gray-600" />
        <div className="cursor-pointer rounded-xl bg-gray-600" />
      </div>

      {/* 기능 카드 3개 */}
      <div className="grid h-[180px] grid-cols-3 gap-4">
        {featureCards.map((card) =>
          card.href ? (
            <Link key={card.label} href={card.href} className={cardStyle}>
              {card.label}
            </Link>
          ) : (
            <div key={card.label} className={cardStyle}>
              {card.label}
            </div>
          ),
        )}
      </div>
    </div>
  );
}
