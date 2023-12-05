"use client";

import { AuthProvider } from "./auth-context";
import { DataProvider } from "./data-context";
import { ThemeProvider } from "./theme-context";
import { UploadProvider } from "./upload-context";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <ThemeProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange
      >
        <DataProvider>
          <UploadProvider>{children}</UploadProvider>
        </DataProvider>
      </ThemeProvider>
    </AuthProvider>
  );
}
