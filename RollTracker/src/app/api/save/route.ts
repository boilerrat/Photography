import { NextRequest, NextResponse } from "next/server";
import { validateSaveRequest } from "@/lib/validation";
import { toMarkdown, appendRollToContent } from "@/lib/markdown";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { doc, storageMode } = validateSaveRequest(body);

    if (storageMode === "download") {
      // For download, we'll create a single consolidated file
      const rollEntry = appendRollToContent("", doc);
      const filename = "film-shot-log.md";
      
      return NextResponse.json({
        filename,
        content: rollEntry,
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
      const path = "film-shot-log.md";

      // Get existing file content
      let existingContent = "";
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
          existingContent = Buffer.from(fileData.content, 'base64').toString('utf-8');
          sha = fileData.sha;
        }
      } catch (error) {
        // File doesn't exist, that's okay - we'll create it
      }

      // Append the new roll to existing content
      const updatedContent = appendRollToContent(existingContent, doc);

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
            message: `Add roll: ${doc.meta.rollId || 'Untitled'}`,
            content: Buffer.from(updatedContent).toString("base64"),
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
