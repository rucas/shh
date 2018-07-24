# Contributing

Thank you for your contribution. Here are a set of guidelines for contributing to the taskd project.

Just follow these simple guidelines to get your PR merged ASAP.

## Installing

```sh
$ git clone https://github.com/rucas/shh
```

## Tests

### Standard

[Standard](https://github.com/standard/standard) is the linter of choice for this repo. To run lint checks:

```sh
$ yarn lint
```

### Jest

[Jest](https://github.com/facebook/jest) is the test runner of choice for this repo. To run tests:

```sh
$ yarn test
```

### git-hooks

[Husky](https://github.com/typicode/husky) is set-up to run on:

- pre-commit, runs yarn lint

- pre-push, runs yarn test

## Submitting a Patch

1. Create an [issue](https://github.com/rucas/taskd/issues/new)
2. Fork the repo
3. Run tests
4. Push commits to your fork and submit a PR
