/**
 * Free resolver — the simplest possible resolver.
 * Always confirms. No payment, no delivery, no anchoring.
 * Use for free-attribution and open-access licenses.
 */

export interface Envelope {
  proofmeta: string;
  payload: Record<string, unknown>;
  payload_hash: string;
  author: string;
  signature: string;
  timestamp: string;
  in_reply_to?: string;
}

export interface ResolverResult {
  status: "confirmed" | "failed" | "pending";
  resolver_id: string;
  metadata: Record<string, unknown>;
}

export const freeResolver = {
  role: "payment" as const,
  id: "free",

  async process(_request: Envelope): Promise<ResolverResult> {
    return {
      status: "confirmed",
      resolver_id: "free",
      metadata: {
        note: "No payment required — free license",
        confirmed_at: new Date().toISOString(),
      },
    };
  },

  async verify(_result: ResolverResult): Promise<boolean> {
    return true;
  },
};
