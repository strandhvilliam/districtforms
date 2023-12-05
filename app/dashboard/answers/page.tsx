"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Dialog } from "@/components/ui/dialog";
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DistrictData, SelectFormResponse } from "@/lib/types";
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
import { useAuth } from "@/context/auth-context";
import { useData } from "@/context/data-context";

export default function AnswersPage() {
  const form = useForm<DistrictData>();
  const { token } = useAuth();
  const { answersData, setAnswersData } = useData();

  useEffect(() => {
    (async () => {
      if (answersData.length > 0) {
        return;
      }
      console.log("fetching answers");
      const response = await fetch("/api/answers", {
        method: "GET",
        headers: {
          authorization: `${token}`,
        },
      });
      const data = await response.json();
      setAnswersData(data);
    })();
  }, [answersData.length, setAnswersData, token]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Senaste svarsresultat</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={() => {}} className="gap-4 flex flex-col">
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
                {answersData &&
                  answersData
                    .filter((row) => !!row.sizeAnswer)
                    .sort(
                      (a, b) =>
                        new Date(b.date!).getTime() -
                        new Date(a.date!).getTime(),
                    )
                    .map((row, index) => (
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
                            <DialogTrigger asChild>
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
                                              defaultValue={
                                                row.sizeAnswer || "N/A"
                                              }
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
                                              defaultValue={
                                                row.lockedAnswer || "N/A"
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
                                              defaultValue={
                                                row.mapAnswer || "N/A"
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
                                                row.facilitiesAnswer || "N/A"
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
                                              defaultValue={
                                                row.elevatorAnswer || "N/A"
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
                                      name="parkingAnswer"
                                      render={() => (
                                        <FormItem>
                                          <FormLabel>
                                            Var det enkelt att hitta parkering?
                                          </FormLabel>
                                          <FormControl>
                                            <Textarea
                                              defaultValue={
                                                row.parkingAnswer || "N/A"
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
                                      name="otherAnswer"
                                      render={() => (
                                        <FormItem>
                                          <FormLabel>
                                            Något annat du tänkte på gällande
                                            distrikten?
                                          </FormLabel>
                                          <FormControl>
                                            <Textarea
                                              defaultValue={
                                                row.otherAnswer || "N/A"
                                              }
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
                    ))}
              </TableBody>
            </Table>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}

function calcQuestionsAnswered(data: SelectFormResponse) {
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
}

function calcMaxLength(nameStr?: string | null) {
  if (!nameStr) {
    return "N/A";
  }
  if (nameStr.length > 16) {
    return nameStr.slice(0, 16) + "...";
  }
  return nameStr;
}
