#!/usr/bin/env nu

def main [] {
  bun run tree-sitter generate --js-runtime bun
}
