import "./globals.css";
import Navbar from "@/components/Navbar";
import {  Fredoka } from "next/font/google";

const fredoka = Fredoka({
  weight: "700",
  subsets: ["latin"],
});
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${fredoka.className} antialiased`}>
        <Navbar />
        {children}
      </body>
    </html>
  );
}
