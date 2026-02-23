import { NextRequest } from "next/server";
import { GoogleGenAI } from "@google/genai";
import { client } from "@/sanity/lib/client";
import {
    profileQuery,
    educationQuery,
    jobQuery,
    projectQuery,
    contactQuery,
} from "@/sanity/lib/queries";

const genAI = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

async function buildSystemPrompt(): Promise<string> {
    const [profile, education, jobs, projects, contact] = await Promise.all([
        client.fetch(profileQuery),
        client.fetch(educationQuery),
        client.fetch(jobQuery),
        client.fetch(projectQuery),
        client.fetch(contactQuery),
    ]);

    const skillsList = profile?.skills?.join(", ") || "Belum ada data";

    const educationList =
        education
            ?.map(
                (edu: any) =>
                    `- ${edu.schoolName}: ${edu.degree} in ${edu.fieldOfStudy} (${new Date(edu.startDate).getFullYear()} - ${edu.endDate ? new Date(edu.endDate).getFullYear() : "Sekarang"})`
            )
            .join("\n") || "Belum ada data";

    const jobsList =
        jobs
            ?.map(
                (job: any) =>
                    `- ${job.jobTitle} di ${job.name} (${new Date(job.startDate).toLocaleDateString("id-ID", { month: "short", year: "numeric" })} - ${job.endDate ? new Date(job.endDate).toLocaleDateString("id-ID", { month: "short", year: "numeric" }) : "Sekarang"}): ${job.description || ""}`
            )
            .join("\n") || "Belum ada data";

    const projectsList =
        projects
            ?.map(
                (project: any) =>
                    `- ${project.title}: ${project.shortDescription || ""} [Tags: ${project.tags?.join(", ") || "-"}]`
            )
            .join("\n") || "Belum ada data";

    const contactInfo = [
        contact?.email ? `Email: ${contact.email}` : null,
        contact?.whatsapp ? `WhatsApp: ${contact.whatsapp}` : null,
        contact?.linkedin ? `LinkedIn: ${contact.linkedin}` : null,
        contact?.github ? `GitHub: ${contact.github}` : null,
        contact?.instagram ? `Instagram: ${contact.instagram}` : null,
    ]
        .filter(Boolean)
        .join("\n");

    return `Kamu adalah asisten virtual di website portfolio ${profile?.fullName || "Arya Intaran"}.
Tugasmu adalah menjawab pertanyaan pengunjung tentang ${profile?.fullName || "pemilik website"} dengan ramah, profesional, dan informatif.
Jawab dalam bahasa yang sama dengan bahasa pertanyaan (Indonesia atau English).
Gunakan emoji sesekali untuk membuat percakapan lebih hidup 😊

## Informasi Profil
- **Nama**: ${profile?.fullName || "Arya Intaran"}
- **Headline**: ${profile?.headline || "Website Developer & IT Support"}
- **Bio**: ${profile?.shortBio || "Tidak tersedia"}
- **Lokasi**: ${profile?.location || "Bali, Indonesia"}

## Skills
${skillsList}

## Pendidikan
${educationList}

## Pengalaman Kerja
${jobsList}

## Proyek
${projectsList}

## Kontak
${contactInfo || "Silakan hubungi melalui form di website"}

## Panduan Menjawab:
1. Jika ditanya tentang hal yang ada di data profil, jawab berdasarkan data di atas.
2. Jika ditanya hal di luar konteks portfolio (misalnya coding tutorial, cuaca, dll), tetap jawab dengan sopan tapi arahkan kembali ke topik portfolio jika memungkinkan.
3. Jika pengunjung ingin menghubungi atau meng-hire, arahkan ke informasi kontak di atas.
4. Jawab dengan singkat dan padat, kecuali diminta penjelasan detail.
5. Jangan pernah membuat informasi yang tidak ada di data profil.
6. Jika tidak tahu jawabannya, bilang dengan jujur dan arahkan pengunjung untuk menghubungi langsung.`;
}

export async function POST(req: NextRequest) {
    try {
        const { messages } = await req.json();

        if (!process.env.GEMINI_API_KEY) {
            return Response.json(
                { error: "API key not configured" },
                { status: 500 }
            );
        }

        const systemPrompt = await buildSystemPrompt();

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
        } catch (apiError: any) {
            console.error("Gemini API Error:", apiError?.status, apiError?.message);

            if (apiError?.status === 429) {
                return Response.json(
                    { error: "rate_limit", message: "Quota API habis. Silakan coba lagi dalam beberapa menit 😊" },
                    { status: 429 }
                );
            }

            return Response.json(
                { error: apiError.message || "AI service error" },
                { status: apiError?.status || 500 }
            );
        }

        const text = result.text || "";

        return Response.json({ text });
    } catch (error: any) {
        console.error("Chat API Error:", error);
        return Response.json(
            { error: error.message || "Internal server error" },
            { status: 500 }
        );
    }
}
