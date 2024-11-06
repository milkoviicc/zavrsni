'use client';
import "../../globals.css";


export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <center className="h-full">
    <div className="w-full h-full">
        {children}
    </div>
    </center>
  );
}