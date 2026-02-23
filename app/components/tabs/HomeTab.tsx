import { useMemo } from "react";
import type { ProfileData, TranslationText } from "./types";

const hardSkillRegex = /(html|css|javascript|typescript|react|next|node|express|python|java|php|laravel|mysql|postgres|mongodb|docker|git|tailwind|figma|ui|ux|api|sql|firebase|supabase|aws|linux|c\+\+|c#|go|kotlin|swift)/i;
const softSkillRegex = /(communication|teamwork|leadership|problem solving|time management|adaptability|critical thinking|collaboration|creativity|public speaking|manajemen waktu|komunikasi|kerja sama|kepemimpinan|adaptasi|problem solving)/i;

interface HomeTabProps {
    profile: ProfileData;
    t: TranslationText;
}

export default function HomeTab({ profile, t }: HomeTabProps) {
    const allSkills = useMemo(
        () => (profile?.skills || []).filter((skill: string) => typeof skill === "string" && skill.trim().length > 0),
        [profile?.skills]
    );

    const hardSkills = useMemo(
        () => allSkills.filter((skill: string) => hardSkillRegex.test(skill)),
        [allSkills]
    );

    const softSkills = useMemo(() => {
        const explicitSoft = allSkills.filter((skill: string) => softSkillRegex.test(skill));
        if (explicitSoft.length > 0) return explicitSoft;
        return allSkills.filter((skill: string) => !hardSkillRegex.test(skill));
    }, [allSkills]);

    const getSkillLogoText = (skill: string) => {
        const clean = skill.replace(/[^a-zA-Z0-9+.#]/g, " ").trim();
        if (!clean) return "SK";
        const parts = clean.split(/\s+/);
        if (parts.length === 1) {
            return parts[0].slice(0, 2).toUpperCase();
        }
        return `${parts[0][0] || ""}${parts[1][0] || ""}`.toUpperCase();
    };

    const getHardSkillIcon = (skill: string) => {
        const normalized = skill
            .toLowerCase()
            .trim()
            .replace(/[()]/g, "")
            .replace(/\./g, "")
            .replace(/\s+/g, " ");

        const iconByToken: Array<{ tokens: string[]; icon: string }> = [
            { tokens: ["html", "html5"], icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/html5/html5-original.svg" },
            { tokens: ["css", "css3"], icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/css3/css3-original.svg" },
            { tokens: ["bootstrap"], icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/bootstrap/bootstrap-original.svg" },
            { tokens: ["tailwind", "tailwind css"], icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/tailwindcss/tailwindcss-original.svg" },
            { tokens: ["sass", "scss"], icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/sass/sass-original.svg" },
            { tokens: ["javascript", "js", "ecmascript"], icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg" },
            { tokens: ["typescript", "ts"], icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg" },
            { tokens: ["react", "reactjs"], icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg" },
            { tokens: ["redux"], icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/redux/redux-original.svg" },
            { tokens: ["next", "nextjs", "next js"], icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nextjs/nextjs-original.svg" },
            { tokens: ["vue", "vuejs"], icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/vuejs/vuejs-original.svg" },
            { tokens: ["nuxt", "nuxtjs"], icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nuxtjs/nuxtjs-original.svg" },
            { tokens: ["angular"], icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/angularjs/angularjs-original.svg" },
            { tokens: ["node", "nodejs", "node js"], icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg" },
            { tokens: ["express", "expressjs"], icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/express/express-original.svg" },
            { tokens: ["nestjs", "nest"], icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nestjs/nestjs-original.svg" },
            { tokens: ["php"], icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/php/php-original.svg" },
            { tokens: ["laravel"], icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/laravel/laravel-original.svg" },
            { tokens: ["python"], icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg" },
            { tokens: ["django"], icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/django/django-plain.svg" },
            { tokens: ["flask"], icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/flask/flask-original.svg" },
            { tokens: ["java"], icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/java/java-original.svg" },
            { tokens: ["spring"], icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/spring/spring-original.svg" },
            { tokens: ["kotlin"], icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/kotlin/kotlin-original.svg" },
            { tokens: ["swift"], icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/swift/swift-original.svg" },
            { tokens: ["go", "golang"], icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/go/go-original.svg" },
            { tokens: ["rust"], icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/rust/rust-original.svg" },
            { tokens: ["c#", "csharp"], icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/csharp/csharp-original.svg" },
            { tokens: ["c++", "cpp"], icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/cplusplus/cplusplus-original.svg" },
            { tokens: ["mysql"], icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mysql/mysql-original.svg" },
            { tokens: ["postgresql", "postgres"], icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/postgresql/postgresql-original.svg" },
            { tokens: ["sqlite"], icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/sqlite/sqlite-original.svg" },
            { tokens: ["mongodb"], icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mongodb/mongodb-original.svg" },
            { tokens: ["redis"], icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/redis/redis-original.svg" },
            { tokens: ["docker"], icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/docker/docker-original.svg" },
            { tokens: ["kubernetes", "k8s"], icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/kubernetes/kubernetes-plain.svg" },
            { tokens: ["git"], icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/git/git-original.svg" },
            { tokens: ["github"], icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/github/github-original.svg" },
            { tokens: ["gitlab"], icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/gitlab/gitlab-original.svg" },
            { tokens: ["figma"], icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/figma/figma-original.svg" },
            { tokens: ["firebase"], icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/firebase/firebase-plain.svg" },
            { tokens: ["supabase"], icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/supabase/supabase-original.svg" },
            { tokens: ["linux"], icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/linux/linux-original.svg" },
            { tokens: ["ubuntu"], icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/ubuntu/ubuntu-plain.svg" },
            { tokens: ["vscode", "visual studio code"], icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/vscode/vscode-original.svg" },
            { tokens: ["postman"], icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/postman/postman-original.svg" },
            { tokens: ["npm"], icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/npm/npm-original-wordmark.svg" },
            { tokens: ["yarn"], icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/yarn/yarn-original.svg" },
            { tokens: ["pnpm"], icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/pnpm/pnpm-original.svg" },
            { tokens: ["webpack"], icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/webpack/webpack-original.svg" },
            { tokens: ["vite"], icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/vitejs/vitejs-original.svg" },
            { tokens: ["graphql"], icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/graphql/graphql-plain.svg" },
            { tokens: ["aws"], icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/amazonwebservices/amazonwebservices-original-wordmark.svg" },
        ];

        const matched = iconByToken.find(({ tokens }) =>
            tokens.some((token) => normalized === token || normalized.includes(token))
        );

        return matched?.icon || null;
    };

    return (
        <div>
            <h1 className="text-3xl font-bold text-text">{t.homeTitle}</h1>
            <p className="mt-2 text-secondary">{profile?.fullName || "Arya Ngurah Intaran"}</p>

            <div className="mt-7">
                <p className="text-sm leading-relaxed text-secondary">{profile?.shortBio || profile?.headline}</p>
            </div>

            <div className="mt-8 border-t border-white/10" aria-hidden="true"></div>

            <div className="mt-8">
                <h2 className="text-xl font-semibold text-text">{t.hardSkillsTitle}</h2>
                {hardSkills.length > 0 ? (
                    <div className="mt-4 grid grid-cols-4 gap-4 sm:grid-cols-5 lg:grid-cols-7">
                        {hardSkills.map((skill: string, index: number) => (
                            <div
                                key={`${skill}-${index}`}
                                className="group flex items-center justify-center"
                                title={skill}
                            >
                                <div className="flex h-14 w-14 items-center justify-center transition-transform duration-300 group-hover:-translate-y-1 group-hover:scale-110">
                                    {getHardSkillIcon(skill) ? (
                                        <div
                                            role="img"
                                            aria-label={skill}
                                            className="h-12 w-12 bg-contain bg-center bg-no-repeat"
                                            style={{ backgroundImage: `url(${getHardSkillIcon(skill) || ""})` }}
                                        ></div>
                                    ) : (
                                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-surface text-xs font-bold uppercase text-primary">
                                            {getSkillLogoText(skill)}
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="mt-3 text-sm text-secondary">{t.hardSkillsEmpty}</p>
                )}
            </div>

            <div className="mt-8 border-t border-white/10" aria-hidden="true"></div>

            <div className="mt-8">
                <h2 className="text-xl font-semibold text-text">{t.softSkillsTitle}</h2>
                {softSkills.length > 0 ? (
                    <div className="mt-4 flex flex-wrap gap-2">
                        {softSkills.map((skill: string, index: number) => (
                            <span
                                key={`${skill}-soft-${index}`}
                                className="rounded-full border border-white/20 px-4 py-2 text-sm text-secondary"
                            >
                                {skill}
                            </span>
                        ))}
                    </div>
                ) : (
                    <p className="mt-3 text-sm text-secondary">{t.softSkillsEmpty}</p>
                )}
            </div>
        </div>
    );
}
