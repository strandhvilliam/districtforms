import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function SuccessFormPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-4 md:p-24 px-6 py-12">
      <div className="flex flex-col items-center justify-center gap-4">
        <h1 className="text-4xl font-bold text-center">
          Mail har skickats till valda adresser!
        </h1>
        <Link href="/">
          <Button>
            <a className="text-xl text-center underline">Tillbaka</a>
          </Button>
        </Link>
      </div>
    </main>
  );
}
