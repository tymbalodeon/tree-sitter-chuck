[private]
@default:
    just help --default

# View full help text, or for a specific recipe
@help *args:
    ./scripts/help.nu {{ args }}

# Check flake and run pre-commit hooks
@check *args:
    ./scripts/check.nu {{ args }}

# Manage environments
@environment *args:
    ./scripts/environment.nu {{ args }}

alias env := environment

# Search available `just` recipes
[no-exit-message]
@find-recipe *args:
    ./scripts/find-recipe.nu {{ args }}

alias find := find-recipe

# View project history
@history *args:
    ./scripts/history.nu {{ args }}

# View issues
@issue *args:
    ./scripts/issue.nu {{ args }}

# View remote repository
@remote *args:
    ./scripts/remote.nu  {{ args }}

# Find/replace
@replace *args:
    ./scripts/replace.nu  {{ args }}

# View repository analytics
@stats *args:
    ./scripts/stats.nu {{ args }}

# List TODO-style comments
@todo *args:
    ./scripts/todo.nu {{ args }}

alias todos := todo

# View the source code for a recipe
@view-source *args:
    ./scripts/view-source.nu {{ args }}

alias src := view-source

mod tree-sitter-chuck "just/tree-sitter-chuck.just"

alias generate := tree-sitter-chuck::generate
alias highlight := tree-sitter-chuck::highlight
alias install := tree-sitter-chuck::install
alias install-grammar := tree-sitter-chuck::install-grammar
alias install-queries := tree-sitter-chuck::install-queries
alias open := tree-sitter-chuck::open
alias parse := tree-sitter-chuck::parse
alias report-states := tree-sitter-chuck::report-states
alias test := tree-sitter-chuck::test
