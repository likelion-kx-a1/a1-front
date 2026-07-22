import Link from "next/link";
import ArrowUpRightIcon from "@/components/icons/ArrowUpRightIcon";

const featureCards: { label: string; href: string }[] = [
  { label: "이미지 생성", href: "/image" },
  { label: "비디오 생성", href: "/video" },
  { label: "역 프롬프트", href: "/reverse-prompt" },
];

export default function Home() {
  return (
    <div className="flex flex-col gap-10 pt-2">
      {/* 랜딩 히어로 */}
      <section
        aria-label="랜딩 비디오"
        className="flex aspect-[1480/640] items-center justify-center overflow-hidden rounded-[32px] bg-[#222] p-[10px]"
      >
        <p className="text-[40px] text-white/10">랜딩 비디오</p>
      </section>

      {/* 바로가기 카드 3개 */}
      <nav aria-label="빠른 이동">
        <ul className="grid grid-cols-3 gap-6">
          {featureCards.map((card) => (
            <li key={card.label}>
              <Link
                href={card.href}
                className="bg-surface relative flex h-[200px] items-end overflow-hidden rounded-2xl p-6"
              >
                <span
                  aria-hidden
                  className="absolute inset-0 bg-gradient-to-b from-transparent to-black/60"
                />
                <span className="relative flex w-full items-center justify-between">
                  <h2 className="text-2xl font-medium text-white">{card.label}</h2>
                  <ArrowUpRightIcon className="size-8 text-white" aria-hidden />
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
}
