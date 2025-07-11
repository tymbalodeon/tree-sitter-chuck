  def get-random-file [files: list<string>] {
  let max_index = (($files | length) - 1)

  $files
  | get (random int 0..$max_index)
}

  export def open-temporary-file [file: string] {
    let files = (
      ls test/corpus/**/*
      | where type == file
      | get name
    )

    let file = if ($file | path exists) {
      $file
    } else if ($file | is-not-empty) {
      try {
        let files = (
          $files
          | find --no-highlight $file
        )

        if ($files | length) == 0 {
          return
        } else if ($files | length) == 1 {
          $files
          | first
        } else {
          $files
          | to text
          | fzf --preview 'open {}'
        }
      } catch {
        return
      }
    } else {
      get-random-file $files
    }

    let temporary_file = (mktemp --tmpdir XXX.ck)

    open $file
    | split row "\n---\n"
    | first
    | split row "=\n"
    | last
    | str trim
    | save --force $temporary_file

    $temporary_file
  }
