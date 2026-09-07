"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";

import {
  classifySupportRequestError,
  postSupportRequest,
} from "@/lib/api/support-request";
import { formatUzPhoneInput, toApiPhone, UZ_PHONE_PREFIX } from "@/lib/phone";

type State = "idle" | "sending" | "done" | "invalid" | "rateLimit" | "network";

/**
 * The footer's "leave your number" block.
 *
 * Deliberately not the consultation form: that one asks for a name and a
 * description of the problem, and the two live in separate tables and separate
 * sections of the admin panel. One field is the whole point — the manager asks
 * for everything else in the first seconds of the call.
 */
export function CallbackForm() {
  const t = useTranslations("callback");
  const [phone, setPhone] = useState(UZ_PHONE_PREFIX);
  const [state, setState] = useState<State>("idle");

  const busy = state === "sending" || state === "done";

  async function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (busy) return;

    const apiPhone = toApiPhone(phone);
    if (!apiPhone) {
      setState("invalid");
      return;
    }

    setState("sending");
    try {
      await postSupportRequest(apiPhone);
      setState("done");
    } catch (error) {
      // A 429 is the anti-spam cap, not a fault: never retry it for the
      // visitor, or a shared office IP keeps hitting the same wall.
      const failure = classifySupportRequestError(error);
      setState(failure === "validation" ? "invalid" : failure);
    }
  }

  const message =
    state === "done"
      ? t("success")
      : state === "invalid"
        ? t("errorPhone")
        : state === "rateLimit"
          ? t("errorRateLimit")
          : state === "network"
            ? t("errorNetwork")
            : null;

  return (
    <form onSubmit={onSubmit} className="mt-5">
      <p className="text-sm leading-relaxed text-cream/60">{t("hint")}</p>
      <div className="mt-4 flex flex-col gap-2 sm:flex-row">
        <input
          type="tel"
          inputMode="tel"
          value={phone}
          onChange={(event) => {
            setPhone(formatUzPhoneInput(event.target.value));
            if (state === "invalid") setState("idle");
          }}
          disabled={busy}
          aria-label={t("phoneLabel")}
          placeholder={UZ_PHONE_PREFIX}
          className="h-11 min-w-0 flex-1 rounded-lg border border-cream/20 bg-brand-deep/40 px-4 text-sm text-cream placeholder:text-cream/35 focus-visible:border-gold focus-visible:outline-none disabled:opacity-60"
        />
        <button
          type="submit"
          disabled={busy}
          className="h-11 shrink-0 rounded-lg bg-gold px-6 text-sm font-medium text-brand transition-colors hover:bg-sand focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold disabled:opacity-60"
        >
          {state === "sending" ? t("sending") : t("submit")}
        </button>
      </div>
      {message ? (
        <p
          role={state === "done" ? "status" : "alert"}
          className={`mt-3 text-sm ${state === "done" ? "text-gold" : "text-red-300"}`}
        >
          {message}
        </p>
      ) : null}
    </form>
  );
}
