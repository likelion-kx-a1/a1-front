import MediaCard from "./MediaCard";

interface CardItem {
  title: string;
  caption: string;
}

interface CardSectionProps {
  heading: string;
  items: CardItem[];
}

export default function CardSection({ heading, items }: CardSectionProps) {
  return (
    <section className="flex flex-col gap-4">
      <h2 className="text-2xl font-bold text-white">{heading}</h2>
      <div className="grid grid-cols-2 gap-x-6 gap-y-6 md:grid-cols-3 xl:grid-cols-4">
        {items.map((item, index) => (
          <MediaCard key={index} title={item.title} caption={item.caption} />
        ))}
      </div>
    </section>
  );
}
