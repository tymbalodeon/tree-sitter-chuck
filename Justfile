[private]
@_: help

# View full help text, or for a specific recipe
@help *args:
    .environments/default/scripts/help.nu {{ args }}

# Run checks
@check *args:
    .environments/default/scripts/check.nu {{ args }}

# Create and switch to bookmarks/branches
@develop *args:
    .environments/default/scripts/develop.nu {{ args }}

alias dev := develop

# Manage environments
@environment *args:
    .environments/default/scripts/environment.nu {{ args }}

alias env := environment

# Format files
@format *args:
    .environments/default/scripts/format.nu {{ args }}

alias fmt := format

# View project history
@history *args:
    .environments/default/scripts/history.nu {{ args }}

# View issues
@issue *args:
    .environments/default/scripts/issue.nu {{ args }}

# Lint files
@lint *args:
    .environments/default/scripts/lint.nu {{ args }}

# View README file
@readme *args:
    .environments/default/scripts/readme.nu  {{ args }}

# View or open recipes
@recipe *args:
    .environments/default/scripts/recipe.nu  {{ args }}

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

[private]
@md *args:
    just markdown {{ args }}

[private]
@tree *args:
    just tree-sitter {{ args }}

[private]
@yml *args:
    just yaml {{ args }}

mod git ".environments/git/Justfile"
mod just ".environments/just/Justfile"
mod markdown ".environments/markdown/Justfile"
mod nix ".environments/nix/Justfile"
mod tree-sitter ".environments/tree-sitter/Justfile"
mod yaml ".environments/yaml/Justfile"

alias clean := nix::clean
alias generate := tree-sitter::generate
alias highlight := tree-sitter::highlight
alias install := tree-sitter::install
alias install-grammar := tree-sitter::install-grammar
alias install-queries := tree-sitter::install-queries
alias leaks := git::leaks
alias open := tree-sitter::open
alias parse := tree-sitter::parse
alias report-states := tree-sitter::report-states
alias sh := nix::shell
alias shell := nix::shell
alias test := tree-sitter::test
