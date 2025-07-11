#!/usr/bin/env nu

use file.nu open-temporary-file

def main [file?: string] {
  let temporary_file = (open-temporary-file $file)
  bun run tree-sitter highlight $temporary_file --config-path config.json
  rm $temporary_file
}
