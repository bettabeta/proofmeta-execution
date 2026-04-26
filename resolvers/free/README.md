# Free Resolver

The simplest resolver. Always confirms. No payment, no delivery, no chain.

## When to use

- Free-attribution licenses
- Open-access items
- Testing and development

## Usage

```typescript
import { freeResolver } from "./index";

const result = await freeResolver.process(openEnvelope);
// { status: "confirmed", resolver_id: "free", metadata: { ... } }
```
