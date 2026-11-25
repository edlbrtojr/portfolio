import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ lang: string }> }
) {
  try {
    const { lang } = await params;

    // Validate the language parameter
    if (lang !== "en" && lang !== "pt") {
      return new NextResponse("Invalid language parameter", { status: 400 });
    }

    // Define the file path based on language
    const fileName = lang === "pt" ? "resume-pt.pdf" : "resume-en.pdf";
    const filePath = path.join(process.cwd(), "public", fileName);
    // Nome com que o recrutador salva o arquivo: "resume-pt.pdf" se perde numa
    // pasta de downloads cheia de currículos.
    const downloadName =
      lang === "pt"
        ? "Curriculo_Edilberto_Lima_Junior.pdf"
        : "Resume_Edilberto_Lima_Junior.pdf";

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
        "Content-Disposition": `attachment; filename="${downloadName}"`,
        // O PDF é trocado no mesmo caminho a cada atualização do currículo. Com
        // "immutable" de 1 ano, navegador e CDN seguiam servindo a versão velha;
        // 1 h na CDN e revalidação no navegador bastam para um arquivo deste porte.
        "Cache-Control": "public, max-age=0, s-maxage=3600, must-revalidate",
      },
    });
  } catch (error) {
    console.error("Error serving resume file:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
