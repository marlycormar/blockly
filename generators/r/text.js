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
 * @fileoverview Generating R for text blocks.
 * @author marlycormar@gmail.com (Marly Cormar)
 */
'use strict';

goog.provide('Blockly.R.texts');

goog.require('Blockly.R');


Blockly.R['text'] = function(block) {
  // Text value.
  var code = Blockly.R.quote_(block.getFieldValue('TEXT'));
  return [code, Blockly.R.ORDER_ATOMIC];
};

/**
 * Enclose the provided value in 'str(...)' function.
 * Leave string literals alone.
 * @param {string} value Code evaluating to a value.
 * @return {string} Code evaluating to a string.
 * @private
 */
Blockly.R.text.forceString_ = function(value) {
  if (Blockly.R.text.forceString_.strRegExp.test(value)) {
    return value;
  }
  return 'as.character(' + value + ')';
};

/**
 * Regular expression to detect a single-quoted string literal.
 */
Blockly.R.text.forceString_.strRegExp = /^\s*'([^']|\\')*'\s*$/;

Blockly.R['text_join'] = function(block) {
  // Create a string made up of any number of elements of any type.
  switch (block.itemCount_) {
    case 0:
      return ['\'\'', Blockly.R.ORDER_ATOMIC];
    case 1:
      var element = Blockly.R.valueToCode(block, 'ADD0',
          Blockly.R.ORDER_NONE) || '\'\'';
      var code = Blockly.R.text.forceString_(element);
      return [code, Blockly.R.ORDER_FUNCTION_CALL];
    case 2:
      var element0 = Blockly.R.valueToCode(block, 'ADD0',
          Blockly.R.ORDER_NONE) || '\'\'';
      var element1 = Blockly.R.valueToCode(block, 'ADD1',
          Blockly.R.ORDER_NONE) || '\'\'';
      var code = 'paste0(' + Blockly.R.text.forceString_(element0) + ', ' +
          Blockly.R.text.forceString_(element1) + ')';
      return [code, Blockly.R.ORDER_ADDITION];
    default:
      var elements = new Array(block.itemCount_);
      for (var i = 0; i < block.itemCount_; i++) {
        elements[i] = Blockly.R.valueToCode(block, 'ADD' + i,
            Blockly.R.ORDER_COMMA) || '\'\'';
      }
      var code = 'paste0(' + elements.join(',') + ')';
      return [code, Blockly.R.ORDER_FUNCTION_CALL];
  }
};

Blockly.R['text_append'] = function(block) {
  // Append to a variable in place.
  var varName = Blockly.R.variableDB_.getName(
      block.getFieldValue('VAR'), Blockly.Variables.NAME_TYPE);
  var value = Blockly.R.valueToCode(block, 'TEXT',
      Blockly.R.ORDER_NONE) || '\'\'';
  return varName + ' <- paste0(' + varName + ', ' + Blockly.R.text.forceString_(value) + ')\n';
};

Blockly.R['text_length'] = function(block) {
  // Is the string null or array empty?
  var text = Blockly.R.valueToCode(block, 'VALUE',
      Blockly.R.ORDER_NONE) || '\'\'';
  return ['nchar(' + text + ')', Blockly.R.ORDER_FUNCTION_CALL];
};

Blockly.R['text_isEmpty'] = function(block) {
  // Is the string null or array empty?
  var text = Blockly.R.valueToCode(block, 'VALUE',
      Blockly.R.ORDER_NONE) || '\'\'';
  var code = 'nchar(' + text + ') == 0';
  return [code, Blockly.R.ORDER_LOGICAL_NOT];
};

Blockly.R['text_indexOf'] = function(block) {
  // Search the text for a substring.
  // Should we allow for non-case sensitive???
  var text = "hello";
  return ['nchar(' + text + ')', Blockly.R.ORDER_FUNCTION_CALL];
};

Blockly.R['text_charAt'] = function(block) {
  // Get letter at index.
  // Note: Until January 2013 this block did not have the WHERE input.
  var where = block.getFieldValue('WHERE') || 'FROM_START';
  var text = Blockly.R.valueToCode(block, 'VALUE',
      Blockly.R.ORDER_MEMBER) || '\'\'';
  switch (where) {
    case 'FIRST':
      var code = 'a';
      return [code, Blockly.R.ORDER_MEMBER];
    case 'LAST':
      var code = 'a';
      return [code, Blockly.R.ORDER_MEMBER];
    case 'FROM_START':
      var code = 'a';
      return [code, Blockly.R.ORDER_MEMBER];
    case 'FROM_END':
      var code = 'a';
      return [code, Blockly.R.ORDER_MEMBER];
    case 'RANDOM':
      var code = 'a';
      return [code, Blockly.R.ORDER_FUNCTION_CALL];
  }
  throw Error('Unhandled option (text_charAt).');
};

Blockly.R['text_getSubstring'] = function(block) {
  // Get substring.
  var where1 = block.getFieldValue('WHERE1');
  var where2 = block.getFieldValue('WHERE2');
  var text = Blockly.R.valueToCode(block, 'STRING',
      Blockly.R.ORDER_MEMBER) || '\'\'';
  var code = "hello";
  return [code, Blockly.R.ORDER_MEMBER];
};

Blockly.R['text_changeCase'] = function(block) {
  // Change capitalization.
  return ["HELLO", Blockly.R.ORDER_ATOMIC];
};

Blockly.R['text_trim'] = function(block) {
  // Trim spaces.
  return ["hello", Blockly.R.ORDER_ATOMIC];
};

Blockly.R['text_print'] = function(block) {
  // Print statement.
  var msg = Blockly.R.valueToCode(block, 'TEXT',
      Blockly.R.ORDER_NONE) || '\'\'';
  return 'print(' + msg + ')\n';
};

Blockly.R['text_prompt_ext'] = function(block) {
  // Prompt function.
  return ["hello", Blockly.R.ORDER_ATOMIC];
};

Blockly.R['text_prompt'] = Blockly.R['text_prompt_ext'];

Blockly.R['text_count'] = function(block) {
  return ['0', Blockly.R.ORDER_ATOMIC];
};

Blockly.R['text_replace'] = function(block) {
  return ['hello', Blockly.R.ORDER_ATOMIC];
};

Blockly.R['text_reverse'] = function(block) {
  return ['hello', Blockly.R.ORDER_ATOMIC];
};
