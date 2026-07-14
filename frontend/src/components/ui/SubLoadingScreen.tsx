// src/components/ui/LoadingScreen.tsx
"use client";

import { cn } from "@/lib/utils";

interface SubLoadingScreenProps {
  message?: string;
  fullScreen?: boolean;
}

export function SubLoadingScreen({
  message = "Loading...",
  fullScreen = true,
}: SubLoadingScreenProps) {
  return (
    <div
      className={cn(
        "flex items-center justify-center ",
        fullScreen && "absolute inset-0",
      )}
    >
      <div className="text-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary mx-auto mb-4"></div>
        <p className="text-muted-foreground">{message}</p>
      </div>
    </div>
  );
}
