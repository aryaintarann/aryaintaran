import type { StructureResolver } from "sanity/structure";

export const structure: StructureResolver = (S) =>
  S.list()
    .title("Content")
    .items([
      S.listItem()
        .title("Side Menu")
        .id("side-menu")
        .child(
          S.document()
            .schemaType("sidebarProfile")
            .documentId("sidebar-profile-main")
            .title("Side Menu Profile")
        ),

      S.listItem()
        .title("Home")
        .id("home")
        .child(
          S.list()
            .title("Home")
            .items([
              S.listItem()
                .title("Home Tab Settings")
                .child(
                  S.document()
                    .schemaType("homeContent")
                    .documentId("home-content-main")
                    .title("Home Tab Settings")
                ),
              S.listItem()
                .title("Home Profile Data")
                .child(
                  S.document()
                    .schemaType("homeProfile")
                    .documentId("home-profile-main")
                    .title("Home Profile Data")
                ),
            ])
        ),

      S.listItem()
        .title("About")
        .id("about")
        .child(
          S.list()
            .title("About Content")
            .items([
              S.listItem()
                .title("About Tab Settings")
                .child(
                  S.document()
                    .schemaType("aboutContent")
                    .documentId("about-content-main")
                    .title("About Tab Settings")
                ),
              S.listItem()
                .title("About Profile")
                .child(
                  S.document()
                    .schemaType("aboutProfile")
                    .documentId("about-profile-main")
                    .title("About Profile")
                ),
              S.documentTypeListItem("education").title("Education"),
            ])
        ),

      S.listItem()
        .title("Career")
        .id("career")
        .child(
          S.list()
            .title("Career")
            .items([
              S.listItem()
                .title("Career Tab Settings")
                .child(
                  S.document()
                    .schemaType("careerContent")
                    .documentId("career-content-main")
                    .title("Career Tab Settings")
                ),
              S.documentTypeListItem("job").title("Career Items"),
            ])
        ),

      S.listItem()
        .title("Achievement")
        .id("achievement")
        .child(
          S.list()
            .title("Achievement")
            .items([
              S.listItem()
                .title("Achievement Tab Settings")
                .child(
                  S.document()
                    .schemaType("achievementContent")
                    .documentId("achievement-content-main")
                    .title("Achievement Tab Settings")
                ),
              S.listItem()
                .title("Achievement Items")
                .child(
                  S.documentTypeList("project")
                    .title("Achievement Items")
                    .filter(
                      '_type == "project" && ("certificate" in tags || "certification" in tags || "sertifikat" in tags || "piagam" in tags)'
                    )
                ),
            ])
        ),

      S.listItem()
        .title("Project")
        .id("project")
        .child(
          S.list()
            .title("Project")
            .items([
              S.listItem()
                .title("Project Tab Settings")
                .child(
                  S.document()
                    .schemaType("projectContent")
                    .documentId("project-content-main")
                    .title("Project Tab Settings")
                ),
              S.listItem()
                .title("Project Items")
                .child(
                  S.documentTypeList("project")
                    .title("Project Items")
                    .filter(
                      '_type == "project" && !("personal" in tags) && !("certificate" in tags) && !("certification" in tags) && !("sertifikat" in tags) && !("piagam" in tags)'
                    )
                ),
            ])
        ),

      S.listItem()
        .title("Personal Project")
        .id("personal-project")
        .child(
          S.list()
            .title("Personal Project")
            .items([
              S.listItem()
                .title("Personal Project Tab Settings")
                .child(
                  S.document()
                    .schemaType("personalProjectContent")
                    .documentId("personal-project-content-main")
                    .title("Personal Project Tab Settings")
                ),
              S.listItem()
                .title("Personal Project Items")
                .child(
                  S.documentTypeList("project")
                    .title("Personal Project Items")
                    .filter('_type == "project" && "personal" in tags')
                ),
            ])
        ),

      S.listItem()
        .title("GitHub")
        .id("github")
        .child(
          S.document()
            .schemaType("github")
            .documentId("github-main")
            .title("GitHub Content")
        ),

      S.listItem()
        .title("Contact")
        .id("contact")
        .child(
          S.list()
            .title("Contact")
            .items([
              S.listItem()
                .title("Contact Tab Settings")
                .child(
                  S.document()
                    .schemaType("contactContent")
                    .documentId("contact-content-main")
                    .title("Contact Tab Settings")
                ),
              S.listItem()
                .title("Contact Data")
                .child(
                  S.document()
                    .schemaType("contact")
                    .documentId("contact-main")
                    .title("Contact Data")
                ),
            ])
        ),
    ]);
