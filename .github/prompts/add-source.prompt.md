---
name: 'add-source'
description: 'Guided prompt for adding support for a new broadcaster domain to WebTvTuner. Always starts with embed-researcher, then developer implements the adapter.'
---

# Add a New Source — WebTvTuner

Use this prompt when you want to add support for a new broadcaster website (a new domain that doesn't have an adapter yet).

## How To Use

Provide:
- The broadcaster website URL (at least one channel URL from that domain)
- What you know about how the video is served (optional — the researcher will investigate)
- The channel names and URLs you want to add from this source

**Examples:**
- "I want to add La7. Here's a live stream URL: https://www.la7.it/dirette — I don't know how they serve the video"
- "Add TV8 from https://tv8.it/streaming — I think they use an iframe embed but I'm not sure"

---

## Workflow

This prompt always follows the same flow:

```
1. embed-researcher  → investigates the domain, documents embedding method
2. developer         → implements the adapter based on research findings
3. developer         → adds channel data for all channels from this source
4. cypress-tester    → writes E2E test for the new source
5. reviewer          → reviews the full implementation
6. pre-commit-reviewer → final check and commit message
```

---

## Routing

**Step 1 — Research:**
```
@workspace #embed-researcher
Investigate how to embed live video from [domain]. Here's a sample URL: [url]
```

**Step 2 — Implement adapter:**
```
@workspace #developer
Implement the [domain] embedding adapter based on the research findings: [paste findings]
```

**Step 3 — Add channels:**
```
@workspace #developer
Add these channels using the new [domain] adapter: [channel list]
```

---

## Definition of Done

A new source is fully supported when:
1. Adapter file exists in `src/adapters/[domain].adapter.ts`
2. Adapter is registered in `src/adapters/index.ts`
3. Unit tests cover the adapter (happy path + URL variations)
4. At least one channel from this source is in `src/data/channels.ts`
5. Cypress E2E test verifies a channel from this source loads
6. All tests pass, build succeeds, Docker builds
7. Adapter file includes a comment with the date last verified and known constraints
