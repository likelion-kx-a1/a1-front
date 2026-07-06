interface MediaCardProps {
  title: string;
  caption: string;
}

export default function MediaCard({ title, caption }: MediaCardProps) {
  return (
    <article className="flex cursor-pointer flex-col gap-2">
      {/* 썸네일 자리표시자 */}
      <div className="aspect-video w-full rounded-lg bg-zinc-800" />
      <h3 className="text-sm font-medium text-white">{title}</h3>
      <p className="text-sm text-zinc-500">{caption}</p>
    </article>
  );
}
