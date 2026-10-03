// ================================
// ServiceDesk Pro - Common Styles
// ================================

// ---------- Layout ----------

export const pageBackground =
  "min-h-screen bg-[#f5f7fb]";

export const pageWrapper =
  "min-h-screen w-full px-4 py-8 sm:px-6 lg:px-8";

export const contentWrapper =
  "mx-auto w-full max-w-7xl";


// ---------- Cards ----------

export const card =
  "rounded-2xl border border-[#e5e7eb] bg-white shadow-[0_20px_50px_rgba(15,23,42,0.08)]";

export const formCard =
  "w-full max-w-[440px] rounded-2xl border border-[#e5e7eb] bg-white p-6 shadow-[0_20px_50px_rgba(15,23,42,0.08)] sm:p-10";


// ---------- Typography ----------

export const pageTitle =
  "text-3xl font-bold tracking-tight text-[#111827]";

export const heading =
  "text-2xl font-bold tracking-tight text-[#111827]";

export const subHeading =
  "text-base font-semibold text-[#374151]";

export const bodyText =
  "text-sm leading-relaxed text-[#6b7280]";

export const mutedText =
  "text-xs text-[#9ca3af]";

export const linkText =
  "font-semibold text-[#4f46e5] transition-colors hover:text-[#4338ca]";


// ---------- Brand ----------

export const brandContainer =
  "mb-8 flex items-center gap-3.5";

export const brandIcon =
  "flex h-12 w-12 items-center justify-center rounded-[13px] bg-gradient-to-br from-[#4f46e5] to-[#6366f1] text-[15px] font-extrabold text-white shadow-[0_8px_18px_rgba(79,70,229,0.25)]";

export const brandTitle =
  "text-[21px] font-semibold text-[#111827]";

export const brandSubtitle =
  "mt-0.5 text-xs text-[#9ca3af]";


// ---------- Forms ----------

export const form =
  "flex flex-col gap-5";

export const formGroup =
  "flex flex-col gap-2";

export const label =
  "text-[13px] font-semibold text-[#374151]";

export const inputWrapper =
  "relative flex items-center";

export const input =
  "h-12 w-full rounded-[9px] border border-[#d1d5db] bg-white px-3.5 text-sm text-[#111827] outline-none transition-all placeholder:text-[#9ca3af] hover:border-[#9ca3af] focus:border-[#4f46e5] focus:ring-4 focus:ring-[#4f46e5]/10";

export const inputWithIcon =
  "h-12 w-full rounded-[9px] border border-[#d1d5db] bg-white pl-[42px] pr-3.5 text-sm text-[#111827] outline-none transition-all placeholder:text-[#9ca3af] hover:border-[#9ca3af] focus:border-[#4f46e5] focus:ring-4 focus:ring-[#4f46e5]/10";

export const inputIcon =
  "pointer-events-none absolute left-3.5 text-sm text-[#9ca3af]";


// ---------- Buttons ----------

export const primaryButton =
  "flex min-h-12 w-full items-center justify-center gap-2 rounded-[9px] border-0 bg-[#4f46e5] text-sm font-semibold text-white transition-all hover:-translate-y-px hover:bg-[#4338ca] hover:shadow-[0_8px_18px_rgba(79,70,229,0.2)] active:translate-y-0 disabled:cursor-not-allowed disabled:opacity-70";

export const secondaryButton =
  "rounded-lg border border-[#d1d5db] bg-white px-4 py-2 text-sm font-medium text-[#374151] transition-colors hover:bg-[#f9fafb]";

export const ghostButton =
  "text-sm font-medium text-[#4f46e5] transition-colors hover:text-[#4338ca]";


// ---------- Password ----------

export const passwordToggle =
  "absolute right-2.5 rounded-md border-0 bg-[#f3f4f6] px-2 py-1.5 text-[11px] font-semibold text-[#4f46e5] transition-colors hover:bg-[#e5e7eb]";


// ---------- Error ----------

export const errorBox =
  "flex items-center gap-2 rounded-lg border border-[#fecaca] bg-[#fef2f2] px-3 py-2.5 text-[13px] text-[#b91c1c]";


// ---------- Register / Footer ----------

export const dividerSection =
  "mt-7 flex items-center justify-center gap-1 border-t border-[#e5e7eb] pt-5 text-[13px] text-[#6b7280]";

export const securityText =
  "mt-5 text-center text-[11px] text-[#9ca3af]";


// ---------- Loading ----------

export const spinner =
  "h-[15px] w-[15px] animate-spin rounded-full border-2 border-white/40 border-t-white";import { useEffect, useState } from "react";


