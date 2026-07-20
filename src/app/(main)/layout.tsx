import Sidebar from "@/components/layout/Sidebar";
import Header from "@/components/layout/Header";

/** 사이드바 + 헤더가 있는 일반 화면 레이아웃 (관리자 페이지는 별도 레이아웃 사용) */
export default function MainLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex min-h-0 flex-1 bg-black text-gray-100">
      <Sidebar />
      <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
        <Header />
        <main className="min-h-0 flex-1 overflow-y-auto px-8 pb-16">{children}</main>
      </div>
    </div>
  );
}
