// Applies pending schema migrations to DATABASE_URL. Run once against production before the first deploy.
// Usage: npm run db:migrate
import config from "@payload-config";
import { getPayload, type Migration } from "payload";
import { migrations } from "@/migrations";

// Same switch the Payload CLI sets: without it dev-mode `push` runs first and conflicts with the migrations.
process.env.PAYLOAD_MIGRATING = "true";

const payload = await getPayload({ config });
const result = await payload.db.migrate({ migrations: migrations as unknown as Migration[] });
console.log(result);
