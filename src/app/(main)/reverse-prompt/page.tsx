/** 역 프롬프트 페이지*/

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

export default function ReversePromptPage() {
  return (
    <div className="flex h-full flex-col gap-4 pt-2">
      {/* 타이틀 + 프로젝트 선택*/}
      <div className="flex flex-col gap-3">
        <h1 className="text-xl font-bold text-white">역 프롬프트</h1>
        <div className="w-52">
          <OptionBox label="Untitled" chevron />
        </div>
      </div>

      {/* 캔버스 영역 */}
      <div className="flex-1" />

      <div className="rounded-2xl bg-gray-800/60 p-4">
        <div className="flex h-40 items-center justify-center rounded-xl border border-dashed border-gray-600 text-sm text-gray-500">
          이미지를 드래그 하거나 추가하세요
        </div>
      </div>
    </div>
  );
}
