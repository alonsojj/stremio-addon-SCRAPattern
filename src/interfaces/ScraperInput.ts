export interface ScraperInput {
  type: string;
  stremioId: string; // The original Stremio ID (e.g., "tt1234567:1:1")
  id: {
    prefix: string | null; // e.g., "tt", "kitsu"
    value: string;
    season: number | null;
    episode: number | null;
  };
  name: string | null; // Resolved content name, if available (e.g., "The Matrix")
  extra?: any; // Any extra args from Stremio
}
