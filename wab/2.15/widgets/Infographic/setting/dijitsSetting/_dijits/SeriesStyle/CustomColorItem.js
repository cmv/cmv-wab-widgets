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
    'dojo/text!./CustomColorItem.html',
    'dojo/Evented',
    'dijit/_WidgetBase',
    'dijit/_TemplatedMixin',
    'dijit/_WidgetsInTemplateMixin',
    'jimu/dijit/ColorPickerPopup',
    'dojo/_base/Color',
    'jimu/utils',
    'dojo/on',
    'dojo/_base/lang',
    'dojo/_base/html',
    'dijit/form/ValidationTextBox'
  ],
  function(declare, templateString, Evented, _WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin,
    ColorPickerPopup, Color, jimuUtils, on, lang, html) {
    return declare([_WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin, Evented], {
      baseClass: 'infographic-custom-color-item',
      templateString: templateString,
      deletable: true,
      numberType: false,
      labelVisible: true,
      // option
      // numberType,
      // deletable
      // labelVisible

      // config
      // id
      // text
      // label
      // color
      postCreate: function() {
        this.inherited(arguments);
        this._ignoreEvent();
        this._initDom();
        this._updateNodesDisplay();
        this._initEvents();
        this._careEvent();
      },

      // startup: function () {
      //   this.inherited(arguments);
      //   if (this.config) {
      //     if (typeof this.config.uniqueID !== 'undefined') {
      //       this.uniqueID = this.config.uniqueID;
      //     } else {
      //       this.uniqueID = jimuUtils.getRandomString();
      //     }
      //   } else {
      //     this.uniqueID = jimuUtils.getRandomString();
      //   }
      //   html.setAttr(this.domNode, "data-id", this.uniqueID);
      //   this.setConfig(this.config);
      // },

      setConfig: function(config) {
        if (!config || typeof config.id === 'undefined') {
          return;
        }
        this._ignoreEvent();
        this.itemId = config.id;
        if (config.color) {
          this.colorPicker.setColor(new Color(config.color));
        }
        if (typeof config.text !== 'undefined') {
          this.textDiv.innerHTML = config.text;
          this.textDiv.title = config.text;
        }
        if (typeof config.label !== 'undefined') {
          this.labelDiv.innerHTML = config.label;
          this.editInput.set('value', config.label);
        }
        this._careEvent();
      },

      _ignoreEvent: function() {
        this.ignoreChangeEvents = true;
      },

      _careEvent: function() {
        this.ignoreChangeEvents = false;
      },

      setColor: function(color) {
        this.colorPicker.setColor(new Color(color));
      },

      setNumberType: function(numberType) {
        this.numberType = numberType;
      },

      lestenDocumentMousemove: function() {
        this._shouldCareMousemove = true;
      },

      _initDom: function() {
        this.colorPicker = new ColorPickerPopup({
          appearance: {
            showTransparent: false,
            showColorPalette: true,
            showCoustom: true,
            showCoustomRecord: true
          }
        });
        this.colorPicker.placeAt(this.colorDiv);
        this.colorPicker.startup();
        this.colorPicker.setColor(new Color('#68D2E0'));
      },

      _initEvents: function() {
        this.own(on(this.colorPicker, 'change', lang.hitch(this, function() {
          this.onChange();
        })));
        this.own(on(document.body, 'click', lang.hitch(this, function(e) {
          var target = e.target;
          var a = html.isDescendant(target, this.editPart);
          if (!a) {
            this._hideEditInput();
          }
        })));
        this._hasHideEditInput = true;
      },

      isValid: function() {
        var label = this.labelDiv.innerHTML;
        var text = this.textDiv.innerHTML.trim();
        return typeof this.itemId !== 'undefined' && !!label && !!text && this.editInput.isValid();
      },

      getConfig: function() {
        return this.isValid() ? {
          id: this.numberType ? Number(this.itemId) : this.itemId,
          text: this.textDiv.innerHTML.trim(),
          label: this.labelDiv.innerHTML,
          color: this._getColor()
        } : undefined;
      },

      _getColor: function() {
        var color = this.colorPicker.getColor();
        return (color && color.toHex) ? color.toHex() : color;
      },

      onChange: function() {
        if (this.ignoreChangeEvents) {
          return;
        }
        var config = this.getConfig();
        if (config) {
          this.emit('change', config);
        }
      },

      destroy: function() {
        if (this.colorPicker) {
          this.colorPicker.destroy();
        }
        this.inherited(arguments);
      },

      highLight: function() {
        if (!html.hasClass(this.domNode, 'high-light')) {
          html.addClass(this.domNode, 'high-light');
        }
        setTimeout(function() {
          this._removeHighLight();
        }.bind(this), 2000);
      },

      _removeHighLight: function() {
        if (!this.domNode) {
          return;
        }
        if (html.hasClass(this.domNode, 'high-light')) {
          html.removeClass(this.domNode, 'high-light');
        }
      },

      _onEditClicked: function(event) {
        if (event && event.stopPropagation) {
          event.stopPropagation();
        }
        var text = this.labelDiv.innerHTML;
        this._showEditInput();
        this.editInput.set('value', text);
        this.editInput.focus();
      },

      _showEditInput: function() {
        if (this._hasHideEditInput) {
          this._hideLabelPart();
          this._showEditPart();
          this._hasHideEditInput = false;
        }
      },

      _hideEditInput: function() {
        if (!this._hasHideEditInput && this.editInput.isValid()) {
          this._hideEditPart();
          this._showLabelPart();
          this._hasHideEditInput = true;
        }
      },

      _onEditInputBlured: function() {
        var text = this.editInput.get('value');
        text = jimuUtils.stripHTML(text);
        this._hideEditInput();
        if (this.labelDiv.innerHTML !== text) {
          this.labelDiv.innerHTML = text;
          this.onChange();
        }
      },

      _onEditCancled: function(event) {
        if (event && event.stopPropagation) {
          event.stopPropagation();
        }
        this._hideEditPart();
        this._showLabelPart();
      },

      _onDeleteClick: function(event) {
        if (event && event.stopPropagation) {
          event.stopPropagation();
        }
        this.emit('delete', this.itemId);
        this.destroy();
      },

      _updateNodesDisplay: function() {
        this.updateDeletabe(this.deletable);
        this.updateLabelDisplay(this.labelVisible);
      },

      updateDeletabe: function(deletable) {
        this.deletable = deletable;
        if (this.deletable) {
          this._showDeleteButton();
        } else {
          this._hideDeleteButton();
        }
      },

      updateLabelDisplay: function(labelVisible) {
        this.labelVisible = labelVisible;
        if (this.labelVisible) {
          this._showLabelContainer();
        } else {
          this._hideLabelContainer();
        }
      },

      _showDeleteButton: function() {
        html.removeClass(this.deleteBtn, 'hidden');
      },

      _hideDeleteButton: function() {
        html.addClass(this.deleteBtn, 'hidden');
      },

      _hideLabelContainer: function() {
        html.addClass(this.labelContainer, 'hidden');
      },

      _showLabelContainer: function() {
        html.removeClass(this.labelContainer, 'hidden');
      },

      _showLabelPart: function() {
        html.removeClass(this.labelPart, 'hide');
      },

      _hideLabelPart: function() {
        html.addClass(this.labelPart, 'hide');
      },

      _showEditPart: function() {
        html.removeClass(this.editPart, 'hide');
      },

      _hideEditPart: function() {
        html.addClass(this.editPart, 'hide');
      }

    });
  });