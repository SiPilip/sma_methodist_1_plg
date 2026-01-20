import TanstackProvider from "@/providers/TanstackProvider";
import "./globals.css";
import { Poppins } from "next/font/google";
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'


const poppins = Poppins({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id" suppressHydrationWarning>
      <body className={poppins.className}>
        <TanstackProvider>
          {children}
          <ReactQueryDevtools initialIsOpen={false} />
        </TanstackProvider>
      </body>
    </html>
  );
}