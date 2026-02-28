import { NextResponse } from "next/server";

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const username = searchParams.get("username");
    const limit = searchParams.get("limit") || "12";

    if (!username) {
        return NextResponse.json({ error: "Username is required" }, { status: 400 });
    }

    try {
        const headers: HeadersInit = {
            "Accept": "application/vnd.github.v3+json",
        };

        // If a GitHub Personal Access Token is available, use it to increase rate limits
        if (process.env.GITHUB_TOKEN) {
            headers["Authorization"] = `token ${process.env.GITHUB_TOKEN}`;
        }

        const response = await fetch(
            `https://api.github.com/users/${username}/repos?type=owner&sort=updated&per_page=${limit}`,
            {
                headers,
                next: { revalidate: 3600 }, // Cache for 1 hour to prevent rate limit issues
            }
        );

        if (!response.ok) {
            console.error(`GitHub API Error: ${response.status} for user ${username}`);
            return NextResponse.json(
                { error: "Failed to fetch repositories" },
                { status: response.status }
            );
        }

        const data = await response.json();
        return NextResponse.json(data);
    } catch (error) {
        console.error("Github proxy fetch failed:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
