---
title: Storing EDI acknowledgements in SharePoint so you can actually find them
description: Document libraries are fine for archiving interchanges — but only if you put the metadata in columns instead of the filename.
pubDate: 2026-02-24
topics: [sharepoint, edi, integration]
appliesTo: ['SharePoint Online', 'Power Automate (Nov 2025 release)']
---

Auditors ask questions like "show me every 856 we sent to this partner in
March." If your archive is a folder of files named `856_20260312_004412.edi`,
answering that means downloading everything and grepping.

## Put the metadata in columns

Create the library with real columns and populate them on upload:

| Column | Type | Why |
| --- | --- | --- |
| Partner | Choice | The single most common filter |
| DocumentType | Choice | 850, 855, 856, 810, 997 |
| InterchangeControlNumber | Text | The only reliable join key back to the partner |
| Direction | Choice | Inbound / Outbound |
| BusinessDate | Date | Not upload date — they differ across timezones |

`BusinessDate` versus upload date matters more than it looks. An interchange sent
at 23:50 Pacific is the next day in UTC, and the partner will reference their
date, not yours.

## Don't use folders

Folders feel natural and are the wrong structure here. A flat library with
metadata gives you filtered views per partner, per document type, and per month
without duplicating anything, and it sidesteps the list view threshold problems
that nested date folders eventually cause.

Create views instead of folders. A view is a saved query; a folder is a
commitment.

## Set retention deliberately

EDI archives grow without bound and nobody ever deletes them, because nobody is
sure whether they are allowed to. Decide the retention period with whoever owns
compliance, apply a retention label, and write the decision down somewhere the
next consultant will find it.
