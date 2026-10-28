import type { CollectionConfig } from "payload";

// Not "messages": Payload would serve it at /api/messages, which is the public contact-form route.
export const ContactMessages: CollectionConfig = {
  slug: "contact-messages",
  labels: { singular: "Message", plural: "Messages" },
  admin: { useAsTitle: "name", defaultColumns: ["name", "email", "read", "createdAt"] },
  defaultSort: "-createdAt",
  // Writes come only from /api/messages through the Local API, after Turnstile and rate limiting.
  access: {
    create: () => false,
    read: ({ req }) => Boolean(req.user),
    update: ({ req }) => Boolean(req.user),
    delete: ({ req }) => Boolean(req.user),
  },
  fields: [
    { name: "name", type: "text", required: true, maxLength: 100 },
    { name: "email", type: "email", required: true },
    { name: "message", type: "textarea", required: true, maxLength: 5000 },
    { name: "read", type: "checkbox", defaultValue: false },
  ],
};
