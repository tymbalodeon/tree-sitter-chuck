# View help text
@help *args :
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
@parse *file:
    tree-sitter parse {{ if file == "" { "example.ck" } else { file } }}

# TODO handle `tree-sitter init-config`
