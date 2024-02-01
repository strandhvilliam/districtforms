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
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  Table,
} from "@/components/ui/table";
import { useData } from "@/context/data-context";
import Link from "next/link";

export default function SentPage() {
  const { sentEmailsData, refreshSentEmailsData, isRefreshingEmails } =
    useData();

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Skickade mail</CardTitle>
        <CardDescription>
          <Button
            onClick={() => refreshSentEmailsData()}
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
      {isRefreshingEmails && (
        <CardContent className="flex flex-col items-center justify-center">
          <p className="text-white">Laddar...</p>
        </CardContent>
      )}
      {!isRefreshingEmails && sentEmailsData.length === 0 && (
        <CardContent className="flex flex-col items-center justify-center">
          <p>Inga mail skickade</p>
        </CardContent>
      )}
      {!isRefreshingEmails && sentEmailsData.length > 0 && (
        <CardContent className="overflow-x-auto">
          <form onSubmit={() => {}} className="gap-4 flex flex-col">
            <div className="border-slate-800 w-fit rounded-md border flex flex-col items-center justify-center gap-4">
              {sentEmailsData.length === 0 ? (
                <div className="p-4 flex flex-col gap-4 min-w-[300px]">
                  <p>Inga mail skickade</p>
                  <Button>
                    <Link href="/dashboard/upload">
                      Ladda upp fil med inmämningar
                    </Link>
                  </Button>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Distrikt</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Skickat datum</TableHead>
                      <TableHead>Besvarad</TableHead>
                      <TableHead>Datum besvarad</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {sentEmailsData &&
                      sentEmailsData.map((row, index) => (
                        <TableRow key={index}>
                          <TableCell className="w-[300px]">
                            {row.district}
                          </TableCell>
                          <TableCell className="w-[300px]">
                            {row.email}
                          </TableCell>
                          <TableCell className="w-[300px]">
                            {row.createdAt}
                          </TableCell>
                          <TableCell className="w-[300px]">
                            {row.completed ? "Ja" : "Nej"}
                          </TableCell>
                          <TableCell className="w-[300px]">
                            {row.completedAt || "N/A"}
                          </TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
              )}
            </div>
          </form>
        </CardContent>
      )}
    </Card>
  );
}
