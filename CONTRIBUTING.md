# Contributing to dinoloop

We would love for you to contribute to dinoloop. 
As a contributor, here are the guidelines we would like you to follow:

## Found a Bug
If you find a bug in the source code, you can help us by
[submitting an issue]. Even better, you can [submit a Pull Request] with a fix.

## Missing a Feature
You can *request* a new feature or If you would like to *implement* a new feature, 
please submit an issue with a proposal, to be sure that we can use it.

### Submitting a Pull Request (PR)
Before you submit your Pull Request (PR) consider the following guidelines:

1. Create a new branch on development branch, **including feature/bugfix changes and appropriate test cases**.
2. Follow our Coding Rules.
3. Ensure that all tests pass.
4. Commit your changes using a descriptive commit message.
5. Push your branch to GitHub
6. In GitHub, send a pull request to `dinoloop:development`.
* If we suggest changes then:
  * Make the required updates.
  * Rebase your branch on `dinoloop:development@latest` and force push to GitHub repository (this will update your Pull Request)
7. Once changes are approved
* Go ahead and merge your changes:
  * git checkout `development`
  * git pull `development`
  * Rebase your branch on `development@latest` (solve conflicts if any) 
  * git pull your branch (solve conflicts if any)
  * git push your branch
  * check out `development`
  * git merge --squash `your_branch_name`
  * Re-run the test suites to ensure tests are still passing.
  * and commit to `development`
  
That's it! Thank you for your contribution!

#### After your pull request is merged
After your pull request is merged, you can safely delete your branch.