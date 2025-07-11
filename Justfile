[private]
@default:
    just help

# View full help text, or for a specific recipe
@help *args:
    .environments/default/scripts/help.nu {{ args }}

# Check flake and run pre-commit hooks
@check *args:
    .environments/default/scripts/check.nu {{ args }}

# Manage environments
@environment *args:
    .environments/default/scripts/environment.nu {{ args }}

alias env := environment

# Search available `just` recipes
[no-exit-message]
@find-recipe *args:
    .environments/default/scripts/find-recipe.nu {{ args }}

alias find := find-recipe

# View project history
@history *args:
    .environments/default/scripts/history.nu {{ args }}

# View issues
@issue *args:
    .environments/default/scripts/issue.nu {{ args }}

# View remote repository
@remote *args:
    .environments/default/scripts/remote.nu  {{ args }}

# Find/replace
@replace *args:
    .environments/default/scripts/replace.nu  {{ args }}

# View repository analytics
@stats *args:
    .environments/default/scripts/stats.nu {{ args }}

# List TODO-style comments
@todo *args:
    .environments/default/scripts/todo.nu {{ args }}

alias todos := todo

# Set helix theme
@theme *args:
    .environments/default/scripts/theme.nu {{ args }}

# View the source code for a recipe
@view-source *args:
    .environments/default/scripts/view-source.nu {{ args }}

alias src := view-source

[private]
@tree *args:
    just tree-sitter {{ args }}

mod nix ".environments/nix/Justfile"
mod tree-sitter ".environments/tree-sitter/Justfile"

alias generate := tree-sitter::generate
alias highlight := tree-sitter::highlight
alias install := tree-sitter::install
alias install-grammar := tree-sitter::install-grammar
alias install-queries := tree-sitter::install-queries
alias open := tree-sitter::open
alias parse := tree-sitter::parse
alias report-states := tree-sitter::report-states
alias shell := nix::shell
alias test := tree-sitter::test
