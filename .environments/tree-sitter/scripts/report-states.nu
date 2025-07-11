#!/usr/bin/env nu

def main [rule: string] {
  let rule = if ($rule | is-empty) {
    "-"
  } else {
    $rule
  }

  bun run tree-sitter generate --js-runtime bun --report-states-for-rule $rule
}
