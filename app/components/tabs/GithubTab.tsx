"use client";

import { useEffect, useMemo, useState } from "react";
import type { ContactData, TranslationText } from "./types";

interface GithubRepo {
    id: number;
    name: string;
    html_url: string;
    description: string | null;
    language: string | null;
    stargazers_count: number;
    forks_count: number;
    updated_at: string;
    fork: boolean;
}

interface ContributionDay {
    date: string;
    contributionCount: number;
}

interface GithubTabProps {
    contact: ContactData;
    t: TranslationText;
}

const parseGithubUsername = (githubUrl?: string) => {
    if (!githubUrl) return "";
    try {
        const parsed = new URL(githubUrl);
        const segments = parsed.pathname.split("/").filter(Boolean);
        return segments[0] || "";
    } catch {
        return githubUrl.replace(/^https?:\/\/(www\.)?github\.com\//i, "").split("/")[0] || "";
    }
};

export default function GithubTab({ contact, t }: GithubTabProps) {
    const [repos, setRepos] = useState<GithubRepo[]>([]);
    const [contributions, setContributions] = useState<ContributionDay[]>([]);
    const [loading, setLoading] = useState(false);
    const [loadingContributions, setLoadingContributions] = useState(false);
    const [failed, setFailed] = useState(false);
    const [failedContributions, setFailedContributions] = useState(false);

    const username = useMemo(() => parseGithubUsername(contact?.github), [contact?.github]);

    useEffect(() => {
        const fetchRepos = async () => {
            if (!username) {
                setRepos([]);
                return;
            }

            setLoading(true);
            setFailed(false);

            try {
                const response = await fetch(`https://api.github.com/users/${username}/repos?type=owner&sort=updated&per_page=12`);
                if (!response.ok) {
                    throw new Error("Failed to fetch repositories");
                }

                const data = (await response.json()) as GithubRepo[];
                setRepos(data.filter((repo) => !repo.fork));
            } catch {
                setFailed(true);
                setRepos([]);
            } finally {
                setLoading(false);
            }
        };

        fetchRepos();
    }, [username]);

    useEffect(() => {
        const fetchContributions = async () => {
            if (!username) {
                setContributions([]);
                return;
            }

            setLoadingContributions(true);
            setFailedContributions(false);

            try {
                const response = await fetch(`https://github-contributions-api.deno.dev/${username}.json`);
                if (!response.ok) {
                    throw new Error("Failed to fetch contributions");
                }

                const data = await response.json() as {
                    contributions?: Array<{
                        date: string;
                        contributionCount: number;
                    }>;
                };

                const normalized = (data.contributions || [])
                    .filter((item): item is { date: string; contributionCount: number } => typeof item?.date === "string" && item.date.length > 0)
                    .map((item) => ({
                        date: item.date,
                        contributionCount: Number(item.contributionCount || 0),
                    }))
                    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
                    .slice(-364);

                setContributions(normalized);
            } catch {
                setFailedContributions(true);
                setContributions([]);
            } finally {
                setLoadingContributions(false);
            }
        };

        fetchContributions();
    }, [username]);

    const contributionWeeks = useMemo(() => {
        if (contributions.length === 0) return [] as ContributionDay[][];

        const firstDate = new Date(contributions[0].date);
        const offset = firstDate.getDay();

        const padded: ContributionDay[] = [
            ...Array.from({ length: offset }, (_, index) => ({
                date: `pad-start-${index}`,
                contributionCount: 0,
            })),
            ...contributions,
        ];

        const remainder = padded.length % 7;
        if (remainder !== 0) {
            padded.push(
                ...Array.from({ length: 7 - remainder }, (_, index) => ({
                    date: `pad-end-${index}`,
                    contributionCount: 0,
                }))
            );
        }

        const weeks: ContributionDay[][] = [];
        for (let i = 0; i < padded.length; i += 7) {
            weeks.push(padded.slice(i, i + 7));
        }
        return weeks;
    }, [contributions]);

    const maxContribution = useMemo(
        () => Math.max(1, ...contributions.map((day) => day.contributionCount)),
        [contributions]
    );

    const monthLabels = useMemo(() => {
        const labels: Array<{ weekIndex: number; label: string }> = [];
        let previousMonthKey = "";

        for (let weekIndex = 0; weekIndex < contributionWeeks.length; weekIndex++) {
            const firstRealDay = contributionWeeks[weekIndex].find((day) => typeof day.date === "string" && !day.date.startsWith("pad-"));
            if (!firstRealDay) continue;

            const date = new Date(firstRealDay.date);
            if (Number.isNaN(date.getTime())) continue;

            const monthKey = `${date.getFullYear()}-${date.getMonth()}`;
            if (monthKey === previousMonthKey) continue;

            previousMonthKey = monthKey;
            labels.push({
                weekIndex,
                label: date.toLocaleDateString("en-US", { month: "short" }),
            });
        }

        return labels;
    }, [contributionWeeks]);

    const dayLabelsByRow = useMemo(() => {
        const formatter = new Intl.DateTimeFormat("en-US", { weekday: "short" });
        const baseSunday = new Date(Date.UTC(2024, 0, 7));
        const labelRows = [1, 3, 5];

        return Array.from({ length: 7 }, (_, rowIndex) => {
            if (!labelRows.includes(rowIndex)) return "";
            const date = new Date(baseSunday);
            date.setUTCDate(baseSunday.getUTCDate() + rowIndex);
            return formatter.format(date);
        });
    }, []);

    const getContributionClass = (count: number) => {
        if (count <= 0) return "bg-background/85";
        const ratio = count / maxContribution;
        if (ratio < 0.25) return "bg-primary/25";
        if (ratio < 0.5) return "bg-primary/45";
        if (ratio < 0.75) return "bg-primary/65";
        return "bg-primary";
    };

    return (
        <div>
            <h2 className="text-3xl font-bold text-text">{t.githubTitle}</h2>

            <div className="mt-7">
                <h3 className="text-xl font-semibold text-text">{t.githubContributionsTitle}</h3>
                {username ? (
                    <div className="mt-3 rounded-xl border border-white/10 bg-surface p-3">
                        <div className="h-34 overflow-x-auto md:h-42">
                            {loadingContributions && <p className="text-secondary">{t.githubLoading}</p>}
                            {failedContributions && <p className="text-secondary">{t.githubFailed}</p>}

                            {!loadingContributions && !failedContributions && contributionWeeks.length > 0 && (
                                <a
                                    href={`https://github.com/${username}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-block min-w-max"
                                >
                                    <div className="mb-2 pl-10">
                                        <div
                                            className="relative h-4 [--cell-step:14px] md:[--cell-step:16px]"
                                            style={{ width: `calc(${contributionWeeks.length} * var(--cell-step))` }}
                                        >
                                            {monthLabels.map((month) => (
                                                <span
                                                    key={`${month.weekIndex}-${month.label}`}
                                                    className="absolute text-[10px] text-secondary md:text-xs"
                                                    style={{ left: `calc(${month.weekIndex} * var(--cell-step))` }}
                                                >
                                                    {month.label}
                                                </span>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="flex gap-1">
                                        <div className="mr-1 grid grid-rows-7 items-center text-[10px] text-secondary md:text-xs">
                                            {dayLabelsByRow.map((label, rowIndex) => (
                                                <span key={`row-${rowIndex}`}>{label}</span>
                                            ))}
                                        </div>

                                        <div className="flex gap-1">
                                            {contributionWeeks.map((week, weekIndex) => (
                                                <div key={`week-${weekIndex}`} className="grid grid-rows-7 gap-1">
                                                    {week.map((day, dayIndex) => {
                                                        const dayDate = day?.date || "";
                                                        return (
                                                        <span
                                                            key={`${dayDate || "unknown"}-${dayIndex}`}
                                                            title={dayDate.startsWith("pad-") ? undefined : `${dayDate}: ${day.contributionCount} contributions`}
                                                            className={`h-2.5 w-2.5 rounded-xs md:h-3 md:w-3 ${getContributionClass(day.contributionCount)}`}
                                                        ></span>
                                                        );
                                                    })}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </a>
                            )}

                            {!loadingContributions && !failedContributions && contributionWeeks.length === 0 && (
                                <p className="text-secondary">{t.githubEmpty}</p>
                            )}
                        </div>
                    </div>
                ) : (
                    <p className="mt-3 text-secondary">{t.githubNoProfile}</p>
                )}
            </div>

            <div className="mt-8">
                <h3 className="text-xl font-semibold text-text">{t.githubRepositoriesTitle}</h3>
                <div className="mt-4 space-y-3">
                    {loading && <p className="text-secondary">{t.githubLoading}</p>}
                    {failed && <p className="text-secondary">{t.githubFailed}</p>}

                    {!loading && !failed && repos.length > 0 && repos.map((repo) => (
                        <a
                            key={repo.id}
                            href={repo.html_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="block rounded-lg border border-white/10 bg-surface p-4 text-text hover:border-primary/40"
                        >
                            <div className="flex items-center justify-between gap-3">
                                <p className="font-semibold">{repo.name}</p>
                                <p className="text-xs text-secondary">{new Date(repo.updated_at).toLocaleDateString()}</p>
                            </div>
                            {repo.description && <p className="mt-1 text-sm text-secondary">{repo.description}</p>}
                            <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-secondary">
                                {repo.language && <span>{repo.language}</span>}
                                <span>★ {repo.stargazers_count}</span>
                                <span>⑂ {repo.forks_count}</span>
                            </div>
                        </a>
                    ))}

                    {!loading && !failed && repos.length === 0 && <p className="text-secondary">{t.githubNoRepositories}</p>}
                </div>
            </div>
        </div>
    );
}
