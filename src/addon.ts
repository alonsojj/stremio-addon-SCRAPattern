import { addonBuilder } from "stremio-addon-sdk";
import { handleStream } from "./sources"; // Import the new handleStream orchestrator
import { handleId, ID_PREFIXES_SUPORTED } from "./utils/parses"; // Import createScraperInput

interface Manifest {
  id: string;
  version: string;
  name: string;
  description: string;
  resources: ("stream" | "catalog" | "meta" | "subtitles")[];
  types: ("movie" | "series" | "channel" | "tv")[];
  catalogs: any[];
  idPrefixes?: string[];
}

const manifest: Manifest = {
  id: "community.SCRAPattern",
  version: "0.0.1",
  name: "SCRAPattern",
  description: "Template de um addon para streaming atraves de WebScraping",
  catalogs: [],
  resources: ["stream"],
  types: ["movie", "series"],
  idPrefixes: ID_PREFIXES_SUPORTED,
};

const builder = new addonBuilder(manifest);

builder.defineStreamHandler(async ({ type, id, extra }) => {
  console.log("[REQUEST] Request for streams: " + type + " " + id);
  const scraperInput = await handleId(type, id, extra);
  const streams = await handleStream(scraperInput);
  return { streams };
});

export default builder.getInterface();
