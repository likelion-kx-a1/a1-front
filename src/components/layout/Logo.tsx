import Link from "next/link";
import { twMerge } from "tailwind-merge";

interface LogoProps {
  /** 아이콘만 노출할지 여부 (기본값: 아이콘 + 워드마크) */
  iconOnly?: boolean;
  /** 클릭 시 이동할 경로. null이면 링크 없이 렌더링 */
  href?: string | null;
  className?: string;
}

export default function Logo({ iconOnly = false, href = "/", className }: LogoProps) {
  const hasVisibleText = !iconOnly;

  const content = (
    <span className={twMerge("inline-flex items-center gap-2", className)}>
      <img
        src="/images/logo/logo-mark.png"
        alt={hasVisibleText ? "" : "GeNova"}
        width={40}
        height={40}
        className="size-10"
      />
      {hasVisibleText && (
        <span className="from-primary-500 to-secondary-500 bg-gradient-to-r bg-clip-text font-logo text-2xl font-medium tracking-tight text-transparent">
          GeNova
        </span>
      )}
    </span>
  );

  if (!href) {
    return content;
  }

  return (
    <Link href={href} aria-label={hasVisibleText ? undefined : "GeNova 홈으로 이동"}>
      {content}
    </Link>
  );
}
