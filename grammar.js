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
    source_file: ($) => repeat($._statement),

    binary_expression: ($) => seq($._value, $.operator, $._value),

    _chuck_operator: (_) => "=>",

    class: (_) => /[A-Z][a-zA-Z0-9]*/,

    // http://stackoverflow.com/questions/13014947/regex-to-match-a-c-style-multiline-comment/36328890#36328890
    comment: (_) =>
      token(
        choice(
          seq("//", /[^\r\n\u2028\u2029]*/),
          seq("/*", /[^*]*\*+([^/*][^*]*\*+)*/, "/"),
        ),
      ),

    debug_print: ($) => seq("<<<", optional($._expressions), ">>>"),

    dur: ($) => seq($._number, "::", "second"),

    _expression: ($) =>
      choice($.binary_expression, $.debug_print, $.function_call, $._value),

    _expressions: ($) =>
      seq($._expression, optional(repeat(seq(",", $._expression)))),

    function_call: ($) => seq($.method, "(", optional($._expressions), ")"),

    float: (_) => /\d?\.\d+/,

    _identifier: (_) => /[a-z][a-zA-Z0-9]*/,

    int: (_) =>
      choice(/\d+/, seq(choice("0x", "0X"), /[\da-fA-F](_?[\da-fA-F])*/)),

    method: ($) => seq($.class, ".", $._identifier),

    _number: ($) => choice($.float, $.int),

    operator: (_) => choice("+", "-"),

    _statement: ($) =>
      choice(
        $.comment,
        seq(
          choice(
            $.class,
            $.debug_print,
            $.function_call,
            $.method,
            $.variable_assignment,
            $.variable_declaration,
          ),
          ";",
        ),
      ),

    string: (_) => {
      const delimeter = '"';

      return seq(delimeter, optional(/[^"]*/), delimeter);
    },

    _type: (_) =>
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

    _value: ($) => choice($.dur, $._identifier, $._number, $.string),

    variable_assignment: ($) =>
      seq(
        $._expression,
        $._chuck_operator,
        choice($.variable_declaration, $._identifier),
      ),

    variable_declaration: ($) => seq($._type, $._identifier),
  },
});
