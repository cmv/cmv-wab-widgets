///////////////////////////////////////////////////////////////////////////
// Copyright © Esri. All Rights Reserved.
//
// Licensed under the Apache License Version 2.0 (the 'License');
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//    http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an 'AS IS' BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.
///////////////////////////////////////////////////////////////////////////

define([
  "dojo/_base/declare",
  "jimu/BaseWidget",
  "dijit/_WidgetsInTemplateMixin",
  "dojo/text!./XYInput.html",
  "dojo/on",
  "dojo/_base/lang",
  "dojo/Evented",
  "esri/geometry/Point",
  'dojo/keys',
  'jimu/utils',
  'dojo/dom-attr',
  'dojo/dom-class',
  "dijit/form/ValidationTextBox"
], function (
  declare,
  BaseWidget,
  _WidgetsInTemplateMixin,
  XYInputTemplate,
  on,
  lang,
  Evented,
  Point,
  keys,
  jimuUtils,
  domAttr,
  domClass
) {
  return declare([BaseWidget, _WidgetsInTemplateMixin, Evented], {
    baseClass: "jimu-widget-ParcelDrafter-XYInput",
    templateString: XYInputTemplate,

    constructor: function (options) {
      lang.mixin(this, options);
    },

    postCreate: function () {
      this.inherited(arguments);
      this.spatialReference = this.map.getLayer(this.config.polygonLayer.id).spatialReference;

      this.xRowWrapper.title = this.nls.xyInput.explanation;
      this.yRowWrapper.title = this.nls.xyInput.explanation;
      //code for accessibility
      domAttr.set(this.newTraverseX, "aria-label", "x" + this.xRowWrapper.title);
      domAttr.set(this.newTraverseY, "aria-label", "y" + this.yRowWrapper.title);

      this.own(on(this.newTraverseX, "change",
        lang.hitch(this, function () {
          this._onTextBoxValueChanged();
        })));
      this.own(on(this.newTraverseY, "change",
        lang.hitch(this, function () {
          this._onTextBoxValueChanged();
        })));

      this.own(on(this.xyStartButton, "click", lang.hitch(this, function () {
        if (!domClass.contains(this.xyStartButton, 'jimu-state-disabled')) {
          var x = this.newTraverseX.value;
          var y = this.newTraverseY.value;
          this.emit("newPoint", this.project(x, y));
        }
      })));

      //code for accessibility
      this.own(on(this.xyStartButton, "keydown", lang.hitch(this, function (evt) {
        if (evt.keyCode === keys.ENTER || evt.keyCode === keys.SPACE) {
          if (!domClass.contains(this.xyStartButton, 'jimu-state-disabled')) {
            var x = this.newTraverseX.value;
            var y = this.newTraverseY.value;
            this.emit("newPoint", this.project(x, y));
          }
        }
      })));
    },

    // takes input x and y and creates a point object in the target Spatial Reference
    project: function (x, y) {
      return new Point(x, y, this.spatialReference);
    },

    /**
     * This function is used to set update last focus node
     * code for accessibility
     * @memberOf widgets/ParcelDrafter/XYInput
     */
    _updateLastFocusNode: function () {
      if (!domClass.contains(this.xyStartButton, 'jimu-state-disabled')) {
        domClass.remove(this.xyStartButton, 'jimu-state-disabled');
        domAttr.set(this.xyStartButton, "tabIndex", "0");
        jimuUtils.initLastFocusNode(this.widgetDomNode, this.xyStartButton);
      } else {
        domClass.add(this.xyStartButton, 'jimu-state-disabled');
        domAttr.set(this.xyStartButton, "tabIndex", "-1");
        jimuUtils.initLastFocusNode(this.widgetDomNode, this.newTraverseY.domNode);
      }
    },

    /**
     * This function is used to enable/disable "Start New Traverse" button depending upon the value of
     * x & y text boxes.
     * @memberOf widgets/ParcelDrafter/XYInput
     */
    _onTextBoxValueChanged: function () {
      if ((this.newTraverseX.isValid()) && (this.newTraverseY.isValid())) { // valid x & y text boxes
        domClass.remove(this.xyStartButton, 'jimu-state-disabled'); // enable "Start New Traverse" button
      } else {
        domClass.add(this.xyStartButton, 'jimu-state-disabled'); // disable "Start New Traverse" button
      }
      this._updateLastFocusNode();
    },

    /**
     * This function is used to clear x and y value after click on start new traverse button
     * @memberOf widgets/ParcelDrafter/XYInput
     */
    resetXYTextBoxes: function () {
      this.newTraverseX.reset();
      this.newTraverseY.reset();
    }
  });
});