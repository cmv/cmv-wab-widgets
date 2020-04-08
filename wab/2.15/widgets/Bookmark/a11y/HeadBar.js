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
  "dijit/a11yclick"
],
  function (lang, on, a11yclick) {
    var mo = {};
    // mo.a11y_removeTabindex = function (dom) {
    //   html.removeAttr(dom, "tabindex");
    // };
    // mo.a11y_setTabindex = function (dom, order) {
    //   html.setAttr(dom, "tabindex", (order || 0));
    // };

    mo.a11y_initEvents = function () {
      this.own(on(this.addBtn, a11yclick, lang.hitch(this, function () {
        this.addingBookmark();
      })));

      this.own(on(this.cardsBtn, a11yclick, lang.hitch(this, function (evt) {
        this._toggleLayoutBtnDisplay("cards");

        if (this._isKeyEvent(evt) && this.listBtn) {
          this.listBtn.focus();//keep focus
        }
      })));
      this.own(on(this.listBtn, a11yclick, lang.hitch(this, function (evt) {
        this._toggleLayoutBtnDisplay("list");

        if (this._isKeyEvent(evt) && this.cardsBtn) {
          this.cardsBtn.focus();//keep focus
        }
      })));
    };

    mo._isKeyEvent = function (evt) {
      if (evt && evt._origType) {//: "keyup"
        return true;
      }

      return false;
    };
    // mo.a11y_focusToBtns = function (btn) {
    //   setTimeout(function () {
    //     btn.focus();//focus after shown
    //   }, 0);
    // };
    // mo.a11y_checkFocus = function () {
    //   setTimeout(lang.hitch(this, function () {
    //     var focusNode = document.activeElement;
    //     if (!html.isDescendant(focusNode, this.domNode)) {
    //       html.removeClass(this.domNode, "a11y_hover");
    //     }
    //   }), 50);//wait for dom update
    // };

    return mo;
  });