import { IScrapper } from "../../interfaces/IScrapper";
import { ScraperInput } from "../../interfaces/ScraperInput"; // Import ScraperInput

export const seriesScrapper: IScrapper = {
  id: "basic.series.scrapper",
  name: "Basic Series Scrapper",
  version: "1.0.0",
  description: "A basic scrapper for testing series streams.",
  types: ["series"],
  resources: ["stream"],

  async getItem(input: ScraperInput): Promise<any> {
    if (
      input.id.value === "0944947" &&
      input.id.season === 1 &&
      input.id.episode === 1
    ) {
      console.log(
        `[${this.name}] Providing multiple streams for series episode ID: ${input.stremioId}`
      );

      const directVideoUrlHD =
        "https://test-videos.co.uk/vids/bigbuckbunny/mp4/h264/1080/Big_Buck_Bunny_1080_10s_5MB.mp4";
      const directVideoUrlSD =
        "https://test-videos.co.uk/vids/bigbuckbunny/mp4/h264/480/Big_Buck_Bunny_480_10s_5MB.mp4";

      return {
        streams: [
          {
            url: directVideoUrlHD,
            title: `Game of Thrones S${input.id.season}E${input.id.episode} - Player 1 (HD)`,
          },
          {
            url: directVideoUrlSD,
            title: `Game of Thrones S${input.id.season}E${input.id.episode} - Player 2 (SD)`,
          },
        ],
      };
    }
    return { streams: [] };
  },
};
