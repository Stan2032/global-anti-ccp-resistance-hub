# LLM Model Swap Guidelines

## Overview

This document provides guidelines for optimal LLM (Large Language Model) selection when working with GitHub Copilot agents. The goal is to match the right model to each task type for optimal performance, cost-efficiency, and quality.

---

## Can Copilot Swap Models Automatically?

**No, Copilot agents cannot swap LLMs autonomously.** Model selection must be explicitly controlled by the user through the GitHub Copilot interface.

### Key Points:
- **User-Controlled**: Only users can change the active LLM model
- **No Auto-Switching**: Agents cannot swap models mid-session
- **Request Protocol**: Agents can and should *recommend* model changes, but users must execute them

---

## Optimal Workflow Guidelines

### For Users:

1. **Before Starting a Task**:
   - Consider the task complexity and type
   - Select the appropriate model based on the recommendations below
   - Confirm model selection before instructing Copilot

2. **When Continuing Work**:
   - If you say "continue" and Copilot recognizes a different model would be more suitable, **Copilot should ask you to switch models BEFORE proceeding**
   - This prevents wasted effort and ensures optimal results

3. **Model Switch Protocol**:
   ```
   User: "Continue with the next task"
   Copilot: "Before continuing, I recommend switching to [Model Name] because [reason]. 
             Please switch models and then I'll proceed with [task description]."
   User: [Switches model]
   User: "Switched. Please proceed."
   Copilot: [Continues with task using appropriate model]
   ```

### For Copilot Agents:

1. **Assess Task Requirements**: Before starting work, evaluate if current model is optimal
2. **Proactive Recommendations**: If a different model would be better, request a switch BEFORE doing the work
3. **Document Preferences**: Log model recommendations in the "Model Preference Log" section below
4. **Be Explicit**: Clearly state WHY a different model would be better

---

## LLM Model Recommendations by Task Type

| Task Type | Recommended Model | Why It's Optimal | Alternative |
|-----------|------------------|------------------|-------------|
| **Complex Code Integration** | Claude Opus 4.6 | Superior reasoning for multi-file refactoring, architectural changes, and complex dependencies | Sonnet 4.5 (if cost is a concern) |
| **Code Reviews** | Claude Opus 4.6 | Best at identifying subtle bugs, security issues, and architectural concerns | Sonnet 4.5 (for quick reviews) |
| **Documentation Writing** | Claude Sonnet 4.5 | Excellent balance of quality and speed; perfect for clear, concise docs | Opus 4.6 (for complex technical specs) |
| **Simple Code Edits** | Claude Sonnet 4.5 | Fast, cost-effective, handles straightforward changes efficiently | Haiku 4 (for trivial edits) |
| **Bug Fixes (Simple)** | Claude Sonnet 4.5 | Quick diagnosis and fixes for isolated issues | Opus 4.6 (for complex bugs) |
| **Bug Fixes (Complex)** | Claude Opus 4.6 | Better at tracing issues across multiple files and understanding system interactions | Sonnet 4.5 (as first attempt) |
| **Testing (Writing Tests)** | Claude Sonnet 4.5 | Good at understanding test patterns and creating comprehensive test coverage | Opus 4.6 (for complex test scenarios) |
| **Testing (Debugging Tests)** | Claude Opus 4.6 | Better at understanding test failures and fixing flaky tests | Sonnet 4.5 (for simple fixes) |
| **API Design** | Claude Opus 4.6 | Superior at considering edge cases, scalability, and API consistency | Sonnet 4.5 (for simple endpoints) |
| **Database Schema Design** | Claude Opus 4.6 | Best at considering relationships, indexes, and long-term maintenance | Sonnet 4.5 (for simple tables) |
| **Security Analysis** | Claude Opus 4.6 | Most thorough at identifying vulnerabilities and security implications | Sonnet 4.5 (for basic checks) |
| **Performance Optimization** | Claude Opus 4.6 | Better at identifying bottlenecks and suggesting optimizations | Sonnet 4.5 (for obvious issues) |
| **Configuration Files** | Claude Sonnet 4.5 | Sufficient for most config changes; fast and reliable | Haiku 4 (for trivial changes) |
| **Dependency Updates** | Claude Sonnet 4.5 | Good at handling package.json, requirements.txt, etc. | Opus 4.6 (if breaking changes expected) |
| **Build System Changes** | Claude Opus 4.6 | Better at understanding complex build configurations and interactions | Sonnet 4.5 (for simple tweaks) |
| **Code Exploration** | Claude Sonnet 4.5 | Fast codebase navigation and understanding | Haiku 4 (for quick searches) |
| **Refactoring (Small)** | Claude Sonnet 4.5 | Handles function/method renames and small structural changes well | Haiku 4 (for trivial renames) |
| **Refactoring (Large)** | Claude Opus 4.6 | Best at maintaining consistency across large-scale refactoring | Sonnet 4.5 (then review with Opus) |
| **Research/Investigation** | Claude Opus 4.6 | Superior at synthesizing information and providing insights | Sonnet 4.5 (for straightforward questions) |
| **Git Operations** | Claude Sonnet 4.5 | Handles branch management, merges, and conflict resolution well | Haiku 4 (for simple commits) |
| **Quick Q&A** | Claude Sonnet 4.5 | Fast responses for general questions | Haiku 4 (for very simple queries) |

---

## Model Capabilities Summary

### Claude Opus 4.6
- **Strengths**: Advanced reasoning, complex problem-solving, comprehensive analysis
- **Best For**: Architecture, complex debugging, security reviews, large refactoring
- **Cost**: Highest
- **Speed**: Slower (but worth it for complex tasks)

### Claude Sonnet 4.5
- **Strengths**: Excellent balance of speed, quality, and cost
- **Best For**: Most coding tasks, documentation, standard debugging
- **Cost**: Medium
- **Speed**: Fast

### Claude Haiku 4
- **Strengths**: Very fast, cost-effective
- **Best For**: Simple edits, quick searches, trivial fixes
- **Cost**: Lowest
- **Speed**: Fastest

---

## Model Preference Log

*This section is for Copilot agents to document when they would have preferred a different model for a completed task.*

### Format:
```
**Date**: YYYY-MM-DD
**Task**: [Brief task description]
**Model Used**: [Model that was used]
**Preferred Model**: [Model that would have been better]
**Reason**: [Why the preferred model would have been better]
**Impact**: [How it affected the outcome, if applicable]
```

### Entries:

<!-- Copilot agents: Add your entries below -->

---

## Future Model Considerations

As new models become available (e.g., future Claude versions, GPT models, or specialized coding models), this document should be updated with:

1. **Model capabilities comparison**
2. **Updated task-to-model mappings**
3. **Cost-benefit analysis for new models**
4. **Migration recommendations**

---

## How to Update This Document

**For Users**:
- Add your observations about model performance
- Suggest new task categories
- Update recommendations based on experience

**For Copilot Agents**:
- Log model preferences in the "Model Preference Log" section
- Suggest updates to the recommendations table based on completed tasks
- Note any patterns where model selection significantly impacted outcomes

**For Collaborators**:
- Keep the table concise and actionable
- Update model capabilities as new versions are released
- Share insights from real-world usage

---

## Quick Reference

**Need to decide which model?** Ask yourself:

1. **Is this complex or simple?**
   - Complex → Opus 4.6
   - Simple → Sonnet 4.5 or Haiku 4

2. **Does it involve multiple files/systems?**
   - Yes → Opus 4.6
   - No → Sonnet 4.5

3. **Is security or architecture involved?**
   - Yes → Opus 4.6
   - No → Sonnet 4.5

4. **Is speed critical and the task is trivial?**
   - Yes → Haiku 4
   - No → Sonnet 4.5 (default choice)

**When in doubt, start with Sonnet 4.5** — it handles most tasks well and you can always switch to Opus 4.6 if needed.

---

*Last Updated: 2026-02-18*
