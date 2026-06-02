# Build Cost Estimate

## Time

| Phase | Duration |
|-------|----------|
| Planning + Q&A | ~5 min |
| Scaffolding (`npm create vue`) | ~3 min |
| **3 parallel agents** (embedder, UI, Docker) | ~6 min (wall clock, ran simultaneously) |
| Verification + commit + push | ~2 min |
| **Total wall-clock time** | **~50 min** (09:17 → 10:07, includes idle/waiting) |
| **Active build time** | **~16 min** |

## Token Estimate (no exact telemetry available)

| Model | Role | Est. Input | Est. Output | Est. Cost* |
|-------|------|-----------|-------------|-----------|
| Claude Opus 4.6 | Main orchestrator (~10 turns) | ~350K | ~80K | ~$6.50 |
| Claude Sonnet (×3 agents) | Sub-agents | ~180K | ~90K | ~$1.35 |
| **Total** | | **~530K** | **~170K** | **~$7.85** |

*Pricing estimates based on typical Anthropic API rates (Opus: $15/$75 per 1M; Sonnet: $3/$15 per 1M).

## Output

- **28 files** created
- **995 lines** of code/config
- Fully working app with tests passing

> ⚠️ These are estimates — the session store doesn't expose per-token billing for this session. Actual costs depend on your GitHub Copilot plan (likely included in subscription).
