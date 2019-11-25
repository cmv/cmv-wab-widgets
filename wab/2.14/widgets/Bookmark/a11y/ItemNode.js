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
  'dojo/keys'
],
  function (lang, on, html, keys) {
    var mo = {};

    mo.a11y_removeTabindex = function (dom) {
      html.removeAttr(dom, "tabindex");
    };
    mo.a11y_setTabindex = function (dom, order) {
      html.setAttr(dom, "tabindex", (order || 0));
    };

    mo.a11y_display = function () {
      //a11y
      if (this.a11y) {
        if (false === this.a11y.selectedBtn) {
          this.a11y_removeTabindex(this.selectedBtn);
        }
        if (false === this.a11y.editBtn) {
          this.a11y_removeTabindex(this.editBtn);
        }
        if (false === this.a11y.deleteBtn) {
          this.a11y_removeTabindex(this.deleteBtn);
        }
        if (false === this.a11y.renameBtn) {
          this.a11y_removeTabindex(this.renameBtn);
        }
        if (false === this.a11y.changeImgBtn) {
          this.a11y_removeTabindex(this.changeImgBtn);
        }
      }
    };

    mo.a11y_updateItemLabel = function(tips){
      html.setAttr(this.domNode, 'aria-label', tips);
    };

    mo.a11y_initEvents = function () {
      this.own(on(this.domNode, 'keydown', lang.hitch(this, function (evt) {
        var target = evt.target;
        var isParentNodeDom = html.hasClass(target, "jimu-img-node");
        if (evt.keyCode === keys.ENTER && isParentNodeDom) {
          this.onNodeBoxClick();
        }

        this.a11y_checkFocus();
      })));

      this.own(on(this.domNode, 'mouseout', lang.hitch(this, function (/*evt*/) {
        html.removeClass(this.domNode, "a11y_hover");
      })));

      //fake hover for ui
      this.own(on(this.domNode, 'focus', lang.hitch(this, function (/*evt*/) {
        html.addClass(this.domNode, "a11y_hover");
      })));
    };

    mo.a11y_focusToLabel = function (label) {
      setTimeout(function () {
        label.focus();//focus after shown
      }, 0);
    };
    mo.a11y_focusToBtns = function (btn) {
      setTimeout(function () {
        btn.focus();//focus after shown
      }, 0);
    };
    mo.a11y_checkFocus = function () {
      setTimeout(lang.hitch(this, function () {
        var focusNode = document.activeElement;
        if (!html.isDescendant(focusNode, this.domNode)) {
          html.removeClass(this.domNode, "a11y_hover");
        }
      }), 50);//wait for dom update
    };

    return mo;
  });