---
title: Reading X12 997 functional acknowledgements without losing your mind
description: What each AK segment actually means, and why a 997 that says "accepted" doesn't mean your order arrived.
pubDate: 2025-08-05
topics: [edi]
appliesTo: ['X12 004010 and later']
lastReviewed: 2026-03-11
---

The 997 is the most misread document in EDI. Someone sees "A" in AK501 and
reports that the order went through. It did not necessarily go anywhere.

## What a 997 tells you

A 997 confirms that a document was **syntactically valid** — segments in the
right order, elements the right type, required fields present. It says nothing
about whether the receiving system did anything useful with it.

The segments, in the order you'll meet them:

- **AK1** — which functional group is being acknowledged
- **AK2** — which transaction set within it
- **AK3 / AK4** — where the error is, if there is one: segment and element
- **AK5** — the verdict for that transaction set
- **AK9** — the verdict for the whole group, plus counts

## The counts in AK9 are the useful part

`AK9` carries the number of transaction sets included, received, and accepted.
When those three numbers disagree, something was silently dropped, and that is
worth an alert. Most integrations check the accept/reject code and ignore the
counts, which is how partial failures go unnoticed for a week.

## Accepted with errors

`AK501 = E` means accepted *with* errors. Partners interpret this
inconsistently: some process the document anyway, some quarantine it. Never
assume. Ask during onboarding and write the answer in the partner profile,
because you will not remember in eighteen months.

## What to do about it

Treat a 997 as a receipt, not a confirmation. If you need to know the order was
actually created, that's a 855 Purchase Order Acknowledgement — a business
response, not a syntax check. Conflating the two is the single most common
source of "but we sent it" conversations.
