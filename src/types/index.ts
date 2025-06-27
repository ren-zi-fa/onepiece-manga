type ChapterData = {
  title: string;
  url: string;
};

type VolumeData = {
  saga: string;
  volume: string;
  coverImage: string;
  arc: string;
  chapters: ChapterData[];
};

export type VolumeDataResponse = {
  success: boolean;
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  nextPage: number | null;
  prevPage: number | null;
  data: VolumeData[];
};

export type ImageType = "comic" | "ads";

export interface ExtractedImage {
  type: ImageType;
  imageUrl: string;
  alt?: string;
  linkUrl?: string;
}

export interface ImageExtractionResponse {
  success: boolean;
  data: ExtractedImage[];
}
