import type { Metadata } from "next";
import "./globals.css";
import Sidebar from "@/components/layout/Sidebar";
import Header from "@/components/layout/Header";

export const metadata: Metadata = {
  title: "A1 생성형 AI 통합 엔진",
  description: "방송 제작자를 위한 AI 이미지·영상 생성 및 미디어 라이브러리 서비스",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" className="h-full antialiased">
      <body className="flex min-h-full flex-col">
        {/* 앱 셸: 사이드바 + 헤더는 모든 화면 공통 */}
        <div className="flex flex-1 bg-black text-zinc-100">
          <Sidebar />
          <div className="flex flex-1 flex-col overflow-hidden">
            <Header />
            <main className="flex-1 overflow-y-auto px-8 pb-16">{children}</main>
          </div>
        </div>
      </body>
    </html>
  );
}
