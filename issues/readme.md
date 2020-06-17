# Prosemirror issue tracking

This doc relates to Prosemirror issue [#1067](https://github.com/ProseMirror/prosemirror/issues/1067).

We will go through 3 commits and observe the changes.

## 1. Commit "change icons"

### Instructions

Inside the project root, do:

```
git checkout f1c69ac7039da5545b8d45a64802d3175329ef45
yarn
cd packages/apps/app1
yarn start
```

Now inspect http://localhost:3000 and click after the text `edit me...` and press `Enter`.

### Console output

![](./issue-after-commit-f1c69ac7039da5545b8d45a64802d3175329ef45.png?raw=true)

### Summary

After this commit we had `package.json` content including:

```js
"resolutions": {
  "w3c-keyname": "2.2.2"
},
```

And exact prosemirror dependencies like:

```js
"prosemirror-commands": "1.1.4",
"prosemirror-dropcursor": "1.3.2",
"prosemirror-gapcursor": "1.1.5",
"prosemirror-history": "1.1.3",
"prosemirror-inputrules": "1.1.2",
"prosemirror-keymap": "1.1.4",
"prosemirror-model": "1.8.2",
"prosemirror-schema-list": "1.1.2",
"prosemirror-state": "1.3.3",
"prosemirror-view": "1.14.13",
```

Given the error discovered, we may have pinned incompatible versions of the prosemirror
libraries above and will fix that in the next commit.

## 2. Commit "move away from exact prosemirror versions and regen lock"

### Instructions

Inside the project root, do:

```
git checkout 515b99b5124b700909e06cc54b16982edec6f7f0
yarn
cd packages/apps/app1
yarn start
```

Now inspect http://localhost:3000 and click after the text `edit me...` and press `Enter`.

### Console output

No errors

### Summary

Moving to inexact prosemirror versions seems to have fixed the multiple versions of libraries issues found before.

After this commit our prosemirror dependencies are:

```js
"prosemirror-commands": "^1.1.4",
"prosemirror-dropcursor": "^1.3.2",
"prosemirror-gapcursor": "^1.1.5",
"prosemirror-history": "^1.1.3",
"prosemirror-inputrules": "^1.1.2",
"prosemirror-keymap": "^1.1.4",
"prosemirror-model": "^1.8.2",
"prosemirror-schema-list": "^1.1.2",
"prosemirror-state": "^1.3.3",
"prosemirror-view": "^1.14.13",
```

## 3. Commit "remove w3c-keyname resolutions in package.json and regen lock"

### Instructions

Inside the project root, do:

```
git checkout 9e55753eba83a1364c703b04f55797ebbbc13b34
yarn
cd packages/apps/app1
yarn start
```

Now inspect http://localhost:3000 and click after the text `edit me...` and press `Enter`.

### Console output

![](./issue-after-commit-9e55753eba83a1364c703b04f55797ebbbc13b34.png?raw=true)

### Summary

Before this commit, we've relied on [yarn resolutions](https://classic.yarnpkg.com/en/docs/selective-version-resolutions/) to pin down our version of `w3c-keyname` to `2.2.2`.

Here we removed the `"resolutions"` sections inside our `package.json` files to see if anything goes
amiss - after all, the original issue reported [#1067](https://github.com/ProseMirror/prosemirror/issues/1067)
claims that there is a problem with `w3c-keyname` greater than version `2.2.2`.

This commit then reproduces the error reported.
