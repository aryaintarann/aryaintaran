import { defineField, defineType } from "sanity";

export const education = defineType({
  name: "education",
  title: "Education",
  type: "document",
  fields: [
    defineField({ name: "schoolName", title: "School Name", type: "string" }),
    defineField({ name: "degree", title: "Degree", type: "string" }),
    defineField({ name: "fieldOfStudy", title: "Field of Study", type: "string" }),
    defineField({ name: "startDate", title: "Start Date", type: "date" }),
    defineField({ name: "endDate", title: "End Date", type: "date" }),
    defineField({ name: "organizationExperience", title: "Organization Experience", type: "array", of: [{ type: "string" }] }),
    defineField({ name: "achievements", title: "Achievements", type: "array", of: [{ type: "string" }] }),
  ],
});
