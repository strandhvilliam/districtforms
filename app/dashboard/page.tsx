"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import {
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Dialog } from "@/components/ui/dialog";
import Loading from "@/components/modals/loading";
import { GoBackButton } from "@/components/interaction/go-back";
import { useUpload } from "@/context/upload-context";
import { FormEvent } from "react";

export default function Dashboard() {
  const { data } = useUpload();
  const calcMaxLengthNote = (noteStr: string) => {
    if (noteStr.length > 30) {
      return noteStr.slice(0, 30) + "...";
    }
    return noteStr;
  };

  const calcMaxLengthName = (nameStr: string) => {
    if (nameStr.length > 20) {
      return nameStr.slice(0, 20) + "...";
    }
    return nameStr;
  };

  const parseDateString = (date: Date) => {
    const dateObj = new Date(date);
    const year = dateObj.getFullYear();
    const month = (dateObj.getMonth() + 1).toString().padStart(2, "0");
    const day = dateObj.getDate().toString().padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const sendEmails = async (e: FormEvent) => {
    e.preventDefault();
    await fetch("/dashboard/api", {
      method: "POST",
    });
    console.log("sent");
  };

  return (
    <main className="flex flex-col min-h-screen  justify-center p-24">
      <form onSubmit={sendEmails} className="gap-4 flex flex-col">
        <div className="flex justify-between items-center w-full">
          <h1 className="text-2xl font-bold">
            Vilka vill du skicka mail till?
          </h1>
          <div className="flex gap-4">
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline">Go back</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Are you sure?</DialogTitle>
                  <DialogDescription>
                    You will need to upload the data again
                  </DialogDescription>
                  <DialogFooter className="gap-2">
                    <DialogClose asChild>
                      <Button variant="outline">Cancel</Button>
                    </DialogClose>
                    <GoBackButton />
                  </DialogFooter>
                </DialogHeader>
              </DialogContent>
            </Dialog>
            <Dialog>
              <DialogTrigger asChild>
                <Button
                  type="submit"
                  variant="default"
                  className="px-8 self-end"
                >
                  Send
                </Button>
              </DialogTrigger>
              <DialogContent>
                <Loading statusText="Sending emails..." />
              </DialogContent>
            </Dialog>
          </div>
        </div>
        <div className="border-slate-800 w-full rounded-md border flex flex-col items-center justify-center gap-4">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Select</TableHead>
                <TableHead>Distrikttyp</TableHead>
                <TableHead>Förkunnare</TableHead>
                <TableHead>E-post</TableHead>
                <TableHead>Tilldelad</TableHead>
                <TableHead>Återlämnad</TableHead>
                <TableHead>Obearbetat</TableHead>
                <TableHead>Anteckning</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data
                .filter((row) => !!row.Återlämnad)
                .sort(
                  (a, b) =>
                    new Date(b.Återlämnad).getTime() -
                    new Date(a.Återlämnad).getTime(),
                )
                .map((row, index) => (
                  <TableRow key={index}>
                    <TableCell>
                      <div className="flex">
                        <Checkbox />
                      </div>
                    </TableCell>
                    <TableCell>{`${row.Distriktstyp} ${row.Distriktsnummer}`}</TableCell>
                    <TableCell>{calcMaxLengthName(row.Namn)}</TableCell>
                    <TableCell>{row["E-post"]}</TableCell>
                    <TableCell>{parseDateString(row.Tilldelade)}</TableCell>
                    <TableCell>{parseDateString(row.Återlämnad)}</TableCell>
                    <TableCell>{row.Obearbetade}</TableCell>
                    <TableCell>
                      <Dialog>
                        <DialogTrigger>
                          <div className="rounded-md hover:shadow hover:bg-slate-600 transition-colors ease-in-out p-2 duration-300 cursor-pointer">
                            {calcMaxLengthNote(row.Anteckningar) || "..."}
                          </div>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>
                              {`Anteckning för ${row.Distriktstyp} ${row.Distriktsnummer}`}
                            </DialogTitle>
                            <DialogDescription>
                              {row.Anteckningar}
                            </DialogDescription>
                          </DialogHeader>
                        </DialogContent>
                      </Dialog>
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </div>
      </form>
    </main>
  );
}
