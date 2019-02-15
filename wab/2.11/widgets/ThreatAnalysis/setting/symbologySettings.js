///////////////////////////////////////////////////////////////////////////
// Copyright © 2014 - 2018 Esri. All Rights Reserved.
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
    './ColorPickerEditor',
    'jimu/BaseWidget',
    'dijit/_WidgetsInTemplateMixin',
    'dojo/text!../templates/ThreatAnalysisSettings.html',
    'dojo/_base/lang',
    'dojo/Evented',
    'dojo/dom-class',
    'dojo/query',
    'dijit/registry',
    'dijit/form/Select',
    'jimu/dijit/SymbolChooser'
  ],
  function (
    declare,
    array,
    html,
    on,
    ColorPickerEditor,
    BaseWidget,
    _WidgetsInTemplateMixin,
    SettingsTemplate,
    lang,
    Evented,
    domClass,
    query,
    dijitRegistry
  ) {
    return declare([BaseWidget, _WidgetsInTemplateMixin, Evented], {
      baseClass: 'jimu-widget-threatAnalysis-Setting',
      templateString: SettingsTemplate,
      selectedSettings: {}, //Holds selected Settings
      colorPickerNodes: [], //Holds an array of color pickers populated at start up
      dropdownNodes: [], //Holds an array of dropdowns populated at start up

      constructor: function (options) {
        lang.mixin(this, options);
      },

      //Load all the options on startup
      startup: function () {

        this.colorPickerNodes = query('.colorPicker', this.domNode);

        this.dropdownNodes = query('.dropdown', this.domNode);

        array.forEach(this.colorPickerNodes, lang.hitch(this, function (node, i) {
          node = new ColorPickerEditor({
            nls: this.nls,
            type: domClass.contains(node, 'Line') ? 'line' : 'fill'
          }, node);
          node.setValues({
            "color": this.config.threatAnalysis.symbology[node.id].color,
            "transparency": this.config.threatAnalysis.symbology[node.id].transparency
          });
          node.startup();
          node.dropdown.set('value', this.config.threatAnalysis.symbology[node.id].type);
        }));

        //send by default updated parameters
        this.onSettingsChanged();

        this._openCloseNodes(this.mandatorySettingsButton, this.mandatoryContainer)
      },

      postCreate: function () {
        this.inherited(arguments);
        //set class to main container
        domClass.add(this.domNode, "SettingsContainer FullWidth");
        this._handleClickEvents();
      },

      /**
       * Handle click events for different controls
       * @memberOf widgets/threatAnalysis/Widget
       **/
      _handleClickEvents: function () {
        //handle Mandatory Evacuation Distance button clicked
        this.own(on(this.mandatorySettingsButton, "click", lang.hitch(this, function () {
          this._openCloseNodes(this.mandatorySettingsButton, this.mandatoryContainer);
        })));
        //handle Safe Evacuation Distance button clicked
        this.own(on(this.safeSettingsButton, "click", lang.hitch(this, function () {
          this._openCloseNodes(this.safeSettingsButton, this.safeContainer);
        })));
      },

      _openCloseNodes: function (node, container) {
        var containers = query('.container', this.domNode);
        var buttons = query('.SettingsButtonIcon', this.domNode);
        var nodeOpen = false;

        if (node) {
          if (domClass.contains(node, 'LabelSettingsRightButton')) {
            nodeOpen = true;
          }
        }
        //close all dropdowns
        array.forEach(containers, lang.hitch(this, function (otherContainer) {
          html.addClass(otherContainer, 'controlGroupHidden');
        }));
        array.forEach(buttons, lang.hitch(this, function (otherNode) {
          html.removeClass(otherNode, 'LabelSettingsDownButton');
          html.addClass(otherNode, 'LabelSettingsRightButton');
        }));

        if (nodeOpen) {
          //in closed state - so open and change arrow to up
          html.removeClass(container, 'controlGroupHidden');
          html.removeClass(node, 'LabelSettingsRightButton');
          html.addClass(node, 'LabelSettingsDownButton');
        }
      },

      /**
       * Update's Settings on close of the widget
       * @memberOf widgets/threatAnalysis/Settings
       **/
      onClose: function () {
        this.onSettingsChanged();
        this._openCloseNodes();
      },

      /**
       * Set's the selected Settings on any value change
       * @memberOf widgets/threatAnalysis/Settings
       **/
      onSettingsChanged: function () {
        array.forEach(this.colorPickerNodes, lang.hitch(this, function (node, i) {
          var json = {
            'color': dijitRegistry.byId(node.id).getValues().color,
            'transparency': dijitRegistry.byId(node.id).getValues().transparency,
            'type': dijitRegistry.byId(node.id).dropdown.getValue()
          };
          this.selectedSettings[node.id] = json;
        }));
        this.emit("settingsChanged", this.selectedSettings);
      }
    });
  });