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

  const name = await requestCinemeta(value, type);

  const nameTranslated = await requestTMDb(value, type);

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
    nameTranslated,
  };

  return parsed;
}

async function requestCinemeta(id: string, type: string): Promise<string> {
  const res = await axios.get(
    `https://cinemeta-live.strem.io/meta/${type}/tt${id}.json`
  );
  return res.data.meta.name;
}

async function requestTMDb(id: string, type: string): Promise<string | null> {
  const apiKey = "api";
  const tmdbType = type === "movie" ? "movie" : "tv";
  try {
    const res = await axios.get(`https://api.themoviedb.org/3/find/tt${id}`, {
      params: {
        api_key: apiKey,
        external_source: "imdb_id",
        language: "pt-BR",
      },
    });
    const results = res.data[tmdbType + "_results"];
    if (results && results.length > 0) {
      return results[0].title || results[0].name || null;
    }
    return null;
  } catch (error) {
    console.error(`[TMDb] Error fetching title for tt${id}:`, error);
    return null;
  }
}
