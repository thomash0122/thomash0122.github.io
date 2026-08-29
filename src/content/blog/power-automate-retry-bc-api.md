---
title: A retry pattern for Power Automate calls to the Business Central API
description: Exponential backoff, idempotency keys, and failure alerting that doesn't spam the channel at 3am.
pubDate: 2026-04-09
topics: [power-automate, business-central, integration]
appliesTo: ['Business Central 26', 'Power Automate (Nov 2025 release)']
lastReviewed: 2026-07-15
---

The default Power Automate retry policy is fine until it isn't. It retries on
5xx, gives up after four attempts, and tells nobody. For a flow moving sales
orders that is not good enough.

## Configure the retry policy explicitly

Every HTTP action has a retry policy under **Settings**, and the default is
worth overriding:

- **Type:** Exponential interval
- **Count:** 4
- **Interval:** `PT10S`
- **Maximum interval:** `PT1H`

Exponential rather than fixed matters because BC throttling responses tend to
come in bursts. Retrying four times at ten-second intervals into an environment
that is rate limiting you just burns your attempts faster.

## Retry only what is safe to retry

A retried `POST` that succeeded but timed out creates a duplicate. Business
Central will happily accept two identical sales orders.

The fix is an idempotency key you control: put a deterministic value in a custom
field on the record, and check for it before creating.

```
Compose  → externalId = concat(partnerCode, '-', poNumber)
Get      → salesOrders?$filter=externalDocumentNumber eq '@{outputs('Compose')}'
Condition → length(body('Get')?['value']) equals 0
  If yes → create the order
  If no  → log and skip
```

It's an extra call per document. It is much cheaper than the meeting about why
the customer was invoiced twice.

## Alert on the pattern, not the event

A flow that alerts on every failure trains everyone to ignore the channel. What
you want to know is that failures are *sustained*.

Write failures to a Dataverse table with a timestamp, then run a separate
scheduled flow every fifteen minutes that alerts only when the count in the last
hour crosses a threshold. One flow does the work, another watches the work. They
should not be the same flow, because the flow that is broken cannot reliably
tell you it is broken.
