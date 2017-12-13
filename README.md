# This post-commit hook is meant to confirm pairs.

This is a git hook extension to [Git-Scripts](https://github.com/pivotal/git_scripts) by Pivotal Labs. All code herein is strictly a product of the author who is not affiliated with Pivotal Labs in any way.

Implement ***PAIRS-HOOK*** by adding a git hook in your package.json 'scripts' section. It assumes that all pairs in pair files only have two letter initials.

```"postcommit": "pairs-hook < /dev/tty"```

Note the ***< /dev/tty*** above which is required to pause on user input.

As written the hook requires [Husky](https://www.npmjs.com/package/husky), but you are welcome to implement your own git hook.

Find the source on [NPM](https://www.npmjs.com/package/pairs-hook) or [GIT](https://github.com/eitah/pairs-hook/).

For other questions contact Eli Itah @eitah on github.
