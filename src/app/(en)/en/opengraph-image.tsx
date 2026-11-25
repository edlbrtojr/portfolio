import { ogImage, ogSize } from "@/lib/og";

export const alt = "Edilberto Lima Jr., full-stack developer and data engineer";
export const size = ogSize;
export const contentType = "image/png";

export default function Image() {
  return ogImage("en");
}
