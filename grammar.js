/**
 * @file Chuck grammar for tree-sitter
 * @author Ben Rosen <benjamin.j.rosen@gmail.com>
 * @license MIT
 */

/// <reference types="tree-sitter-cli/dsl" />
// @ts-check

module.exports = grammar({
  name: "chuck",

  rules: {
    source_file: ($) => repeat($._definition),

    _definition: ($) => choice($.function_definition),

    function_definition: ($) =>
      seq("fun", $._type, $.identifier, $.parameter_list, $.block),

    parameter_list: (_) => seq("(", ")"),

    _type: (_) =>
      choice(
        "int",
        "float",
        "time",
        "dur",
        "void",
        "vec3",
        "vec4",
        "complex",
        "polar",
      ),

    block: ($) => seq("{", repeat($._statement), "}"),

    _statement: ($) => choice($.return_statement),

    return_statement: ($) => seq("return", $._expression, ";"),

    _expression: ($) => choice($.identifier, $.number),

    identifier: (_) => /[a-z]+/,

    number: (_) => /\d+/,
  },
});
