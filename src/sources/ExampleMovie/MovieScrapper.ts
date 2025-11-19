import { IScrapper } from "../../interfaces/IScrapper";
import { ScraperInput } from "../../interfaces/ScraperInput"; // Import ScraperInput

export const movieScrapper: IScrapper = {
  id: "basic.movie.scrapper",
  name: "Basic Movie Scrapper",
  version: "1.0.0",
  description: "A basic scrapper for testing movie streams.",
  types: ["movie"],
  resources: ["stream"],

  async getItem(input: ScraperInput): Promise<any> {
    // This scrapper only handles 'tt' IDs directly for specific movies
    if (
      input.type === "movie" &&
      input.id.prefix === "tt" &&
      input.id.value === "0133093"
    ) {
      // The Matrix
      console.log(
        `[${this.name}] Providing stream for movie ID: ${input.stremioId}`
      );
      const directVideoUrl =
        "https://test-videos.co.uk/vids/bigbuckbunny/mp4/h264/1080/Big_Buck_Bunny_1080_10s_5MB.mp4";

      return {
        streams: [
          { url: directVideoUrl, title: "The Matrix - Test Stream (Player 1)" },
        ],
      };
    }
    return { streams: [] };
  },
};
