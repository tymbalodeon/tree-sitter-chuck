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
@find-recipe *search_term:
    ./scripts/find-recipe.nu {{ search_term }}

alias find := find-recipe

# View project history
@history *args:
    ./scripts/history.nu {{ args }}

# View issues
@issue *args:
    ./scripts/issue.nu {{ args }}

# Create a new release
@release *preview:
    ./scripts/release.nu  {{ preview }}

# View remote repository
@remote *web:
    ./scripts/remote.nu  {{ web }}

# Find/replace
@replace *help:
    ./scripts/replace.nu  {{ help }}

# View repository analytics
@stats *help:
    ./scripts/stats.nu {{ help }}

# List TODO-style comments
@todo *args:
    ./scripts/todo.nu {{ args }}

alias todos := todo

# View the source code for a recipe
@view-source *recipe:
    ./scripts/view-source.nu {{ recipe }}

alias src := view-source

mod tree-sitter-chuck "just/tree-sitter-chuck.just"

alias generate := tree-sitter-chuck::generate
alias highlight := tree-sitter-chuck::highlight
alias install-grammar := tree-sitter-chuck::install-grammar
alias install-queries := tree-sitter-chuck::install-queries
alias open := tree-sitter-chuck::open
alias parse := tree-sitter-chuck::parse
alias report-states := tree-sitter-chuck::report-states
alias test := tree-sitter-chuck::test
