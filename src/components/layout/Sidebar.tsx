import Link from "next/link";
import LibraryNav from "@/components/layout/LibraryNav";

/** 생성 메뉴 (href가 있으면 이동, 없으면 아직 페이지 준비 전) */
const createMenus: { label: string; href: string | null }[] = [
  { label: "이미지 생성", href: "/image" },
  { label: "비디오 생성", href: "/video" },
  { label: "역 프롬프트", href: null },
];

const menuStyle = "flex items-center gap-3 rounded-lg px-2 py-2 text-left hover:bg-gray-900";

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
        <Link href="/" className={menuStyle}>
          <IconPlaceholder />
          <span>홈</span>
        </Link>

        {/* 생성 메뉴 */}
        {createMenus.map((menu) =>
          menu.href ? (
            <Link key={menu.label} href={menu.href} className={menuStyle}>
              <IconPlaceholder />
              <span>{menu.label}</span>
            </Link>
          ) : (
            <button key={menu.label} className={menuStyle}>
              <IconPlaceholder />
              <span>{menu.label}</span>
            </button>
          ),
        )}

        <hr className="my-2 border-gray-800" />

        <LibraryNav />
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
