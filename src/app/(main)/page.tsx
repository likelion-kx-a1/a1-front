const featureCards = ["이미지 생성", "비디오 생성", "역 프롬프트"];

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
        {featureCards.map((label) => (
          <div
            key={label}
            className="flex cursor-pointer items-center justify-center rounded-xl bg-gray-600 text-gray-300"
          >
            {label}
          </div>
        ))}
      </div>
    </div>
  );
}