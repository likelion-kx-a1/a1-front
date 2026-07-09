import LibraryNav from "@/features/library/components/LibraryNav";

const createMenus = ["이미지 생성", "비디오 생성", "스토리보드 생성"];

/** 임시 아이콘 자리표시 */
function IconPlaceholder() {
  return <span className="size-6 shrink-0 rounded-md bg-gray-400" aria-hidden />;
}

export default function Sidebar() {
  return (
    <aside className="flex w-64 shrink-0 flex-col border-r border-gray-800 bg-black text-gray-200">
      {/* 서비스명 */}
      <div className="flex items-center gap-3 px-5 py-5">
        <span className="size-8 rounded-md bg-gray-300" aria-hidden />
        <span className="text-lg font-bold text-white">서비스명</span>
      </div>

      {/* 네비게이션 */}
      <nav className="flex flex-1 flex-col gap-1 px-3">
        <button className="flex items-center gap-3 rounded-lg px-2 py-2 text-left hover:bg-gray-900">
          <IconPlaceholder />
          <span>홈</span>
        </button>

        {/* 라이브러리 (접기/펼치기 토글) */}
        <LibraryNav />

        <hr className="my-2 border-gray-800" />

        {/* 생성 메뉴 */}
        {createMenus.map((menu) => (
          <button
            key={menu}
            className="flex items-center gap-3 rounded-lg px-2 py-2 text-left hover:bg-gray-900"
          >
            <IconPlaceholder />
            <span>{menu}</span>
          </button>
        ))}
      </nav>

      {/* 계정 */}
      <div className="flex items-center gap-3 border-t border-gray-800 px-5 py-4">
        <span className="size-8 rounded-full bg-gray-300" aria-hidden />
        <div className="flex flex-col leading-tight">
          <span className="text-sm text-white">계정</span>
          <span className="text-xs text-gray-500">구독 상태</span>
        </div>
      </div>
    </aside>
  );
}
