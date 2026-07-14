import LibraryIcon from "@/components/icons/LibraryIcon";
import IconBadge from "@/components/layout/IconBadge";

const itemStyle =
  "bg-surface flex h-12 w-full items-center justify-between rounded-lg px-4 text-base text-white hover:bg-gray-900";

const projects = ["Untitled"];

export default function LibraryNav() {
  return (
    <div className="flex flex-col gap-4">
      <h3 className="flex items-center gap-2 px-4 py-3 text-xl text-white">
        <IconBadge icon={LibraryIcon} />
        내 라이브러리
      </h3>

      <ul className="flex flex-col gap-2 pl-10">
        {projects.map((project) => (
          <li key={project}>
            <button type="button" className={itemStyle}>
              <span>{project}</span>
              <span className="text-xs text-gray-500" aria-hidden>
                ▸
              </span>
            </button>
          </li>
        ))}

        <li>
          <button type="button" className={`${itemStyle} text-[#999]`}>
            <span>새 프로젝트</span>
            <span className="text-base text-gray-500" aria-hidden>
              +
            </span>
          </button>
        </li>
      </ul>
    </div>
  );
}
