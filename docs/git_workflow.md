# Git Workflow & Pull Request Protocol

**CRITICAL RULE:** Students are strictly forbidden from merging their own Pull Requests. Only the Mentor (Sir Tahir) is authorized to review and merge PRs into `develop`.

## The "Stacked Branch" Workflow

1. **Fork, Clone, and Setup:** 
   Fork the main organization repository to your personal GitHub account. Clone your fork locally. 

2. **Develop Feature 1:** 
   Checkout a new branch (e.g., `feature-1`) from the `develop` branch. Complete your feature, commit, and push it to your forked repository.

3. **Submit PR 1 & Automated Review:** 
   Open a Pull Request targeting the upstream `develop` branch. CodeRabbit will automatically review it. You must fix any HIGH or CRITICAL issues flagged by CodeRabbit. Once resolved, assign the PR to your mentor for human review.

4. **Branch Feature 2 (Do Not Wait):** 
   While waiting for PR 1 to be merged, do not stop working. Checkout a new branch (e.g., `feature-2`) directly from the `feature-1` branch (NOT from `develop`).

5. **Submit PR 2 as a Draft:** 
   Push `feature-2` to your fork and open a second PR against the upstream `develop` branch. **You must set this PR as a "Draft".** This indicates it is dependent on PR 1 and is not yet ready for the mentor to review.

6. **Rebase After Merge:** 
   Once your mentor reviews and merges PR 1 into the main `develop` branch, fetch the latest upstream changes. Rebase your `feature-2` branch onto the updated `upstream/develop`. 

7. **Publish and Repeat:** 
   Push the rebased `feature-2` branch to your fork. Change PR 2 from "Draft" to "Ready for Review". Repeat this stacked branching process for all subsequent features.

8. **Local Branch Maintenance:**
   Do not maintain a local `develop` branch. Delete it and rely solely on fetching and rebasing from `upstream/develop` to prevent local desynchronization.