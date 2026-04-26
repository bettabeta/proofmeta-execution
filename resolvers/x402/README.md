# x402 Resolver

🚧 **Planned**

HTTP-native micropayments via the [x402 protocol](https://x402.org). Pay-per-request licensing for agent-to-agent transactions.

## How it will work

1. Consumer sends license request
2. Provider returns HTTP 402 with x402 payment requirements
3. Consumer pays via x402-compatible wallet (USDC on Base)
4. Provider verifies payment → returns `confirmed`

## Why x402

- Native to HTTP — no redirect, no checkout page
- Agent-friendly — no human in the loop
- Micropayment-ready — $0.001 per request is viable
- Chain-agnostic payment settlement

## Chain-specific data

```json
{
  "status": "confirmed",
  "resolver_id": "x402",
  "metadata": {
    "tx_hash": "0x...",
    "chain": "base",
    "amount_usdc": "0.01"
  }
}
```
