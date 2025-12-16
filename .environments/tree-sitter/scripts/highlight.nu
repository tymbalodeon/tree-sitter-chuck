#!/usr/bin/env nu

use ../../default/scripts/print.nu print-error
use file.nu open-temporary-file

def main [file?: string] {
  let local_config_file = (fd config --extension json | lines)

  let args = if ($local_config_file | is-empty) {
    let user_config = try {
      bun run tree-sitter init-config
      | complete
      | get stderr
      | lines
      | first
      | split row ": "
      | last
    } catch {
      print-error "failed to read tree-sitter config file"
    }

    let existing_config = (open $user_config)

    $existing_config
    | update parser-directories (
        $existing_config.parser-directories
        | append (pwd | path dirname)
      )
    | to json
    | save --force  $user_config

    []
  } else {
    let config_file = ($local_config_file | first)
    [--config-path $config_file]
  }

  let temporary_file = (open-temporary-file $file)
  bun run tree-sitter highlight $temporary_file ...$args
  rm $temporary_file
}
