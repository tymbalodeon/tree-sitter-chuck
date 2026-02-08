#!/usr/bin/env nu

use get-grammar-files.nu

def main [grammar_path?: string] {
  for file in (get-grammar-files $grammar_path) {
    bun run tree-sitter generate --js-runtime bun $file
  }
}
