#!/usr/bin/env nu

def main [name?: string] {
  if ($name | is-empty) {
    bun run tree-sitter test
  } else {
    bun run tree-sitter test --include $name
  }
}
