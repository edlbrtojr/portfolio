import Link from "next/link";
import { ArrowLeft, Home, Search } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="container mx-auto min-h-[80vh] flex items-center justify-center py-8 px-4 md:px-8 animate-fade-in">
      <div className="relative w-full max-w-2xl">
        {/* Background decorative elements */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[200%] h-[200%] rounded-full bg-gradient-to-br from-aurora-purple/20 via-aurora-cyan/15 to-aurora-magenta/20 blur-3xl opacity-50 animate-glow-pulse" />
        </div>

        <div className="aurora-glass-glow p-8 md:p-12 text-center relative overflow-hidden rounded-3xl">
          {/* 404 number with gradient */}
          <div className="mb-6">
            <span className="text-8xl md:text-9xl font-display font-bold text-gradient">
              404
            </span>
          </div>

          <h2 className="text-2xl md:text-3xl font-display font-semibold mb-4 text-foreground">
            Page Not Found
          </h2>
          
          <p className="text-muted-foreground mb-8 text-lg max-w-md mx-auto">
            The page you are looking for might have been removed, had its name
            changed, or is temporarily unavailable.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button
              variant="outline"
              asChild
              className="aurora-btn rounded-xl w-full sm:w-auto"
            >
              <Link href="/" className="flex items-center gap-2">
                <ArrowLeft className="h-4 w-4" />
                Go Back
              </Link>
            </Button>
            <Button
              asChild
              className="aurora-btn-primary rounded-xl w-full sm:w-auto"
            >
              <Link href="/" className="flex items-center gap-2">
                <Home className="h-4 w-4" />
                Go to Homepage
              </Link>
            </Button>
          </div>

          {/* Decorative corners */}
          <div className="absolute top-4 left-4 w-8 h-8 border-t-2 border-l-2 border-aurora-purple/30 rounded-tl-xl" />
          <div className="absolute top-4 right-4 w-8 h-8 border-t-2 border-r-2 border-aurora-cyan/30 rounded-tr-xl" />
          <div className="absolute bottom-4 left-4 w-8 h-8 border-b-2 border-l-2 border-aurora-cyan/30 rounded-bl-xl" />
          <div className="absolute bottom-4 right-4 w-8 h-8 border-b-2 border-r-2 border-aurora-purple/30 rounded-br-xl" />
        </div>
      </div>
    </div>
  );
}
