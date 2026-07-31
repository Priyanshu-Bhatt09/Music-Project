import type { CatalogItem, LibraryItem, SearchType } from "./types";

const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8080";

type SearchApiResponse = {
  resultCount: number;
  results: Array<{
    appleCatalogId: number;
    title: string;
    artistName: string;
    genre: string;
    releaseDate?: string | null;
    trackCount?: number | null;
    durationSeconds?: number | null;
    artworkUrl?: string | null;
  }>;
};

async function readErrorMessage(response: Response, fallback: string) {
  try {
    const data = (await response.json()) as { error?: string };
    return data.error || fallback;
  } catch {
    return fallback;
  }
}

function authHeaders(token?: string | null) {
  return token ? { Authorization: `Bearer ${token}` } : undefined;
}

export async function searchCatalog(query: string, type: SearchType, token?: string | null): Promise<CatalogItem[]> {
  const url = new URL("/api/search", baseUrl);
  url.searchParams.set("query", query);
  url.searchParams.set("type", type);

  const response = await fetch(url.toString(), {
    cache: "no-store",
    headers: authHeaders(token),
  });
  if (!response.ok) {
    throw new Error(await readErrorMessage(response, "Failed to fetch search results"));
  }

  const data = (await response.json()) as SearchApiResponse;
  return data.results.map((item, index) => {
    const id = item.appleCatalogId ?? Number.MAX_SAFE_INTEGER - index;
    return {
      key: `${id}-${item.title}-${item.artistName}-${index}`,
      id,
      title: item.title,
      artistName: item.artistName,
      genre: item.genre,
      releaseDate: item.releaseDate ?? "",
      trackCount: item.trackCount ?? null,
      durationSeconds: item.durationSeconds ?? null,
      artworkUrl: item.artworkUrl ?? null,
    };
  });
}

export async function getLibrary(token?: string | null): Promise<LibraryItem[]> {
  const response = await fetch(`${baseUrl}/api/library`, {
    cache: "no-store",
    headers: authHeaders(token),
  });
  if (!response.ok) {
    throw new Error(await readErrorMessage(response, "Failed to fetch library"));
  }
  const data = await response.json();
  return Array.isArray(data.content) ? data.content : data;
}

export async function saveLibraryItem(
  item: {
    appleCatalogId: number;
    title: string;
    artistName: string;
    genre: string;
    releaseDate?: string | null;
    trackCount?: number | null;
    durationSeconds?: number | null;
    artworkUrl?: string | null;
    userRating?: number | null;
    userNotes?: string;
  },
  token?: string | null,
) {
  const response = await fetch(`${baseUrl}/api/library`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(authHeaders(token) ?? {}),
    },
    body: JSON.stringify(item),
  });

  if (!response.ok) {
    throw new Error(await readErrorMessage(response, "Failed to save item"));
  }

  return response.json();
}

export async function getInsights(token?: string | null) {
  const response = await fetch(`${baseUrl}/api/insights/summary`, {
    cache: "no-store",
    headers: authHeaders(token),
  });
  if (!response.ok) {
    throw new Error(await readErrorMessage(response, "Failed to fetch insights"));
  }
  return response.json();
}

export async function login(email: string, password: string) {
  return authRequest("/api/auth/login", email, password);
}

export async function signup(email: string, password: string) {
  return authRequest("/api/auth/signup", email, password);
}

async function authRequest(path: string, email: string, password: string) {
  const response = await fetch(`${baseUrl}${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  if (!response.ok) {
    throw new Error(await readErrorMessage(response, "Authentication failed"));
  }

  return response.json() as Promise<{ token: string; email: string }>;
}
