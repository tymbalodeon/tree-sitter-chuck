use ../../default/scripts/print.nu print-warning

def get-random-file [files: list<string>] {
  let max_index = (($files | length) - 1)

  $files
  | get (random int 0..$max_index)
}

export def open-temporary-file [file?: string] {
  let files = (
    ls **/test/corpus/**/*
    | where type == file
    | get name
  )

  let file = if ($file | is-empty) {
    get-random-file $files
  } else if ($file | path exists) {
    $file
  } else {
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
  }

  let extension = try {
    open tree-sitter.json
    | get grammars
    | where {"file-types" in ($in | columns)}
    | get file-types
    | flatten
    | first
  } catch {
    print-warning "failed to determine language file extension"
  }

  let temporary_file = (mktemp --tmpdir $"XXX.($extension)")

  open $file
  | split row "\n---\n"
  | first
  | split row "=\n"
  | last
  | str trim
  | save --force $temporary_file

  $temporary_file
}
