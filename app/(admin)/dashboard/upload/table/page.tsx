"use client";

import { GoBackButton } from "@/components/interaction/go-back";
import Loading from "@/components/modals/loading";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useUpload } from "@/context/upload-context";
import { Target } from "@/lib/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";

const FormSchema = z.object({
  // targets: z.array(z.string()).refine((value) => value.some((item) => item)),
  targets: z.array(z.string()),
});

export default function TablePage() {
  const [isSending, setIsSending] = useState(false);
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      targets: [],
    },
  });
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

  const onSubmit = async (input: z.infer<typeof FormSchema>) => {
    setIsSending(true);
    try {
      const body = data.filter((row) => input.targets.includes(row.Id));

      const targets: Target[] = body.map((row) => ({
        email: row["E-post"],
        aterlamnad: parseDateString(row.Återlämnad),
        namn: row.Namn,
        distrikt: `${row.Distriktstyp} ${row.Distriktsnummer}`,
      }));

      await fetch("/api/mail", {
        method: "POST",
        body: JSON.stringify({ targets }),
        cache: "no-store",
      });
      setIsSending(false);
    } catch (error) {
      setIsSending(false);
    }
  };

  const onErrors = (errors: any) => {
    console.error(errors);
  };

  if (!data) {
    return <Loading statusText="Loading data..." />;
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit, onErrors)}
        className="gap-4 flex flex-col"
      >
        <Card>
          <CardHeader className="flex flex-row justify-between">
            <div className="flex flex-col gap-1">
              <CardTitle className="">Återlämnade distrikt</CardTitle>
              <CardDescription>
                Välj de inämningar som du vill skicka mail till.
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
                    .map((row) => (
                      <TableRow key={row.Id}>
                        <TableCell>
                          <FormField
                            key={row.Id}
                            name="targets"
                            control={form.control}
                            render={({ field }) => (
                              <FormItem key={row.Id} className="flex">
                                <FormControl>
                                  <Checkbox
                                    onCheckedChange={(checked) => {
                                      console.log(row.Id);
                                      return checked
                                        ? field.onChange([
                                            ...field.value,
                                            row.Id,
                                          ])
                                        : field.onChange(
                                            field.value.filter(
                                              (value: any) => value !== row.Id,
                                            ),
                                          );
                                    }}
                                  />
                                </FormControl>
                              </FormItem>
                            )}
                          />
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
          </CardContent>
        </Card>
      </form>
    </Form>
  );
}
