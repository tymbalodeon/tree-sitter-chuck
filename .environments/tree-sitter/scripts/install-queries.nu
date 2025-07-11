#!/usr/bin/env nu

def main [] {
  let chuck_query_directory = (
    $env.HOME
    | path join .config/helix/runtime/queries/chuck/
  )

  mkdir $chuck_query_directory
  cp queries/highlights.scm $chuck_query_directory
}
