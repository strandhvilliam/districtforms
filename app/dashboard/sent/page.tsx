"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  Table,
} from "@/components/ui/table";
import { useAuth } from "@/context/auth-context";
import { useData } from "@/context/data-context";
import { SelectSentEmail } from "@/lib/types";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function SentPage() {
  const { token } = useAuth();
  const { sentEmailsData, setSentEmailsData } = useData();
  // const [sentEmailsData, setSentEmailsData] = useState<SelectSentEmail[]>([]);

  useEffect(() => {
    const getSentEmails = async () => {
      try {
        if (sentEmailsData.length > 0) {
          return;
        }
        const res = await fetch("/api/sent", {
          method: "GET",
          headers: {
            authorization: `${token}`,
          },
        });
        const data = (await res.json()) as SelectSentEmail[];
        console.log(data);
        setSentEmailsData(data);
      } catch (error) {
        console.log(error);
      }
    };
    getSentEmails();
  }, [sentEmailsData.length, setSentEmailsData, token]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Senaste svarsresultat</CardTitle>
      </CardHeader>
      <CardContent>
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
                        <TableCell className="w-[300px]">{row.email}</TableCell>
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
    </Card>
  );
}
