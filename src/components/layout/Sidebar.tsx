import Link from "next/link";
import HomeIcon from "@/components/icons/HomeIcon";
import ImageIcon from "@/components/icons/ImageIcon";
import ReversePromptIcon from "@/components/icons/ReversePromptIcon";
import VideoIcon from "@/components/icons/VideoIcon";
import IconBadge from "@/components/layout/IconBadge";
import LibraryNav from "@/components/layout/LibraryNav";
import Logo from "@/components/layout/Logo";

/** 생성 메뉴 */
const createMenus = [
  { label: "이미지 생성", href: "/image", icon: ImageIcon },
  { label: "비디오 생성", href: "/video", icon: VideoIcon },
  { label: "역 프롬프트", href: "/reverse-prompt", icon: ReversePromptIcon },
];

const menuStyle = "flex items-center gap-2 rounded-lg px-4 py-3 text-xl hover:bg-gray-900";

export default function Sidebar() {
  return (
    <aside className="bg-background border-border flex w-90 shrink-0 flex-col gap-10 border-r-2 p-6 text-gray-200">
      <Logo className="p-2" />

      <nav aria-label="주요 메뉴" className="flex flex-1 flex-col gap-4">
        <ul>
          <li>
            <Link href="/" className={menuStyle}>
              <IconBadge icon={HomeIcon} />
              <span>홈</span>
            </Link>
          </li>
        </ul>

        <hr aria-hidden className="border-gray-800" />

        <ul className="flex flex-col gap-4">
          {createMenus.map((menu) => (
            <li key={menu.label}>
              <Link href={menu.href} className={menuStyle}>
                <IconBadge icon={menu.icon} />
                <span>{menu.label}</span>
              </Link>
            </li>
          ))}
        </ul>

        <hr aria-hidden className="border-gray-800" />

        <LibraryNav />
      </nav>
    </aside>
  );
}
