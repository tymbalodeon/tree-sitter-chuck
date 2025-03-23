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

    _chuck_keyword: () =>
      choice("const", "fun", "function", "global", "new", "spork"),

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
          $._identifier,
          $.member_identifier,
          $.variable_declaration,
        ),
      ),

    _chuck_operator: () => choice("=>", "*=>", "+=>", "-=>", "/=>"),
    class_identifier: () => /[A-Z][a-zA-Z0-9]*/,

    _class_keyword: () =>
      choice(
        "class",
        "extends",
        "implements",
        "interface",
        "private",
        "protected",
        "public",
        "pure",
        "static",
        "super",
        "this",
      ),

    // http://stackoverflow.com/questions/13014947/regex-to-match-a-c-style-multiline-comment/36328890#36328890
    comment: () =>
      token(
        choice(
          seq("//", /[^\r\n\u2028\u2029]*/),
          seq("/*", /[^*]*\*+([^/*][^*]*\*+)*/, "/"),
        ),
      ),

    complex: ($) => seq("#(", $.number, ",", $.number, ")"),

    _control_structure: () =>
      choice(
        "break",
        "continue",
        "else",
        "for",
        "if",
        "repeat",
        "return",
        "switch",
        "until",
        "while",
      ),

    debug_print: ($) => seq("<<<", optional($._expressions), ">>>"),

    duration_identifier: () =>
      choice("day", "hour", "minute", "ms", "samp", "second", "week"),

    dur: ($) => seq($.number, "::", choice($.duration_identifier, $.variable)),

    _expression: ($) =>
      choice($.operation, $.debug_print, $.function_call, $._value),

    _expressions: ($) =>
      seq($._expression, optional(repeat(seq(",", $._expression)))),

    function_call: ($) =>
      seq(
        $.member_identifier,
        "(",
        field("arguments", optional($._expressions)),
        ")",
      ),

    _float: () => /(\d+)?\.\d+/,
    global_unit_generator: () => choice("adc", "blackhole", "dac"),

    _identifier: ($) => choice($.variable, $.keyword),

    _int: () =>
      choice(/\d+/, seq(choice("0x", "0X"), /[\da-fA-F](_?[\da-fA-F])*/)),

    keyword: ($) =>
      choice(
        $._chuck_keyword,
        $._class_keyword,
        $._control_structure,
        $.duration_identifier,
        $.global_unit_generator,
        $.type,
        $._special_value,
      ),

    member_identifier: ($) =>
      seq(
        field("object_identifier", choice($.class_identifier, $._identifier)),
        ".",
        field("member_identifier", $._identifier),
      ),

    number: ($) => seq(optional("-"), choice($._float, $._int)),
    object_assignment: ($) => seq($.class_identifier, $._identifier),

    operation: ($) =>
      seq($._value, $.operator, $._value, optional(seq($.operator, $._value))),

    operator: () => choice("*", "+", "-", "/"),
    polar: ($) => seq("%(", $.number, ",", $.number, ")"),

    type: ($) =>
      choice(
        "complex",
        "dur",
        "float",
        "int",
        "polar",
        "same",
        "time",
        "vec3",
        "vec4",
        "void",
      ),

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
            $._value,
            $.variable_declaration,
          ),
          ";",
        ),
      ),

    _special_value: ($) =>
      choice("NULL", "false", "maybe", "me", "now", "null", "pi", "true"),

    string: () => {
      const delimeter = '"';
      return seq(delimeter, optional(/[^"]*/), delimeter);
    },

    _value: ($) =>
      choice($.complex, $.dur, $._identifier, $.number, $.polar, $.string),
    variable: () => /[a-z][a-zA-Z0-9]*/,
    variable_declaration: ($) => seq($.type, $._identifier),
  },
});
