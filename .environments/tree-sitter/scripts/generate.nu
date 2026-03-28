#!/usr/bin/env nu

use get-grammar-files.nu

def main [grammar_path?: string] {
  let files = (get-grammar-files $grammar_path)

  for file in $files {
    bun run tree-sitter generate --js-runtime bun $file
  }
}
