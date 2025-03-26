[private]
@default:
    just help --default

# View full help text, or for a specific recipe
@help *args:
    ./scripts/help.nu {{ args }}

# Check flake and run pre-commit hooks
@check *args:
    ./scripts/check.nu {{ args }}

# List dependencies
@dependencies *args:
    ./scripts/dependencies.nu {{ args }}

alias deps := dependencies

# Manage environments
@environment *args:
    ./scripts/environment.nu {{ args }}

alias env := environment

# Search available `just` recipes
[no-cd]
[no-exit-message]
@find-recipe *search_term:
    ./scripts/find-recipe.nu {{ search_term }}

alias find := find-recipe

# View project history
[no-cd]
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

# View repository analytics
@stats *help:
    ./scripts/stats.nu {{ help }}

# View the source code for a recipe
[no-cd]
@view-source *recipe:
    ./scripts/view-source.nu {{ recipe }}

alias src := view-source

mod tree-sitter-chuck "just/tree-sitter-chuck.just"

alias generate := tree-sitter-chuck::generate
alias highlight := tree-sitter-chuck::highlight
alias install := tree-sitter-chuck::install
alias parse := tree-sitter-chuck::parse
