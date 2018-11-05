///////////////////////////////////////////////////////////////////////////
// Copyright © 2014 - 2018 Esri. All Rights Reserved.
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

define(['dojo/Evented',
  'dojo/_base/declare',
  'dojo/_base/lang',
  'dijit/_WidgetBase',
  'dijit/_TemplatedMixin',
  "dijit/_WidgetsInTemplateMixin",
  'dojo/on',
  'dojo/query',
  'dojo/_base/html',
  "dojo/text!./MultSelector.html",
  "jimu/dijit/CheckBox",
  "dijit/form/Select",
  "dojox/form/CheckedMultiSelect",
  "dijit/form/ValidationTextBox",
  "xstyle/css!dojox/form/resources/CheckedMultiSelect.css"
],
  function (Evented, declare, lang,
    _WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin,
    on, query, html,
    template) {
    var clazz = declare([_WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin, Evented], {
      templateString: template,
      /*
        config = {
          layerMode
          layer
          defaultLayers
          layerState
        }
      */
      _LAST_VALUEL: "",//esc the Aysc "change" event

      postCreate: function () {
        this.inherited(arguments);
      },

      startup: function () {
        //TODO hack label
        //this._initMultSelectorLabel();
        this.own(on(this.selector, 'click', lang.hitch(this, function (evt) {
          if (evt.target.nodeName === "INPUT") {
            this.selector.dropDownButton.toggleDropDown();
          }
        })));
        this.own(on(this.selector, 'change', lang.hitch(this, function (evt) {
          this._updateMultSelectorLabel(this._getOptionsLabelsByValues(evt));

          if (this._LAST_VALUEL.toString() !== evt.toString()) {
            //re-position the dropDownMeun
            this.selector.dropDownButton.toggleDropDown();
            this.selector.dropDownButton.toggleDropDown();

            this.emit("change", evt);//because the change event is Asyc, so can't disable

            this._LAST_VALUEL = evt;
          }
        })));

        this.inherited(arguments);
      },

      // initOptionsbyLayers: function (layers) {
      //   this._initMultSelectorLabel();

      //   var oldOptions = this.selector.getOptions();
      //   this.selector.removeOption(this.selector.getOptions());

      //   var selectedValue = [];
      //   for (var i = 0, len = layers.length; i < len; i++) {
      //     var option = layers[i];

      //     this.selector.addOption(option);

      //     if (this._hasOptionMultSelected(option, oldOptions)) {
      //       selectedValue.push(option.value);
      //     }
      //   }

      //   this.selector.set("value", selectedValue);//keep selected
      //   this._updateMultSelectorLabel(selectedValue);
      // },

      initOptions: function (options, isKeepSelected) {
        this.disable();
        this._initMultSelectorLabel();

        var oldOptions = null;
        if (isKeepSelected) {
          oldOptions = this.selector.getOptions();
        }

        this.selector.removeOption(this.selector.getOptions());

        var selectedValue = [];
        for (var i = 0, len = options.length; i < len; i++) {
          var option = options[i];

          this.selector.addOption(option);

          if (this._hasOptionMultSelected(option, (isKeepSelected ? oldOptions : options))) {
            selectedValue.push(option.value);//keep selected
          }
        }

        this.selector.set("value", selectedValue);
        this._updateMultSelectorLabel(this._getOptionsLabelsByValues(selectedValue));

        this.enable();
      },

      setOptions: function (options) {
        this.selector.set('options', options);
      },
      getOptions: function () {
        return this.selector.get('options');
      },
      reset: function () {
        this.selector.set("options", [{ value: "", label: "" }]);
        this.selector.reset();
      },

      setValue: function(value){
        this.setConfig(value);
      },
      setConfig: function (config) {
        this._setMultSelectorEmpty();
        this.selector.set("value", config);
      },

      getConfig: function () {
        return this.selector.getValue();
      },

      disable: function () {
        this.selector.set('disabled', true);
        this._DISABLED = true;
      },
      enable: function () {
        this.selector.set('disabled', false);
        this._DISABLED = false;
      },

      //Asyc, so init in initOption
      _initMultSelectorLabel: function () {
        if (this.selector.labelDiv) {
          html.empty(this.selector.labelDiv);
          html.destroy(this.selector.labelDiv);
          this.selector.labelDiv = null;
        }

        var rawLabel = query(".dijitButtonText", this.selector.dropDownButton.buttonNode)[0];
        html.addClass(rawLabel, "hide");

        this.selector.labelDiv = html.create('div', {
          "class": "dijitReset dijitInline dijitButtonText multselector-label-container"
        }, rawLabel, 'after');

        //ui max-height
        html.addClass(this.selector.labelDiv, "label-max-height");
        html.addClass(this.selector.dropDownMenu.domNode,"mult-selector-dropdown-max-height");

        this._updateMultSelectorLabel([this.nls.defaultLayerHolder]);
      },
      _setMultSelectorEmpty: function () {
        this.selector.set("value", []);
        this._updateMultSelectorLabel([this.nls.defaultLayerHolder]);
      },
      _updateMultSelectorLabel: function (array) {
        html.empty(this.selector.labelDiv);

        if (!array || 0 === array.length) {
          this._setMultSelectorEmpty();
        }

        for (var i = 0, len = array.length; i < len; i++) {
          var item = array[i];

          html.create('div', {
            "class": "dijitReset dijitButtonText multselector-label",
            innerHTML: item
          }, this.selector.labelDiv);
        }
      },
      _getOptionsLabelsByValues: function (values) {
        var options = this.getOptions();
        var labels = [];

        for (var i = 0, len = options.length; i < len; i++) {
          var option = options[i];

          for (var j = 0, lenJ = values.length; j < lenJ; j++) {
            var value = values[j];

            if (option.value === value) {
              labels.push(option.label);
            }
          }
        }

        return labels;
      },
      // _resetDefaultLayersOptions: function (layers) {
      //   //can't defaultLayers.set('options', layers); so hack
      //   var oldOptions = this.selector.getOptions();

      //   this.selector.removeOption(this.selector.getOptions())

      //   var selectedValue = [];
      //   for (var i = 0, len = layers.length; i < len; i++) {
      //     var option = layers[i];

      //     this.selector.addOption(option);

      //     if (this._hasOptionMultSelected(option, oldOptions)) {
      //       selectedValue.push(option.value);
      //     }
      //   }

      //   this.selector.set("value", selectedValue);//keep selected
      //   this._updateMultSelectorLabel(selectedValue);
      // },
      _hasOptionMultSelected: function (option, options) {
        for (var i = 0, len = options.length; i < len; i++) {
          var item = options[i];

          if (item.value === option.value && true === item.selected) {
            return true;
          }
        }

        return false;
      }
    });
    return clazz;
  });