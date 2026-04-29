# Privy Agent Wallet Resolver

Manages agent wallets via [Privy](https://privy.io). Each ProofMeta agent gets its own wallet with Ethereum (Base) and Solana addresses — without ever holding private keys.

## Why Privy?

- **No seed phrases** — agents don't manage keys, Privy does
- **Human oversight** — fund and monitor at [agents.privy.io](https://agents.privy.io)
- **x402 built-in** — automatic USDC payments for license requests
- **Multi-chain** — Ethereum + Solana from one wallet

## Setup

### For agents (CLI flow)

```bash
npm install -g @privy-io/agent-wallet-cli
privy-agent-wallets login
privy-agent-wallets list-wallets
```

### For developers (SDK flow)

```bash
npm install @privy-io/node @x402/fetch
```

```typescript
import { PrivyClient } from "@privy-io/node";
import { createX402Client } from "@privy-io/node/x402";
import { wrapFetchWithPayment } from "@x402/fetch";

const privy = new PrivyClient(appId, appSecret);

// Create agent wallet
const wallet = await privy.wallets().create({ chainType: "solana" });

// Setup x402 payments
const x402client = createX402Client(privy, {
  walletId: wallet.id,
  address: wallet.address,
});

// Fetch with automatic payment
const fetchWithPayment = wrapFetchWithPayment(fetch, x402client);
const response = await fetchWithPayment("https://provider.ai/api/license");
```

## Environment

```
PRIVY_APP_ID=your-app-id
PRIVY_APP_SECRET=your-app-secret
```

## How it works with ProofMeta

1. **Provider Agent** creates wallet → publishes manifest with `x402` resolver
2. **Consumer Agent** creates wallet → funds with USDC
3. Consumer requests license → hits Provider's x402-enabled endpoint
4. x402 handles payment automatically (402 → sign → retry → 200)
5. Provider confirms → GRANTED envelope signed
6. Entire flow: no human intervention, no checkout pages
