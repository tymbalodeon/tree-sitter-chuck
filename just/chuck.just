# View help text
@help *args:
    ../scripts/chuck/help.nu {{ args }}

# Generate parser
[no-cd]
@generate:
    tree-sitter generate --js-runtime bun

# Install dependencies
@install:
    bun install

# Parse file
[no-cd]
parse *file:
    #!/usr/bin/env nu

    let file = if ("{{ file }}" | is-empty) {
         "examples/example.ck"
    } else {
        "{{ file }}"
    }

    tree-sitter parse $file

# TODO handle `tree-sitter init-config`

# Test parser
[no-cd]
test *name:
    #!/usr/bin/env nu

    if ("{{ name }}" | is-empty) {
        tree-sitter test
    } else {
        tree-sitter test --include {{ name }}
    }
