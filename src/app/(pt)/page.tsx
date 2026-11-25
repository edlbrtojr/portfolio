import { Home } from "@/components/home";
import { homeMetadata } from "@/lib/metadata";

export const metadata = homeMetadata("pt");

export default function Page() {
  return <Home locale="pt" />;
}
