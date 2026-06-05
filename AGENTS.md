# Workspace Rules

### 1. Think Before Coding

**Don't assume. Don't hide confusion. Surface tradeoffs.**

Before implementing:
- State your assumptions explicitly. If uncertain, ask.
- If multiple interpretations exist, present them — don't pick silently.
- If a simpler approach exists, say so. Push back when warranted.
- If something is unclear, stop. Name what's confusing. Ask.

### 2. Simplicity First

**Minimum code that solves the problem. Nothing speculative.**

- No features beyond what was asked.
- No abstractions for single-use code.
- No "flexibility" or "configurability" that wasn't requested.
- No error handling for impossible scenarios.
- If you write 200 lines and it could be 50, rewrite it.

Ask yourself: "Would a senior engineer say this is overcomplicated?" If yes, simplify.

### 3. Surgical Changes

**Touch only what you must. Clean up only your own mess.**

When editing existing code:
- Don't "improve" adjacent code, comments, or formatting.
- Don't refactor things that aren't broken.
- Match existing style, even if you'd do it differently.
- If you notice unrelated dead code, mention it — don't delete it.

When your changes create dead code or unused imports, clean those up — they're yours. Everything else stays untouched.

### 4. Goal-Driven Execution

**Transform vague instructions into verifiable success criteria.**

Before starting a task:
- Restate the goal as a concrete, testable outcome.
- Define what "done" looks like before writing any code.
- Prefer "write a test that reproduces it, then make it pass" over "fix the bug."

During execution:
- If a task has multiple steps, verify each step before moving to the next.
- If you hit an unexpected state, stop and reassess — don't power through.
- Ensure tests pass before AND after your changes.
- State what was validated and what was not when finishing.
