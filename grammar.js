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

    chuck_operation: ($) =>
      seq(
        choice(
          $.chuck_operation,
          $._expression,
          $.member_identifier,
          $.object_assignment,
        ),
        $._chuck_operator,
        choice(
          $.object_assignment,
          $.identifier,
          $.member_identifier,
          $.variable_declaration,
        ),
      ),

    _chuck_operator: () => "=>",
    class_identifier: () => /[A-Z][a-zA-Z0-9]*/,

    // http://stackoverflow.com/questions/13014947/regex-to-match-a-c-style-multiline-comment/36328890#36328890
    comment: () =>
      token(
        choice(
          seq("//", /[^\r\n\u2028\u2029]*/),
          seq("/*", /[^*]*\*+([^/*][^*]*\*+)*/, "/"),
        ),
      ),

    debug_print: ($) => seq("<<<", optional($._expressions), ">>>"),

    duration_identifier: () =>
      choice("samp", "ms", "second", "minute", "hour", "day", "week"),

    dur: ($) => seq($._number, "::", $.duration_identifier),

    _expression: ($) =>
      choice($.binary_expression, $.debug_print, $.function_call, $._value),

    _expressions: ($) =>
      seq($._expression, optional(repeat(seq(",", $._expression)))),

    function_call: ($) =>
      seq(
        $.member_identifier,
        "(",
        field("arguments", optional($._expressions)),
        ")",
      ),

    float: () => /(\d+)?\.\d+/,
    global_unit_generator: () => choice("adc", "blackhole", "dac"),

    identifier: ($) =>
      choice(
        /[a-z][a-zA-Z0-9]*/,
        $.duration_identifier,
        $.global_unit_generator,
        $.now_keyword,
      ),

    int: () =>
      choice(/\d+/, seq(choice("0x", "0X"), /[\da-fA-F](_?[\da-fA-F])*/)),

    member_identifier: ($) =>
      seq(
        field("object_identifier", choice($.class_identifier, $.identifier)),
        ".",
        field("member_identifier", $.identifier),
      ),

    now_keyword: () => "now",
    _number: ($) => choice($.float, $.int),
    object_assignment: ($) => seq($.class_identifier, $.identifier),
    operator: () => choice("+", "-"),

    _statement: ($) =>
      choice(
        $.comment,
        seq(
          choice(
            $.class_identifier,
            $.object_assignment,
            $.debug_print,
            $.function_call,
            $.member_identifier,
            $.chuck_operation,
            $.variable_declaration,
          ),
          ";",
        ),
      ),

    string: () => {
      const delimeter = '"';
      return seq(delimeter, optional(/[^"]*/), delimeter);
    },

    type: () =>
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

    _value: ($) => choice($.dur, $.identifier, $._number, $.string),
    variable_declaration: ($) => seq($.type, $.identifier),
  },
});
