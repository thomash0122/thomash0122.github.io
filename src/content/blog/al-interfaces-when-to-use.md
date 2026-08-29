---
title: AL interfaces — when they earn their keep and when they're overkill
description: Interfaces solved a real problem in AL, and are now applied to plenty of problems that didn't need solving.
pubDate: 2025-11-12
topics: [al-development, business-central]
appliesTo: ['Business Central 24 and later']
lastReviewed: 2026-05-30
---

Interfaces arrived in AL and were immediately applied to everything. Most of
that was unnecessary. Here is the test I use.

## Use an interface when the set of implementations is open

If a third party — another extension, a partner, a future you — should be able
to add an implementation without modifying your code, that is what interfaces
are for. EDI document parsers are the canonical example: you genuinely do not
know how many partners there will be.

```al
enum 50100 "EDI Parser Type" implements IEdiDocumentParser
{
    Extensible = true;

    value(0; X12)
    {
        Implementation = IEdiDocumentParser = "X12 Parser";
    }
}
```

`Extensible = true` is the whole point. Without it you have written a `case`
statement with extra steps.

## Don't use one when the set is closed and small

Two implementations that will never become three do not need an interface. A
codeunit with a `case` is easier to read, easier to debug, and easier for the
next person to modify. Abstraction has a cost and it is paid by whoever reads the
code next.

## The upgrade consideration

Once an interface is published and something else implements it, changing the
method signature is a breaking change. Interfaces are the most expensive thing in
AL to get wrong, because the cost lands on people who don't work for you.

Design the interface after you have written the second implementation, not
before the first. You will not guess the right shape from one example, and the
second one tells you what actually varies.
