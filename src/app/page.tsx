import CardSection from "@/features/library/components/CardSection";

/** 더미 데이터 */
const exampleItems = Array.from({ length: 4 }, (_, i) => ({
  title: `영상예제${i + 1}`,
  caption: "캡션",
}));

const sections = ["타이틀", "타이틀", "타이틀"];

export default function Home() {
  return (
    <div className="flex flex-col gap-10 pt-2">
      {sections.map((heading, index) => (
        <CardSection key={index} heading={heading} items={exampleItems} />
      ))}
    </div>
  );
}
