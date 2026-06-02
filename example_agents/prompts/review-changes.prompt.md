---
name: 'review-changes'
description: 'Review staged and unstaged changes in the PFS Effektivzins repository. Produces prioritized findings and optionally triggers fixes.'
agent: 'reviewer'
---

# Review Repository Changes — PFS Effektivzins Tool

Review the current staged and unstaged diff in this repository.

## Scope

- Load `copilot-instructions.md` first, then apply the relevant `.github/instructions/` files and `.github/skills/` for the touched area
- For calculation changes: always check `.github/skills/financial-calculations/SKILL.md`
- For security-sensitive changes (routes, inputs, file export): also apply `.github/agents/security-reviewer.agent.md`
- Ignore generated files, build output, `node_modules`, and lockfiles unless explicitly requested

## Output

- Produce findings ordered by severity: Critical → High → Medium → Low
- For each finding: file, severity, relevant rule or skill, description, proposed fix
- If no findings: state this explicitly and mention any unverified risks (e.g., Cypress tests not run)
- Stop after the review — do not implement fixes unless the user explicitly approves

## Follow-Up

If the user approves specific fixes after the review, hand off to the `developer` agent to implement only the approved findings.
