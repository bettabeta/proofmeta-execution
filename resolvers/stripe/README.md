# Stripe Resolver

🚧 **Planned**

Handles payment via Stripe Checkout. Supports one-time payments and subscriptions.

## How it will work

1. License request enters PENDING
2. Resolver creates a Stripe Checkout session
3. On successful payment, webhook fires → resolver returns `confirmed`
4. `metadata` contains: `payment_intent_id`, `checkout_session_id`, `amount`, `currency`

## Environment

```
STRIPE_SECRET_KEY=sk_...
STRIPE_WEBHOOK_SECRET=whsec_...
```

## Chain-specific data

All Stripe-specific data lives in `metadata`:

```json
{
  "status": "confirmed",
  "resolver_id": "stripe",
  "metadata": {
    "payment_intent_id": "pi_...",
    "amount": 500,
    "currency": "usd"
  }
}
```

No Stripe data in the core protocol fields. Ever.
