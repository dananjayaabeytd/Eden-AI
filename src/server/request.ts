import "server-only";

import { createHash } from "node:crypto";
import { headers } from "next/headers";

import { getSecurityEnv } from "@/server/env";

export type RequestMeta = {
  /** Salted SHA-256 of the client IP — lets us rate-limit without storing raw IPs. */
  ipHash: string | null;
  userAgent: string | null;
};

export async function getRequestMeta(): Promise<RequestMeta> {
  const h = await headers();
  const ip = h.get("x-forwarded-for")?.split(",")[0]?.trim() || h.get("x-real-ip")?.trim() || null;
  const userAgent = h.get("user-agent")?.slice(0, 500) ?? null;

  const ipHash = ip
    ? createHash("sha256").update(`${getSecurityEnv().IP_HASH_SALT}:${ip}`).digest("hex")
    : null;

  return { ipHash, userAgent };
}
