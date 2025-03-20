package tree_sitter_chuck_test

import (
	"testing"

	tree_sitter "github.com/tree-sitter/go-tree-sitter"
	tree_sitter_chuck "github.com/tree-sitter/tree-sitter-chuck/bindings/go"
)

func TestCanLoadGrammar(t *testing.T) {
	language := tree_sitter.NewLanguage(tree_sitter_chuck.Language())
	if language == nil {
		t.Errorf("Error loading Chuck grammar")
	}
}
