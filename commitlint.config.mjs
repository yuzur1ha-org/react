export default {
  extends: ["@commitlint/config-conventional"],
  rules: {
    "type-enum": [
      2,
      "always",
      [
        "feat",
        "fix",
        "docs",
        "refactor",
        "perf",
        "test",
        "build",
        "ci",
        "chore",
        "revert",
      ],
    ],
    "subject-case": [0],
    "subject-full-stop": [2, "never", "."],
    "english-subject": [2, "always"],
  },
  plugins: [
    {
      rules: {
        "english-subject": ({ subject }) => [
          Boolean(subject && /^[A-Za-z0-9][\x20-\x7e]*$/.test(subject)),
          "Write the subject in English; use an imperative verb",
        ],
      },
    },
  ],
}
