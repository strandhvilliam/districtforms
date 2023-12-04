import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-4 p-24">
      <h1 className="text-xl font-bold">Provide the excel file:</h1>
      <form className="flex flex-col gap-4">
        <Input id="file" type={"file"} />
      </form>
      <Button></Button>
    </main>
  );
}
