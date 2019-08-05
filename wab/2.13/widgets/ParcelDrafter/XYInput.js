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
  "dijit/form/ValidationTextBox"
],
  function (
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
    domAttr
  ) {
    return declare([BaseWidget, _WidgetsInTemplateMixin, Evented], {
      baseClass: "jimu-widget-ParcelDrafter-XYInput",
      templateString: XYInputTemplate,

      constructor: function (options) {
        lang.mixin(this, options);
      },

      postCreate: function () {
        this.inherited(arguments);
        this.spatialReference =  this.map.getLayer(this.config.polygonLayer.id).spatialReference;

        this.xRowWrapper.title = this.nls.xyInput.explanation + " (" + this.spatialReference.latestWkid + ")";
        this.yRowWrapper.title = this.nls.xyInput.explanation + " (" + this.spatialReference.latestWkid + ")";
        //code for accessibility
        domAttr.set(this.newTraverseX, "aria-label", "x" + this.xRowWrapper.title);
        domAttr.set(this.newTraverseY, "aria-label", "y" + this.yRowWrapper.title);
        this.own(on(this.xyStartButton, "click", lang.hitch(this, function() {
          var x = this.newTraverseX.value;
          var y = this.newTraverseY.value;
          this.emit("newPoint", this.project(x, y));
        })));

        //code for accessibility
        this.own(on(this.xyStartButton, "keydown", lang.hitch(this, function (evt) {
          if (evt.keyCode === keys.ENTER || evt.keyCode === keys.SPACE) {
            var x = this.newTraverseX.value;
            var y = this.newTraverseY.value;
            this.emit("newPoint", this.project(x, y));
          }
        })));
      },

      // takes input x and y and creates a point object in the target Spatial Reference
      project: function(x, y) {
        return new Point(x, y, this.spatialReference);
      },

      /**
       * This function is used to set xyStartButton as last focus node
       * code for accessibility
       * @memberOf widgets/ParcelDrafter/XYInput
       */
      setXyStartButtonAsLastNode: function () {
        jimuUtils.initLastFocusNode(this.widgetDomNode, this.xyStartButton);
      }
    });
  });
