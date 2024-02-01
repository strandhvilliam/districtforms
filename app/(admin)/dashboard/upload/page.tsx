"use client";
import Dropzone, { Accept } from "react-dropzone";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useUpload } from "@/context/upload-context";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/context/auth-context";

export default function UploadPage() {
  const { upload, isUploaded, setIsUploaded, data } = useUpload();
  const [fileName, setFileName] = useState<string | null>(null);
  const router = useRouter();
  const toast = useToast();
  const { isLoading } = useAuth();

  const handleFileChosen = async (data: File[]) => {
    if (data.length < 0) {
      return;
    }
    const file = data[0];
    setFileName(file.name);
    const isValid = await upload(file);
    if (!isValid) {
      setFileName(null);
      toast.toast({
        title: "Fel filformat",
        description: "Ladda upp en .xlsx fil",
        variant: "destructive",
      });
    }
  };

  const handleNext = (e: FormEvent) => {
    e.preventDefault();
    setIsUploaded(true);
    router.push("/dashboard/upload/table");
  };
  return (
    <>
      {isLoading && <p>Laddar...</p>}
      {!isLoading && (
        <Card>
          <CardHeader>
            <CardTitle>Ladda upp excel filen:</CardTitle>
            <CardDescription>
              Ladda ner .xlsx filen från TerritoryHelper och ladda upp den här.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form
              onSubmit={handleNext}
              className="flex w-full max-w-2xl flex-col gap-4"
            >
              {/* <Input onChange={handleFileChange} id="file" type={"file"} /> */}
              <Dropzone
                accept={{
                  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet":
                    [".xlsx"],
                }}
                onDrop={(acceptedFiles) => handleFileChosen(acceptedFiles)}
              >
                {({ getRootProps, getInputProps }) => (
                  <Card
                    className="flex flex-col justify-center items-center border-dashed"
                    {...getRootProps()}
                  >
                    <CardContent className="flex p-12 flex-col items-center  justify-center">
                      <input {...getInputProps()} />
                      <div className="flex gap-4 flex-col items-center justify-center">
                        <svg
                          className="w-12 h-12"
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          strokeWidth="2"
                          stroke="currentColor"
                          fill="none"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path stroke="none" d="M0 0h24v24H0z" />{" "}
                          <path d="M4 17v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2 -2v-2" />{" "}
                          <polyline points="7 9 12 4 17 9" />{" "}
                          <line x1="12" y1="4" x2="12" y2="16" />
                        </svg>
                        <span>
                          Dra filen hit eller klicka för att ladda upp en fil
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </Dropzone>
              <div>
                <span>{fileName || "Ingen fil vald."}</span>
              </div>
              <Button
                className={`${
                  data.length === 0
                    ? "opacity-40 hover:bg-primary cursor-default"
                    : "opacity-100"
                } w-full self-end`}
                disabled={data.length === 0}
                type="submit"
              >
                Ladda upp
              </Button>
            </form>
          </CardContent>
        </Card>
      )}
    </>
  );
}
