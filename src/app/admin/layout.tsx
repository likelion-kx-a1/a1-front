import Header from "@/components/layout/Header";

/** 관리자 페이지 전용 레이아웃 — 사이드바 없이 헤더만 표시 */
export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex min-h-0 flex-1 flex-col overflow-hidden bg-black text-gray-100">
      <Header />
      <main className="min-h-0 flex-1 overflow-y-auto px-8 pb-16">{children}</main>
    </div>
  );
}

