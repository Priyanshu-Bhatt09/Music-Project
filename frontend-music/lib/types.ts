export type SearchType = "albums" | "songs" | "artists";

export type CatalogItem = {
  key: string;
  id: number;
  title: string;
  artistName: string;
  genre: string;
  releaseDate: string;
  trackCount?: number | null;
  durationSeconds?: number | null;
  artworkUrl?: string | null;
};

export type LibraryItem = CatalogItem & {
  userRating: number;
  userNotes: string;
};
