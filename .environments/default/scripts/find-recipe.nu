#!/usr/bin/env nu

export def choose-recipe [environment?: string] {
  let recipes = (just --summary | split row " ")

  let recipes = if ($environment | is-not-empty) {
    $recipes
    | where {$"($environment)::" in $in}
  } else {
    $recipes
  }

  $recipes
  | each {
      |recipe|

      if :: in $recipe {
        let parts = ($recipe | split row ::)

       $".environments/($parts | first)/scripts/($parts | last).nu"
      } else {
        $".environments/default/scripts/($recipe).nu"
      }
  }
  | to text
  | (
      fzf
        --preview
        "bat --force-colorization {}"
    )
  | str trim
  | split row " "
  | first
}

# Search available `just` recipes
def main [
  search_term?: string # Regex pattern to match
] {
  if ($search_term | is-empty) {
    let command = (choose-recipe)
    let out = (just $command | complete)

    print (
      if $out.exit_code != 0 {
        just $command --help
      } else {
        print $"(ansi --escape {attr: b})just ($command)(ansi reset)\n"

        $out.stdout
      }
    )
  } else {
    just
    | rg $search_term
  }
}
