"use client";

import Link from "next/link";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useSearchParams } from "next/navigation";
import FallbackImage from "./FallbackImage";
import { useVolume } from "@/hooks/useVolume";

export default function CardHome() {
  const searchParams = useSearchParams();
  const page = searchParams.get("page") || "1";

  const { data, error, isLoading } = useVolume(page);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="text-center">
          <h3 className="text-lg font-semibold text-destructive">
            Gagal mengambil data
          </h3>
          <p className="text-sm text-muted-foreground mt-2">
            Silakan refresh halaman atau coba lagi nanti.
          </p>
        </div>
      </div>
    );
  }

  if (!data?.data || data.data.length === 0) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="text-center">
          <h3 className="text-lg font-semibold">Tidak ada data</h3>
          <p className="text-sm text-muted-foreground mt-2">
            Belum ada volume yang tersedia.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <p className="text-muted-foreground text-center">
        Menampilkan {data.data.length} dari {data.total} volume
      </p>

      {/* Grid cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {data.data.map((volume, index) => (
          <Card
            key={`${volume.saga}-${volume.volume}-${index}`}
            className="flex flex-col h-full"
          >
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <Badge variant="secondary" className="text-xs">
                  {volume.saga}
                </Badge>
              </div>
              <CardTitle className="text-lg font-semibold">
                {volume.volume}
              </CardTitle>
              <CardDescription className="text-sm font-medium text-primary">
                {volume.arc}
              </CardDescription>
            </CardHeader>

            <CardContent className="flex-1 pb-3">
              <div className="relative aspect-[3/4] mb-4 w-full max-w-[180px] mx-auto">
                <FallbackImage
                  src={volume.coverImage}
                  fallbackSrc="/image.png"
                  alt={`${volume.volume} - ${volume.arc}`}
                  fill
                  className="object-cover rounded-md shadow-md transition-transform hover:scale-105"
                  sizes="(max-width: 640px) 180px, (max-width: 1024px) 160px, 180px"
                  priority={index < 4}
                  unoptimized
                />
              </div>

              <div className="space-y-2">
                <h4 className="font-medium text-sm">
                  Chapters ({volume.chapters.length}):
                </h4>
                <div className="max-h-32 overflow-y-auto space-y-1">
                  {volume.chapters.map((chapter, idx) => {
                    const pathOnly = chapter.url
                      .replace("https://onepieceberwarna.com", "")
                      .replace(/-berwarna/g, "");
                    return (
                      <Link
                        key={idx}
                        href={`/read${pathOnly}`}
                        className="block text-xs text-muted-foreground hover:text-primary hover:underline transition-colors p-1 rounded hover:bg-muted/50"
                      >
                        {chapter.title}
                      </Link>
                    );
                  })}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      <div className="flex flex-wrap justify-center items-center gap-2">
        {/* Prev button */}
        <Button variant="outline" size="sm" asChild disabled={data.page === 1}>
          <Link href={`?page=${data.page - 1}`}>← Prev</Link>
        </Button>

        {/* Page number buttons */}
        {Array.from({ length: data.totalPages }, (_, i) => i + 1).map((p) => (
          <Button
            key={p}
            size="sm"
            variant={p === Number(page) ? "default" : "outline"}
            asChild
          >
            <Link href={`?page=${p}`}>{p}</Link>
          </Button>
        ))}

        {/* Next button */}
        <Button
          variant="outline"
          size="sm"
          asChild
          disabled={data.page === data.totalPages}
        >
          <Link href={`?page=${data.page + 1}`}>Next →</Link>
        </Button>
      </div>

      {/* Pagination info */}
      <div className="flex justify-center ">
        <p className="text-sm text-muted-foreground">
          Halaman {data.page} dari {data.totalPages}
        </p>
      </div>
    </div>
  );
}
