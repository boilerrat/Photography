import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const path = searchParams.get("path");

    if (!path) {
      return NextResponse.json(
        { error: "Path parameter is required" },
        { status: 400 }
      );
    }

    const githubRepo = process.env.GITHUB_REPO;
    const githubToken = process.env.GITHUB_TOKEN;
    const githubBranch = process.env.GITHUB_BRANCH || "main";

    if (!githubRepo || !githubToken) {
      return NextResponse.json(
        { error: "GitHub configuration missing" },
        { status: 500 }
      );
    }

    const [owner, repo] = githubRepo.split("/");

    const response = await fetch(
      `https://api.github.com/repos/${owner}/${repo}/contents/${path}?ref=${githubBranch}`,
      {
        headers: {
          Authorization: `Bearer ${githubToken}`,
          Accept: "application/vnd.github.v3+json",
        },
      }
    );

    if (!response.ok) {
      if (response.status === 404) {
        return NextResponse.json(
          { error: "File not found" },
          { status: 404 }
        );
      }
      throw new Error(`GitHub API error: ${response.statusText}`);
    }

    const fileData = await response.json();
    const content = Buffer.from(fileData.content, "base64").toString("utf-8");

    return NextResponse.json({ content });
  } catch (error) {
    console.error("Import GitHub error:", error);
    return NextResponse.json(
      { error: "Failed to import from GitHub" },
      { status: 500 }
    );
  }
}
