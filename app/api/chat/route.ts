import { NextRequest } from "next/server";
import { GoogleGenAI } from "@google/genai";
import { client } from "@/sanity/lib/client";
import {
    localizedContactQuery,
    localizedEducationQuery,
    localizedGithubQuery,
    localizedHomeProfileQuery,
    localizedJobQuery,
    localizedProjectQuery,
    localizedSidebarProfileQuery,
} from "@/sanity/lib/queries";

const genAI = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

interface EducationItem {
    schoolName?: string;
    degree?: string;
    fieldOfStudy?: string;
    startDate?: string;
    endDate?: string;
}

interface JobItem {
    jobTitle?: string;
    name?: string;
    startDate?: string;
    endDate?: string;
    description?: string;
}

interface ProjectItem {
    title?: string;
    shortDescription?: string;
    tags?: string[];
}

interface ContactInfo {
    email?: string;
    whatsapp?: string;
    linkedin?: string;
    github?: string;
    instagram?: string;
}

interface GithubInfo {
    profileUrl?: string;
    username?: string;
}

interface ProfileInfo {
    fullName?: string;
    headline?: string;
    summary?: string;
    hardSkills?: string[];
    softSkills?: string[];
}

type ChatLanguage = "id" | "en";

async function buildSystemPrompt(language: ChatLanguage, currentPath: string): Promise<string> {
    const safeFetch = async <T,>(
        query: string,
        params: Record<string, string>,
        fallback: T
    ): Promise<T> => {
        try {
            return await client.fetch<T>(query, params);
        } catch {
            return fallback;
        }
    };

    const [profile, sidebarProfile, education, jobs, projects, github, contact] = await Promise.all([
        safeFetch<ProfileInfo>(
            localizedHomeProfileQuery,
            {
                language,
                languageId: `home-profile-${language}`,
                mainId: "home-profile-main",
            },
            {}
        ),
        safeFetch<{ headline?: string }>(
            localizedSidebarProfileQuery,
            {
                language,
                languageId: `sidebar-profile-${language}`,
                mainId: "sidebar-profile-main",
            },
            {}
        ),
        safeFetch<EducationItem[]>(localizedEducationQuery, { language }, []),
        safeFetch<JobItem[]>(localizedJobQuery, { language }, []),
        safeFetch<ProjectItem[]>(localizedProjectQuery, { language }, []),
        safeFetch<GithubInfo>(
            localizedGithubQuery,
            {
                language,
                languageId: `github-${language}`,
                mainId: "github-main",
            },
            {}
        ),
        safeFetch<ContactInfo>(
            localizedContactQuery,
            {
                language,
                languageId: `contact-${language}`,
                mainId: "contact-main",
            },
            {}
        ),
    ]);

    const skillsList = [
        ...(profile?.hardSkills || []),
        ...(profile?.softSkills || []),
    ]
        .filter(Boolean)
        .join(", ");

    const formatYear = (value?: string) => {
        if (!value) return "Sekarang";
        return new Date(value).getFullYear();
    };

    const locale = language === "en" ? "en-US" : "id-ID";

    const formatMonthYear = (value?: string) => {
        if (!value) return "Sekarang";
        return new Date(value).toLocaleDateString(locale, { month: "short", year: "numeric" });
    };

    const educationList =
        education
            ?.map(
                (edu: EducationItem) =>
                    `- ${edu.schoolName}: ${edu.degree} in ${edu.fieldOfStudy} (${formatYear(edu.startDate)} - ${formatYear(edu.endDate)})`
            )
            .join("\n") || "Belum ada data";

    const jobsList =
        jobs
            ?.map(
                (job: JobItem) =>
                    `- ${job.jobTitle} di ${job.name} (${formatMonthYear(job.startDate)} - ${formatMonthYear(job.endDate)}): ${job.description || ""}`
            )
            .join("\n") || "Belum ada data";

    const projectsList =
        projects
            ?.map(
                (project: ProjectItem) =>
                    `- ${project.title}: ${project.shortDescription || ""} [Tags: ${project.tags?.join(", ") || "-"}]`
            )
            .join("\n") || "Belum ada data";

    const contactInfo = [
        contact?.email ? `Email: ${contact.email}` : null,
        contact?.whatsapp ? `WhatsApp: ${contact.whatsapp}` : null,
        contact?.linkedin ? `LinkedIn: ${contact.linkedin}` : null,
        github?.profileUrl ? `GitHub: ${github.profileUrl}` : contact?.github ? `GitHub: ${contact.github}` : null,
        contact?.instagram ? `Instagram: ${contact.instagram}` : null,
    ]
        .filter(Boolean)
        .join("\n");

    const presentLabel = language === "en" ? "Present" : "Sekarang";

    const normalizedJobsList = jobsList.replaceAll("Sekarang", presentLabel);
    const normalizedEducationList = educationList.replaceAll("Sekarang", presentLabel);

    return `You are the AI assistant for ${profile?.fullName || "Arya Intaran"}'s portfolio website.
Current website language: ${language === "en" ? "English" : "Indonesian"}.
Current page path: ${currentPath}.

Respond in the same language as the user's latest message. If unclear, default to ${language === "en" ? "English" : "Indonesian"}.
Be concise, warm, and professional. Use short bullets when listing information.
Only use facts from the data below. If data is missing, say so clearly and suggest checking the Contact section.

## Informasi Profil
- **Nama**: ${profile?.fullName || "Arya Intaran"}
- **Headline**: ${sidebarProfile?.headline || "Website Developer & IT Support"}
- **Bio**: ${profile?.summary || "Tidak tersedia"}

## Skills
${skillsList || "Belum ada data"}

## Pendidikan
${normalizedEducationList}

## Pengalaman Kerja
${normalizedJobsList}

## Proyek
${projectsList}

## Kontak
${contactInfo || "Silakan hubungi melalui form di website"}

## Panduan Menjawab:
1. Prioritize portfolio topics: home, about, career, achievements, projects, GitHub, and contact.
2. If the question is outside portfolio context, answer briefly and steer back to portfolio context.
3. For hiring/contact requests, provide available contact channels from data.
4. Do not invent facts or dates.
5. Keep responses practical and easy to scan.`;
}

export async function POST(req: NextRequest) {
    try {
        const { messages, language, path } = await req.json() as {
            messages: Array<{ role: string; content: string }>;
            language?: "id" | "en";
            path?: string;
        };

        const activeLanguage: ChatLanguage = language === "en" ? "en" : "id";
        const currentPath = typeof path === "string" && path.trim() ? path : "/";

        if (!process.env.GEMINI_API_KEY) {
            return Response.json(
                { error: "API key not configured" },
                { status: 500 }
            );
        }

        const systemPrompt = await buildSystemPrompt(activeLanguage, currentPath);

        const contents = messages.map((msg: { role: string; content: string }) => ({
            role: msg.role === "assistant" ? "model" : "user",
            parts: [{ text: msg.content }],
        }));

        let result;
        try {
            result = await genAI.models.generateContent({
                model: "gemini-2.0-flash",
                contents,
                config: {
                    temperature: 0.7,
                    maxOutputTokens: 1024,
                    topP: 0.9,
                    topK: 40,
                    systemInstruction: systemPrompt,
                },
            });
        } catch (apiError: unknown) {
            const apiErrorInfo = apiError as { status?: number; message?: string };
            console.error("Gemini API Error:", apiErrorInfo.status, apiErrorInfo.message);

            if (apiErrorInfo.status === 429) {
                return Response.json(
                    { error: "rate_limit", message: "Quota API habis. Silakan coba lagi dalam beberapa menit 😊" },
                    { status: 429 }
                );
            }

            return Response.json(
                { error: apiErrorInfo.message || "AI service error" },
                { status: apiErrorInfo.status || 500 }
            );
        }

        const text = result.text || "";

        return Response.json({ text });
    } catch (error: unknown) {
        const errorInfo = error as { message?: string };
        console.error("Chat API Error:", errorInfo);
        return Response.json(
            { error: errorInfo.message || "Internal server error" },
            { status: 500 }
        );
    }
}
