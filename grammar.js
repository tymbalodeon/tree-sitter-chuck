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
    source_file: ($) => repeat(choice($.block, $.comment, $._statement)),
    array: ($) => seq("[", optional($._expression_list), "]"),

    array_declaration: ($) =>
      seq($.variable_identifier, "[", optional($._expression), "]"),

    binary_expression: ($) =>
      prec.left(seq($._expression, $.operator, $._expression)),

    block: ($) => seq("{", repeat($._statement), "}"),
    cast: ($) => seq($._expression, "$", $.primitive_type),

    _chuck_keyword: () =>
      choice("const", "fun", "function", "global", "new", "spork"),

    chuck_operation: ($) =>
      seq(
        choice($.chuck_operation, $._expression),
        $._chuck_operator,
        choice($._declaration, $._identifier, $.member_identifier),
      ),

    _chuck_operator: () => choice("=>", "*=>", "+=>", "-=>", "/=>", "@=>"),
    class_declaration: ($) => seq($.class_identifier, $.variable_identifier),
    class_identifier: ($) => choice(/[A-Z][a-zA-Z0-9]*/, $.reference_type),

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

    complex: ($) => seq("#(", $._expression, ",", $._expression, ")"),

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

    concatentation_operator: () => "+",
    debug_print: ($) => seq("<<<", $._expression_list, ">>>"),

    _declaration: ($) =>
      choice($.array_declaration, $.class_declaration, $.variable_declaration),

    duration_identifier: () =>
      choice("day", "hour", "minute", "ms", "samp", "second", "week"),

    dur: ($) =>
      seq(
        $._expression,
        "::",
        choice($.duration_identifier, $.variable_identifier),
      ),

    _expression: ($) =>
      choice(
        $.array,
        $.binary_expression,
        $.cast,
        $.debug_print,
        $._declaration,
        $.function_call,
        $._identifier,
        $.member_identifier,
        $._number,
        $.string,
        seq("(", $._expression, ")"),
      ),

    _expression_list: ($) =>
      seq($._expression, repeat(seq(",", $._expression))),

    function_call: ($) =>
      seq(
        choice($._identifier, $.member_identifier),
        "(",
        field("arguments", optional($._expression_list)),
        ")",
      ),

    float: () => token(seq(optional("-"), /(\d+)?\.\d+/)),
    global_unit_generator: () => choice("adc", "blackhole", "dac"),
    hexidecimal: () => token(seq("0", /x/i, /[\da-fA-F](_?[\da-fA-F])*/)),

    _identifier: ($) =>
      choice($.class_identifier, $.keyword, $.variable_identifier),

    int: () => token(seq(optional("-"), /\d+/)),

    keyword: ($) =>
      choice(
        $._chuck_keyword,
        $._class_keyword,
        $._control_structure,
        $.duration_identifier,
        $.global_unit_generator,
        $.primitive_type,
        $._special_literal_value,
      ),

    member_identifier: ($) => seq($._identifier, ".", $.variable_identifier),

    _number: ($) =>
      choice($.complex, $.dur, $.float, $.hexidecimal, $.int, $.polar),

    operator: () => choice("*", "+", "-", "/"),
    polar: ($) => seq("%(", $._expression, ",", $._expression, ")"),

    primitive_type: () =>
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

    reference_assignment: ($) => seq($.primitive_type),
    reference_type: () => choice("Event", "Object", "UGen", "array", "string"),

    _special_literal_value: () =>
      choice("NULL", "false", "maybe", "me", "now", "null", "pi", "true"),

    _statement: ($) => seq(choice($.chuck_operation, $._expression), ";"),

    string: () => {
      const delimeter = '"';
      return seq(delimeter, optional(/[^"]*/), delimeter);
    },

    _type: ($) =>
      choice($.class_identifier, $.variable_identifier, $.primitive_type),

    variable_identifier: () => /[a-z][a-zA-Z0-9]*/,
    variable_declaration: ($) => seq($.primitive_type, $.variable_identifier),
  },

  word: ($) => $.variable_identifier,
});
