#!/usr/bin/env nu

use get-grammar-files.nu

def main [
  rule: string
  grammar_path?: string
] {
  let rule = if ($rule | is-empty) {
    "-"
  } else {
    $rule
  }

  let files = (get-grammar-files $grammar_path)

  for file in $files {
    (
      bun run tree-sitter generate
        --js-runtime bun
        --report-states-for-rule $rule
        $file
    )
  }
}
