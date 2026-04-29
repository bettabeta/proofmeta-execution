# ProofMeta Execution Layer

> **Layer:** Execution
> **Depends on:** [proofmeta-primitive-core](https://github.com/bettabeta/proofmeta-primitive-core) + [proofmeta-license-contracts](https://github.com/bettabeta/proofmeta-license-contracts)
> **Guarantees:** Pluggable payment, delivery, and anchoring — pick your stack, the protocol doesn't care.

[![License](https://img.shields.io/badge/License-Apache_2.0-blue.svg)](https://opensource.org/licenses/Apache-2.0)
[![Status: In Progress](https://img.shields.io/badge/Status-In_Progress-yellow)]()

---

## What is this?

This is where the protocol meets infrastructure. The Execution Layer provides **resolvers** — pluggable modules that handle the things the protocol intentionally doesn't own:

- **Payment** — How money moves (Stripe, x402, Lightning, SEPA)
- **Delivery** — How content is delivered (HTTPS, IPFS, S3)
- **Anchoring** — How proofs are recorded on-chain (Solana PDA, EVM, none)

Each resolver is independent. Mix and match. Use Stripe for payment and Solana for anchoring. Or use nothing — Tier 1 (pure signature) is always valid.

## How it fits together

```
┌─────────────────────────────────────┐
│  Execution Layer  ← you are here   │
│  resolvers/stripe    → payment     │
│  resolvers/x402      → payment     │
│  resolvers/solana-pda → anchoring  │
│  resolvers/free      → no-op       │
├─────────────────────────────────────┤
│  License Layer                      │
│  scope, terms, pricing              │
├─────────────────────────────────────┤
│  Primitive Layer                    │
│  Signed Envelopes, DID, ed25519    │
└─────────────────────────────────────┘
```

## Resolvers

| Resolver | Role | Status | Description |
|----------|------|--------|-------------|
| [free](resolvers/free/) | payment | ✅ Ready | No-op resolver for free licenses. Always returns `confirmed`. |
| [privy](resolvers/privy/) | wallet | 🚧 In Progress | Agent wallet management via Privy. Multi-chain (EVM + Solana). |
| [x402](resolvers/x402/) | payment | 🚧 In Progress | x402 protocol — HTTP-native USDC micropayments via Coinbase/Pay AI/Corbits. |
| [stripe](resolvers/stripe/) | payment | 💤 Planned | Stripe Checkout + webhooks. One-time and subscription. |
| [solana-pda](resolvers/solana-pda/) | anchor | 💤 Planned | Anchor license grants as Solana PDAs. |

## Resolver interface

Every resolver implements the same contract:

```typescript
interface Resolver {
  role: "payment" | "delivery" | "anchor";
  id: string;

  // Called when a license request enters PENDING
  process(request: Envelope): Promise<ResolverResult>;

  // Called to verify a previously processed result
  verify(result: ResolverResult): Promise<boolean>;
}

interface ResolverResult {
  status: "confirmed" | "failed" | "pending";
  resolver_id: string;
  metadata: Record<string, unknown>;  // chain-specific data lives here
}
```

Chain-specific data (transaction hashes, PDAs, payment intents) goes in `metadata` — never in the core protocol fields.

## Design rules

1. **No resolver is required.** A ProofMeta deployment with zero resolvers (Tier 1) is valid.
2. **Chain-specific data stays in `metadata`.** No `0x` addresses, no `programId`s in core fields.
3. **Each resolver is independently versioned and deployable.**
4. **Resolvers are stateless where possible.** State lives in the envelope chain.

## Repository Structure

```
/resolvers
  /free          → No-op resolver (reference implementation)
  /stripe        → Stripe payment resolver
  /x402          → x402 micropayment resolver
  /solana-pda    → Solana PDA anchor resolver
/docs
  RESOLVER_SPEC.md  → How to build a resolver
```

## License

Copyright © 2026 Daud Zulfacar, Pandr UG (haftungsbeschränkt)

Apache License 2.0 — see [LICENSE](LICENSE).
