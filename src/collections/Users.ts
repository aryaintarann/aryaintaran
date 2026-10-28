import type { CollectionConfig } from "payload";

export const Users: CollectionConfig = {
  slug: "users",
  admin: { useAsTitle: "email" },
  auth: {
    tokenExpiration: 60 * 60 * 24 * 7,
    maxLoginAttempts: 5,
    lockTime: 10 * 60 * 1000,
    cookies: { secure: process.env.NODE_ENV === "production", sameSite: "Lax" },
  },
  // Payload's first-user screen bypasses this; after that only a logged-in admin can add users.
  access: { create: ({ req }) => Boolean(req.user) },
  fields: [],
};
