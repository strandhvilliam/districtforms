"use client";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/context/auth-context";
import { usePathname, useRouter } from "next/navigation";
import { ReactNode, useEffect, useState } from "react";
import UploadPage from "./upload/page";
import AnswersPage from "./answers/page";
import SentPage from "./sent/page";
import { useUpload } from "@/context/upload-context";
import TablePage from "./upload/table/page";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const { isAuthenticated } = useAuth();
  const pathname = usePathname();
  const router = useRouter();
  const { isUploaded } = useUpload();

  useEffect(() => {
    if (!isAuthenticated) {
      console.log("redirecting");
      router.replace("/login");
      return;
    }
  }, [isAuthenticated, isUploaded, pathname, router]);

  return (
    <main className="flex flex-col items-center gap-4 p-24">
      <Tabs defaultValue="upload" className="w-full max-w-[124rem]">
        <TabsList>
          <TabsTrigger
            onClick={() => router.push("/dashboard/upload")}
            value="upload"
          >
            Ladda upp
          </TabsTrigger>
          <TabsTrigger
            onClick={() => router.push("/dashboard/answers")}
            value="answers"
          >
            Se svar
          </TabsTrigger>
          <TabsTrigger
            onClick={() => router.push("/dashboard/sent")}
            value="sent"
          >
            Skickade mail
          </TabsTrigger>
        </TabsList>
        <TabsContent value="upload">
          {!isUploaded ? <UploadPage /> : <TablePage />}
        </TabsContent>
        <TabsContent value="answers">
          <AnswersPage />
        </TabsContent>
        <TabsContent value="sent">
          <SentPage />
        </TabsContent>
      </Tabs>
    </main>
  );
}
