# Build Cost Estimate — `with_agent_AI` Branch

## Time

| Phase | Duration |
|-------|----------|
| Agent config setup (copilot-setup-steps, instructions, package.json) | ~8 min |
| Issue creation + auth troubleshooting | ~12 min |
| **App build** (4 parallel agents: config, embedders, components, tests+docker) | ~4 min (wall clock) |
| Verification (build + tests) | ~2 min |
| **Total wall-clock time** | **~90 min** (11:05 → 12:28, includes idle/auth issues) |
| **Active build time** (app implementation only) | **~6 min** |

## Token Estimate (no exact telemetry available)

| Model | Role | Est. Input | Est. Output | Est. Cost* |
|-------|------|-----------|-------------|-----------|
| Claude Opus 4.6 | Main orchestrator (~8 turns) | ~300K | ~90K | ~$7.20 |
| Claude Sonnet (×4 agents) | Sub-agents (config, embedders, components, tests) | ~200K | ~80K | ~$1.80 |
| **Total** | | **~500K** | **~170K** | **~$9.00** |

*Pricing estimates based on typical Anthropic API rates (Opus: $15/$75 per 1M; Sonnet: $3/$15 per 1M).

## Output

- **38 files** created
- **906 lines** of code/config
- Build ✅ | Component tests 3/3 ✅ | E2E tests 3/3 ✅

## Comparison with `No_AI` Branch

| Metric | `No_AI` (first build) | `with_agent_AI` (second build) |
|--------|----------------------|-------------------------------|
| Files | 42 | 38 |
| Lines of code | 995 | 906 |
| Active build time | ~16 min | ~6 min |
| Total session time | ~50 min | ~90 min (includes config/auth overhead) |
| Estimated token cost | ~$7.85 | ~$9.00 |
| Component tests | 2 | 3 |
| E2E tests | 1 | 3 |

> ⚠️ Token estimates are approximations. Actual costs depend on your GitHub Copilot subscription plan (likely included in flat-rate pricing).

> 💡 The second build was faster in active time because the architecture was already known. The higher total session time was due to cloud agent setup, `gh` auth, and subscription troubleshooting.
