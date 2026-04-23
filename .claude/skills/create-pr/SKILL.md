---
name: create-pr
description: Create a PR consistent with our team's PR creation guidelines.
---

# Commit and Pull Request Best Practices

## Creating Commits (Apply Only When Explicitly Asked)

Commits should be crafted thoughtfully to tell a clear, logical story that makes it easy for reviewers to follow changes commit-by-commit.

### Core Principles

**Encapsulation**: Each commit should completely encapsulate a particular change - a single logical unit of work that stands on its own. This could be:

- Adding a new function or module
- Fixing a specific bug
- Refactoring a component
- Updating documentation for a feature

**Coherent Story**: The sequence of commits should tell a logical story. Reviewers should be able to review the PR commit-by-commit and understand the progression of changes. Each commit builds on the previous one in a way that makes sense.

**Avoid Retroactive Changes**: Later commits should avoid modifying or "fixing" earlier commits in the same branch unless necessary to maintain a clear story. If you find yourself fixing something from an earlier commit, consider whether you should:

- Amend the earlier commit (if not yet pushed or if safe to force-push)
- Rebase and squash/fixup the commits
- Keep it separate only if it represents a genuine evolution of understanding

### Staging Strategies for Clean Commits

When you have multiple unrelated changes in your working directory, use git's staging capabilities to create clean, focused commits:

**Staging Hunks**: Use git's interactive staging to commit partial files:

- In your editor's git interface, stage individual hunks (sections) of changes
- Via command line: `git add -p <file>` to interactively choose which changes to stage
- This allows you to separate unrelated changes in the same file into different commits

**Temporary Edits for Clean Staging**: When changes are intermingled and can't be easily separated with hunk staging:

1. Edit the file to include only the changes for the first commit
2. Stage and commit those changes
3. Edit the file again to restore the other changes
4. Stage and commit those as a separate commit

**Example workflow**:

```
# You have file.go with both a bug fix and a refactor
# Stage only the bug fix parts
git add -p file.go  # Select hunks related to bug fix

# Commit the bug fix
git commit -m "Fix null pointer error in handler"

# Stage the refactor
git add file.go

# Commit the refactor
git commit -m "Refactor handler to use dependency injection"
```

### Best Practices Summary

- Each commit should be reviewable on its own
- Commits should be in logical order - dependencies should come before features that use them
- Avoid "WIP" or "fix typo" commits in the final PR - squash or amend these before requesting review
- Use descriptive commit messages that explain what and why
- When in doubt, smaller focused commits are better than large monolithic ones
- The commit history should read like chapters in a book, not a stream of consciousness

## Pull Request Description Guidelines

Every pull request MUST include a well-structured description with the following sections. This ensures reviewers and future developers understand the context, reasoning, and implications of the changes.

Ensure that the pull request description is short and concise, and only elaborate if the scope and contents of the PR really necessitate it.

Your pull request direction must be written directly, not in the form of a file. This is to make it easy to transfer to the GitHub pull request creation UI.

## Required Sections

### Summary

**Purpose**: Clearly describe what changes were made in this PR.

**Guidelines**:

- Write in past tense (e.g., "Added feature X", "Fixed bug Y", "Refactored Z")
- Be specific about what was changed, not just what the goal was
- List the key changes if there are multiple components
- Keep it concise but comprehensive enough for someone to understand the scope without reading the code
- **Multiple commits**: If the branch includes several commits that each do a logically distinct thing, explain what each commit does in bullet point form, referencing the commit SHA without backticks (GitHub will automatically convert it to a link)

**Length**: 3-8 bullet points for typical PRs. Simple bug fixes may be 1-2 bullets; large features may be longer.

**Format**:

- Use bullet points (dash-prefixed)
- For single logical change: Start each bullet with a verb ("Added", "Updated", "Fixed", "Refactored")
- For multiple distinct commits: Start each bullet with the commit SHA followed by colon, then description (e.g., "a1b2c3d: Added authentication middleware")
- Each bullet should be a complete sentence or phrase describing one change

### Motivation

**Purpose**: Explain why this change is necessary and what impact it will have.

**Guidelines**:

- Link to relevant tickets, issues, or documentation
- Describe the problem being solved or the feature being enabled
- Explain the business or technical value
- Include context that would help reviewers understand the importance
- Mention any user-facing impact or benefits

**Length**: 2-4 paragraphs. Should be long enough to provide context but concise enough to read quickly.

**Format**:

- Start with the problem or need being addressed
- Explain the impact or value of solving it
- Use prose paragraphs, not bullet points
- Keep language clear and accessible (avoid unnecessary jargon)

### Design (Optional)

**Purpose**: Document significant design decisions, architectural choices, and tradeoffs.

**When to include**: Include this section when:

- The PR introduces new patterns or architectural changes
- There were multiple approaches considered and you chose one
- The implementation involves non-obvious design choices
- The change affects system architecture or component interactions
- Future developers would benefit from understanding the reasoning

**Guidelines**:

- Explain alternative approaches that were considered and why they were rejected
- Document any tradeoffs made (e.g., performance vs. maintainability)
- Describe new patterns or abstractions introduced
- Include relevant technical context or constraints that influenced decisions
- Link to design documents or RFCs if applicable

**Length**: 1-3 paragraphs or 5-10 bullet points, depending on complexity. Can be longer for significant architectural changes.

**Format**:

- Use headings to organize subsections (e.g., "Alternatives Considered", "Tradeoffs", "Design Decisions")
- Use numbered lists for alternatives that were evaluated
- Use bullet points for tradeoffs and design rationales
- Include brief explanations for why alternatives were rejected
- Be specific about technical constraints or requirements that influenced decisions

### Testing

**Purpose**: Document how the changes were validated to work correctly.

**Guidelines**:

- List all automated tests added or modified
- Describe manual testing performed
- Include test scenarios covered
- Mention any edge cases tested
- Note performance or load testing if applicable
- Include screenshots or videos for UI changes

**Length**: 5-15 bullet points across automated and manual testing categories. More complex changes require more detail.

**Format**:

- Use subsection headings: "Automated Tests", "Manual Testing" (if applicable), "Performance Testing" (if applicable)
- Under each heading, use bullet points to list specific tests or test scenarios
- For automated tests, include test function names or test file names in parentheses
- "Manual Testing" means testing by a human. It's only applicable if the user describes the tests they performed.
- For manual tests, describe the scenario and expected outcome
- End with a statement about CI/test status (e.g., "All tests passing in CI pipeline")
- For UI changes, include links to screenshots or videos

### Deploy Notes

**Purpose**: Document any special considerations or requirements for deploying this change.

**Guidelines**:
Always consider and document:

- **Dependencies**: Does this PR depend on another PR, infrastructure change, or external service update?
- **Deployment Order**: Do multiple services need to be deployed in a specific order?
- **Backward Compatibility**: Is this change backward compatible? Can old and new versions coexist?
- **Rollback Safety**: Can this change be safely rolled back? Are there any irreversible migrations or state changes?
- **Configuration**: Are there new environment variables, feature flags, or configuration changes required?
- **Database Migrations**: Are there schema changes? Do they need to run before or after deployment?
- **Monitoring**: Should any new metrics or alerts be added? What should be monitored after deployment?
- **Gradual Rollout**: Should this be deployed gradually (canary, feature flag, etc.)?

**Length**: Address all relevant categories from above. For simple PRs, this might be 1-2 sentences. For complex deployments, this could be 10-20 bullet points.

**Format**:

- Use subsection headings for each relevant category (Dependencies, Deployment Order, Rollback Safety, Configuration, etc.)
- If there are critical deployment considerations, start with "⚠️ DEPLOYMENT CONSIDERATIONS:" or similar warning
- For configuration changes, use nested bullet points with specific variable names
- For deployment steps, use numbered lists
- Use code formatting for environment variable names and values
- If no special deployment considerations exist, explicitly state: "No special deployment considerations - safe to deploy and rollback"

## Formatting Tips

- Use markdown formatting for readability
- Use bullet points for lists
- Use code blocks for code snippets, configuration examples, or environment variables
- Use bold to highlight important deployment considerations. Do not use emojis.
- Keep each section focused on its purpose
- Link to external resources when relevant (issues, design docs, monitoring dashboards)

## Final Checklist

Before submitting your PR, verify:

- [ ] Commits are well-structured and tell a logical story
- [ ] Each commit encapsulates a complete, logical change
- [ ] No "WIP" or "fix typo" commits remain (squashed or amended)
- [ ] All required sections are filled out
- [ ] Design section included if architectural changes were made
- [ ] Testing section describes both automated and manual testing
- [ ] Deploy notes address all deployment considerations
- [ ] Links to related issues/tickets are included
- [ ] Code is ready for review (linted, tested, documented)
