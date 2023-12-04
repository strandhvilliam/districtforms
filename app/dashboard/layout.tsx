"use client";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useRouter } from "next/navigation";
import { ReactNode, useEffect, useState } from "react";

export default function DashhboardLayout({
  children,
}: {
  children: ReactNode;
}) {
  const [activeTab, setActiveTab] = useState("upload");
  const router = useRouter();

  useEffect(() => {
    if (activeTab === "upload") {
      router.push("/dashboard/upload");
    } else if (activeTab === "table") {
      router.push("/dashboard/answers");
    }
  }, [activeTab, router]);

  return (
    <main className="flex flex-col items-center mt-80 gap-4 p-24">
      <Tabs defaultValue="upload" className="w-full max-w-[124rem]">
        <TabsList>
          <TabsTrigger onClick={() => setActiveTab("upload")} value="upload">
            Ladda upp
          </TabsTrigger>
          <TabsTrigger onClick={() => setActiveTab("table")} value="table">
            Se svar
          </TabsTrigger>
        </TabsList>
        <TabsContent value="upload">{children}</TabsContent>
        <TabsContent value="table">{children}</TabsContent>
      </Tabs>
    </main>
  );
}
