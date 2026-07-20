import MediaCard from "./MediaCard";

interface CardItem {
  id?: number;
  title: string;
  caption?: string;
  previewUrl?: string;
  mediaType?: "IMAGE" | "VIDEO";
  mediaTypeLabel?: string;
  metaLine?: string;
  href?: string;
}

interface CardSectionProps {
  heading: string;
  items: CardItem[];
}

export default function CardSection({ heading, items }: CardSectionProps) {
  return (
    <section className="flex flex-col gap-4" aria-labelledby="card-section-heading">
      <h2 id="card-section-heading" className="sr-only">
        {heading}
      </h2>
      <ul className="grid grid-cols-2 gap-x-6 gap-y-8 md:grid-cols-3 xl:grid-cols-4">
        {items.map((item, index) => (
          <li key={item.id ?? index}>
            <MediaCard
              title={item.title}
              caption={item.caption}
              previewUrl={item.previewUrl}
              mediaType={item.mediaType}
              mediaTypeLabel={item.mediaTypeLabel}
              metaLine={item.metaLine}
              href={item.href}
            />
          </li>
        ))}
      </ul>
    </section>
  );
}
