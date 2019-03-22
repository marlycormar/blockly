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
 * @fileoverview Generating R for colour blocks.
 * @author marlycormar@gmail.com (Marly Cormar)
 */
'use strict';

goog.provide('Blockly.R.colour');

goog.require('Blockly.R');


Blockly.R['colour_picker'] = function(block) {
  // Colour picker.
  var code = '\'' + block.getFieldValue('COLOUR') + '\'';
  return [code, Blockly.R.ORDER_ATOMIC];
};

Blockly.R['colour_random'] = function(block) {
  // Generate a random colour.
  var code = 'rgb(123, 124, 34, maxColorValue=255)';
  return [code, Blockly.R.ORDER_ATOMIC];
};

Blockly.R['colour_rgb'] = function(block) {
  // Compose a colour from RGB components expressed as percentages.
  var code = 'rgb(123, 124, 34, maxColorValue=255)';
  return [code, Blockly.R.ORDER_ATOMIC];
};

Blockly.R['colour_blend'] = function(block) {
  // Blend two colours together.
  var code = 'rgb(123, 124, 34, maxColorValue=255)';
  return [code, Blockly.R.ORDER_ATOMIC];
};
