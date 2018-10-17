# Husky and [Standard-version](https://github.com/conventional-changelog/standard-version) Demo using gulp

This repository demonstrates, how to setup a release flow with standard-version,
triggered by merges into specific branches.

The Idea is to have a Branch setup, that is similiar to [GitFlow](https://datasift.github.io/gitflow/IntroducingGitFlow.html)
as in having a development branch and one or more release branches,
that need different versioning in the manifest.json.
(Or you just don't wanne manually bump the manifest.json version)

## package.json
### husky.hooks.post-merge
runs gulp release to create a standard-version release on merge

## config.js
### `releaseBranchNames:string[]`
contains the names of branches, that should get the standard-version
treatment.

## gulpfile.js
### `> gulp release`
creates the version-commit, -tag and -change

all Branches but master are treated as pre-release, getting their name added to the version
e.g. `v0.0.1-whateverbranchname.0`

### `> gulp release:manifest`
Used in the `postbump` hook of standard-version to alter the manifest.json version ([Overwolf Demo App](https://github.com/overwolf/demo-app])