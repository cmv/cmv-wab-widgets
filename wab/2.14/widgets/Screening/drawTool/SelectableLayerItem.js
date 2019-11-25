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
  'dojo/_base/declare',
  'dojo/_base/html',
  'dojo/_base/lang',
  'dojo/_base/event',
  'dojo/on',
  'dojo/Evented',
  'dijit/_WidgetBase',
  'dijit/_TemplatedMixin',
  'dijit/_WidgetsInTemplateMixin',
  'dojo/text!./SelectableLayerItem.html',
  'dojo/dom-attr',
  'dojo/keys'
], function (
  declare,
  html,
  lang,
  Event,
  on,
  Evented,
  _WidgetBase,
  _TemplatedMixin,
  _WidgetsInTemplateMixin,
  template,
  domAttr,
  keys
) {
  return declare([_WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin, Evented], {
    baseClass: 'jimu-widget-screening-selectable-layer-item',
    templateString: template,

    layerName: 'layer',
    layerVisible: true,
    checked: false,

    constructor: function (options) {
      this.layerName = 'layer';
      this.layerVisible = true;
      this.checked = false;
      lang.mixin(this, options);
    },

    postCreate: function () {
      this.inherited(arguments);
    },

    init: function (layerObject) {
      this.featureLayer = layerObject;
      this.layerName = this.layerInfo.title || 'layer';

      this.own(on(this.featureLayer, 'selection-clear', lang.hitch(this, function () {
        html.addClass(this.domNode, 'no-action');
      })));

      this.layerNameNode.innerHTML = this.layerName;
      this.layerNameNode.title = this.layerName;

      html.addClass(this.selectableCheckBox, 'checked');
      domAttr.set(this.selectableCheckBox, "aria-label", this.layerName);
      domAttr.set(this.selectableCheckBox, 'aria-checked', "true");

      this.own(on(this.selectableCheckBox, 'click', lang.hitch(this, function (evt) {
        Event.stop(evt);
        this._toggleChecked(evt);
      })));
      this.own(on(this.selectableCheckBox, 'keydown', lang.hitch(this, function (evt) {
        if (evt.keyCode === keys.ENTER || evt.keyCode === keys.SPACE) {
          Event.stop(evt);
          this._toggleChecked(evt);
        }
        if (evt.keyCode === keys.ESCAPE) {
          if (!this.isSingleTabSelected) {
            Event.stop(evt);
            this.emit("focusLastSelectedTab");
          }
        }
      })));
      this.own(on(this.layerContent, 'click', lang.hitch(this, this._toggleContent)));
    },

    isLayerVisible: function () {
      return this.layerVisible;
    },

    isChecked: function () {
      return this.checked;
    },

    _toggleChecked: function (event) {
      Event.stop(event);
      html.toggleClass(this.selectableCheckBox, 'checked');
      this.checked = html.hasClass(this.selectableCheckBox, 'checked');
      if (this.checked) {
        domAttr.set(this.selectableCheckBox, 'aria-checked', "true");
      } else {
        domAttr.set(this.selectableCheckBox, 'aria-checked', "false");
      }
      this.emit('stateChange', {
        checked: this.checked,
        layerInfo: this.layerInfo
      });
    }
  });
});