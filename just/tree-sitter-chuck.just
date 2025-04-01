# View help text
@help *args:
    ../scripts/chuck/help.nu {{ args }}

# Generate parser
[no-cd]
@generate:
    bun run tree-sitter generate --js-runtime bun

# Install dependencies
@install:
    bun install

# Parse file
[no-cd]
parse +file:
    #!/usr/bin/env nu

    # TODO DRY me up (see highlight)
    let files = (
        ls test/corpus/**/*
        | where type == file
        | get name
    )

    let file = if ("{{ file }}" | path exists) {
        "{{ file }}"
    } else if ("{{ file }}" | is-not-empty) {
        try {
            let files = (
                $files
                | find --no-highlight "{{ file }}"
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

    bun run tree-sitter parse --no-ranges $temporary_file
    rm $temporary_file

# Test parser
test *name:
    #!/usr/bin/env nu

    if ("{{ name }}" | is-empty) {
        bun run tree-sitter test
    } else {
        bun run tree-sitter test --include {{ name }}
    }

# Highlight file
highlight *file:
    #!/usr/bin/env nu

    def get-random-file [files: list<string>] {
        let max_index = (($files | length) - 1)

        $files
        | get (random int 0..$max_index)
    }

    let files = (
        ls test/corpus/**/*
        | where type == file
        | get name
    )

    let file = if ("{{ file }}" | is-not-empty) {
        try {
            let files = (
                $files
                | find --no-highlight "{{ file }}"
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

    bun run tree-sitter highlight $temporary_file --config-path config.json
    rm $temporary_file


# TODO DRY me up
# Open file
open *file:
    #!/usr/bin/env nu

    def get-random-file [files: list<string>] {
        let max_index = (($files | length) - 1)

        $files
        | get (random int 0..$max_index)
    }

    let files = (
        ls test/corpus/**/*
        | where type == file
        | get name
    )

    let file = if ("{{ file }}" | is-not-empty) {
        try {
            let files = (
                $files
                | find --no-highlight "{{ file }}"
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
    | prepend $"// ($temporary_file)\n\n"
    | to text
    | save --force $temporary_file

    hx $temporary_file
    rm $temporary_file

# Copy queries to helix directory
install-queries:
    #!/usr/bin/env nu

    let chuck_query_directory = (
        $env.HOME
        | path join ".config/helix/runtime/queries/chuck/"
    )

    mkdir $chuck_query_directory
    cp queries/highlights.scm $chuck_query_directory

# Add the grammar to helix
@install-grammar: && install-queries
    hx --grammar fetch
    hx --grammar build
