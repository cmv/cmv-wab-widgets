///////////////////////////////////////////////////////////////////////////
// Copyright © Esri. All Rights Reserved.
//
// Licensed under the Apache License Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//    http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.
///////////////////////////////////////////////////////////////////////////

define([
  'dojo/json',
  'dojo/text!./symbol.json',
  'esri/symbols/SimpleLineSymbol',
  'esri/symbols/SimpleFillSymbol',
  'esri/symbols/jsonUtils',
  'esri/Color'
  ], function(JSON, symbolStr, SimpleLineSymbol, SimpleFillSymbol, symbolUtils, Color){
  var jsonObj = JSON.parse(symbolStr), mo = {};

  mo.pointSymbol = symbolUtils.fromJson(jsonObj.pointSymbol);

  mo.lineSymbol = new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID,
      new Color([0, 69, 117]), 2);

  mo.polygonSymbol = new SimpleFillSymbol(SimpleFillSymbol.STYLE_SOLID,
      new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID, new Color([110, 110, 110]), 1),
      new Color([0, 100, 255, 0.6]));

  return mo;
});