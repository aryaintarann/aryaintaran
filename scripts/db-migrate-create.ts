// Writes a new schema migration into src/migrations after you change a collection or global.
// Usage: npm run db:migrate:create -- <name>
import config from "@payload-config";
import { getPayload } from "payload";

const payload = await getPayload({ config });
await payload.db.createMigration({
  migrationName: process.argv[3] ?? "migration",
  payload,
  forceAcceptWarning: true, // dev-mode `push` leaves a batch -1 record that would otherwise prompt
});
