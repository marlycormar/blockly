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
 * @fileoverview Generating R for loop blocks.
 * @author marlycormar@gmail.com (Marly Cormar)
 */
'use strict';

goog.provide('Blockly.R.loops');

goog.require('Blockly.R');


Blockly.R['controls_repeat_ext'] = function(block) {
  // Repeat n times.
  if (block.getField('TIMES')) {
    // Internal number.
    var repeats = String(Number(block.getFieldValue('TIMES')));
  } else {
    // External number.
    var repeats = Blockly.R.valueToCode(block, 'TIMES',
        Blockly.R.ORDER_ASSIGNMENT) || '0';
  }
  var branch = Blockly.R.statementToCode(block, 'DO');
  branch = Blockly.R.addLoopTrap(branch, block.id);
  var code = '';
  var loopVar = Blockly.R.variableDB_.getDistinctName(
      'count', Blockly.Variables.NAME_TYPE);
  var endVar = repeats;
  if (!repeats.match(/^\w+$/) && !Blockly.isNumber(repeats)) {
    var endVar = Blockly.R.variableDB_.getDistinctName(
        'repeat_end', Blockly.Variables.NAME_TYPE);
    code += endVar + ' <- ' + repeats + '\n';
  }
  code += 'for (' + loopVar +  ' in 0:' + endVar + '){\n' + branch + '}\n';
  return code;
};

Blockly.R['controls_repeat'] = Blockly.R['controls_repeat_ext'];

Blockly.R['controls_whileUntil'] = function(block) {
  // Do while/until loop.
  var until = block.getFieldValue('MODE') == 'UNTIL';
  var argument0 = Blockly.R.valueToCode(block, 'BOOL',
      until ? Blockly.R.ORDER_LOGICAL_NOT :
      Blockly.R.ORDER_NONE) || 'FALSE';
  var branch = Blockly.R.statementToCode(block, 'DO');
  branch = Blockly.R.addLoopTrap(branch, block.id);
  if (until) {
    argument0 = '!' + argument0;
  }
  return 'while (' + argument0 + ') {\n' + branch + '}\n';
};

Blockly.R['controls_for'] = function(block) {
  // For loop.
  var code = 'for (i in 0:5){\n  print(i)\n}';
  return code;
};

Blockly.R['controls_forEach'] = function(block) {
  // For each loop.
  var code = 'for (i in 0:5){\n  print(i)\n}';
  return code;
};

Blockly.R['controls_flow_statements'] = function(block) {
  // Flow statements: continue, break.
  switch (block.getFieldValue('FLOW')) {
    case 'BREAK':
      return 'break\n';
    case 'CONTINUE':
      return 'next\n';
  }
  throw Error('Unknown flow statement.');
};
