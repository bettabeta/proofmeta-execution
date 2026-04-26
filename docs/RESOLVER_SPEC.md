# How to Build a Resolver

A resolver is a module that handles one role in the ProofMeta lifecycle: payment, delivery, or anchoring.

## The interface

```typescript
interface Resolver {
  role: "payment" | "delivery" | "anchor";
  id: string;
  process(request: Envelope): Promise<ResolverResult>;
  verify(result: ResolverResult): Promise<boolean>;
}
```

That's it. Two methods.

## Rules

1. **`process()` is called once** when a request enters PENDING. It does the work (charge payment, deliver content, write to chain) and returns a result.

2. **`verify()` is called anytime** to re-check a previous result. It should be idempotent and stateless — given the same `ResolverResult`, it always returns the same answer.

3. **Chain-specific data goes in `metadata`**. Never add required fields to the core protocol. Your resolver's `metadata` is your namespace — put whatever you need there.

4. **Return one of three statuses:**
   - `confirmed` — done, move to GRANTED
   - `failed` — done, move to DENIED
   - `pending` — not done yet, check back later

5. **Be stateless where possible.** The envelope chain is the source of truth. Your resolver should be able to verify a result without its own database.

## Example: building a new resolver

```typescript
export const myResolver = {
  role: "payment",
  id: "my-payment-service",

  async process(request) {
    // Do the work
    const paymentResult = await chargeCustomer(request);
    
    return {
      status: paymentResult.success ? "confirmed" : "failed",
      resolver_id: "my-payment-service",
      metadata: {
        transaction_id: paymentResult.id,
        amount: paymentResult.amount,
      },
    };
  },

  async verify(result) {
    // Re-check the payment
    const tx = await lookupTransaction(result.metadata.transaction_id);
    return tx.status === "settled";
  },
};
```

## Registration

Declare your resolver in the Provider's manifest:

```json
{
  "resolvers": [
    { "role": "payment", "id": "my-payment-service" }
  ]
}
```

Consumers that support your resolver ID can use it. Those that don't, skip it. No breaking changes.
