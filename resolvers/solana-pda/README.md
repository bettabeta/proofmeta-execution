# Solana PDA Anchor Resolver

🚧 **Planned**

Anchors license grants as Program Derived Addresses (PDAs) on Solana. Provides on-chain proof that a license was granted at a specific time.

## How it will work

1. License reaches GRANTED status
2. Resolver derives a PDA from: `[provider_did, consumer_did, request_id]`
3. Writes grant data to the PDA account
4. Returns `confirmed` with PDA address and transaction signature

## Chain-specific data

```json
{
  "status": "confirmed",
  "resolver_id": "solana-pda",
  "metadata": {
    "pda": "7xKXt...",
    "tx_signature": "5eykt...",
    "slot": 123456789,
    "program_id": "ProofMeta1111111111111111111111111111111"
  }
}
```

## Verification

Anyone can verify the anchor by reading the PDA account on-chain. The data matches the envelope's `payload_hash` — if it does, the anchor is valid.
