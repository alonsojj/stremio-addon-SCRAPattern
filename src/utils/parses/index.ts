import { ScraperInput } from "../../interfaces/ScraperInput";
import { cinemetaParser } from "./cinemeta";

export const ID_PREFIXES_SUPORTED = ["tt"];

type HandlerFunction = (
  stremioId: string,
  type: string
) => Promise<ScraperInput>;

const HANDLER_IDS: Record<string, HandlerFunction> = {
  tt: cinemetaParser,
};

export function parsePrefix(stremioId: string) {
  let prefix = null;
  for (const id of ID_PREFIXES_SUPORTED) {
    if (stremioId.startsWith(id)) {
      prefix = id;
    }
  }
  if (!prefix) {
    throw Error("Parsing input error");
  }
  return prefix;
}

export async function handleId(
  type: string,
  stremioId: string,
  extra?: any
): Promise<ScraperInput> {
  const prefix = parsePrefix(stremioId);

  const handler = HANDLER_IDS[prefix];
  const input = await handler(stremioId, type);
  console.log(`[PARSE SERVICE]`, input);
  return input;
}
