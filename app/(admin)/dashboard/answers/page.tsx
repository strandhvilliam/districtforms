"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import { useData } from "@/context/data-context";
import { DistrictData, SelectFormResponse } from "@/lib/types";
import { useForm } from "react-hook-form";
import * as Xlsx from "xlsx";

export default function AnswersPage() {
  const form = useForm<DistrictData>();
  const { answersData, refreshAnswersData, isRefreshingAnswers } = useData();

  const downloadAsXlsx = () => {
    const data = answersData.map((row) => {
      const { id: _, ...rest } = row;
      return rest;
    });
    const sheet = Xlsx.utils.json_to_sheet(data);
    const wb = Xlsx.utils.book_new();
    Xlsx.utils.book_append_sheet(wb, sheet, "svar");
    Xlsx.utils.sheet_add_aoa(
      sheet,
      [
        [
          "Distrikt",
          "Namn",
          "Datum",
          "Storlek",
          "Låsta portar",
          "Karta",
          "Verksamheter",
          "Hiss",
          "Parkering",
          "Övrigt",
        ],
      ],
      { origin: "A1" },
    );
    /* calculate column width */
    const max_width = answersData.reduce(
      (w, r) => Math.max(w, r.district.length),
      10,
    );
    sheet["!cols"] = [{ wch: max_width }];
    Xlsx.writeFile(wb, "svar.xlsx");
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center  justify-between">
        <CardTitle>Senaste svarsresultat</CardTitle>
        <CardDescription className="flex items-center">
          <Button
            onClick={() => downloadAsXlsx()}
            type="button"
            className="flex gap-2 text-white hover:bg-slate-900 sm:mr-2 bg-transparent border py-2"
          >
            Ladda ner som .xlsx
            <svg
              xmlns="http://www.w3.org/2000/svg"
              height="24"
              fill="#fff"
              viewBox="0 -960 960 960"
              width="24"
            >
              <path d="M480-320 280-520l56-58 104 104v-326h80v326l104-104 56 58-200 200ZM240-160q-33 0-56.5-23.5T160-240v-120h80v120h480v-120h80v120q0 33-23.5 56.5T720-160H240Z" />
            </svg>
          </Button>
          <Button
            onClick={() => refreshAnswersData()}
            type="button"
            className="flex gap-2 text-white hover:bg-slate-900 sm:mr-2 bg-transparent border py-2"
          >
            Refresh
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="#fff"
              width="24"
              height="24"
              viewBox="0 0 24 24"
            >
              <path d="M9 12l-4.463 4.969-4.537-4.969h3c0-4.97 4.03-9 9-9 2.395 0 4.565.942 6.179 2.468l-2.004 2.231c-1.081-1.05-2.553-1.699-4.175-1.699-3.309 0-6 2.691-6 6h3zm10.463-4.969l-4.463 4.969h3c0 3.309-2.691 6-6 6-1.623 0-3.094-.65-4.175-1.699l-2.004 2.231c1.613 1.526 3.784 2.468 6.179 2.468 4.97 0 9-4.03 9-9h3l-4.537-4.969z" />
            </svg>
          </Button>
        </CardDescription>
      </CardHeader>
      {isRefreshingAnswers && (
        <CardContent className="flex flex-col items-center justify-center">
          <p className="text-white">Laddar...</p>
        </CardContent>
      )}
      {!isRefreshingAnswers && answersData.length === 0 && (
        <CardContent className="flex flex-col items-center justify-center">
          <p>Inga svar</p>
        </CardContent>
      )}

      {!isRefreshingAnswers && answersData.length > 0 && (
        <CardContent className="overflow-x-auto">
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
                                <Button>
                                  Tryck här för att se svarresultat
                                </Button>
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
                                              Var det enkelt att hitta
                                              parkering?
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
      )}
    </Card>
  );
}

function calcQuestionsAnswered(data: SelectFormResponse) {
  let count = 0;
  const fieldsToCheck: (keyof SelectFormResponse)[] = [
    "sizeAnswer",
    "lockedAnswer",
    "mapAnswer",
    "facilitiesAnswer",
    "elevatorAnswer",
    "parkingAnswer",
    "otherAnswer",
  ];

  for (const field of fieldsToCheck) {
    const value = data[field];
    if (value !== null && value.toString()?.trim().length > 0) {
      count++;
    }
  }

  return `${count}/${fieldsToCheck.length}`;
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
