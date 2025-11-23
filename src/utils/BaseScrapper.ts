import {
  IScrapper,
  StremioStream,
  ISearchResult,
} from "../interfaces/IScrapper";
import { ScraperInput } from "../interfaces/ScraperInput";
import { puppeteerScrape } from "./puppeteerScraper";

export abstract class BaseScrapper implements IScrapper {
  public id: string;
  public name: string;
  public mainUrl: string;
  public types: ("movie" | "series")[];
  public resources: "stream"[];

  constructor(
    id: string,
    name: string,
    mainUrl: string,
    types: ("movie" | "series")[] = ["movie", "series"]
  ) {
    this.id = id;
    this.name = name;
    this.mainUrl = mainUrl;
    this.types = types;
    this.resources = ["stream"];
  }

  abstract search(query: string): Promise<ISearchResult[]>;

  async extractStreamUrl(url: string): Promise<StremioStream[]> {
    console.log(
      `[${this.name}] Extracting stream from: ${url} using Puppeteer`
    );
    try {
      const streamUrl = await puppeteerScrape(url);
      if (streamUrl) {
        console.log(
          `[${this.name}] Found stream URL with Puppeteer: ${streamUrl}`
        );
        return [{ url: streamUrl, title: `Stream (from ${this.name})` }];
      }
    } catch (error) {
      console.error(
        `[${this.name}] Error extracting stream from "${url}" with Puppeteer:`,
        error
      );
    }

    console.warn(`[${this.name}] No stream found for ${url} with Puppeteer`);
    return [];
  }

  async getItem(input: ScraperInput): Promise<{ streams: StremioStream[] }> {
    let contentUrl: string | undefined;

    if (input.id.prefix === "tt") {
      const query =
        input.nameTranslated && input.nameTranslated.trim() !== ""
          ? input.nameTranslated
          : input.name;
      const searchResults = await this.search(query);
      const result = searchResults.find((r) => {
        console.log(
          `[${this.name}] Comparing search result name "${r.name}" with input name "${input.name}"`
        );
        const nameToMatch = input.name!.toLowerCase();
        const translatedNameToMatch = input.nameTranslated?.toLowerCase();

        return (
          (r.name.toLowerCase().includes(nameToMatch) ||
           (translatedNameToMatch && r.name.toLowerCase().includes(translatedNameToMatch))) &&
          r.type === input.type
        );
      });
      contentUrl = result?.id;
    } else if (input.id.prefix === this.id) {
      contentUrl = input.id.value;
    }

    if (!contentUrl) {
      console.warn(
        `[${this.name}] No content URL found for ${input.stremioId}`
      );
      return { streams: [] };
    }

    return { streams: await this.extractStreamUrl(contentUrl) };
  }
}
