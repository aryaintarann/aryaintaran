import config from "@payload-config";
import { generateImportMap } from "payload";
import { generateTypes } from "payload/node";

const sanitized = await config;
await generateImportMap(sanitized, { force: true, log: true });
await generateTypes(sanitized, { log: true });
