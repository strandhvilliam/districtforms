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
import {
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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DistrictData } from "@/lib/types";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";

const example: DistrictData[] = [
  {
    district: "Savja 123",
    name: "Kalle Karlsson",
    date: "2021-09-20",
    sizeAnswer: "Stort tycker jag for att jag inte kunde hitta alla hus",
    lockedAnswer: "Ja",
    mapAnswer: "Ja",
    facilitiesAnswer: "Ja en affar och en restaurang",
    elevatorAnswer: "Ja",
    otherAnswer: "Ingen jag tanker pa",
  },
  {
    district: "Kabo 321",
    name: "Stella Karlsson",
    date: "2021-09-20",
    sizeAnswer: "Stor",
    mapAnswer: "Ja",
    facilitiesAnswer: "Ja en affar och en restaurang",
    elevatorAnswer: "Ja",
    parkingAnswer: "Enkelt att parkera",
    otherAnswer: "Ingen jag tanker pa",
  },
];

export default function AnswersPage() {
  const { data } = useUpload();

  const form = useForm<DistrictData>();

  const calcMaxLength = (nameStr?: string) => {
    if (!nameStr) {
      return "N/A";
    }
    if (nameStr.length > 16) {
      return nameStr.slice(0, 16) + "...";
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

  const calcQuestionsAnswered = (data: DistrictData) => {
    let count = 0;
    if (data.sizeAnswer && data.sizeAnswer.length > 0) {
      count++;
    }
    if (data.lockedAnswer && data.lockedAnswer.length > 0) {
      count++;
    }
    if (data.mapAnswer && data.mapAnswer.length > 0) {
      count++;
    }
    if (data.facilitiesAnswer && data.facilitiesAnswer.length > 0) {
      count++;
    }
    if (data.elevatorAnswer && data.elevatorAnswer.length > 0) {
      count++;
    }
    if (data.parkingAnswer && data.parkingAnswer.length > 0) {
      count++;
    }
    if (data.otherAnswer && data.otherAnswer.length > 0) {
      count++;
    }
    return count + "/7";
  };

  const sendEmails = async (e: FormEvent) => {
    e.preventDefault();
    await fetch("/dashboard/api", {
      method: "POST",
    });
    console.log("sent");
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Senaste svarsresultat</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={sendEmails} className="gap-4 flex flex-col">
          <div className="border-slate-800 w-fit rounded-md border flex flex-col items-center justify-center gap-4">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Distrikt</TableHead>
                  <TableHead>Namn</TableHead>
                  <TableHead>Datum</TableHead>
                  <TableHead>Antal frågor svarade?</TableHead>
                  <TableHead></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {example
                  .filter((row) => !!row.sizeAnswer)
                  .sort(
                    (a, b) =>
                      new Date(b.date).getTime() - new Date(a.date).getTime(),
                  )
                  .map((row, index) => (
                    <>
                      <TableRow key={index}>
                        <TableCell className="w-[300px]">
                          {calcMaxLength(row.district)}
                        </TableCell>
                        <TableCell className="w-[300px]">
                          {calcMaxLength(row.name)}
                        </TableCell>
                        <TableCell className="w-[300px]">
                          {calcMaxLength(row.date)}
                        </TableCell>
                        <TableCell className="w-[300px]">
                          {calcQuestionsAnswered(row)}
                        </TableCell>
                        <TableCell className="w-[300px]">
                          <Dialog>
                            <DialogTrigger>
                              <Button>Tryck här för att se svarresultat</Button>
                            </DialogTrigger>
                            <DialogContent className="sm:h-[80%] w-full max-w-6xl">
                              <DialogHeader>
                                <DialogTitle className="pt-4 px-8">{`${row.district}`}</DialogTitle>
                                <DialogDescription className="px-8">
                                  {`Av ${row.name} den ${row.date}`}
                                </DialogDescription>
                              </DialogHeader>
                              <Form {...form}>
                                <ScrollArea>
                                  <form className="space-y-8 w-full flex-grow flex flex-col px-8">
                                    <hr />
                                    <FormField
                                      name="sizeAnswer"
                                      render={({ field }) => (
                                        <FormItem>
                                          <FormLabel>
                                            Tyckte du att distriktet var lagom
                                            stort?
                                          </FormLabel>
                                          <FormControl>
                                            <Textarea
                                              defaultValue={row.sizeAnswer}
                                              readOnly={true}
                                              className="resize-none"
                                              {...field}
                                            />
                                          </FormControl>
                                          <FormMessage />
                                        </FormItem>
                                      )}
                                    />
                                    <FormField
                                      control={form.control}
                                      name="lockedAnswer"
                                      render={() => (
                                        <FormItem>
                                          <FormLabel>
                                            Fanns det låsta portar?
                                          </FormLabel>
                                          <FormControl>
                                            <Textarea
                                              defaultValue={row.lockedAnswer}
                                              readOnly={true}
                                              className="resize-none"
                                            />
                                          </FormControl>
                                          <FormMessage />
                                        </FormItem>
                                      )}
                                    />
                                    <FormField
                                      control={form.control}
                                      name="mapAnswer"
                                      render={() => (
                                        <FormItem>
                                          <FormLabel>
                                            Var distriktet enkelt ritat, eller
                                            var det svårt att hitta vissa
                                            hushåll?
                                          </FormLabel>
                                          <FormControl>
                                            <Textarea
                                              defaultValue={row.mapAnswer}
                                              readOnly={true}
                                              className="resize-none"
                                            />
                                          </FormControl>
                                          <FormMessage />
                                        </FormItem>
                                      )}
                                    />
                                    <FormField
                                      control={form.control}
                                      name="facilitiesAnswer"
                                      render={() => (
                                        <FormItem>
                                          <FormLabel>
                                            Fanns det andra verksamheter
                                            (Affärer, vårdinrättningar,
                                            bensinmackar)
                                          </FormLabel>
                                          <FormControl>
                                            <Textarea
                                              defaultValue={
                                                row.facilitiesAnswer
                                              }
                                              readOnly={true}
                                              className="resize-none"
                                            />
                                          </FormControl>
                                          <FormMessage />
                                        </FormItem>
                                      )}
                                    />
                                    <FormField
                                      control={form.control}
                                      name="elevatorAnswer"
                                      render={() => (
                                        <FormItem>
                                          <FormLabel>
                                            Om trapphus, fanns det hiss?
                                          </FormLabel>
                                          <FormControl>
                                            <Textarea
                                              defaultValue={row.elevatorAnswer}
                                              readOnly={true}
                                              className="resize-none"
                                            />
                                          </FormControl>
                                          <FormMessage />
                                        </FormItem>
                                      )}
                                    />
                                    <FormField
                                      control={form.control}
                                      name="parkingAnswer"
                                      render={() => (
                                        <FormItem>
                                          <FormLabel>
                                            Var det enkelt att hitta parkering?
                                          </FormLabel>
                                          <FormControl>
                                            <Textarea
                                              defaultValue={row.parkingAnswer}
                                              readOnly={true}
                                              className="resize-none"
                                            />
                                          </FormControl>
                                          <FormMessage />
                                        </FormItem>
                                      )}
                                    />
                                    <FormField
                                      control={form.control}
                                      name="otherAnswer"
                                      render={() => (
                                        <FormItem>
                                          <FormLabel>
                                            Något annat du tänkte på gällande
                                            distrikten?
                                          </FormLabel>
                                          <FormControl>
                                            <Textarea
                                              defaultValue={row.otherAnswer}
                                              readOnly={true}
                                              className="resize-none"
                                            />
                                          </FormControl>
                                          <FormMessage />
                                        </FormItem>
                                      )}
                                    />
                                  </form>
                                </ScrollArea>
                              </Form>
                            </DialogContent>
                          </Dialog>
                        </TableCell>
                      </TableRow>
                    </>
                  ))}
              </TableBody>
            </Table>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
