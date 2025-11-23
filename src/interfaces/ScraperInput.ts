export interface ScraperInput {
  type: string;
  stremioId: string;
  id: {
    prefix: string | null;
    value: string;
    season: number | null;
    episode: number | null;
  };
  name: string | null;
  nameTranslated: string | null;
  extra?: any;
}
