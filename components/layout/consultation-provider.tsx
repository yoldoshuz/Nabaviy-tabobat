"use client";

import { Info, X } from "lucide-react";
import { useTranslations } from "next-intl";
import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type FormEvent,
  type ReactNode,
} from "react";

import { Link } from "@/lib/i18n/navigation";
import { formatUzPhoneInput, UZ_PHONE_PREFIX } from "@/lib/phone";
import { cn } from "@/lib/utils";

interface ConsultationContextValue {
  open: () => void;
  close: () => void;
  isOpen: boolean;
}

const ConsultationContext = createContext<ConsultationContextValue | null>(null);

export function useConsultation(): ConsultationContextValue {
  const context = useContext(ConsultationContext);
  if (!context) {
    throw new Error("useConsultation must be used inside <ConsultationProvider>");
  }
  return context;
}

export function ConsultationProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);

  const value = useMemo<ConsultationContextValue>(
    () => ({
      isOpen,
      open: () => setIsOpen(true),
      close: () => setIsOpen(false),
    }),
    [isOpen],
  );

  return (
    <ConsultationContext.Provider value={value}>
      {children}
      {isOpen ? <ConsultationModal onClose={value.close} /> : null}
    </ConsultationContext.Provider>
  );
}

function ConsultationModal({ onClose }: { onClose: () => void }) {
  const t = useTranslations("consultation");
  const [status, setStatus] = useState<"idle" | "sending" | "done">("idle");
  const [errors, setErrors] = useState<{ name?: string; phone?: string }>({});

  const handleSubmit = useCallback(
    async (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      const data = new FormData(event.currentTarget);
      const name = String(data.get("name") ?? "").trim();
      const phone = String(data.get("phone") ?? "").trim();

      const nextErrors: { name?: string; phone?: string } = {};
      if (!name) nextErrors.name = t("errorName");
      if (!phone) nextErrors.phone = t("errorPhone");
      setErrors(nextErrors);
      if (Object.keys(nextErrors).length > 0) return;

      setStatus("sending");
      // Backend is wired later — the request payload is ready to be posted here.
      await new Promise((resolve) => window.setTimeout(resolve, 600));
      setStatus("done");
    },
    [t],
  );

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="consultation-title"
      className="fixed inset-0 z-100 overflow-y-auto bg-brand-deep"
    >
      <button
        type="button"
        onClick={onClose}
        aria-label={t("successHome")}
        className="absolute top-5 right-5 z-10 flex size-11 items-center justify-center rounded-full bg-cream text-brand transition-transform hover:scale-105 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold sm:top-8 sm:right-8 sm:size-14"
      >
        <X className="size-5 sm:size-6" aria-hidden />
      </button>

      <div className="mx-auto flex min-h-full w-full max-w-2xl flex-col justify-center px-5 py-16 sm:px-8">
        <div className="text-center">
          <h2
            id="consultation-title"
            className="text-3xl leading-tight text-cream sm:text-4xl"
          >
            {t("title")}
          </h2>
          <p className="mt-2 font-display text-3xl text-gold sm:text-4xl">
            {t("titleAccent")}
          </p>
          <p className="mx-auto mt-4 max-w-md text-sm text-cream/60">
            {t("subtitle")}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="mt-10 space-y-5" noValidate>
          <div className="grid gap-5 sm:grid-cols-2">
            <Field
              id="consultation-name"
              name="name"
              label={t("nameLabel")}
              placeholder={t("namePlaceholder")}
              error={errors.name}
              autoComplete="name"
            />
            <Field
              id="consultation-phone"
              name="phone"
              type="tel"
              label={t("phoneLabel")}
              placeholder={t("phonePlaceholder")}
              error={errors.phone}
              autoComplete="tel"
            />
          </div>

          <div className="space-y-2">
            <label
              htmlFor="consultation-message"
              className="block text-xs text-cream/60"
            >
              {t("messageLabel")}
            </label>
            <textarea
              id="consultation-message"
              name="message"
              rows={4}
              placeholder={t("messagePlaceholder")}
              className="w-full rounded-lg border border-transparent bg-white px-4 py-3 text-sm text-brand outline-none transition-shadow placeholder:text-brand/40 focus-visible:ring-3 focus-visible:ring-gold/60"
            />
          </div>

          <p className="flex items-start gap-3 rounded-lg bg-white px-4 py-3 text-xs leading-relaxed text-brand/80">
            <Info className="mt-0.5 size-4 shrink-0 text-gold-strong" aria-hidden />
            {t("note")}
          </p>

          <button
            type="submit"
            disabled={status === "sending"}
            className="h-13 w-full rounded-lg bg-gold py-4 text-sm font-medium text-brand transition-colors hover:bg-sand disabled:opacity-70 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold"
          >
            {status === "sending" ? t("submitting") : t("submit")}
          </button>
        </form>
      </div>

      {status === "done" ? <SuccessDialog onClose={onClose} /> : null}
    </div>
  );
}

function SuccessDialog({ onClose }: { onClose: () => void }) {
  const t = useTranslations("consultation");

  return (
    <div className="fixed inset-0 z-10 flex items-center justify-center bg-brand-deep/70 px-5 backdrop-blur-[2px]">
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="consultation-success-title"
        className="relative w-full max-w-md rounded-lg bg-white p-8 text-center shadow-float"
      >
        <button
          type="button"
          onClick={onClose}
          aria-label={t("successHome")}
          className="absolute top-4 right-4 flex size-8 items-center justify-center rounded-full border border-border text-brand transition-colors hover:bg-stone focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
        >
          <X className="size-4" aria-hidden />
        </button>

        <h3 id="consultation-success-title" className="text-xl text-brand">
          {t("successTitle")}
        </h3>
        <p className="mt-4 text-sm leading-relaxed text-brand/80">
          {t("successText")}
        </p>
        <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
          {t("successHint")}
        </p>

        <div className="mt-7 space-y-3">
          <Link
            href="/"
            onClick={onClose}
            className="flex h-11 items-center justify-center rounded-lg bg-brand text-sm font-medium text-cream transition-colors hover:bg-brand-soft"
          >
            {t("successHome")}
          </Link>
          <Link
            href="/products"
            onClick={onClose}
            className="flex h-11 items-center justify-center rounded-lg border border-brand/25 text-sm font-medium text-brand transition-colors hover:bg-stone"
          >
            {t("successCatalog")}
          </Link>
        </div>
      </div>
    </div>
  );
}

function Field({
  id,
  name,
  label,
  placeholder,
  error,
  type = "text",
  autoComplete,
}: {
  id: string;
  name: string;
  label: string;
  placeholder: string;
  error?: string;
  type?: string;
  autoComplete?: string;
}) {
  // The phone field carries its own country code and regroups the digits as
  // they are typed, so what the customer sees is always what the API accepts.
  const isPhone = type === "tel";
  return (
    <div className="space-y-2">
      <label htmlFor={id} className="block text-xs text-cream/60">
        {label}
      </label>
      <input
        id={id}
        name={name}
        type={type}
        placeholder={placeholder}
        autoComplete={autoComplete}
        {...(isPhone
          ? {
              inputMode: "tel" as const,
              defaultValue: UZ_PHONE_PREFIX,
              onInput: (event: FormEvent<HTMLInputElement>) => {
                event.currentTarget.value = formatUzPhoneInput(
                  event.currentTarget.value,
                );
              },
            }
          : {})}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? `${id}-error` : undefined}
        className={cn(
          "h-12 w-full rounded-lg border border-transparent bg-white px-4 text-sm text-brand outline-none transition-shadow placeholder:text-brand/40 focus-visible:ring-3 focus-visible:ring-gold/60",
          error && "ring-2 ring-destructive",
        )}
      />
      {error ? (
        <p id={`${id}-error`} className="text-xs text-destructive">
          {error}
        </p>
      ) : null}
    </div>
  );
}
