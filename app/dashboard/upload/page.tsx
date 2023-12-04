"use client";
import Dropzone from "react-dropzone";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
    router.push("/dashboard/upload/table");
  };
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl font-bold">
          Ladda upp excel filen:
        </CardTitle>
        <CardDescription>
          Ladda ner .xslx filen från TerritoryHelper
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form
          onSubmit={handleNext}
          className="flex w-full max-w-2xl flex-col gap-4"
        >
          {/* <Input onChange={handleFileChange} id="file" type={"file"} /> */}
          <Dropzone onDrop={(acceptedFiles) => console.log(acceptedFiles)}>
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
                      stroke-width="2"
                      stroke="currentColor"
                      fill="none"
                      stroke-linecap="round"
                      stroke-linejoin="round"
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
          <Button
            className={`${
              !isUploaded
                ? "opacity-40 hover:bg-primary cursor-default"
                : "opacity-100"
            } w-full self-end`}
            disabled={!isUploaded}
            type="submit"
          >
            Ladda upp
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
