"use client";

import { useRouter } from "next/navigation";
import { Button } from "../ui/button";

export function GoBackButton() {
  const router = useRouter();

  const navigateBack = () => {
    router.back();
  };
  return (
    <Button onClick={navigateBack} variant="default">
      Go Back
    </Button>
  );
}
