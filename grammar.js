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
    source_file: ($) =>
      repeat(
        choice(
          $.block,
          $.class_definition,
          $.comment,
          $.conditional,
          $.function_definition,
          $._loop,
          $._statement,
        ),
      ),

    array: ($) => seq("[", $._expression_list, "]"),

    array_declaration: ($) =>
      seq(choice($.class_identifier, $.primitive_type), $.array_identifier),

    array_identifier: ($) =>
      seq(
        $.variable_identifier,
        repeat1(seq("[", optional($._expression), "]")),
      ),

    binary_expression: ($) =>
      prec.left(seq($._expression, $.operator, $._expression)),

    block: ($) =>
      seq(
        "{",
        repeat(
          choice(
            $.class_definition,
            $.comment,
            $.conditional,
            $._loop,
            $._statement,
          ),
        ),
        "}",
      ),

    cast: ($) => seq($._expression, "$", $.primitive_type),

    _chuck_keyword: () =>
      choice("const", "fun", "function", "global", "new", "spork"),

    chuck_operation: ($) =>
      seq(
        choice(
          $.chuck_operation,
          $._expression,
          seq("(", optional($._expression_list), ")"),
        ),
        $._chuck_operator,
        choice($._declaration, $._identifier, $.member_identifier),
      ),

    _chuck_operator: () =>
      choice("%=>", "&=>", "*=>", "+=>", "-=>", "/=>", "=>", "@=>", "|=>"),
    class_declaration: ($) => seq($.class_identifier, $.variable_identifier),

    class_definition: ($) =>
      seq(optional("public"), "class", $.class_identifier, $.block),

    class_identifier: ($) => choice(/[A-Z][a-zA-Z0-9]*/, $.reference_type),

    class_instantiation: ($) =>
      seq("new", choice($.class_identifier, $.variable_identifier)),

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

    conditional: ($) =>
      seq(
        "if",
        "(",
        $._expression,
        ")",
        $._control_structure_body,
        optional(seq("else", $._control_structure_body)),
      ),

    _control_structure: () =>
      choice("break", "continue", "repeat", "return", "switch"),

    _control_structure_body: ($) => choice($.block, $._statement),
    concatentation_operator: () => "+",
    debug_print: ($) => seq("<<<", $._expression_list, ">>>"),

    _declaration: ($) =>
      choice(
        $.array_declaration,
        $.class_declaration,
        $.reference_declaration,
        $.variable_declaration,
      ),

    do_loop: ($) =>
      seq(
        "do",
        $._control_structure_body,
        choice($._until_expression, $._while_expression),
      ),

    duration_identifier: () =>
      choice("day", "hour", "minute", "ms", "samp", "second", "week"),

    dur: ($) =>
      seq(
        $._expression,
        "::",
        choice(
          $.class_identifier,
          $.duration_identifier,
          $.variable_identifier,
        ),
      ),

    _expression: ($) =>
      choice(
        $.array,
        $.binary_expression,
        $.cast,
        $.conditional,
        $.class_instantiation,
        $.debug_print,
        $._declaration,
        $.function_call,
        $._identifier,
        $.increment_expression,
        $._loop,
        $.member_identifier,
        $.negation_expression,
        $._number,
        $.string,
        seq("(", $._expression, ")"),
      ),

    _expression_list: ($) =>
      prec(1, seq($._expression, repeat(seq(",", $._expression)))),

    float: () => token(seq(optional("-"), /(\d+)?\.\d+/)),

    for_loop: ($) =>
      seq(
        "for",
        "(",
        $.chuck_operation,
        ";",
        $.binary_expression,
        ";",
        $._expression,
        ")",
        $._control_structure_body,
      ),

    for_each_loop: ($) =>
      seq(
        "for",
        "(",
        seq(
          $.variable_declaration,
          ":",
          choice($.array, $.array_identifier, $.variable_identifier),
        ),
        ")",
        $._control_structure_body,
      ),

    function_call: ($) =>
      seq(
        choice($._identifier, $.member_identifier),
        "(",
        field("arguments", optional($._expression_list)),
        ")",
      ),

    function_definition: ($) =>
      seq(
        "fun",
        $.primitive_type,
        $.variable_identifier,
        "(",
        field(
          "parameters",
          optional(
            seq(
              choice($.array_declaration, $.variable_declaration),
              repeat(
                seq(",", choice($.array_declaration, $.variable_declaration)),
              ),
            ),
          ),
        ),
        ")",
        $.block,
      ),

    global_unit_generator: () => choice("adc", "blackhole", "dac"),
    hexidecimal: () => token(seq("0", /x/i, /[\da-fA-F](_?[\da-fA-F])*/)),
    increment_expression: ($) => seq($._expression, choice("++", "--")),

    _identifier: ($) =>
      choice(
        $.array_identifier,
        $.class_identifier,
        $.keyword,
        $.variable_identifier,
      ),

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

    _loop: ($) =>
      choice(
        $.do_loop,
        $.for_loop,
        $.for_each_loop,
        $.until_loop,
        $.while_loop,
      ),

    member_identifier: ($) => seq($._identifier, ".", $.variable_identifier),
    negation_expression: ($) => prec.left(seq("!", $._expression)),

    _number: ($) =>
      choice($.complex, $.dur, $.float, $.hexidecimal, $.int, $.polar),

    operator: () =>
      choice(
        "!=",
        "%",
        "&",
        "&&",
        "*",
        "+",
        "-",
        "/",
        "<",
        "<<",
        "<=",
        "==",
        ">",
        ">=",
        ">>",
        "^",
        "|",
        "||",
      ),
    polar: ($) => seq("%(", $._expression, ",", $._expression, ")"),

    primitive_type: () =>
      choice(
        "auto",
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

    reference_declaration: ($) =>
      seq(
        choice($.class_identifier, $.variable_identifier),
        "@",
        choice($.array_identifier, $.variable_identifier),
      ),

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

    _until_expression: ($) => seq("until", "(", $._expression, ")"),
    until_loop: ($) => seq($._until_expression, $._control_structure_body),
    variable_identifier: () => /[a-z_][a-zA-Z0-9_]*/,

    variable_declaration: ($) =>
      seq($.primitive_type, choice($.class_identifier, $.variable_identifier)),

    _while_expression: ($) => seq("while", "(", $._expression, ")"),
    while_loop: ($) => seq($._while_expression, $._control_structure_body),
  },

  word: ($) => $.variable_identifier,
});
