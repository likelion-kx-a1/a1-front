import ImageIcon from "@/components/icons/ImageIcon";
import VideoIcon from "@/components/icons/VideoIcon";
import Link from "next/link";

interface MediaCardProps {
  title: string;
  caption?: string;
  previewUrl?: string;
  mediaType?: "IMAGE" | "VIDEO";
  mediaTypeLabel?: string;
  metaLine?: string;
  href?: string;
}

export default function MediaCard({
  title,
  caption,
  previewUrl,
  mediaType = "IMAGE",
  mediaTypeLabel,
  metaLine,
  href,
}: MediaCardProps) {
  const TypeIcon = mediaType === "VIDEO" ? VideoIcon : ImageIcon;
  const typeLabel = mediaTypeLabel ?? (mediaType === "VIDEO" ? "비디오" : "이미지");

  const content = (
    <>
      <div className="relative aspect-video w-full overflow-hidden rounded-lg bg-gray-800">
        {previewUrl ? (
          mediaType === "VIDEO" ? (
            <video
              src={previewUrl}
              muted
              playsInline
              preload="metadata"
              className="size-full object-cover"
            />
          ) : (
            <img src={previewUrl} alt={title} className="size-full object-cover" />
          )
        ) : null}
        <span className="absolute top-3 right-3 flex size-8 items-center justify-center rounded-lg bg-black/50">
          <TypeIcon className="size-4 text-white" aria-hidden />
        </span>
      </div>
      <div className="flex flex-col gap-1">
        <h3 className="truncate text-base font-medium text-white">{title}</h3>
        <p className="text-sm text-gray-400">{typeLabel}</p>
        {metaLine && <p className="text-xs text-gray-500">{metaLine}</p>}
        {caption && <p className="text-xs text-gray-600">{caption}</p>}
      </div>
    </>
  );

  if (href) {
    return (
      <Link href={href} className="flex cursor-pointer flex-col gap-2">
        {content}
      </Link>
    );
  }

  return <article className="flex flex-col gap-2">{content}</article>;
}
