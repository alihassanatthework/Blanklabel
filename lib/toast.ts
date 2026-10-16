"use client";

import type { ExternalToast } from "sonner";

// Toasts load the toast library on first use, keeping it out of the initial bundle.
type Kind = "message" | "success" | "error";

function show(kind: Kind, message: string, opts?: ExternalToast) {
  void import("sonner").then(({ toast }) => {
    if (kind === "success") toast.success(message, opts);
    else if (kind === "error") toast.error(message, opts);
    else toast(message, opts);
  });
}

export const toast = Object.assign((message: string, opts?: ExternalToast) => show("message", message, opts), {
  success: (message: string, opts?: ExternalToast) => show("success", message, opts),
  error: (message: string, opts?: ExternalToast) => show("error", message, opts),
});
