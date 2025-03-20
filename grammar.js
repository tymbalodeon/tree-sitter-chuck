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
    source_file: ($) => repeat(choice($.comment, $.debug_print)),

    // http://stackoverflow.com/questions/13014947/regex-to-match-a-c-style-multiline-comment/36328890#36328890
    comment: (_) =>
      token(
        choice(
          seq("//", /[^\r\n\u2028\u2029]*/),
          seq("/*", /[^*]*\*+([^/*][^*]*\*+)*/, "/"),
        ),
      ),

    _statement_end: (_) => ";",
    debug_print: ($) => seq("<<<", optional($.value), ">>>", $._statement_end),

    dur: ($) => seq($._number, "::", "second"),

    float: (_) => /\d?\.\d+/,

    int: (_) =>
      choice(/\d+/, seq(choice("0x", "0X"), /[\da-fA-F](_?[\da-fA-F])*/)),

    _number: ($) => choice($.float, $.int),

    string: (_) => {
      const delimeter = '"';

      return seq(delimeter, optional(/[a-zA-Z\s]*/), delimeter);
    },

    _type_identifier: (_) =>
      choice(
        "complex",
        "dur",
        "float",
        "int",
        "polar",
        "time",
        "vec3",
        "vec4",
        "void",
      ),

    value: ($) => choice($.dur, $._number, $.string),
  },
});
