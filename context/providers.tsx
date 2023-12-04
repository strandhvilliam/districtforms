"use client";

import { ThemeProvider } from "./theme-context";
import { UploadProvider } from "./upload-context";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <UploadProvider>{children}</UploadProvider>
    </ThemeProvider>
  );
}
