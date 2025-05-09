import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="container mx-auto min-h-[80vh] flex items-center justify-center py-8 px-4 md:px-8 animate-fade-in">
      <div className="relative w-full max-w-2xl">
        {/* Background decorative elements */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[200%] h-[200%] rounded-full bg-gradient-to-br from-blue-500/20 via-purple-500/20 to-pink-500/20 blur-3xl opacity-30 animate-pulse"></div>
        </div>

        <div className="glass-morphism p-8 md:p-12 text-center relative overflow-hidden bg-white/10 dark:bg-slate-800/80 backdrop-filter backdrop-blur-lg border border-white/30 dark:border-white/30 shadow-xl rounded-3xl">
          {/* Shine effect */}
          <div className="absolute -inset-1 bg-gradient-to-r from-transparent via-white/20 to-transparent -top-[100%] opacity-0 group-hover:opacity-100 group-hover:animate-[shine_3s_ease-in-out]"></div>

          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400">
            404
          </h1>
          <h2 className="text-2xl md:text-3xl font-semibold mb-6 text-white">
            Page Not Found
          </h2>
          <p className="text-white/70 mb-8 text-lg">
            The page you are looking for might have been removed, had its name
            changed, or is temporarily unavailable.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button
              variant="outline"
              asChild
              className="w-full sm:w-auto bg-white/10 hover:bg-white/20 text-white border-white/30 hover:border-white/50 backdrop-blur-lg"
            >
              <Link href="/">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Go Back
              </Link>
            </Button>
            <Button
              variant="outline"
              asChild
              className="w-full sm:w-auto bg-white/10 hover:bg-white/20 text-white border-white/30 hover:border-white/50 backdrop-blur-lg"
            >
              <Link href="/">Go to Homepage</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
