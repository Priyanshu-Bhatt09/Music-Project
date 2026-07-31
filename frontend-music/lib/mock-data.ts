import type { CatalogItem, LibraryItem } from "./types";

export const featuredResults: CatalogItem[] = [
  {
    key: "1440806041-Parachutes-Coldplay-0",
    id: 1440806041,
    title: "Parachutes",
    artistName: "Coldplay",
    genre: "Alternative",
    releaseDate: "2000-07-10",
    trackCount: 10,
    artworkUrl: "https://is1-ssl.mzstatic.com/image/thumb/Music124/v4/9c/4f/0a/9c4f0a3a-3e0f-3e4f-29f6-7dd8f9a8b5c0/source/100x100bb.jpg",
  },
  {
    key: "1440857781-A Rush of Blood to the Head-Coldplay-1",
    id: 1440857781,
    title: "A Rush of Blood to the Head",
    artistName: "Coldplay",
    genre: "Alternative",
    releaseDate: "2002-08-26",
    trackCount: 11,
    artworkUrl: "https://is1-ssl.mzstatic.com/image/thumb/Music124/v4/9c/4f/0a/9c4f0a3a-3e0f-3e4f-29f6-7dd8f9a8b5c0/source/100x100bb.jpg",
  },
  {
    key: "1440821100-Midnights-Taylor Swift-2",
    id: 1440821100,
    title: "Midnights",
    artistName: "Taylor Swift",
    genre: "Pop",
    releaseDate: "2022-10-21",
    trackCount: 13,
    artworkUrl: "https://is1-ssl.mzstatic.com/image/thumb/Music122/v4/2f/16/ff/2f16ffb2-3cc0-16a8-8b72-2a08c6e9f5eb/source/100x100bb.jpg",
  },
];

export const libraryItems: LibraryItem[] = [
  {
    key: "library-1",
    id: 1,
    title: "Parachutes",
    artistName: "Coldplay",
    genre: "Alternative",
    releaseDate: "2000-07-10",
    trackCount: 10,
    durationSeconds: 2780,
    artworkUrl: featuredResults[0].artworkUrl,
    userRating: 5,
    userNotes: "Classic mellow opener for the library.",
  },
  {
    key: "library-2",
    id: 2,
    title: "Midnights",
    artistName: "Taylor Swift",
    genre: "Pop",
    releaseDate: "2022-10-21",
    trackCount: 13,
    durationSeconds: 3040,
    artworkUrl: featuredResults[2].artworkUrl,
    userRating: 4,
    userNotes: "Good contrast for analytics mix.",
  },
];
