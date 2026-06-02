---
name: 'add-channel'
description: 'Guided prompt for adding a new channel or channel group to WebTvTuner. Routes to embed-researcher if the domain is new, then to developer for implementation.'
---

# Add a Channel — WebTvTuner

Use this prompt when you want to add a new channel or group of channels to the app.

## How To Use

Provide:
- The channel name(s) and URL(s)
- Which group they belong to (existing or new)
- Whether this is a domain that already has an adapter

**Examples of good descriptions:**
- "Add Rai News 24: https://www.raiplay.it/dirette/rainews24 — it's in the RAI group and uses the same raiplay.it adapter"
- "Add La7 from https://www.la7.it/dirette — this is a new domain, we don't have an adapter for la7.it yet"
- "Create a new 'Sports' group with these channels: [list]"

---

## Routing Logic

**If the channel URL is from a domain that already has an adapter** (raiplay.it, mediasetinfinity.mediaset.it):
→ Route directly to `developer` to add the channel data and write a quick Cypress test.

**If the channel URL is from a new domain with no existing adapter:**
→ Route to `embed-researcher` first to investigate the embedding method, then to `developer` to implement the adapter and add the channel.

**If a new group is needed:**
→ Route to `developer` to add the group to channel data and update the group filter UI.

---

## Context To Include

When routing to any agent, include:
- Channel name and URL
- Group assignment
- Whether an adapter exists for this domain
- Any known info about how the video is served (iframe embed? HLS? player widget?)

---

## Definition of Done

The channel is "added" when:
1. Channel data exists in `src/data/channels.ts`
2. Adapter exists and handles the URL correctly (new adapters only)
3. Unit test covers the adapter for this URL (new adapters only)
4. Cypress test verifies the channel appears in the grid and can be selected
5. `npm run test` and `npm run build` pass
6. Docker build succeeds
