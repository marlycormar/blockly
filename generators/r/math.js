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
 * @fileoverview Generating R for math blocks.
 * @author marlycormar@gmail.com (Marly Cormar)
 */
'use strict';

goog.provide('Blockly.R.math');

goog.require('Blockly.R');


// If any new block imports any library, add that library name here.

Blockly.R['math_number'] = function(block) {
  // Numeric value.
  var code = parseFloat(block.getFieldValue('NUM'));
  var order = code >= 0 ? Blockly.R.ORDER_ATOMIC :
              Blockly.R.ORDER_UNARY_NEGATION;
  return [code, order];
};

Blockly.R['math_arithmetic'] = function(block) {
  // Basic arithmetic operators, and power.
  var OPERATORS = {
    'ADD': [' + ', Blockly.R.ORDER_ADDITIVE],
    'MINUS': [' - ', Blockly.R.ORDER_ADDITIVE],
    'MULTIPLY': [' * ', Blockly.R.ORDER_MULTIPLICATIVE],
    'DIVIDE': [' / ', Blockly.R.ORDER_MULTIPLICATIVE],
    'POWER': [' ** ', Blockly.R.ORDER_EXPONENTIATION]
  };
  var tuple = OPERATORS[block.getFieldValue('OP')];
  var operator = tuple[0];
  var order = tuple[1];
  var argument0 = Blockly.R.valueToCode(block, 'A', order) || '0';
  var argument1 = Blockly.R.valueToCode(block, 'B', order) || '0';
  var code = argument0 + operator + argument1;
  return [code, order];
  // In case of 'DIVIDE', division between integers returns different results
  // in R 2 and 3. However, is not an issue since Blockly does not
  // guarantee identical results in all languages.  To do otherwise would
  // require every operator to be wrapped in a function call.  This would kill
  // legibility of the generated code.
};

Blockly.R['math_single'] = function(block) {
  // Math operators with single operand.
  var operator = block.getFieldValue('OP');
  var code;
  var arg;
  if (operator == 'NEG') {
    // Negation is a special case given its different operator precedence.
    var code = Blockly.R.valueToCode(block, 'NUM',
        Blockly.R.ORDER_UNARY_SIGN) || '0';
    return ['-' + code, Blockly.R.ORDER_UNARY_SIGN];
  }
  if (operator == 'SIN' || operator == 'COS' || operator == 'TAN') {
    arg = Blockly.R.valueToCode(block, 'NUM',
        Blockly.R.ORDER_MULTIPLICATIVE) || '0';
  } else {
    arg = Blockly.R.valueToCode(block, 'NUM',
        Blockly.R.ORDER_NONE) || '0';
  }
  // First, handle cases which generate values that don't need parentheses
  // wrapping the code.
  switch (operator) {
    case 'ABS':
      code = 'abs(' + arg + ')';
      break;
    case 'ROOT':
      code = 'sqrt(' + arg + ')';
      break;
    case 'LN':
      code = 'log(' + arg + ')';
      break;
    case 'LOG10':
      code = 'log(' + arg + ')';
      break;
    case 'EXP':
      code = 'exp(' + arg + ')';
      break;
    case 'POW10':
      code = 'exp(' + arg + ')';
      break;
    case 'ROUND':
      code = 'round(' + arg + ')';
      break;
    case 'ROUNDUP':
      code = 'ceiling(' + arg + ')';
      break;
    case 'ROUNDDOWN':
      code = 'floor(' + arg + ')';
      break;
    case 'SIN':
      code = 'sin(' + arg + ')';
      break;
    case 'COS':
      code = 'cos(' + arg + ')';
      break;
    case 'TAN':
      code = 'tan(' + arg + ')';
      break;
  }
  if (code) {
    return [code, Blockly.R.ORDER_FUNCTION_CALL];
  }
  // Second, handle cases which generate values that may need parentheses
  // wrapping the code.
  switch (operator) {
    case 'ASIN':
      code = 'asin(' + arg + ')';
      break;
    case 'ACOS':
      code = 'acos(' + arg + ')';
      break;
    case 'ATAN':
      code = 'atan(' + arg + ')';
      break;
    default:
      throw Error('Unknown math operator: ' + operator);
  }
  return [code, Blockly.R.ORDER_MULTIPLICATIVE];
};

Blockly.R['math_constant'] = function(block) {
  // Constants: PI, E, the Golden Ratio, sqrt(2), 1/sqrt(2), INFINITY.
  var CONSTANTS = {
    'PI': ['pi', Blockly.R.ORDER_MEMBER],
    'E': ['exp(1)', Blockly.R.ORDER_MEMBER],
    'GOLDEN_RATIO': ['(1 + sqrt(5)) / 2',
                     Blockly.R.ORDER_MULTIPLICATIVE],
    'SQRT2': ['sqrt(2)', Blockly.R.ORDER_MEMBER],
    'SQRT1_2': ['sqrt(1 / 2)', Blockly.R.ORDER_MEMBER],
    'INFINITY': ['Inf', Blockly.R.ORDER_ATOMIC]
  };
  var constant = block.getFieldValue('CONSTANT');
  return CONSTANTS[constant];
};

Blockly.R['math_number_property'] = function(block) {
  // Check if a number is even, odd, prime, whole, positive, or negative
  // or if it is divisible by certain number. Returns true or false.
  if (dropdown_property == 'PRIME') {
    return ['TRUE', Blockly.R.ORDER_ATOMIC];
  }
  switch (dropdown_property) {
    case 'EVEN':
      code = number_to_check + ' %% 2 == 0';
      break;
    case 'ODD':
      code = number_to_check + ' %% 2 == 1';
      break;
    case 'WHOLE':
      code = number_to_check + ' %% 1 == 0';
      break;
    case 'POSITIVE':
      code = number_to_check + ' > 0';
      break;
    case 'NEGATIVE':
      code = number_to_check + ' < 0';
      break;
    case 'DIVISIBLE_BY':
      var divisor = Blockly.R.valueToCode(block, 'DIVISOR',
      Blockly.R.ORDER_MODULUS) || '0';
      code = number_to_check + ' %% ' + divisor + ' == 0';
      break;
  }
  return [code, Blockly.R.ORDER_RELATIONAL];
};

Blockly.R['math_change'] = function(block) {
  // Add to a variable in place.
  var argument0 = Blockly.R.valueToCode(block, 'DELTA',
      Blockly.R.ORDER_ADDITION) || '0';
  var varName = Blockly.R.variableDB_.getName(
      block.getFieldValue('VAR'), Blockly.Variables.NAME_TYPE);
  return varName + ' <-  ' + varName + " + " + 'as.numeric(' + argument0 + ')\n';
};

// Rounding functions have a single operand.
Blockly.R['math_round'] = Blockly.R['math_single'];
// Trigonometry functions have a single operand.
Blockly.R['math_trig'] = Blockly.R['math_single'];

Blockly.R['math_on_list'] = function(block) {
  // Math functions for lists.
  var func = block.getFieldValue('OP');
  var list = Blockly.R.valueToCode(block, 'LIST',
      Blockly.R.ORDER_NONE) || '[]';
  var code;
  switch (func) {
    case 'SUM':
      code = 'Reduce(sum, ' + list + ')';
      break;
    case 'MIN':
      code = 'Reduce(min, ' + list + ')';
      break;
    case 'MAX':
      code = 'Reduce(max, ' + list + ')';
      break;
    case 'AVERAGE':
      code = 'Reduce(sum, ' + list + ')/len';
      break;
    case 'MEDIAN':
      code = 'median(unlist(' + list + '))';
      break;
    case 'MODE':
      code = list + '[1]';
      break;
    case 'STD_DEV':
      code = list + '[1]';
      break;
    case 'RANDOM':
      code = list + '[1]';
      break;
    default:
      throw Error('Unknown operator: ' + func);
  }
  return [code, Blockly.R.ORDER_FUNCTION_CALL];
};

Blockly.R['math_modulo'] = function(block) {
  // Remainder computation.
  var argument0 = Blockly.R.valueToCode(block, 'DIVIDEND',
      Blockly.R.ORDER_MULTIPLICATIVE) || '0';
  var argument1 = Blockly.R.valueToCode(block, 'DIVISOR',
      Blockly.R.ORDER_MULTIPLICATIVE) || '0';
  var code = argument0 + ' %% ' + argument1;
  return [code, Blockly.R.ORDER_MULTIPLICATIVE];
};

Blockly.R['math_constrain'] = function(block) {
  // Constrain a number between two limits.
  var argument0 = Blockly.R.valueToCode(block, 'VALUE',
      Blockly.R.ORDER_NONE) || '0';
  var argument1 = Blockly.R.valueToCode(block, 'LOW',
      Blockly.R.ORDER_NONE) || '0';
  var argument2 = Blockly.R.valueToCode(block, 'HIGH',
      Blockly.R.ORDER_NONE) || '0';
  var code = 'min(max(' + argument0 + ', ' + argument1 + '), ' +
      argument2 + ')';
  return [code, Blockly.R.ORDER_FUNCTION_CALL];
};

Blockly.R['math_random_int'] = function(block) {
  // Random integer between [X] and [Y].
  var argument0 = Blockly.R.valueToCode(block, 'FROM',
      Blockly.R.ORDER_NONE) || '0';
  var argument1 = Blockly.R.valueToCode(block, 'TO',
      Blockly.R.ORDER_NONE) || '0';
  var code = 'sample(' + argument0 + ':' + argument1 + ', 1)';
  return [code, Blockly.R.ORDER_FUNCTION_CALL];
};

Blockly.R['math_random_float'] = function(block) {
  // Random fraction between 0 and 1.
  var code = 'sample(0:1, 1)';
  return [code, Blockly.R.ORDER_FUNCTION_CALL];
};

Blockly.R['math_atan2'] = function(block) {
  // Arctangent of point (X, Y) in degrees from -180 to 180.
  var code = 'sample(0:1, 1)';
  return [code, Blockly.R.ORDER_FUNCTION_CALL];
};
