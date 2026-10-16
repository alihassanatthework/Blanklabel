import { z } from "zod";

// Shared form schemas - reused later by the real API routes.
const email = z.string().trim().min(1, "Email is required").email("Enter a valid email address");
const name = z.string().trim().min(2, "Enter your name");
const phone = z
  .string()
  .trim()
  .refine((v) => v === "" || /^[0-9+()\-.\s]{7,20}$/.test(v), "Enter a valid phone number");

export const sampleSchema = z.object({
  name,
  company: z.string().trim().optional().or(z.literal("")),
  email,
  printer: z.string().min(1, "Choose your printer"),
  size: z.string().min(1, "Choose a label size"),
});
export type SampleInput = z.infer<typeof sampleSchema>;

export const quoteSchema = z.object({
  name,
  company: z.string().trim().optional().or(z.literal("")),
  email,
  phone,
  shape: z.enum(["Rectangle", "Square", "Circle", "Oval"]),
  width: z.coerce.number<string>().positive("Enter a width").max(12, "Max 12 in"),
  height: z.coerce.number<string>().positive("Enter a height").max(24, "Max 24 in"),
  quantity: z.enum(["500", "1,000", "2,500", "5,000", "10,000+"]),
  material: z.enum(["Paper", "Direct thermal", "Thermal transfer", "Not sure"]),
  finish: z.enum(["Matte", "Gloss", "Not sure"]),
  artwork: z.string().optional(),
  notes: z.string().max(1000, "Keep notes under 1,000 characters").optional(),
});
export type QuoteInput = z.infer<typeof quoteSchema>;

export const contactSchema = z.object({
  name,
  email,
  phone,
  topic: z.enum(["Order question", "Product help", "Custom quote", "Bulk pricing", "Other"]),
  message: z.string().trim().min(10, "Tell us a little more (10+ characters)"),
});
export type ContactInput = z.infer<typeof contactSchema>;

export const newsletterSchema = z.object({ email });

export const checkoutSchema = z.object({
  email,
  phone,
  firstName: z.string().trim().min(1, "First name is required"),
  lastName: z.string().trim().min(1, "Last name is required"),
  company: z.string().optional(),
  address: z.string().trim().min(3, "Street address is required"),
  city: z.string().trim().min(2, "City is required"),
  state: z.string().trim().length(2, "Use a 2-letter state code"),
  zip: z.string().trim().regex(/^\d{5}(-\d{4})?$/, "Enter a 5-digit ZIP"),
  delivery: z.enum(["ground", "expedited"]),
  payment: z.enum(["card", "paypal", "apple", "google"]),
  cardName: z.string().optional(),
  cardNumber: z.string().optional(),
  cardExpiry: z.string().optional(),
  cardCvc: z.string().optional(),
});
export type CheckoutInput = z.infer<typeof checkoutSchema> & {
  lines: { productId: string; qty: number }[];
  total: number;
};
