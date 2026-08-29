---
title: Handling inbound EDI 850 purchase orders in Business Central
description: A working pattern for turning an inbound X12 850 into a Sales Order without hardcoding a mapping per trading partner.
pubDate: 2026-06-18
topics: [edi, business-central, al-development]
appliesTo: ['Business Central 26', 'AL runtime 15']
lastReviewed: 2026-08-02
---

Every EDI implementation starts the same way: a partner sends an 850, and you
need a Sales Order at the end of it. The temptation is to write a codeunit that
reads that partner's file and creates the order. Do that four times and you have
four codeunits that are 80% identical and diverge every time someone changes a
qualifier.

## Split parsing from mapping

The thing that makes this maintainable is refusing to let the parser know
anything about Business Central, and refusing to let the mapper know anything
about X12.

| Layer | Knows about | Doesn't know about |
| --- | --- | --- |
| Parser | Segments, elements, qualifiers | Sales Orders, Customers |
| Staging table | Both, briefly | Nothing |
| Mapper | Sales Orders, Customers | Segment positions |

The staging table is the important part. Parse into it, then map out of it. When
a partner sends something malformed you have a row to look at, which beats
reading a raw interchange in a text file.

## The interface

```al
interface IEdiDocumentParser
{
    procedure Parse(var InStream: InStream; var StagingHeader: Record "EDI Staging Header"): Boolean;
    procedure DocumentType(): Enum "EDI Document Type";
}
```

Each partner gets a codeunit implementing this. Registration happens in a setup
table rather than a `case` statement, so onboarding a partner is configuration
rather than a deployment.

## Where item numbers actually break

The failure that costs the most time is not parsing. It's the PO1 segment's item
identification. Partners send their own SKU, a UPC, or your item number,
identified by a qualifier — and some send different qualifiers on different
lines of the same document.

Build a cross-reference lookup that tries qualifiers in a configured order and
records which one matched. When a line fails to resolve, park the whole document
rather than creating a partial order. A partial sales order is worse than no
sales order, because someone will ship it.

> Rule of thumb: if you cannot resolve every line, resolve none of them.

## Acknowledge before you process

Send the 997 as soon as the interchange is structurally valid, before any
business logic runs. The 997 says "I received a well-formed document," not "I
agree with its contents." Conflating those two is how you end up unable to
explain to a partner why they got an acknowledgement for an order you never
shipped.
