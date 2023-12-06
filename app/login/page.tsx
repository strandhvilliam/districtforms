"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/context/auth-context";
import { useRouter } from "next/navigation";
import { FormEvent, useEffect, useState } from "react";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const { login, isAuthenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isAuthenticated) {
      router.replace("/dashboard/upload");
    }
  }, [isAuthenticated, router]);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    login(username, password);
  };
  return (
    <main className="flex flex-col min-h-screen items-center gap-4 justify-center sm:p-24">
      <Card className="w-full max-w-lg">
        <CardHeader>
          <CardTitle>Logga in</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <Label htmlFor="username">Användarnamn</Label>
            <Input
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="p-4 border border-gray-300 rounded-md"
            />
            <Label htmlFor="password">Lösenord</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="p-4 border border-gray-300 rounded-md"
            />
            <Button type="submit">Logga in</Button>
          </form>
        </CardContent>
      </Card>
    </main>
  );
}
