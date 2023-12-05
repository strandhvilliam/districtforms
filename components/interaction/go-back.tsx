"use client";

import { useRouter } from "next/navigation";
import { Button } from "../ui/button";
import { useUpload } from "@/context/upload-context";

export function GoBackButton() {
  const router = useRouter();
  const { resetData } = useUpload();

  const navigateBack = () => {
    resetData();
    router.replace("/dashboard/upload");
  };
  return (
    <Button onClick={navigateBack} variant="default">
      Go Back
    </Button>
  );
}
