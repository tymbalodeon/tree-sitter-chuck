#!/usr/bin/env nu

export def main [directory_or_path?: string] {
  let directory_or_path = if ($directory_or_path | is-empty) {
    "."
  } else {
    $directory_or_path
  }

  if ($directory_or_path | path type) == file {
    [$directory_or_path]
  } else {
    fd grammar --extension js $directory_or_path
    | lines
  }
}
