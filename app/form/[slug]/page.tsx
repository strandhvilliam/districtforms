"use client";
import { useSearchParams, useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { DistrictData, FormAnswers, formSchema } from "@/lib/types";

export default function FormPage({ params }: { params: { slug: string } }) {
  const router = useRouter();
  const queryParams = useSearchParams();
  const district = params.slug;
  const name = queryParams.get("name");
  const date = queryParams.get("date");

  const form = useForm<FormAnswers>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      sizeAnswer: "",
      lockedAnswer: "",
      mapAnswer: "",
      facilitiesAnswer: "",
      elevatorAnswer: "",
      parkingAnswer: "",
      otherAnswer: "",
    },
  });

  const onSubmit = async (data: FormAnswers) => {
    const formData: DistrictData = {
      district,
      name: name || "N/A",
      date: date || "N/A",
      ...data,
    };
    console.log(formData);
    await fetch("/api/forms", {
      method: "POST",
      body: JSON.stringify(formData),
    });
    router.push("/success/form");
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-4 md:p-24 px-6 py-12">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-8 w-full max-w-2xl"
        >
          <div className="flex w-full flex-col">
            <span className="">
              Distrikt: <strong>{district}</strong>
            </span>
            <span className="">
              Inlämnad: <strong>{date || "Ej specificerat"}</strong>
            </span>
            <span className="">
              Namn: <strong>{name || "Ej specificerat"}</strong>
            </span>
          </div>
          <hr />
          <p>
            Vi som ansvarar för distrikten är intresserad av att få dina
            synpunkter på hur distriktet var utformat. Alla frågor är
            frivilliga, men försök att svara på så många som möjligt
          </p>
          <hr />
          <FormField
            control={form.control}
            name="sizeAnswer"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tyckte du att distriktet var lagom stort?</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Ditt svar här..."
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
            render={({ field }) => (
              <FormItem>
                <FormLabel>Fanns det låsta portar?</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Ditt svar här..."
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
            name="mapAnswer"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Var distriktet enkelt ritat, eller var det svårt att hitta
                  vissa hushåll?
                </FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Ditt svar här..."
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
            name="facilitiesAnswer"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Fanns det andra verksamheter (Affärer, vårdinrättningar,
                  bensinmackar)
                </FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Ditt svar här..."
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
            name="elevatorAnswer"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Om trapphus, fanns det hiss?</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Ditt svar här..."
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
            name="parkingAnswer"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Var det enkelt att hitta parkering?</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Ditt svar här..."
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
            name="otherAnswer"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Något annat du tänkte på gällande distrikten?
                </FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Ditt svar här..."
                    className="resize-none"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="flex flex-col gap-4 sm:flex-row items-center justify-between">
            <span>Tack för dina inputs, dem är värdefulla!</span>
            <Button className="sm:w-fit w-full" type="submit">
              Skicka
            </Button>
          </div>
        </form>
      </Form>
    </main>
  );
}

/*
- Tyckte du att det var lagom stort?
- Fanns det låsta portar?
- Var distriktet enkelt ritat, eller var det svårt att hitta vissa hushåll?
- Fanns det andra verksamheter (Affärer, vårdinrättningar, bensinmackar)?
- Om trapphus, fanns det hiss?
- Var det enkelt att parkera?
- Något annat du tänkte på gällande distriktet?
*/
