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
parse *file:
    #!/usr/bin/env nu

    let file = if ("{{ file }}" | is-empty) {
         "examples/example.ck"
    } else {
        "{{ file }}"
    }

    bun run tree-sitter parse --no-ranges $file

# Test parser
[no-cd]
test *name:
    #!/usr/bin/env nu

    if ("{{ name }}" | is-empty) {
        bun run tree-sitter test
    } else {
        bun run tree-sitter test --include {{ name }}
    }

# Highlight file
@highlight +file:
    bun run tree-sitter highlight {{ file }} --config-path config.json
