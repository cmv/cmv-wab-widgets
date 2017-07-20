/**
 *  @fileOverview The GridOverlay Settings widget
 *  @author Esri
 *
 *  @todo Add and cleanup the code comments (including JSDoc comments)
 *  @todo Revisit all getters/setters for latest GridOverlay logic
 */

///////////////////////////////////////////////////////////////////////////
// Copyright © 2014 Esri. All Rights Reserved.
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
  'dojo/_base/declare',
  'dojo/dom-class',
  'jimu/BaseWidgetSetting',
  'dojo/_base/lang',
  'dijit/_WidgetsInTemplateMixin',
  'dojo/_base/Color',
  '../lib/GridOverlay',
  'esri/map',
  'dijit/form/HorizontalSlider',
  'dijit/ColorPalette',
  'dijit/form/NumberSpinner',
  'jimu/dijit/ColorPicker'
],
function(
  declare,
  domClass,
  BaseWidgetSetting,
  lang,
  _WidgetsInTemplateMixin,
  Color,
  GridOverlay,
  Map
) {

  var setColorText = function(domNode, color) {
    if (!(color instanceof Color)) {
      color = new Color(color);
    }
    var text = color.toHex();
    var textColor = (0.2126 * color.r + 0.7152 * color.g + 0.0722 * color.b) > 128 ?
      new Color([0,0,0]) :
      new Color([255,255,255]);
    //var height = domGeometry.position(domNode).h + 'px';
    var style = 'color:' + textColor + ';';
    var domNodeClass = 'grid-overlay-setting-color-picker-text';
    domNode.innerHTML = "<div class='" + domNodeClass + "' style='" +
      style + "'>" + text + "</div>";
  };

  var setDefaultFontSize = function(fontCtrl, gridCtrl, fontIndex, val) {
    if (isNaN(val)) {
      fontCtrl.value = 5;
      fontCtrl.setDisplayedValue(5);
    } else {
      if (val > 4 && val < 73) {
        gridCtrl.setFontSize(fontIndex, val);
      }
    }
  };

  var setDefaultLineWidth = function(lineCtrl, gridCtrl, lineIndex, val) {
    if (isNaN(val)) {
      lineCtrl.value = 1;
      lineCtrl.setDisplayedValue(1);
    } else {
      if (val > 0 && val < 11) {
        gridCtrl.setLineWidth(lineIndex, val);
      }
    }
  };

  return declare([BaseWidgetSetting, _WidgetsInTemplateMixin], {
    baseClass: 'grid-overlay-setting',
    verticalLabelsClicked: false,
    horizontalLabelsClicked: false,
    upperLeftClicked: false,
    upperRightClicked: false,
    lowerLeftClicked: false,
    lowerRightClicked: false,
    centerClicked: false,

    postCreate: function(){
      //the config object is passed in
      this.setConfig(this.config);

      var map = new Map(this.sampleMap,{
        basemap: 'satellite',
        center: [-96.01118799999999,41.32155100080983],
        zoom: 9
      });
      var self = this;
      var grid = new GridOverlay(lang.mixin({map:map, enabled: true}, this.config));
      this.sampleGrid = grid;
      this.minIntervalSpacing.onChange = lang.hitch(this, function(val) {
        var width = val + 'px';
        this.minIntervalSpacingVal.innerHTML = width;
        // this.minIntervalDisplay.style.width = width;
        grid.setMinIntervalSpacing(val);
      });
      this.lineOpacity.onChange = lang.hitch(this, function(val) {
        this.lineOpacityVal.innerHTML = Math.round(val * 100) + '%';
        grid.setLineOpacity(val);
      });
      this.labelOpacity.onChange = lang.hitch(this, function(val) {
        this.labelOpacityVal.innerHTML = Math.round(val * 100) + '%';
        grid.setLabelOpacity(val);
      });
      this.colorPicker0.onChange = function(val) {
        setColorText(this.domNode, val);
        grid.setColor(0, val.toHex());
      };
      this.colorPicker1.onChange = function(val) {
        setColorText(this.domNode, val);
        grid.setColor(1, val.toHex());
      };
      this.colorPicker2.onChange = function(val) {
        setColorText(this.domNode, val);
        grid.setColor(2, val.toHex());
      };
      this.colorPicker3.onChange = function(val) {
        setColorText(this.domNode, val);
        grid.setColor(3, val.toHex());
      };
      this.colorPicker4.onChange = function(val) {
        setColorText(this.domNode, val);
        grid.setColor(4, val.toHex());
      };
      this.colorPicker5.onChange = function(val) {
        setColorText(this.domNode, val);
        grid.setColor(5, val.toHex());
      };
      this.fontSize0.onChange = function(val) {
        setDefaultFontSize(this, grid, 0, val);
      };
      this.fontSize1.onChange = function(val) {
        setDefaultFontSize(this, grid, 1, val);
      };
      this.fontSize2.onChange = function(val) {
        setDefaultFontSize(this, grid, 2, val);
      };
      this.fontSize3.onChange = function(val) {
        setDefaultFontSize(this, grid, 3, val);
      };
      this.fontSize4.onChange = function(val) {
        setDefaultFontSize(this, grid, 4, val);
      };
      this.fontSize5.onChange = function(val) {
        setDefaultFontSize(this, grid, 5, val);
      };
      this.lineSize0.onChange = function(val) {
        setDefaultLineWidth(this, grid, 0, val);
      };
      this.lineSize1.onChange = function(val) {
        setDefaultLineWidth(this, grid, 1, val);
      };
      this.lineSize2.onChange = function(val) {
        setDefaultLineWidth(this, grid, 2, val);
      };
      this.lineSize3.onChange = function(val) {
        setDefaultLineWidth(this, grid, 3, val);
      };
      this.lineSize4.onChange = function(val) {
        setDefaultLineWidth(this, grid, 4, val);
      };
      this.lineSize5.onChange = function(val) {
        setDefaultLineWidth(this, grid, 5, val);
      };
      this.topLeft.onclick = function() {
        self.upperLeftClicked = !self.upperLeftClicked;
        self._toggleLabelPlacement(self.topLeft, self.upperLeftClicked);
        grid.setLabelPlacement('upper-left', self.upperLeftClicked);
      };
      this.topRight.onclick = function() {
        self.upperRightClicked = !self.upperRightClicked;
        self._toggleLabelPlacement(self.topRight, self.upperRightClicked);
        grid.setLabelPlacement('upper-right', self.upperRightClicked);
      };
      this.btmLeft.onclick = function() {
        self.lowerLeftClicked = !self.lowerLeftClicked;
        self._toggleLabelPlacement(self.btmLeft, self.lowerLeftClicked);
        grid.setLabelPlacement('lower-left', self.lowerLeftClicked);
      };
      this.btmRight.onclick = function() {
        self.lowerRightClicked = !self.lowerRightClicked;
        self._toggleLabelPlacement(self.btmRight, self.lowerRightClicked);
        grid.setLabelPlacement('lower-right', self.lowerRightClicked);
      };
      this.center.onclick = function() {
        self.centerClicked = !self.centerClicked;
        self._toggleLabelPlacement(self.center, self.centerClicked);
        grid.setLabelPlacement('center', self.centerClicked);
      };
      this.verticalLabels.onclick = function() {
        self.verticalLabelsClicked = true;
        self.horizontalLabelsClicked = false;
        self._toggleHorzVertOptions(false);
        grid.setVerticalLabels(self.verticalLabelsClicked);
      };
      this.horizontalLabels.onclick = function() {
        self.verticalLabelsClicked = false;
        self.horizontalLabelsClicked = true;
        self._toggleHorzVertOptions(true);
        grid.setVerticalLabels(!self.horizontalLabelsClicked);
      };
    },

    setConfig: function(){
      this.minIntervalSpacing.set('value', this.config.minIntervalSpacing);
      this.minIntervalSpacingVal.innerHTML = this.config.minIntervalSpacing + 'px';
      // this.minIntervalDisplay.style.width = this.config.minIntervalSpacing + 'px';
      this.lineOpacity.set('value', this.config.lineOpacity);
      this.lineOpacityVal.innerHTML = Math.round(this.config.lineOpacity * 100) + '%';
      this.labelOpacity.set('value', this.config.labelOpacity);
      this.labelOpacityVal.innerHTML = Math.round(this.config.labelOpacity * 100) + '%';
      // this.centerLabelOpacity.set('value', this.config.centerLabelOpacity);
      // this.centerLabelOpacityVal.innerHTML = Math.round(this.config.centerLabelOpacity * 100) + '%';
      for (var i = 0; i < 6; i++) {
        this['colorPicker' + i].setColor(new Color(this.config.colors[i]));
        this['colorPicker' + i].picker.setColor(this.config.colors[i]);
        setColorText(this['colorPicker' + i].domNode, this.config.colors[i]);
      }
      this.fontSize0.setValue(this.config.fontSizes[0]);
      this.fontSize1.setValue(this.config.fontSizes[1]);
      this.fontSize2.setValue(this.config.fontSizes[2]);
      this.fontSize3.setValue(this.config.fontSizes[3]);
      this.fontSize4.setValue(this.config.fontSizes[4]);
      this.fontSize5.setValue(this.config.fontSizes[5]);
      this.lineSize0.setValue(this.config.lineWidths[0]);
      this.lineSize1.setValue(this.config.lineWidths[1]);
      this.lineSize2.setValue(this.config.lineWidths[2]);
      this.lineSize3.setValue(this.config.lineWidths[3]);
      this.lineSize4.setValue(this.config.lineWidths[4]);
      this.lineSize5.setValue(this.config.lineWidths[5]);

      var corners = this.config.labelPlacement;
      this.upperLeftClicked = corners.upperLeft;
      if (corners.upperLeft) {
        this._toggleLabelPlacement(this.topLeft, corners.upperLeft);
      }
      this.upperRightClicked = corners.upperRight;
      if (corners.upperRight) {
        this._toggleLabelPlacement(this.topRight, corners.upperRight);
      }
      this.lowerLeftClicked = corners.lowerLeft;
      if (corners.lowerLeft) {
        this._toggleLabelPlacement(this.btmLeft, corners.lowerLeft);
      }
      this.lowerRightClicked = corners.lowerRight;
      if (corners.lowerRight) {
        this._toggleLabelPlacement(this.btmRight, corners.lowerRight);
      }
      this.centerClicked = corners.center;
      if (corners.center) {
        this._toggleLabelPlacement(this.center, corners.center);
      }

      this._toggleHorzVertOptions(!this.config.verticalLabels);
    },

    getConfig: function(){
      //WAB will get config object through this method
      this.config = this.sampleGrid.getSettings();
      return this.config;
    },

    _toggleHorzVertOptions: function(isHorizontal) {
      //horizontal
      if (isHorizontal) {
        //Make horizontal div active
        domClass.remove(this.horizontalLabels, "image-labels horizontalLabel");
        domClass.add(this.horizontalLabels, "image-labels horizontalLabelClicked");
        //Make vertical div inactive
        domClass.remove(this.verticalLabels, "image-labels verticalLabelClicked");
        domClass.add(this.verticalLabels, "image-labels verticalLabel");
      } else {
        //Make horizontal div inactive
        domClass.remove(this.horizontalLabels, "image-labels horizontalLabelClicked");
        domClass.add(this.horizontalLabels, "image-labels horizontalLabel");
        //Make vertical div active
        domClass.remove(this.verticalLabels, "image-labels verticalLabel");
        domClass.add(this.verticalLabels, "image-labels verticalLabelClicked");
      }
    },

    _toggleLabelPlacement: function(ctrl, enabled) {
      if (ctrl) {
        var ctrlClass = ctrl.className.replace("image-labels", "").trim();
        if (enabled) {
          //Make ctrl div active
          domClass.remove(ctrl, "image-labels " + ctrlClass);
          domClass.add(ctrl, "image-labels " + ctrlClass + "Clicked");
        } else {
          //Make ctrl div inactive
          var origClassName = ctrlClass.substring(0,ctrlClass.indexOf("Clicked"));
          domClass.remove(ctrl, "image-labels " + ctrlClass);
          domClass.add(ctrl, "image-labels " + origClassName);
        }
      }
    }
  });
});
