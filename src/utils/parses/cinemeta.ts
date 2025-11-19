import { ScraperInput } from "../../interfaces/ScraperInput";
import axios from "axios";
export async function cinemetaParser(
  stremioId: string,
  type: string
): Promise<ScraperInput> {
  let value = stremioId.split("tt")[1];
  let season: number | null = null;
  let episode: number | null = null;

  if (type === "series") {
    const parts = value.split(":");

    value = parts[0];

    season = parts[1] && !isNaN(Number(parts[1])) ? Number(parts[1]) : null;
    episode = parts[2] && !isNaN(Number(parts[2])) ? Number(parts[2]) : null;
  }

  const name = await requestCinemeta(value);
  const parsed: ScraperInput = {
    type,
    stremioId,
    id: {
      prefix: "tt",
      value,
      season,
      episode,
    },
    name,
  };

  return parsed;
}

async function requestCinemeta(id: string): Promise<string> {
  const res = await axios.get(
    `https://cinemeta-live.strem.io/meta/movie/tt${id}.json`
  );
  return res.data.meta.name;
}
