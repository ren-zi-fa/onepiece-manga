import { Metadata } from "next";
import ReadManga from "@/app/_components/ReadManga";
import Link from "next/link";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;

  const match = slug.match(/chapter-\d+/i);
  const chapterLabel = match ? match[0] : slug;

  return {
    title: `${chapterLabel} | Nakama`,
    description: `Created by Renzi Febriandika — Now reading ${chapterLabel}`,
  };
}

export default async function ReadPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const slug = (await params).slug;
  return (
    <>
      <Link href="/" className="underline flex justify-center">
        All Chapter
      </Link>
      <ReadManga slug={slug} />
    </>
  );
}
