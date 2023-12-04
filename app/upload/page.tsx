"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useUpload } from "@/context/upload-context";
import { useRouter } from "next/navigation";
import { ChangeEvent, FormEvent } from "react";

export default function Upload() {
  const { upload, isUploaded } = useUpload();
  const router = useRouter();
  const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    const { files } = e.target;

    if (files) {
      const file = files[0];
      upload(file);
    }
  };

  const handleNext = (e: FormEvent) => {
    e.preventDefault();
    router.push("/dashboard");
  };
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-4 p-24">
      <h1 className="text-xl font-bold">Provide the excel file:</h1>
      <form onSubmit={handleNext} className="flex flex-col gap-4">
        <Input onChange={handleFileChange} id="file" type={"file"} />
        <Button
          className={
            !isUploaded
              ? "opacity-40 hover:bg-primary cursor-default"
              : "opacity-100"
          }
          disabled={!isUploaded}
          type="submit"
        >
          Next
        </Button>
      </form>
    </main>
  );
}
