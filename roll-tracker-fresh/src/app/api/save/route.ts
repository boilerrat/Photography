import { NextRequest, NextResponse } from "next/server";
import { validateSaveRequest } from "@/lib/validation";
import { toMarkdown } from "@/lib/markdown";
import { generateFilename } from "@/lib/filename";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { doc, storageMode } = validateSaveRequest(body);

    const markdown = toMarkdown(doc);
    const filename = generateFilename(doc.meta);

    if (storageMode === "download") {
      return NextResponse.json({
        filename,
        content: markdown,
      });
    }

    if (storageMode === "github") {
      // GitHub API integration
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
      const path = `rolls/${filename}`;

      // Get file SHA if it exists
      let sha: string | undefined;
      try {
        const getResponse = await fetch(
          `https://api.github.com/repos/${owner}/${repo}/contents/${path}`,
          {
            headers: {
              Authorization: `Bearer ${githubToken}`,
              Accept: "application/vnd.github.v3+json",
            },
          }
        );

        if (getResponse.ok) {
          const fileData = await getResponse.json();
          sha = fileData.sha;
        }
      } catch (error) {
        // File doesn't exist, that's okay
      }

      // Create or update file
      const createResponse = await fetch(
        `https://api.github.com/repos/${owner}/${repo}/contents/${path}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${githubToken}`,
            Accept: "application/vnd.github.v3+json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            message: `Update roll: ${doc.meta.rollId}`,
            content: Buffer.from(markdown).toString("base64"),
            branch: githubBranch,
            ...(sha && { sha }),
          }),
        }
      );

      if (!createResponse.ok) {
        const error = await createResponse.json();
        throw new Error(`GitHub API error: ${error.message}`);
      }

      const result = await createResponse.json();
      return NextResponse.json({
        html_url: result.content.html_url,
      });
    }

    return NextResponse.json(
      { error: "Invalid storage mode" },
      { status: 400 }
    );
  } catch (error) {
    console.error("Save error:", error);
    return NextResponse.json(
      { error: "Failed to save roll" },
      { status: 500 }
    );
  }
}
