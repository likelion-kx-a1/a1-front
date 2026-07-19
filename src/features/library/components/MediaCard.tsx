import Link from "next/link";

interface MediaCardProps {
  title: string;
  caption?: string;
  previewUrl?: string;
  mediaType?: "IMAGE" | "VIDEO";
  href?: string;
}

export default function MediaCard({
  title,
  caption,
  previewUrl,
  mediaType = "IMAGE",
  href,
}: MediaCardProps) {
  const content = (
    <>
      <div className="aspect-video w-full overflow-hidden rounded-lg bg-gray-800">
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
      </div>
      <h3 className="truncate text-sm font-medium text-white">{title}</h3>
      {caption && <p className="truncate text-sm text-gray-500">{caption}</p>}
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
