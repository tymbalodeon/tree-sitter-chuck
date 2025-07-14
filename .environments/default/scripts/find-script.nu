#!/usr/bin/env nu

use environment.nu parse-environments
use find-recipe.nu choose-recipe

export def get-script [
  recipe: string
  scripts: list<string>
] {
  if ($recipe | path exists) {
    return $recipe
  }

  let parts = (
    $recipe
    | split row "::"
    | split row "/"
  )

  let environment = if ($parts | length) == 1 {
    ""
  } else {
    $parts
    | first
  }

  let $recipe = ($parts | last)

  let matching_scripts = (
    $scripts
    | where {
        let path = ($in | path parse)

        $path.stem == $recipe and $path.extension == "nu"
      }
  )

  let matching_scripts = if ($matching_scripts | length) > 1 {
    if ($environment | is-not-empty) {
      let matches = (
        $matching_scripts
        | str replace .environments/ ""
        | find --no-highlight $environment
      )

      let matching_scripts = (
        $matching_scripts
        | where {
            |script|

            $matches
            | where {$in in $script}
            | is-not-empty
          }
      )

      if ($matching_scripts | is-empty) {
        return
      }

      $matching_scripts
    } else {
      $matching_scripts
    }
  } else if ($recipe | is-not-empty) and ($matching_scripts | is-empty) {
    let environment = (parse-environments [$recipe])

    if ($environment | is-not-empty) {
      return (choose-recipe ($environment | first | get name))
    } else {
      return
    }
  } else {
    $matching_scripts
  }

  if ($matching_scripts | length) > 1 {
    $matching_scripts
    | to text
    | (
        fzf
          --preview
          "bat --force-colorization {}"
      )
  } else {
    $matching_scripts
    | first
  }
}

export def main [recipe: string] {
  let scripts = (
    fd --exclude tests --extension nu "" .environments
    | lines
  )

  get-script $recipe $scripts
}
