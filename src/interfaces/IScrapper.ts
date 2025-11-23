import { ScraperInput } from "./ScraperInput";

export interface StremioStream {
    name?: string;
    title?: string;
    url?: string;
    description?: string;
    behaviorHints?: {
        bingeGroup?: string;
    };
}

export interface ISearchResult {
  name: string;
  poster?: string;
  id: string; // This is the URL to the content, not the Stremio ID
  type: "movie" | "series" | "anime" | string;
}

export interface IScrapper {
  id: string;
  name: string;
  version: string;
  description: string;
  types: Array<"movie" | "series" | "anime" | "other" | string>;
  resources: Array<"stream" | "catalog" | "meta" | string>;

  getItem(input: ScraperInput): Promise<{ streams: StremioStream[] }>;
  getCatalog?(input: ScraperInput): Promise<any[]>;
}
