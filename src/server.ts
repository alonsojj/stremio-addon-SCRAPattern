#!/usr/bin/env node

import { serveHTTP, publishToCentral } from "stremio-addon-sdk";
import addonInterface from "./addon"; // This now exports builder.getRouter()

const port = process.env.PORT ? parseInt(process.env.PORT) : 53961;

serveHTTP(addonInterface, { port });

// when you've deployed your addon, un-comment this line
// publishToCentral("https://my-addon.awesome/manifest.json")
// for more information on deploying, see: https://github.com/Stremio/stremio-addon-sdk/blob/master/docs/deploying/README.md
