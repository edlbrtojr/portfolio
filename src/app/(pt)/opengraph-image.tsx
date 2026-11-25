import { ogImage, ogSize } from "@/lib/og";

export const alt = "Edilberto Lima Jr., desenvolvedor full-stack e engenheiro de dados";
export const size = ogSize;
export const contentType = "image/png";

export default function Image() {
  return ogImage("pt");
}
