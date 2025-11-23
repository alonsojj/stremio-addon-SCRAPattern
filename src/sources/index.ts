import { ScraperInput } from "../interfaces/ScraperInput";
import { BaseScrapper } from "../utils/BaseScrapper";
import { movieScrapper } from "./ExampleMovie/MovieScrapper";
import { seriesScrapper } from "./ExampleSeries/SeriesScrapper";
import { goFlixScrapper } from "./Goflix/GoflixScrapper";

const scrapperRegistry: BaseScrapper[] = [goFlixScrapper];

export async function handleStream(input: ScraperInput): Promise<any[]> {
  let allFoundStreams: any[] = [];

  for (const scrapper of scrapperRegistry) {
    const supportsType = scrapper.types.includes(input.type);

    if (supportsType) {
      console.log(
        `[Scrapper Orchestrator] Querying ${scrapper.name} for ${input.type}:${input.stremioId}`
      );
      try {
        const result = await scrapper.getItem(input);
        if (result && result.streams && result.streams.length > 0) {
          allFoundStreams = allFoundStreams.concat(result.streams);
        }
      } catch (error) {
        console.error(
          `[Scrapper Orchestrator] Error querying ${scrapper.name} for ${input.stremioId}:`,
          error
        );
      }
    } else {
      console.log(
        `[Scrapper Orchestrator] Scrapper ${scrapper.name} skipped for ${input.stremioId} (supportsType: ${supportsType})`
      );
    }
  }
  return allFoundStreams;
}

export function getRegisteredScrappers(): IScrapper[] {
  return scrapperRegistry.map((scrapper) => scrapper);
}
