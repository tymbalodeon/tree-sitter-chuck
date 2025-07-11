#!/usr/bin/env nu

use file.nu open-temporary-file

def main [file?: string] {
  let temporary_file = (open-temporary-file $file)
  hx $temporary_file
  rm $temporary_file
}
