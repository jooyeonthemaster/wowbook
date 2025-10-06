import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "맑음 - 21회 서울와우북페스티벌 추천",
  description: "당신의 마음을 맑게 하는 와우북페스티벌 프로그램을 찾아보세요",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
