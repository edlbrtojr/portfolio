import { Home } from "@/components/home";
import { homeMetadata } from "@/lib/metadata";

export const metadata = homeMetadata("en");

export default function Page() {
  return <Home locale="en" />;
}
