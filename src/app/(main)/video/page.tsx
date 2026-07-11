/** 비디오 생성 페이지 */

const OPTION_LABELS = ["1:1", "1K", '5-6"'];

function OptionBox({ label, chevron = false }: { label: string; chevron?: boolean }) {
  return (
    <div className="flex items-center justify-between gap-2 rounded-lg bg-gray-800 px-3 py-2 text-sm text-gray-200">
      <span className="flex items-center gap-2">
        <span className="size-4 shrink-0 rounded bg-gray-400" aria-hidden />
        {label}
      </span>
      {chevron && (
        <span className="text-xs text-gray-400" aria-hidden>
          ▼
        </span>
      )}
    </div>
  );
}

function FrameBox({ label }: { label: string }) {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-2 rounded-lg bg-gray-700 py-6 text-sm text-gray-300">
      <span className="size-6 rounded bg-gray-500" aria-hidden />
      {label}
    </div>
  );
}

function FrameAddBox({ label }: { label: string }) {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-2 rounded-lg bg-gray-700/60 py-6 text-sm text-gray-500">
      <span className="text-xl leading-none text-gray-400" aria-hidden>
        +
      </span>
      {label}
    </div>
  );
}

export default function VideoGenerationPage() {
  return (
    <div className="flex h-full flex-col gap-4 pt-2">
      {/* 타이틀 + 프로젝트 선택 */}
      <div className="flex flex-col gap-3">
        <h1 className="text-xl font-bold text-white">비디오 생성</h1>
        <div className="w-52">
          <OptionBox label="Untitled" chevron />
        </div>
      </div>

      {/* 튜토리얼(캔버스) 영역 */}
      <div className="flex flex-1 items-center justify-center rounded-xl bg-gray-900/50 text-lg text-gray-600">
        튜토리얼
      </div>

      {/* 프레임 카드 */}
      <div className="rounded-2xl bg-gray-800/60 p-5">
        <div className="flex gap-3">
          <FrameBox label="시작 프레임" />
          <FrameBox label="마지막 프레임" />
          <FrameAddBox label="프레임 추가" />
        </div>
        <div className="mt-4 text-sm text-gray-500">
          <p>이미지를 설명해주세요</p>
          <p>참고 이미지를 추가해 완성도를 높여보세요</p>
        </div>
      </div>

      {/* 옵션 + 생성 버튼*/}
      <div className="flex items-center justify-between pb-2">
        <div className="flex gap-2">
          {OPTION_LABELS.map((label) => (
            <OptionBox key={label} label={label} />
          ))}
        </div>
        <div className="flex items-center gap-3">
          <span className="text-sm text-gray-500">000</span>
          <div className="bg-primary-500 flex size-10 items-center justify-center rounded-lg">
            <span className="size-5 rounded bg-white/80" aria-hidden />
          </div>
        </div>
      </div>
    </div>
  );
}
