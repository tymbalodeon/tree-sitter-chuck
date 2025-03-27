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
          $._control_structure,
          $.function_definition,
          $.import_expression,
          $.statement,
        ),
      ),

    array: ($) => seq("[", $._expression_list, "]"),

    array_declaration: ($) =>
      prec.left(
        seq(
          $._type,
          seq($.array_identifier, repeat(seq(",", $.array_identifier))),
        ),
      ),

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
            $._control_structure,
            $.function_definition,
            $.statement,
          ),
        ),
        "}",
      ),

    cast: ($) => seq($._expression, "$", $.primitive_type),
    _chuck_keyword: () => choice("const", "function", "global", "spork"),

    chuck_operation: ($) =>
      seq(
        choice($.chuck_operation, $._expression),
        $.chuck_operator,
        choice($._declaration, $._identifier, $.keyword, $.member_identifier),
      ),

    chuck_operator: () =>
      choice(
        "%=>",
        "&=>",
        "*=>",
        "+=>",
        "-=>",
        "/=>",
        "=<",
        "=>",
        "=^",
        "@=>",
        "|=>",
      ),

    class_definition: ($) =>
      seq(
        optional("public"),
        "class",
        $.class_identifier,
        optional(seq("extends", $.class_identifier)),
        $.block,
      ),

    class_identifier: () => /[A-Z][a-zA-Z0-9]*/,

    class_instantiation: ($) =>
      seq("new", choice($.class_identifier, $.variable_identifier)),

    _class_keyword: () =>
      choice(
        "extends",
        "implements",
        "interface",
        "private",
        "protected",
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

    _control_structure: ($) =>
      choice($.do_loop, $.for_loop, $.for_each_loop, $.loop),

    control_structure_keyword: () => choice("break", "continue", "switch"),
    _control_structure_body: ($) => choice($.block, $.statement),
    debug_print: ($) => seq("<<<", $._expression_list, ">>>"),

    _declaration: ($) =>
      choice(
        $.array_declaration,
        $.reference_declaration,
        $.variable_declaration,
      ),

    do_loop: ($) =>
      seq("do", $._control_structure_body, $._until_while_expression),

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
        $.class_instantiation,
        $.conditional,
        $._control_structure,
        $.debug_print,
        $._declaration,
        $.function_call,
        $._identifier,
        $.increment_expression,
        $.keyword,
        $.member_identifier,
        $.negation_expression,
        $._number,
        $.spork_expression,
        $.string,
        seq("(", optional($._expression_list), ")"),
      ),

    _expression_list: ($) =>
      prec(1, seq($._expression, repeat(seq(",", $._expression)))),

    float: () => token(seq(optional("-"), /(\d+)?\.\d+/)),

    for_loop: ($) =>
      seq(
        "for",
        "(",
        choice($.chuck_operation, $.variable_declaration),
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

    function_call: ($) => {
      const argument_list = seq(
        "(",
        field("arguments", optional($._expression_list)),
        ")",
      );

      return seq(
        choice($._identifier, $.member_identifier),
        argument_list,
        repeat(seq(".", choice($._identifier), argument_list)),
      );
    },

    function_definition: ($) =>
      seq(
        "fun",
        $._type,
        $.variable_identifier,
        "(",
        field(
          "parameters",
          optional(seq($._declaration, repeat(seq(",", $._declaration)))),
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
        $.reference_type,
        $.variable_identifier,
      ),

    import_expression: ($) =>
      seq(
        "@import",
        choice($.string, seq("{", $.string, repeat(seq(",", $.string)), "}")),
      ),

    int: () => token(seq(optional("-"), /\d+/)),

    keyword: ($) =>
      choice(
        $._chuck_keyword,
        $._class_keyword,
        $.control_structure_keyword,
        $.duration_identifier,
        $.global_unit_generator,
        $.primitive_type,
        $._special_literal_value,
      ),

    loop: ($) =>
      seq(
        choice(
          seq("repeat", "(", $._expression, ")"),
          $._until_while_expression,
        ),
        $._control_structure_body,
      ),

    member_identifier: ($) =>
      prec(
        1,
        seq(
          choice("me", $.global_unit_generator, $._identifier),
          ".",
          $.variable_identifier,
        ),
      ),

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
      seq(choice($._type, $.variable_identifier), "@", $._identifier),

    reference_type: () => choice("Event", "Object", "UGen", "array", "string"),

    _special_literal_value: () =>
      choice("NULL", "false", "maybe", "me", "now", "null", "pi", "true"),

    spork_expression: ($) => seq("spork", "~", $.function_call),

    statement: ($) =>
      seq(
        optional("return"),
        choice($.chuck_operation, $._expression, $.function_definition),
        ";",
      ),

    string: () => {
      const delimeter = '"';
      return seq(delimeter, optional(/[^"]*/), delimeter);
    },

    _type: ($) =>
      seq(
        optional("static"),
        choice($.class_identifier, $.primitive_type, $.reference_type),
      ),

    _until_while_expression: ($) =>
      seq(choice("until", "while"), "(", $._expression, ")"),

    variable_identifier: () => /[a-z_][a-zA-Z0-9_]*/,

    variable_declaration: ($) => {
      const identifier = choice($.class_identifier, $.variable_identifier);
      return prec.left(
        seq($._type, seq(identifier, repeat(seq(",", identifier)))),
      );
    },
  },

  word: ($) => $.variable_identifier,
});
