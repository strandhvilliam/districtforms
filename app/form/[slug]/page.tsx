"use client";
import { useSearchParams, useRouter } from "next/navigation";
import { Control, useForm } from "react-hook-form";
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
import { Card } from "@/components/ui/card";

const QUESTIONS = [
  {
    label: "Tyckte du att distriktet var lagom stort?",
    name: "sizeAnswer",
    placeholder: "Ditt svar här...",
  },
  {
    label: "Fanns det låsta portar?",
    name: "lockedAnswer",
    placeholder: "Ditt svar här...",
  },
  {
    label:
      "Var distriktet enkelt ritat, eller var det svårt att hitta vissa hushåll?",
    name: "mapAnswer",
    placeholder: "Ditt svar här...",
  },
  {
    label:
      "Fanns det andra verksamheter (Affärer, vårdinrättningar, bensinmackar)",
    name: "facilitiesAnswer",
    placeholder: "Ditt svar här...",
  },
  {
    label: "Om trapphus, fanns det hiss?",
    name: "elevatorAnswer",
    placeholder: "Ditt svar här...",
  },
  {
    label: "Var det enkelt att hitta parkering?",
    name: "parkingAnswer",
    placeholder: "Ditt svar här...",
  },
  {
    label: "Något annat du tänkte på gällande distrikten?",
    name: "otherAnswer",
    placeholder: "Ditt svar här...",
  },
];

export default function FormPage({ params }: { params: { slug: string } }) {
  const router = useRouter();
  const queryParams = useSearchParams();
  const district = decodeURIComponent(params.slug);
  const name = queryParams.get("name");
  const date = queryParams.get("date");
  const id = queryParams.get("id");

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
      sentEmailId: id ? +id : 0,
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
      <Card className="p-16">
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
              Vi som ansvarar för distrikten är intresserade av att få dina
              synpunkter på hur distriktet var utformat. Alla frågor är
              frivilliga, men försök att svara på så många som möjligt.
            </p>
            <hr />
            {QUESTIONS.map((q) => (
              <QFormField
                key={q.name}
                control={form.control}
                name={q.name}
                label={q.label}
                placeholder={q.placeholder}
              />
            ))}
            <div className="flex flex-col gap-4 sm:flex-row items-center justify-between">
              <span>Tack för dina inputs, dem är värdefulla!</span>
              <Button className="sm:w-fit w-full" type="submit">
                Skicka
              </Button>
            </div>
          </form>
        </Form>
      </Card>
    </main>
  );
}

function QFormField({
  control,
  name,
  label,
  placeholder,
}: {
  control: Control;
  name: string;
  label: string;
  placeholder: string;
}) {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <FormControl>
            <Textarea
              placeholder={placeholder}
              className="resize-none"
              {...field}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
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
