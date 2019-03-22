/**
 * @license
 * Visual Blocks Language
 *
 * Copyright 2019 Google Inc.
 * https://developers.google.com/blockly/
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * @fileoverview Generating R for logic blocks.
 * @author marlycormar@gmail.com (Marly Cormar)
 */
'use strict';

goog.provide('Blockly.R.logic');

goog.require('Blockly.R');


Blockly.R['controls_if'] = function(block) {
  // If/elseif/else condition.
  var n = 0;
  var code = '', branchCode, conditionCode;
  do {
    conditionCode = Blockly.R.valueToCode(block, 'IF' + n,
      Blockly.R.ORDER_NONE) || 'FALSE';
    branchCode = Blockly.R.statementToCode(block, 'DO' + n);
    code += (n > 0 ? ' else ' : '') +
        'if (' + conditionCode + ') {\n' + branchCode + '}';

    ++n;
  } while (block.getInput('IF' + n));

  if (block.getInput('ELSE')) {
    branchCode = Blockly.R.statementToCode(block, 'ELSE');
    code += ' else {\n' + branchCode + '}';
  }
  return code + '\n';
};

Blockly.R['controls_ifelse'] = Blockly.R['controls_if'];

Blockly.R['logic_compare'] = function(block) {
  // Comparison operator.
  var OPERATORS = {
    'EQ': '==',
    'NEQ': '!=',
    'LT': '<',
    'LTE': '<=',
    'GT': '>',
    'GTE': '>='
  };
  var operator = OPERATORS[block.getFieldValue('OP')];
  var order = Blockly.R.ORDER_RELATIONAL;
  var argument0 = Blockly.R.valueToCode(block, 'A', order) || '0';
  var argument1 = Blockly.R.valueToCode(block, 'B', order) || '0';
  var code = argument0 + ' ' + operator + ' ' + argument1;
  return [code, order];
};

Blockly.R['logic_operation'] = function(block) {
  // Operations 'and', 'or'.
  var operator = (block.getFieldValue('OP') == 'AND') ? '&&' : '||';
  var order = (operator == '&&') ? Blockly.R.ORDER_LOGICAL_AND :
      Blockly.R.ORDER_LOGICAL_OR;
  var argument0 = Blockly.R.valueToCode(block, 'A', order);
  var argument1 = Blockly.R.valueToCode(block, 'B', order);
  if (!argument0 && !argument1) {
    // If there are no arguments, then the return value is false.
    argument0 = 'FALSE';
    argument1 = 'FALSE';
  } else {
    // Single missing arguments have no effect on the return value.
    var defaultArgument = (operator == '&&') ? 'TRUE' : 'FALSE';
    if (!argument0) {
      argument0 = defaultArgument;
    }
    if (!argument1) {
      argument1 = defaultArgument;
    }
  }
  var code = argument0 + ' ' + operator + ' ' + argument1;
  return [code, order];
};

Blockly.R['logic_negate'] = function(block) {
  // Negation.
  var argument0 = Blockly.R.valueToCode(block, 'BOOL',
      Blockly.R.ORDER_LOGICAL_NOT) || 'TRUE';
  var code = '! ' + argument0;
  return [code, Blockly.R.ORDER_LOGICAL_NOT];
};

Blockly.R['logic_boolean'] = function(block) {
  // Boolean values true and false.
  var code = (block.getFieldValue('BOOL') == 'TRUE') ? 'TRUE' : 'FALSE';
  return [code, Blockly.R.ORDER_ATOMIC];
};

Blockly.R['logic_null'] = function(block) {
  // Null data type.
  return ['NA', Blockly.R.ORDER_ATOMIC];
};

Blockly.R['logic_ternary'] = function(block) {
  // Ternary operator.
  var value_if = Blockly.R.valueToCode(block, 'IF',
      Blockly.R.ORDER_CONDITIONAL) || 'FALSE';
  var value_then = Blockly.R.valueToCode(block, 'THEN',
      Blockly.R.ORDER_CONDITIONAL) || 'NA';
  var value_else = Blockly.R.valueToCode(block, 'ELSE',
      Blockly.R.ORDER_CONDITIONAL) || 'NA';
  var code = value_then + ' if' + value_if + ' else ' + value_else;
  return [code, Blockly.R.ORDER_CONDITIONAL];
};
