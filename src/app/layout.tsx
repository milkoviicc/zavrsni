import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "./context/AuthProvider";
import Footer from "./components/Footer/Footer";
import Navbar from "./components/Navbar/Navbar";

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
          <Navbar />
          {children}
          <Footer />
        </body>
      </html>
    </AuthProvider>
  );
}
