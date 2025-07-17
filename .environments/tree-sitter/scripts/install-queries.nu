#!/usr/bin/env nu

def main [] {
  let language = (
    pwd
    | path basename
    | str replace tree-sitter- ""
  )

  let query_directory = (
    $env.HOME
    | path join $".config/helix/runtime/queries/($language)"
  )

  mkdir $query_directory
  cp queries/highlights.scm $query_directory
}
