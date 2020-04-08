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
  'dojo/_base/lang',
  'dojo/on',
  "dojo/query",
  "dojo/aspect",
  //'dojo/Deferred',
  'dojo/_base/array',
  'dojo/_base/html',
  'jimu/utils',
  'dojo/keys'
  //"dijit/a11yclick",
],
  function (lang, on, query, aspect,/*Deferred, */array, html, jimuUtils, keys/*, a11yclick*/) {
    var mo = {};

    mo.a11y_init = function () {
      html.setAttr(this.domNode, 'aria-label', this.nls._widgetLabel);
    };

    mo.a11y_updateFocusNodes = function (options) {
      if (this._dijitDirections && this._dijitDirections._widgetContainer) {
        //add tabindex for _resultsNode
        var resultLabel = query(".esriResultsSummary", this._dijitDirections._resultsNode);
        if (resultLabel && resultLabel[0]) {
          html.setAttr(resultLabel[0], "tabindex", "0");
          html.setAttr(resultLabel[0], "role", "document");
        }
        //var routeLengthLabel = query(".esriRouteLength", this._dijitDirections._resultsNode);
        //array.forEach(routeLengthLabel, lang.hitch(this, function (node) {
        //html.setAttr(node, "tabindex", "0");
        //}));

        //set and focus firstNode
        var inputs = query("input", this._dijitDirections._widgetContainer);
        array.some(inputs, lang.hitch(this, function (node) {
          if (jimuUtils.isDomFocusable(node)) {
            jimuUtils.initFirstFocusNode(this.domNode, node);
            if (options && options.isFouceToFirstNode) {
              node.focus();
            }
            // this.own(node, "focus",lang.hitch(this, function () {}));
            return true;
          }
        }));

        //set last focusNode
        var isSaveShow = html.getStyle(this._dijitDirections._savePrintBtnContainer, "display");
        if ("none" === isSaveShow) {
          jimuUtils.initLastFocusNode(this.domNode, this._dijitDirections._clearDirectionsButtonNode);//clear btn
        } else {
          var lastItem = null;
          lastItem = query(".esriPrintFooter", this._dijitDirections._resultsNode);
          if (lastItem && lastItem[0]) {
            html.setAttr(lastItem[0], "tabindex", "0");
            lastItem = lastItem[0];//footer of resultNode
          } else {
            var tiems = query('[tabindex $=\"0\"]', this._dijitDirections._resultsNode);
            lastItem = tiems[tiems.length - 1];//last item
          }

          jimuUtils.initLastFocusNode(this.domNode, lastItem);//set last item whitch tabindex=0
        }

        //hack event for [data-blur-on-click] blur
        var bluredBtns = query("[data-blur-on-click]", this._dijitDirections.domNode);
        if (bluredBtns && false === html.hasClass(this._dijitDirections.domNode, "WAB-508")) {
          array.forEach(bluredBtns, lang.hitch(this, function (btn) {
            this.own(on(btn, "keydown", lang.hitch(this, function (evt) {
              if (evt.keyCode === keys.ENTER || evt.keyCode === keys.SPACE) {
                this._delayFocus(evt.target);
              }
            })));
          }));

          //hack mode selector aria-label bug
          this.own(aspect.after(this._dijitDirections._travelModeSelector, "openDropDown",
            lang.hitch(this, function () {
              var items = query(".dijitMenuItem", this._dijitDirections._travelModeSelector.dropDown.domNode);
              array.forEach(items, lang.hitch(this, function (node) {
                html.removeAttr(node, "aria-label");
              }));
            }), this));

          html.addClass(this._dijitDirections.domNode, "WAB-508");
        }
      }
    };

    mo.a11y_initEvents = function () {
      //hack to set focusNode
      if (this._dijitDirections && this._dijitDirections._clearResultsHTML) {
        this.own(aspect.after(this._dijitDirections, "_clearResultsHTML",
          lang.hitch(this, this.a11y_updateFocusNodes), this));
      }
      //hack clearBtn
      this.own(on(this._dijitDirections._clearDirectionsButtonNode, "keydown", lang.hitch(this, function (evt) {
        if (evt.keyCode === keys.ENTER || evt.keyCode === keys.SPACE) {
          setTimeout(lang.hitch(this, function () {
            this._dijitDirections._clearDirectionsButtonNode.focus();
          }), 150);
        }
      })));
    };

    mo.a11y_focusWhenFinish = function () {
      var resultLabel = query(".esriResultsSummary", this._dijitDirections._resultsNode);
      if (resultLabel && resultLabel[0]) {
        this._delayFocus(resultLabel[0]);
      }
    };

    mo._delayFocus = function (dom) {
      setTimeout(lang.hitch(this, function () {
        dom.focus();
      }), 80);
    };

    mo.a11y_hackAttr = function (){
      //hack: leave now
      /*
      html.removeAttr(this._dijitDirections._startTimeButtonNodeContainer ,"tabindex");
      html.removeAttr(this._dijitDirections._startTimeButtonNodeContainer ,"role");

      html.setAttr(this._dijitDirections._startTimeButtonNode,  "tabindex", "0");
      html.setAttr(this._dijitDirections._startTimeButtonNode,  "role", "button");
      */
    };

    return mo;
  });