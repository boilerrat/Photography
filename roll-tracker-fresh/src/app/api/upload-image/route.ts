import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json(
        { error: "No file provided" },
        { status: 400 }
      );
    }

    const imgurClientId = process.env.IMGUR_CLIENT_ID;
    if (!imgurClientId) {
      return NextResponse.json(
        { error: "Imgur configuration missing" },
        { status: 500 }
      );
    }

    // Convert file to base64
    const arrayBuffer = await file.arrayBuffer();
    const base64 = Buffer.from(arrayBuffer).toString("base64");

    // Upload to Imgur
    const response = await fetch("https://api.imgur.com/3/image", {
      method: "POST",
      headers: {
        Authorization: `Client-ID ${imgurClientId}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        image: base64,
        type: "base64",
        title: file.name,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(`Imgur API error: ${error.data?.error || "Unknown error"}`);
    }

    const result = await response.json();
    const imageUrl = result.data.link;

    return NextResponse.json({ url: imageUrl });
  } catch (error) {
    console.error("Upload image error:", error);
    return NextResponse.json(
      { error: "Failed to upload image" },
      { status: 500 }
    );
  }
}
