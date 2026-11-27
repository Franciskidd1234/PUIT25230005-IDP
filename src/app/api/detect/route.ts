import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("image") as File;

    if (!file) {
      return NextResponse.json({ error: "No image provided" }, { status: 400 });
    }

    const allowedTypes = ["image/png", "image/jpeg", "image/gif", "image/webp"];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: "Invalid file type. Allowed: png, jpg, jpeg, gif, webp" },
        { status: 400 }
      );
    }

    if (file.size > 16 * 1024 * 1024) {
      return NextResponse.json(
        { error: "File size must be less than 16MB" },
        { status: 400 }
      );
    }

    const arrayBuffer = await file.arrayBuffer();
    const base64Image = Buffer.from(arrayBuffer).toString("base64");

    const apiKey = process.env.ULTRALYTICS_API_KEY;
    const endpoint = process.env.ULTRALYTICS_ENDPOINT;

    if (!apiKey || !endpoint) {
      return NextResponse.json(
        { error: "API configuration missing" },
        { status: 500 }
      );
    }

    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        image: base64Image,
        confidence: 0.5,
      }),
      signal: AbortSignal.timeout(30000),
    });

    if (!response.ok) {
      const errorText = await response.text();
      return NextResponse.json(
        { error: `Model API error: ${errorText}` },
        { status: 500 }
      );
    }

    const result = await response.json();
    return NextResponse.json({ success: true, result });
  } catch (error) {
    if (error instanceof Error) {
      if (error.name === "TimeoutError") {
        return NextResponse.json(
          { error: "Request timeout" },
          { status: 500 }
        );
      }
      return NextResponse.json(
        { error: `Request failed: ${error.message}` },
        { status: 500 }
      );
    }
    return NextResponse.json(
      { error: "Server error" },
      { status: 500 }
    );
  }
}