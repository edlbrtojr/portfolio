import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function GET(
  request: NextRequest,
  { params }: { params: { lang: string } }
) {
  try {
    const lang = params.lang;

    // Validate the language parameter
    if (lang !== "en" && lang !== "pt") {
      return new NextResponse("Invalid language parameter", { status: 400 });
    }

    // Define the file path based on language
    const fileName = lang === "pt" ? "resume-pt.pdf" : "resume-en.pdf";
    const filePath = path.join(process.cwd(), "public", fileName);

    // Check if the file exists
    if (!fs.existsSync(filePath)) {
      console.error(`File not found: ${filePath}`);
      return new NextResponse("Resume file not found", { status: 404 });
    }

    // Read the file
    const fileBuffer = fs.readFileSync(filePath);

    // Return the file with appropriate headers
    return new NextResponse(fileBuffer, {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename=${fileName}`,
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    });
  } catch (error) {
    console.error("Error serving resume file:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
