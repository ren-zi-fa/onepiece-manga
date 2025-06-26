import { Github } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function Navbar() {
  return (
    <div className="flex items-center justify-between shadow-sm mb-4 border-2 p-4 rounded-2xl flex-wrap gap-4">
      {/* Logo */}
      <Link href="/">
        <Image
          src="/logo.png"
          width={80}
          height={70}
          alt="logo"
          priority
          className="w-16 sm:w-20 md:w-[80px] h-auto"
        />
      </Link>

      {/* Teks Tengah */}
      <div className="text-center flex-1">
        <Link href="/" className="text-xl sm:text-2xl md:text-3xl font-onepiece text-black">
          One Piece
        </Link>
      </div>

      {/* GitHub */}
      <div className="flex items-center">
        <a
          href="https://github.com/ren-zi-fa"
          target="_blank"
          rel="noreferrer"
        >
          <div className="border-2 rounded-full p-2 bg-black hover:scale-105 transition-transform">
            <Github className="text-white w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7" />
          </div>
        </a>
      </div>
    </div>
  );
}
