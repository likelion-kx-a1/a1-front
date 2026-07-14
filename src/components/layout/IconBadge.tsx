import type { ComponentType, SVGProps } from "react";

interface IconBadgeProps {
  icon?: ComponentType<SVGProps<SVGSVGElement>>;
}

export default function IconBadge({ icon: Icon }: IconBadgeProps) {
  return (
    <span className="bg-card flex size-10 shrink-0 items-center justify-center rounded-lg" aria-hidden>
      {Icon ? <Icon className="size-6 text-white" /> : <span className="size-6 rounded-md bg-gray-400" />}
    </span>
  );
}
