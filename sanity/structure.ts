import type { StructureResolver } from "sanity/structure";

const languageDocItems = (
  S: Parameters<StructureResolver>[0],
  schemaType: string,
  baseId: string,
  titleId: string,
  titleEn: string
) =>
  S.list()
    .title("Language")
    .items([
      S.listItem()
        .title(titleId)
        .child(
          S.document()
            .schemaType(schemaType)
            .documentId(`${baseId}-id`)
            .title(titleId)
        ),
      S.listItem()
        .title(titleEn)
        .child(
          S.document()
            .schemaType(schemaType)
            .documentId(`${baseId}-en`)
            .title(titleEn)
        ),
      S.listItem()
        .title("Default / Fallback")
        .child(
          S.document()
            .schemaType(schemaType)
            .documentId(`${baseId}-main`)
            .title("Default / Fallback")
        ),
    ]);

export const structure: StructureResolver = (S) =>
  S.list()
    .title("Content")
    .items([
      S.listItem()
        .title("Side Menu")
        .id("side-menu")
        .child(
          languageDocItems(
            S,
            "sidebarProfile",
            "sidebar-profile",
            "Side Menu Profile (ID)",
            "Side Menu Profile (EN)"
          )
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
                .child(languageDocItems(S, "homeContent", "home-content", "Home Tab Settings (ID)", "Home Tab Settings (EN)")),
              S.listItem()
                .title("Home Profile Data")
                .child(languageDocItems(S, "homeProfile", "home-profile", "Home Profile Data (ID)", "Home Profile Data (EN)")),
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
                .child(languageDocItems(S, "aboutContent", "about-content", "About Tab Settings (ID)", "About Tab Settings (EN)")),
              S.listItem()
                .title("About Profile")
                .child(languageDocItems(S, "aboutProfile", "about-profile", "About Profile (ID)", "About Profile (EN)")),
              S.listItem()
                .title("Education (ID)")
                .child(
                  S.documentTypeList("education")
                    .title("Education (ID)")
                    .filter('_type == "education" && language == "id"')
                ),
              S.listItem()
                .title("Education (EN)")
                .child(
                  S.documentTypeList("education")
                    .title("Education (EN)")
                    .filter('_type == "education" && language == "en"')
                ),
              S.listItem()
                .title("Education (Default)")
                .child(
                  S.documentTypeList("education")
                    .title("Education (Default)")
                    .filter('_type == "education" && !defined(language)')
                ),
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
                .child(languageDocItems(S, "careerContent", "career-content", "Career Tab Settings (ID)", "Career Tab Settings (EN)")),
              S.listItem()
                .title("Career Items (ID)")
                .child(
                  S.documentTypeList("job")
                    .title("Career Items (ID)")
                    .filter('_type == "job" && language == "id"')
                ),
              S.listItem()
                .title("Career Items (EN)")
                .child(
                  S.documentTypeList("job")
                    .title("Career Items (EN)")
                    .filter('_type == "job" && language == "en"')
                ),
              S.listItem()
                .title("Career Items (Default)")
                .child(
                  S.documentTypeList("job")
                    .title("Career Items (Default)")
                    .filter('_type == "job" && !defined(language)')
                ),
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
                .child(languageDocItems(S, "achievementContent", "achievement-content", "Achievement Tab Settings (ID)", "Achievement Tab Settings (EN)")),
              S.listItem()
                .title("Achievement Items (ID)")
                .child(
                  S.documentTypeList("project")
                    .title("Achievement Items (ID)")
                    .filter(
                      '_type == "project" && language == "id" && ("certificate" in tags || "certification" in tags || "sertifikat" in tags || "piagam" in tags)'
                    )
                ),
              S.listItem()
                .title("Achievement Items (EN)")
                .child(
                  S.documentTypeList("project")
                    .title("Achievement Items (EN)")
                    .filter(
                      '_type == "project" && language == "en" && ("certificate" in tags || "certification" in tags || "sertifikat" in tags || "piagam" in tags)'
                    )
                ),
              S.listItem()
                .title("Achievement Items (Default)")
                .child(
                  S.documentTypeList("project")
                    .title("Achievement Items (Default)")
                    .filter(
                      '_type == "project" && !defined(language) && ("certificate" in tags || "certification" in tags || "sertifikat" in tags || "piagam" in tags)'
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
                .child(languageDocItems(S, "projectContent", "project-content", "Project Tab Settings (ID)", "Project Tab Settings (EN)")),
              S.listItem()
                .title("Project Items (ID)")
                .child(
                  S.documentTypeList("project")
                    .title("Project Items (ID)")
                    .filter(
                      '_type == "project" && language == "id" && !("personal" in tags) && !("certificate" in tags) && !("certification" in tags) && !("sertifikat" in tags) && !("piagam" in tags)'
                    )
                ),
              S.listItem()
                .title("Project Items (EN)")
                .child(
                  S.documentTypeList("project")
                    .title("Project Items (EN)")
                    .filter(
                      '_type == "project" && language == "en" && !("personal" in tags) && !("certificate" in tags) && !("certification" in tags) && !("sertifikat" in tags) && !("piagam" in tags)'
                    )
                ),
              S.listItem()
                .title("Project Items (Default)")
                .child(
                  S.documentTypeList("project")
                    .title("Project Items (Default)")
                    .filter(
                      '_type == "project" && !defined(language) && !("personal" in tags) && !("certificate" in tags) && !("certification" in tags) && !("sertifikat" in tags) && !("piagam" in tags)'
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
                .child(languageDocItems(S, "personalProjectContent", "personal-project-content", "Personal Project Tab Settings (ID)", "Personal Project Tab Settings (EN)")),
              S.listItem()
                .title("Personal Project Items (ID)")
                .child(
                  S.documentTypeList("project")
                    .title("Personal Project Items (ID)")
                    .filter('_type == "project" && language == "id" && "personal" in tags')
                ),
              S.listItem()
                .title("Personal Project Items (EN)")
                .child(
                  S.documentTypeList("project")
                    .title("Personal Project Items (EN)")
                    .filter('_type == "project" && language == "en" && "personal" in tags')
                ),
              S.listItem()
                .title("Personal Project Items (Default)")
                .child(
                  S.documentTypeList("project")
                    .title("Personal Project Items (Default)")
                    .filter('_type == "project" && !defined(language) && "personal" in tags')
                ),
            ])
        ),

      S.listItem()
        .title("GitHub")
        .id("github")
        .child(
          languageDocItems(S, "github", "github", "GitHub Content (ID)", "GitHub Content (EN)")
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
                .child(languageDocItems(S, "contactContent", "contact-content", "Contact Tab Settings (ID)", "Contact Tab Settings (EN)")),
              S.listItem()
                .title("Contact Data")
                .child(languageDocItems(S, "contact", "contact", "Contact Data (ID)", "Contact Data (EN)")),
            ])
        ),
    ]);
