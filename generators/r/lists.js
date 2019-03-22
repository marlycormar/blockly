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
 * @fileoverview Generating R for list blocks.
 * @author marlycormar@gmail.com (Marly Cormar)
 */
'use strict';

goog.provide('Blockly.R.lists');

goog.require('Blockly.R');


Blockly.R['lists_create_empty'] = function(block) {
  // Create an empty list.
  return ['list()', Blockly.R.ORDER_ATOMIC];
};

Blockly.R['lists_create_with'] = function(block) {
  // Create a list with any number of elements of any type.
  var elements = new Array(block.itemCount_);
  for (var i = 0; i < block.itemCount_; i++) {
    elements[i] = Blockly.R.valueToCode(block, 'ADD' + i,
        Blockly.R.ORDER_NONE) || 'NULL';
  }
  var code = 'list(' + elements.join(', ') + ')';
  return [code, Blockly.R.ORDER_ATOMIC];
};

Blockly.R['lists_repeat'] = function(block) {
  // Create a list with one element repeated.
  var element = Blockly.R.valueToCode(block, 'ITEM',
      Blockly.R.ORDER_NONE) || 'NULL';
  var repeatCount = Blockly.R.valueToCode(block, 'NUM',
      Blockly.R.ORDER_NONE) || '0';
  return ['list(rep(' + element + ', ' + repeatCount + '))', Blockly.R.ORDER_FUNCTION_CALL];
};

Blockly.R['lists_length'] = function(block) {
    // String or array length.
  var list = Blockly.R.valueToCode(block, 'VALUE',
      Blockly.R.ORDER_MEMBER) || 'list()';
  return ['length(' + list + ')', Blockly.R.ORDER_FUNCTION_CALL];
};

Blockly.R['lists_isEmpty'] = function(block) {
  var list = Blockly.R.valueToCode(block, 'VALUE',
    Blockly.R.ORDER_MEMBER) || 'list()';
  return ['length(' + list + ') == 0', Blockly.R.ORDER_LOGICAL_NOT];
};

Blockly.R['lists_indexOf'] = function(block) {
  // Find an item in the list.
  return ['1', Blockly.R.ORDER_ATOMIC];
};

Blockly.R['lists_getIndex'] = function(block) {
  // Get element at index.
  return ['1', Blockly.R.ORDER_ATOMIC];
};

Blockly.R['lists_setIndex'] = function(block) {
  // Set element at index.
  return ['list()', Blockly.R.ORDER_ATOMIC];
};

Blockly.R['lists_getSublist'] = function(block) {
  // Get sublist.
  return ['list()', Blockly.R.ORDER_ATOMIC];
};

Blockly.R['lists_split'] = function(block) {
  // Block for splitting text into a list, or joining a list into text.
  return ['list()', Blockly.R.ORDER_ATOMIC];

};

Blockly.R['lists_reverse'] = function(block) {
  // Block for reversing a list.
    // Block for reversing a list.
  var list = Blockly.R.valueToCode(block, 'LIST',
      Blockly.R.ORDER_NONE) || 'list()';
  var code = 'rev(' + list + ')';
  return [code, Blockly.R.ORDER_FUNCTION_CALL];
};
