import { ScraperInput } from "./ScraperInput"; // Import the new ScraperInput interface

export interface IScrapper {
  id: string;
  name: string;
  version: string;
  description: string;
  types: Array<"movie" | "series" | "anime" | "other" | string>;
  resources: Array<"stream" | "catalog" | "meta" | string>;

  getItem(input: ScraperInput): Promise<any>;
  getCatalog?(input: ScraperInput): Promise<any[]>;
}
