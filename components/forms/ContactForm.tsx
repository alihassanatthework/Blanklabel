"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/Button";
import { Input, Select, Textarea } from "@/components/ui/Input";
import { DemoNote } from "@/components/ui/misc";
import { submitContact } from "@/lib/data/actions";
import { contactSchema, type ContactInput } from "@/lib/schemas";
import { FormSuccess } from "./FormSuccess";

export function ContactForm() {
  const [done, setDone] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ContactInput>({ resolver: zodResolver(contactSchema), defaultValues: { topic: "Order question" } });

  if (done)
    return (
      <FormSuccess
        title="Thanks - your message is in"
        nextSteps={["Our team reads every message.", "We reply by email within one business day."]}
      />
    );

  return (
    <form noValidate onSubmit={handleSubmit(async (v) => (await submitContact(v)).ok && setDone(true))} className="grid gap-5 sm:grid-cols-2">
      <Input label="Name" required autoComplete="name" error={errors.name?.message} {...register("name")} />
      <Input label="Email" type="email" required autoComplete="email" error={errors.email?.message} {...register("email")} />
      <Input label="Phone" type="tel" autoComplete="tel" error={errors.phone?.message} {...register("phone")} />
      <Select label="Topic" options={["Order question", "Product help", "Custom quote", "Bulk pricing", "Other"]} {...register("topic")} />
      <Textarea label="Message" required className="sm:col-span-2" rows={5} error={errors.message?.message} {...register("message")} />
      <div className="flex flex-col gap-3 sm:col-span-2 sm:flex-row sm:items-center sm:justify-between">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting && <Loader2 aria-hidden className="size-4 animate-spin" />}
          {isSubmitting ? "Sending..." : "Send message"}
        </Button>
        <DemoNote>Demo form - nothing is sent.</DemoNote>
      </div>
    </form>
  );
}
