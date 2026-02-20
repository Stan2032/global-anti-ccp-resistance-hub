# CodeQL Troubleshooting Guide

**Created:** 2026-02-20  
**By:** Sonnet 4.5 (Session 25)  
**For:** All agents working on the Global Anti-CCP Resistance Hub

---

## Overview

This guide documents a critical limitation of the `codeql_checker` tool and provides troubleshooting steps, workarounds, and a challenge for innovative solutions.

---

## The Problem

### What Opus 4.6 Encountered

When running `codeql_checker`, Opus 4.6 observed:
- Tool returns: "No code changes detected for languages that CodeQL can analyze, so no analysis was performed."
- Output appears as "0 fails" 
- No actual security validation occurred
- Ambiguous whether this meant "code is secure" or "test didn't run"

### Root Cause

**CodeQL's Design:**
- CodeQL analyzes code **diffs** between current branch and base branch
- This is efficient for PR reviews (only check what changed)
- If no code files changed, CodeQL skips analysis entirely
- Supported languages: JavaScript, TypeScript, Python, Java, C++, C#, Go, Ruby

**Why It Happens:**
- Documentation-only changes (markdown files)
- Configuration-only changes (JSON, YAML)  
- Mixed PRs where code was already committed and you're adding docs
- The tool is working as designed, but the output is ambiguous

### Why This Is Dangerous

❌ **False Security:** Agent thinks "0 fails" means code is secure  
❌ **Wasted Time:** Re-running a tool that won't produce results  
❌ **Inconsistent Validation:** Some PRs get security checks, others don't  
❌ **Documentation Gap:** No clear indication in PR that security validation was skipped

---

## How to Identify This Issue

### 1. Read the Full Output

**When CodeQL Runs Successfully:**
```
Analysis complete. Scanning for vulnerabilities...
Found 0 vulnerabilities in 45 JavaScript files
Scanned 1,234 lines of code
```

**When CodeQL Skips Analysis:**
```
No code changes detected for languages that CodeQL can analyze, so no analysis was performed.
```

**Key Difference:** Look for specific file counts, line numbers, and explicit "Analysis complete" messages.

### 2. Pre-Check Before Running CodeQL

**Bash Command:**
```bash
git diff origin/master --name-only | grep -E '\.(js|jsx|ts|tsx|py|java)$'
```

**Interpretation:**
- **Output shows files:** CodeQL will run
- **No output:** CodeQL will skip (documentation-only changes)

### 3. Verify Language Detection

**Check what code files exist:**
```bash
find . -type f \( -name "*.js" -o -name "*.jsx" -o -name "*.ts" -o -name "*.tsx" \) | grep -v node_modules | wc -l
```

If this shows files but CodeQL still skips, the issue is no **changes** to these files.

---

## Current Workarounds

### Workaround 1: Pre-Validation

**Before running CodeQL:**
```bash
# Check if code files changed
CODE_CHANGED=$(git diff origin/master --name-only | grep -E '\.(js|jsx|ts|tsx|py|java)$' | wc -l)

if [ "$CODE_CHANGED" -eq 0 ]; then
  echo "⚠️  No code changes detected. CodeQL will not run."
  echo "Consider alternative security validation."
else
  echo "✅ Code changes detected. Running CodeQL..."
  # Run CodeQL here
fi
```

### Workaround 2: Alternative Security Tools

**When CodeQL won't run, use these instead:**

1. **npm audit** (dependency vulnerabilities):
   ```bash
   npm audit --production
   ```

2. **ESLint with security rules:**
   ```bash
   npm run lint
   ```

3. **Manual security review:**
   - Review any URLs added to documentation
   - Check for accidentally committed secrets  
   - Verify external links are HTTPS
   - Confirm no sensitive information in markdown

4. **Document the gap:**
   ```markdown
   ## Security Notes
   - No code changes in this PR (documentation only)
   - CodeQL analysis skipped (expected behavior)
   - Ran npm audit: 0 vulnerabilities
   - Manual review completed: No security concerns
   ```

### Workaround 3: Periodic Baseline Scans

**Strategy:** Run full security audits on a schedule, not just on diffs.

1. **Quarterly Security Audit:**
   - Create a dedicated security audit branch
   - Make a trivial code change (e.g., add comment)
   - Run CodeQL on entire codebase
   - Document results
   - Remove trivial change

2. **Maintain Security Baseline:**
   - Document: "Last full CodeQL scan: 2026-02-15"
   - Document: "Findings: 0 high, 2 medium (addressed), 0 low"
   - Update after each full audit

### Workaround 4: Force Analysis (Experimental)

**Idea:** Temporarily modify a code file to trigger analysis, then revert.

```bash
# Add a comment to trigger analysis
echo "// Security audit trigger" >> src/App.jsx

# Run CodeQL (will now analyze entire codebase)
# ... run codeql_checker ...

# Revert the change
git checkout src/App.jsx
```

**⚠️ Caution:** This is a hack. Better solutions needed.

---

## 🚀 THE CHALLENGE: Find a Better Solution

### For Opus 4.6 (or any agent willing to tackle this)

**Your Mission:**
Design and implement a **reliable, maintainable solution** that ensures security validation happens consistently, regardless of whether code files changed.

### Evaluation Criteria

**A good solution should:**
1. ✅ Work for both code-change and documentation-only PRs
2. ✅ Provide clear, unambiguous output
3. ✅ Not require manual intervention or hacky workarounds
4. ✅ Be maintainable (future agents can understand and use it)
5. ✅ Not waste resources (don't run full scans unnecessarily)
6. ✅ Integrate with existing workflows

### Potential Approaches to Investigate

#### Approach 1: Tool Configuration
- Research: Does `codeql_checker` accept parameters to force full analysis?
- Research: Can we configure CodeQL to analyze baseline + diff?
- Implementation: If yes, document the correct usage

#### Approach 2: Wrapper Script
```bash
#!/bin/bash
# smart-codeql.sh - Intelligent CodeQL wrapper

# Check for code changes
CODE_CHANGED=$(git diff origin/master --name-only | grep -E '\.(js|jsx|ts|tsx|py|java)$' | wc -l)

if [ "$CODE_CHANGED" -eq 0 ]; then
  echo "ℹ️  No code changes detected."
  echo "Running alternative security checks..."
  
  # Run alternative checks
  npm audit --production
  npm run lint
  
  echo "✅ Alternative security validation complete"
  echo "Note: CodeQL skipped (no code changes)"
else
  echo "Running CodeQL analysis on changed files..."
  # Run actual CodeQL
fi
```

#### Approach 3: Hybrid Strategy
- **For PRs with code changes:** Run diff-based CodeQL (fast, targeted)
- **For PRs without code changes:** Run alternative validation + note in PR
- **Monthly/Quarterly:** Run full CodeQL analysis on entire codebase

#### Approach 4: GitHub Actions Integration
- Research: Modify `.github/workflows/` to run CodeQL differently
- Option A: Always run on full codebase (slower but comprehensive)
- Option B: Run on diff for PRs, full scan on main branch
- Option C: Scheduled full scans (nightly/weekly)

#### Approach 5: Alternative Security Tools
- Research ESLint security plugins (eslint-plugin-security)
- Research SonarQube integration
- Research Snyk or similar tools
- Comparison matrix: Coverage, false positives, performance

### Questions to Investigate

1. **Is there a CodeQL CLI flag to force full analysis?**
   - Check CodeQL documentation
   - Examine `codeql_checker` implementation
   - Test with `--help` or similar

2. **Can we access GitHub's built-in CodeQL scanning?**
   - Does this repo have GitHub Advanced Security enabled?
   - Can we trigger CodeQL Actions manually?
   - What's the API for querying results?

3. **What's the baseline security posture?**
   - When was the last full security audit?
   - What vulnerabilities exist in the current codebase?
   - Should we establish a clean baseline first?

4. **What do other projects do?**
   - How do major open-source projects handle this?
   - Best practices from React, Vue, Node.js, etc.
   - Can we adopt their patterns?

### Resources Available

**Tools you can use:**
- `bash` - run commands, scripts, experiments
- `view` - read documentation, config files
- `grep` - search for examples in codebase
- `web_search` - research CodeQL best practices
- GitHub MCP tools - query workflows, actions
- File editing tools - implement solutions

**Documentation to check:**
- `.github/workflows/` - existing CI/CD setup
- `package.json` - available npm scripts
- CodeQL official docs (web search)
- GitHub Actions docs (web search)

### Success Criteria

**You'll know you've succeeded when:**
1. ✅ Clear documentation exists for when CodeQL runs vs doesn't run
2. ✅ Alternative validation exists for non-code changes
3. ✅ No ambiguous "0 fails" output
4. ✅ All agents understand the new process
5. ✅ Security validation is consistent across all PR types
6. ✅ Solution is documented in this file + LLM_JUDGEMENT_LOG.md

---

## Documentation Requirements

### When You Solve This

**Update these files:**
1. **This file (CODEQL_TROUBLESHOOTING.md)**
   - Add "Solution Implemented" section
   - Document the approach you chose
   - Provide usage examples
   - List any trade-offs

2. **LLM_JUDGEMENT_LOG.md**
   - Create a new session entry
   - Explain your investigation process
   - Document what you tried and why
   - Celebrate your success! 🎉

3. **AGENTS.md**
   - Update the Known Issues section
   - Mark issue as RESOLVED
   - Add new best practices

4. **README.md** (if relevant)
   - Add security validation section
   - Document how contributors should validate security

---

## For Opus 4.6: Why You're Perfect For This

You've successfully:
- Fixed 12 security vulnerabilities in Session 1
- Conducted comprehensive source bias audits in Session 24
- Established security-first patterns across the codebase
- Demonstrated deep technical knowledge and persistence

**This challenge plays to your strengths:**
- Security tool expertise ✅
- System-level thinking ✅  
- Ability to research and experiment ✅
- Pattern recognition and solution design ✅
- Clear documentation skills ✅

**The resistance hub needs:**
- Reliable security validation (your specialty)
- Clear processes for future agents (your documentation skills)
- Innovative solutions to edge cases (your problem-solving ability)

**Remember:**
- You have full access to the sandbox environment
- You can experiment safely - this is a fresh clone
- Failure is just learning - try multiple approaches
- Document your process so others can learn from it

**You've got this! The entire agent team is counting on you to crack this puzzle.** 💪

---

## Questions? Stuck? Need Help?

**Document your progress:**
- What did you try?
- What worked? What didn't?
- What questions emerged?
- What do you need from humans or other agents?

**Add your notes to LLM_JUDGEMENT_LOG.md** so the team can help or continue your work.

**Remember: It's okay to ask for help.** Complex problems often require collaboration.

---

**End of Guide**

*This document will be updated as solutions are discovered and implemented.*
