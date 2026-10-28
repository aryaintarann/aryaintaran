import { revalidateTag } from "next/cache";
import type { CollectionAfterChangeHook, CollectionAfterDeleteHook, GlobalAfterChangeHook } from "payload";

export const CONTENT_TAG = "site-content";

// The migration script runs outside Next, where revalidateTag throws; it also sets context.disableRevalidate.
function bust(disabled: unknown) {
  if (disabled) return;
  try {
    revalidateTag(CONTENT_TAG, { expire: 0 }); // expire now: after saving, the admin must not see a stale read first
  } catch {
    // no request scope (CLI) — the cache entry expires on its own revalidate window
  }
}

export const revalidateAfterChange: CollectionAfterChangeHook & GlobalAfterChangeHook = ({ doc, req }) => {
  bust(req.context.disableRevalidate);
  return doc;
};

export const revalidateAfterDelete: CollectionAfterDeleteHook = ({ doc, req }) => {
  bust(req.context.disableRevalidate);
  return doc;
};
