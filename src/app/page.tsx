import { Metadata } from "next";
import CardHome from "./_components/CardHome";
import { Suspense } from "react";
export const metadata: Metadata = {
  title: "Home | Nakama",
  description: "created by Renzi Febriandika",
};
export default function Home() {
  return (
    <Suspense fallback={<div className="p-6 text-center">Memuat halaman...</div>}>
      <CardHome />
    </Suspense>
  );
}
