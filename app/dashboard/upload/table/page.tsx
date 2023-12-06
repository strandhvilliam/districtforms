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
import { FormEvent, useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Target } from "@/lib/types";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { Form, FormField, FormItem } from "@/components/ui/form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const FormSchema = z.object({
  targets: z.array(z.string()).refine((value) => value.some((item) => item)),
});

export default function TablePage() {
  const [isSending, setIsSending] = useState(false);
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
  });
  const { data, isUploaded } = useUpload();
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
    const selectedRows = Array.from(
      document.querySelectorAll("input[type=checkbox]:checked"),
    ).map(
      (checkbox) =>
        checkbox.parentElement?.parentElement?.parentElement?.parentElement,
    );

    console.log("rows", selectedRows);

    //
    // const tempTarget: Target = {
    //   email: "strandh.villiam@gmail.com",
    //   namn: "Villiam Strandh",
    //   distrikt: "Centrum 123",
    //   aterlamnad: "2023-12-05",
    // };
    //
    // try {
    //   setIsSending(true);
    //   const response = await fetch("/api/mail", {
    //     method: "POST",
    //     headers: {
    //       "Content-Type": "application/json",
    //     },
    //     body: JSON.stringify({ targets: [tempTarget] }),
    //   });
    //   console.log(response);
    //   setIsSending(false);
    // } catch (error) {
    //   console.error(error);
    // }
  };

  return (
    <Form {...form}>
      <form onSubmit={sendEmails} className="gap-4 flex flex-col">
        <Card>
          <CardHeader className="flex flex-row justify-between">
            <div className="flex flex-col gap-1">
              <CardTitle className="">Återlämnade distrikt</CardTitle>
              <CardDescription>
                Välj de distrikt som du vill skicka mail till.
              </CardDescription>
            </div>
            <div className="flex justify-between items-end">
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
                  {isSending && (
                    <DialogContent>
                      <Loading statusText="Sending emails..." />
                    </DialogContent>
                  )}
                  {!isSending && (
                    <DialogContent>
                      <h2 className="font-bold text-lg">
                        Mailen har skickats!
                      </h2>
                      <DialogClose asChild>
                        <Button variant="default" className="px-8 self-end">
                          Ok
                        </Button>
                      </DialogClose>
                    </DialogContent>
                  )}
                </Dialog>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="border-slate-800 w-full rounded-md border flex flex-col items-center justify-center gap-4">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Välj</TableHead>
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
                      <FormField
                        key={index}
                        name="targets"
                        control={form.control}
                        render={({ field }) => (
                          <TableRow>
                            <TableCell>
                              <FormItem className="flex">
                                <Checkbox />
                              </FormItem>
                            </TableCell>
                            <TableCell>{`${row.Distriktstyp} ${row.Distriktsnummer}`}</TableCell>
                            <TableCell>{calcMaxLengthName(row.Namn)}</TableCell>
                            <TableCell>{row["E-post"]}</TableCell>
                            <TableCell>
                              {parseDateString(row.Tilldelade)}
                            </TableCell>
                            <TableCell>
                              {parseDateString(row.Återlämnad)}
                            </TableCell>
                            <TableCell>{row.Obearbetade}</TableCell>
                            <TableCell>
                              <Dialog>
                                <DialogTrigger>
                                  <div className="rounded-md hover:shadow hover:bg-slate-600 transition-colors ease-in-out p-2 duration-300 cursor-pointer">
                                    {calcMaxLengthNote(row.Anteckningar) ||
                                      "..."}
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
                        )}
                      />
                    ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </form>
    </Form>
  );
}
