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
  'dojo/_base/html',
  'jimu/utils',
  'dojo/keys'
  //"dijit/a11yclick",
],
  function (lang, on, html, jimuUtils, keys/*, a11yclick*/) {
    var mo = {};

    mo.a11y_init = function () {
      html.setAttr(this.domNode, 'aria-label', this.nls._widgetLabel);
      //_controllerDiv must be the first focusable node, so keyboard will trigger it when enter widgetDom
      // html.setAttr(this.overviewMapDijit._focusDiv, "tabindex", 0);
      html.setAttr(this.overviewMapDijit._controllerDiv, "tabindex", 0);
      html.setAttr(this.overviewMapDijit._maximizerDiv, "tabindex", 0);
      jimuUtils.initFirstFocusNode(this.domNode, this.overviewMapDijit._controllerDiv);
      jimuUtils.initLastFocusNode(this.domNode, this.overviewMapDijit._maximizerDiv);
    };

    mo.a11y_initEvents = function () {
      this._openedBy508Enter = false;
      this._closedBy508Controller = false;
      this._initToShow = !!(this.config.overviewMap.visible);

      this.own(on(this.domNode, 'keydown', lang.hitch(this, function (evt) {
        var target = evt.target;
        if (false === this._initToShow && evt.keyCode === keys.ENTER && html.hasClass(target, this.baseClass)) {
          this._openedBy508Enter = true;
        }

        //remove these events when esri/overviewMap dijit supports 508
        //dijit's first node and last node are not in normal order by dom-structure
        if (evt.keyCode === keys.TAB && !html.hasClass(target, this.baseClass)) {
          evt.preventDefault();
          if (html.hasClass(target, 'ovwController')) {
            this.overviewMapDijit._maximizerDiv.focus();
          } else if (html.hasClass(target, 'ovwMaximizer')) {
            this.overviewMapDijit._controllerDiv.focus();
          }
        }
      })));

      this.own(on(this.domNode, 'focus', lang.hitch(this, function () {
        if (true === this._closedBy508Controller) {
          //this._closedBy508Controller = false;
          return;
        }

        if (false === this._initToShow && jimuUtils.isInNavMode() && !this._openedBy508Enter &&
          html.getStyle(this.domNode, 'height') < 10) {
          this.overviewMapDijit.show(); //show widget temporarily
        }
      })));

      this.own(on(this.domNode, 'blur', lang.hitch(this, function () {
        if (false === this._initToShow && jimuUtils.isInNavMode() && !this._openedBy508Enter) {
          setTimeout(lang.hitch(this, function () {
            var focusNode = document.activeElement;
            if (!html.isDescendant(focusNode, this.domNode)) {
              this.overviewMapDijit.hide(); //hide widget
            }
          }), 10);//wait for dom update
        }
      })));

      //remove these events when esri/overviewMap dijit supports 508
      this.own(on(this.overviewMapDijit._controllerDiv, 'keydown', lang.hitch(this, function (evt) {
        if (evt.keyCode === keys.ENTER) {
          if (this.overviewMapDijit.visible) {
            this.overviewMapDijit.hide();
            //back to focus and display widgetDom temperly when set it closed.
            this._openedBy508Enter = false;

            this._closedBy508Controller = true;//skip out the focus
            this.domNode.focus();
          } else {
            this.overviewMapDijit.show();

            if (false === this._initToShow){
              this._openedBy508Enter = true;
              this._closedBy508Controller = false;
            }
          }
        }
      })));

      this.own(on(this.overviewMapDijit._maximizerDiv, 'keydown', lang.hitch(this, function (evt) {
        if (evt.keyCode === keys.ENTER) {
          this.overviewMapDijit._maximizeHandler();
        }
      })));
    };

    return mo;
  });