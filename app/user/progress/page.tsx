import ProgressTracker from "@/components/features/progress/progress-tracker";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function ProgressPage() {
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card">
        <div className="mx-auto max-w-6xl px-4 py-4">
          <div className="flex items-center gap-4">
            <Link href="/user/dashboard">
              <Button
                variant="outline"
                size="sm"
                className="border-2 bg-transparent"
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Dashboard
              </Button>
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-foreground">
                Progress Tracking
              </h1>
              <p className="text-muted-foreground">
                Monitor your contest performance and analytics in real-time
              </p>
            </div>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-6xl px-4 py-8">
        <ProgressTracker showRealTime={true} />
      </div>
    </div>
  );
}
