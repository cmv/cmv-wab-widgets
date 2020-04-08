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
    'dojo/_base/declare',
    'dojo/_base/array',
    'dojo/_base/html',
    'dojo/on',
    'dojo/dom',
    'dojo/keys',
    './ColorPickerEditor',
    'jimu/BaseWidget',
    'dijit/_WidgetsInTemplateMixin',
    'dojo/text!../templates/ThreatAnalysisSettings.html',
    'dojo/_base/lang',
    'dojo/Evented',
    'dojo/dom-class',
    'dojo/query',
    'dojo/dom-attr',
    'dijit/registry',
    'dijit/focus',
    'jimu/utils',
    'jimu/dijit/formSelect',
    'jimu/dijit/SymbolChooser'
  ],
  function (
    declare,
    array,
    html,
    on,
    dom,
    keys,
    ColorPickerEditor,
    BaseWidget,
    _WidgetsInTemplateMixin,
    SettingsTemplate,
    lang,
    Evented,
    domClass,
    query,
    domAttr,
    dijitRegistry,
    focusUtils,
    jimuUtils
  ) {
    return declare([BaseWidget, _WidgetsInTemplateMixin, Evented], {
      baseClass: 'jimu-widget-threatAnalysisSetting',
      templateString: SettingsTemplate,
      selectedSettings: {}, //Holds selected Settings
      colorPickerNodes: [], //Holds an array of color pickers populated at start up

      constructor: function (options) {
        lang.mixin(this, options);
      },

      //Load all the options on startup
      startup: function () {

        this.colorPickerNodes = query('.colorPicker', this.domNode);

        array.forEach(this.colorPickerNodes, lang.hitch(this, function (node) {
          node = new ColorPickerEditor({
            nls: this.nls,
            type: domClass.contains(node, 'Line') ? 'line' : 'fill'
          }, node);
          this.own(node.on("ColorPickerEditorChanged", lang.hitch(this, function () {
            this.onSettingsChanged();
          })));
          node.setValues({
            "color": this.config.threatAnalysis.symbology[node.id].color,
            "transparency": this.config.threatAnalysis.symbology[node.id].transparency
          });
          node.startup();
          node.dropdown.set('value', this.config.threatAnalysis.symbology[node.id].type);
        }));

        // Code for Accessibility: keydown for color picker
        var colorPickerDOMNodes = query('.jimu-color-pickerPopup', this.domNode);
        array.forEach(colorPickerDOMNodes, lang.hitch(this, function (node) {
          this.own(on(node, 'keydown', lang.hitch(this, function (event) {
            if (event.keyCode === keys.ENTER || event.keyCode === keys.SPACE) {
              event.currentTarget.click();
            }
          })));
        }));
        //send by default updated parameters
        this.onSettingsChanged();
      },

      postCreate: function () {
        this.inherited(arguments);
        //set class to main container
        domClass.add(this.domNode, "SettingsContainer FullWidth");
        this._handleClickEvents();
      },

      /**
       * Handle click events for different controls
       * @memberOf widgets/ThreatAnalysis/Widget
       **/
      _handleClickEvents: function () {
        //handle Mandatory Evacuation Distance button clicked
        this.own(on(this.mandatorySettingsButton, "click", lang.hitch(this, function () {
          this._openCloseNodes(this.mandatorySettingsButton, this.mandatoryContainer);
        })));
        //handle Mandatory Evacuation Distance button keydown for accessibility
        this.own(on(this.mandatorySettingsButton, "keydown", lang.hitch(this, function (evt) {
          if (evt.keyCode === keys.ENTER || evt.keyCode === keys.SPACE) {
            this._openCloseNodes(this.mandatorySettingsButton, this.mandatoryContainer);
          }
        })));
        //handle Safe Evacuation Distance button clicked
        this.own(on(this.safeSettingsButton, "click", lang.hitch(this, function () {
          this._openCloseNodes(this.safeSettingsButton, this.safeContainer);
        })));
        //handle Safe Evacuation Distance button keydown for accessibility
        this.own(on(this.safeSettingsButton, "keydown", lang.hitch(this, function (evt) {
          if (evt.keyCode === keys.ENTER || evt.keyCode === keys.SPACE) {
            this._openCloseNodes(this.safeSettingsButton, this.safeContainer);
            this._setLastFocusNode();
          }
        })));
      },

      validInputs: function () {
        var isValid = true;
        //validate for any invalid values in all colorPicker spinners
        array.some(this.colorPickerNodes, function (node) {
          if (!dijitRegistry.byId(node.id).validateSpinner()) {
            isValid = false;
            return true;
          }
        }, this);
        return isValid;
      },

      _openCloseNodes: function (node, container) {
        var containers = query('.container', this.domNode);
        var buttons = query('.SettingsButtonIcon', this.domNode);
        var nodeOpen = false;
        //open or close nodes only when all values enterd are valid
        if (!this.validInputs()) {
          return;
        }
        if (node) {
          if (domClass.contains(node, 'LabelSettingsRightButton')) {
            nodeOpen = true;
          }
        }
        //close all dropdowns
        array.forEach(containers, lang.hitch(this, function (otherContainer) {
          html.addClass(otherContainer, 'controlGroupHidden');
        }));
        array.forEach(buttons, lang.hitch(this, function (otherNode, index) {
          html.removeClass(otherNode, 'LabelSettingsDownButton');
          html.addClass(otherNode, 'LabelSettingsRightButton');
          domAttr.set(otherNode, "aria-expanded", "false");
          if (index === buttons.length - 1) {
            this._setLastFocusNode();
          }
        }));

        if (nodeOpen) {
          //in closed state - so open and change arrow to up
          html.removeClass(container, 'controlGroupHidden');
          html.removeClass(node, 'LabelSettingsRightButton');
          html.addClass(node, 'LabelSettingsDownButton');
          domAttr.set(node, "aria-expanded", "true");
          var colorPicker = query('.jimu-color-picker', container);
          if (colorPicker.length) {
            focusUtils.focus(colorPicker[0]);
          }
        } else {
          focusUtils.focus(node);
        }
      },

      /**
       * Update's Settings on close of the widget
       * @memberOf widgets/ThreatAnalysis/Settings
       **/
      onClose: function () {
        this.onSettingsChanged();
        this._openCloseNodes();
      },

      /**
       * Set's the selected Settings on any value change
       * @memberOf widgets/ThreatAnalysis/Settings
       **/
      onSettingsChanged: function () {
        array.forEach(this.colorPickerNodes, lang.hitch(this, function (node) {
          var json = {
            'color': (dijitRegistry.byId(node.id) !== undefined) ?
              dijitRegistry.byId(node.id).getValues().color : this.config.threatAnalysis.symbology[node.id].color,
            'transparency': (dijitRegistry.byId(node.id) !== undefined) ?
              dijitRegistry.byId(node.id).getValues().transparency :
              this.config.threatAnalysis.symbology[node.id].transparency,
            'type': (dijitRegistry.byId(node.id) !== undefined) ?
              dijitRegistry.byId(node.id).dropdown.getValue() : this.config.threatAnalysis.symbology[node.id].type
          };
          this.selectedSettings[node.id] = json;
        }));
        this.emit("ThreatSettingsChanged", this.selectedSettings);
      },

      // Code for Accessibility : function to set last focus node
      _setLastFocusNode: function () {
        if (domClass.contains(this.safeSettingsButton, "LabelSettingsDownButton")) {
          var lastSafeSettingStyleDOM = query(".dijit", dom.byId('safeFillColor').lastElementChild)[0];
          jimuUtils.initLastFocusNode(this.refDomNode, lastSafeSettingStyleDOM);
        } else {
          jimuUtils.initLastFocusNode(this.refDomNode, this.safeSettingsButton);
        }
      }
    });
  });