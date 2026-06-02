---
name: 'review-changes'
description: 'Review staged and unstaged changes in the WebTvTuner repository. Produces prioritized findings and optionally triggers fixes.'
agent: 'reviewer'
---

# Review Repository Changes — WebTvTuner

Review the current staged and unstaged diff in this repository.

## Scope

- Load `copilot-instructions.md` first, then apply the relevant `.github/instructions/` files and `.github/skills/` for the touched area
- For adapter changes: always check `.github/skills/embedding-adapters/SKILL.md`
- For security-sensitive changes (iframes, external URLs, Docker): also apply `.github/agents/security-reviewer.agent.md`
- Ignore generated files, build output, `node_modules`, and lockfiles

## Output

- Produce findings ordered by severity: Critical → High → Medium → Low
- For each finding: file, severity, relevant rule or skill, description, proposed fix
- If no findings: state this explicitly and mention any unverified risks
- Stop after the review — do not implement fixes unless the user explicitly approves

## Follow-Up

If the user approves specific fixes after the review, hand off to the `developer` agent to implement only the approved findings.
