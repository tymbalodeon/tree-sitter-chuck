@default:
    just --list

[no-cd]
@generate:
    tree-sitter generate --js-runtime bun

@install:
    bun install

[no-cd]
@parse *file:
    tree-sitter parse {{ if file == "" { "example.ck" } else { file } }}

