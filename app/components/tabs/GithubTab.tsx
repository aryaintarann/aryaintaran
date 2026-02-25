"use client";

import { useEffect, useMemo, useState } from "react";
import { GitHubCalendar } from "react-github-calendar";
import type { ContactData, GithubData, TranslationText } from "./types";

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

interface GithubTabProps {
    github: GithubData;
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

export default function GithubTab({ github, contact, t }: GithubTabProps) {
    const [repos, setRepos] = useState<GithubRepo[]>([]);
    const [loading, setLoading] = useState(false);
    const [failed, setFailed] = useState(false);

    const username = useMemo(() => {
        const fromCms = (github?.username || "").trim();
        if (fromCms) return fromCms;
        return parseGithubUsername(github?.profileUrl || contact?.github);
    }, [contact?.github, github?.profileUrl, github?.username]);

    const profileUrl = useMemo(() => {
        if (github?.profileUrl) return github.profileUrl;
        if (username) return `https://github.com/${username}`;
        return "";
    }, [github?.profileUrl, username]);

    const reposLimit = useMemo(() => {
        const value = Number(github?.repositoriesLimit || 12);
        if (!Number.isFinite(value) || value < 1) return 12;
        return Math.min(50, Math.floor(value));
    }, [github?.repositoriesLimit]);

    const showContributions = github?.showContributions !== false;
    const showRepositories = github?.showRepositories !== false;
    const contributionsTitle = github?.contributionsTitle || github?.githubContributionsTitle || t.githubContributionsTitle;
    const repositoriesTitle = github?.repositoriesTitle || github?.githubRepositoriesTitle || t.githubRepositoriesTitle;

    useEffect(() => {
        const fetchRepos = async () => {
            if (!username) {
                setRepos([]);
                return;
            }

            setLoading(true);
            setFailed(false);

            try {
                const response = await fetch(`https://api.github.com/users/${username}/repos?type=owner&sort=updated&per_page=${reposLimit}`);
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
    }, [reposLimit, username]);

    return (
        <div>
            <h2 className="text-3xl font-bold text-text">{t.githubTitle}</h2>
            {github?.description && <p className="mt-2 text-secondary">{github.description}</p>}

            {showContributions && (
            <div className="mt-7">
                <h3 className="text-xl font-semibold text-text">{contributionsTitle}</h3>
                {username ? (
                    <div className="mt-3 rounded-xl border border-white/10 bg-surface p-3">
                        <a
                            href={profileUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="block"
                        >
                            <div className="github-calendar-responsive w-full text-secondary">
                                <GitHubCalendar
                                    username={username}
                                    blockSize={9}
                                    blockMargin={3}
                                    fontSize={12}
                                    showWeekdayLabels={false}
                                    throwOnError={false}
                                    errorMessage={t.githubFailed}
                                />
                            </div>
                        </a>
                    </div>
                ) : (
                    <p className="mt-3 text-secondary">{t.githubNoProfile}</p>
                )}
            </div>
            )}

            {showRepositories && (
            <div className="mt-8">
                <h3 className="text-xl font-semibold text-text">{repositoriesTitle}</h3>
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
            )}
        </div>
    );
}
