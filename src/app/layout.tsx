import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "./context/AuthProvider";

export const metadata: Metadata = {
  title: "Društvena mreža",
  description: "Društvena mreža u nextjs-u.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <AuthProvider>
      <html lang="en">
        <body>
          {children}
        </body>
      </html>
    </AuthProvider>
  );
}
