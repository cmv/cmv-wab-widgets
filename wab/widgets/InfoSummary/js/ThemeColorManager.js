///////////////////////////////////////////////////////////////////////////
// Copyright © 2015 Esri. All Rights Reserved.
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

define(['dojo/_base/declare',
  'dojo/_base/lang',
  'dojo/dom-style',
  'dojo/_base/array',
  'dojo/_base/Color'
], function (declare, lang, domStyle, array, Color) {
  var themeColorManager = declare(null, {
    _theme: null,
    _styleName: "",
    _styleColor: null,
    _options: null,

    // updateUI(options): Updates UI nodes with the theme color
    //   options: {updateNodes: [{node: <domNode>, styleProp: <style prop like 'background-color'>}]}
    //
    constructor: function (options) {
      this._theme = options.theme;
      this._styleName = options.stylename;
      this.getStyleColor(this._styleName);
      this._options = options;
      this.ph = options.ph;
      this.w = options.w;
    },

    setStyle: function (styleName) {
      this._styleName = styleName;
      this.getStyleColor(this._styleName);
    },

    getStyleColor: function () {
      setTimeout(lang.hitch(this, function () {
        var bc = this.w.getComputedStyle(this.ph, null).getPropertyValue('background-color');
        this._styleColor = Color.fromRgb(bc).toHex();
      }), 500);
    },

    updateUI: function (_styleColor) {
      if (_styleColor) {
        array.forEach(this._options.updateNodes, function (un) {
          domStyle.set(un.node, un.styleProp, _styleColor);
        });
      }
    }
  });

  return themeColorManager;
});
