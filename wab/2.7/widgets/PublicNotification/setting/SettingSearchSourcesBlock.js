/* global jimuNls */
/*
 | Copyright 2017 Esri
 |
 | Licensed under the Apache License, Version 2.0 (the "License");
 | you may not use this file except in compliance with the License.
 | You may obtain a copy of the License at
 |
 |    http://www.apache.org/licenses/LICENSE-2.0
 |
 | Unless required by applicable law or agreed to in writing, software
 | distributed under the License is distributed on an "AS IS" BASIS,
 | WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 | See the License for the specific language governing permissions and
 | limitations under the License.
 */
//====================================================================================================================//
define([
  'dojo/_base/array',
  'dojo/_base/declare',
  'dojo/_base/lang',
  'dojo/dom-class',
  'dojo/dom-construct',
  'dojo/on',
  './settingComponents',
  './SettingBoxedDivs',
  './SettingBufferBlock',
  './SettingCheckboxLabeled',
  './SettingContainer',
  './SettingDropdownLabeled',
  './SettingFieldListLabeled',
  './SettingInputLabeled',
  './SettingObject',
  './SettingOptionsTable'
], function (
  array,
  declare,
  lang,
  domClass,
  domConstruct,
  on,
  settingComponents,
  SettingBoxedDivs,
  SettingBufferBlock,
  SettingCheckboxLabeled,
  SettingContainer,
  SettingDropdownLabeled,
  SettingFieldListLabeled,
  SettingInputLabeled,
  SettingObject,
  SettingOptionsTable
) {
  return declare(SettingObject, {
    _inputControl: null,
    _mainControl: null,
    _detailsDiv: null,
    _detailsTitle: null,
    _detailsCheckbox: null,
    _sourceDisplay: null,
    _iCurrentSource: -1,
    _sourceMenuItems: [],
    _newSourceTypeMenuItems: [],
    _nls: null,
    _webmapFeatureLayers: [],
    _fieldListPicker: null,
    _displayFieldInput: null,

    //================================================================================================================//

    /**
     * Constructor for class.
     * @param {object} config App configuration object; see subclass for required parameter(s)
     * @memberOf SettingSearchSourcesBlock#
     * @constructor
     */
    constructor: function (name, nls, widthClass, sourceDefaults, webmapFeatureLayers) {
      /*jshint unused:false*/
      var addSearchSourceComp;
      this._nls = nls;
      this._webmapFeatureLayers = webmapFeatureLayers;

      this._newSourceTypeMenuItems = [nls.groupingLabels.featureLayerDetails, nls.groupingLabels.geocoderDetails];

      this._inputControl = new SettingOptionsTable(null, 'third-width', '', nls.propertyLabels.name, null,
        '', lang.hitch(this, this._onRowSelected), lang.hitch(this, this._onRowDeleted),
        lang.hitch(this, this._onRowMoved));

      this._detailsDiv =
        settingComponents.container('two-thirds-width optionsTableHeaderHeight', 'majorTrailingVertGap', []);

      addSearchSourceComp =
        settingComponents.addTextButtonDropdownCtl('', nls.buttons.addSearchSource, this._newSourceTypeMenuItems);
      this.own(on(addSearchSourceComp.ctl, 'click', lang.hitch(this, this._onAddSearchSourceMenuItemClick)));

      this._mainControl = new SettingContainer(null, (widthClass || ''), 'majorTrailingVertGap',
        nls.groupingLabels.searchSources, 'full-width', [

        new SettingInputLabeled('allPlaceholder', false, 'full-width', 'third-width', 'two-thirds-width',
          nls.propertyLabels.placeholderTextForAllSources),
        new SettingCheckboxLabeled('showInfoWindowOnSelect', 'full-width', 'third-width', 'two-thirds-width',
          nls.propertyLabels.showPopupForFoundItem),

        new SettingBoxedDivs(null, [
          addSearchSourceComp.div,
          settingComponents.container('full-width flexbox', 'majorTrailingHorizGap', [
            this._inputControl.div(),
            this._detailsDiv
          ])
        ])
      ]);
      this._mainDiv = this._mainControl.div();
    },

    setConfig: function () {
      this._mainControl.setConfig(this._config);

      // Remove feature layers that are not in the webmap
      this._config.sources = array.filter(this._config.sources, lang.hitch(this, function (source) {
        return source.type === 'locator' ||
          (source.type === 'query' && array.some(this._webmapFeatureLayers, function (layer) {
            return source.layerId === layer.layerId;
          }));
      }));

      this._sourceMenuItems = array.map(this._config.sources, function (source) {
        return {
          item: source.name
        };
      });

      // And set the menu
      this._inputControl.setValue(this._sourceMenuItems);

      // Pick the first item for the details
      if (this._sourceMenuItems.length > 0) {
        this._inputControl.selectTableRow(0);
      }
    },

    getConfig: function () {
      this._mainControl.getConfig(this._config);

      // Convert i18n back to codes by unselecting the current item (if any)
      this._setDetails(-1);
    },

    /*----------------------------------------------------------------------------------------------------------------*/

    _onAddSearchSourceMenuItemClick: function (evt) {
      var newConfigItem, newMenuEntry = {};

      if (evt.target.innerText === this._newSourceTypeMenuItems[0]) {
        newConfigItem = lang.clone(this._config.searchSourceTemplates.query);
        newConfigItem.name = this._webmapFeatureLayers[0].name;
        newConfigItem.displayField = this._webmapFeatureLayers[0].displayField;
        newConfigItem.layerId = this._webmapFeatureLayers[0].layerId;
        newConfigItem.url = this._webmapFeatureLayers[0].url;

      } else {
        newConfigItem = lang.clone(this._config.searchSourceTemplates.locator);
      }

      newConfigItem.buffer = lang.clone(this._config.bufferTemplate);
      this._config.sources.push(newConfigItem);

      newMenuEntry.item = newConfigItem.name;
      this._sourceMenuItems.push(newMenuEntry);
      this._inputControl.addRowToTable(newMenuEntry);

      this._inputControl.selectTableRow(this._config.sources.length - 1);
    },

    _setDetails: function (iNewSource) {
      var numSourceMenuItems = this._sourceMenuItems.length, source,
        opLayerMenuItems = [], fieldMenuItems = [];

      // Remove any current details
      this._removeCurrentDetails();

      if (0 <= iNewSource && iNewSource < numSourceMenuItems) {
        // Create the details display based on the item's type
        source = this._config.sources[iNewSource];
        if (source.type === 'query') {
          // Create the menus for webmap feature layers and fields
          array.map(this._webmapFeatureLayers, function (webmapLayer) {
            opLayerMenuItems.push({
              'label': webmapLayer.name,
              'value': webmapLayer.layerId
            });
            if (source.layerId === webmapLayer.layerId) {
              array.map(webmapLayer.fields, function (field) {
                fieldMenuItems.push({
                  'label': field.alias || field.name,
                  'value': field.name
                });
              });
            }
          });

          this._fieldListPicker =
            new SettingFieldListLabeled('searchFields', this._nls, 'full-width', 'details-label', 'details-value',
            this._nls.propertyLabels.searchFields, this._nls.hints.csvNameList, fieldMenuItems);
          this._displayFieldInput =
            new SettingDropdownLabeled('displayField', 'full-width', 'details-label', 'details-value',
              this._nls.propertyLabels.displayField, '', fieldMenuItems, lang.hitch(this, this._onChangeField));

          this._sourceDisplay = new SettingContainer(null, '', 'majorTrailingVertGap',
            this._nls.groupingLabels.featureLayerDetails, 'full-width', [
            new SettingDropdownLabeled('name', 'full-width', 'details-label', 'details-value',
              this._nls.propertyLabels.name, '', opLayerMenuItems, lang.hitch(this, this._onChangeFeatureLayer)),
            new SettingInputLabeled('placeholder', false, 'full-width', 'details-label', 'details-value',
              this._nls.propertyLabels.placeholderText),
            this._fieldListPicker,
            this._displayFieldInput,
            new SettingInputLabeled('maxSuggestions', true, 'full-width', 'details-label', 'details-value',
              this._nls.propertyLabels.maximumSuggestions, '6'),
            new SettingInputLabeled('maxResults', true, 'full-width', 'details-label', 'details-value',
              this._nls.propertyLabels.maximumResults, '6'),
            new SettingInputLabeled('zoomScale', true, 'full-width', 'details-label', 'details-value',
              this._nls.propertyLabels.zoomScale, '50000', '', '1:'),
            new SettingCheckboxLabeled('exactMatch', 'full-width', 'details-label', 'details-value',
              this._nls.propertyLabels.exactMatch),
            new SettingCheckboxLabeled('searchInCurrentMapExtent', 'full-width', 'details-label', 'details-value',
              this._nls.propertyLabels.limitSearchToMapExtent),
            new SettingBufferBlock('buffer', this._nls, 'full-width', 'details-label', 'details-value',
              this._config.bufferTemplate, this._nls.propertyLabels.bufferDefaultDistance, '100')

          ]);
          source.name = this._convertLayerNameToLayerId(source.name);

        } else if (source.type === 'locator') {
          this._sourceDisplay = new SettingContainer(null, '', 'majorTrailingVertGap',
            this._nls.groupingLabels.geocoderDetails, 'full-width', [
            new SettingInputLabeled('url', false, 'full-width', 'details-label', 'details-value',
              this._nls.propertyLabels.url),
            new SettingInputLabeled('name', false, 'full-width', 'details-label', 'details-value',
              this._nls.propertyLabels.name),
            new SettingInputLabeled('placeholder', false, 'full-width', 'details-label', 'details-value',
              this._nls.propertyLabels.placeholderText),
            new SettingInputLabeled('countryCode', false, 'full-width', 'details-label', 'details-value',
              this._nls.propertyLabels.countryRegionCodes, this._nls.placeholders.countryRegionCodes),
            new SettingInputLabeled('maxSuggestions', true, 'full-width', 'details-label', 'details-value',
              this._nls.propertyLabels.maximumSuggestions, '6'),
            new SettingInputLabeled('maxResults', true, 'full-width', 'details-label', 'details-value',
              this._nls.propertyLabels.maximumResults, '6'),
            new SettingInputLabeled('zoomScale', true, 'full-width', 'details-label', 'details-value',
              this._nls.propertyLabels.zoomScale, '50000', '', '1:'),

            //enableLocalSearch this._nls.propertyLabels.enableLocalSearch
            //localSearchMinScale this._nls.propertyLabels.minimumScale
            //localSearchDistance this._nls.propertyLabels.radius

            new SettingCheckboxLabeled('searchInCurrentMapExtent', 'full-width', 'details-label', 'details-value',
              this._nls.propertyLabels.limitSearchToMapExtent),
            new SettingBufferBlock('buffer', this._nls, 'full-width', 'details-label', 'details-value',
              this._config.bufferTemplate, this._nls.propertyLabels.bufferDefaultDistance, '100')
          ]);
        }

        if (this._sourceDisplay) {
          source.buffer.bufferUnitsMenu = this._convertUnitCodesToLabels(source.buffer.bufferUnitsMenu);
          this._sourceDisplay.setConfig(source);

          domConstruct.place(this._sourceDisplay.div(), this._detailsDiv);
          domClass.remove(this._detailsDiv, 'hidden');
          this._iCurrentSource = iNewSource;
        }
      }
    },

    _convertLayerIdToLayerName: function (layerId) {
      var name = layerId;
      array.some(this._webmapFeatureLayers, function (webmapLayer) {
        if (webmapLayer.layerId === layerId) {
          name = webmapLayer.name;
          return true;
        }
        return false;
      });
      return name;
    },

    _convertLayerNameToLayerId: function (name) {
      var layerId = name;
      array.some(this._webmapFeatureLayers, function (webmapLayer) {
        if (webmapLayer.name === name) {
          layerId = webmapLayer.layerId;
          return true;
        }
        return false;
      });
      return layerId;
    },

    _onChangeFeatureLayer: function (layerId) {
      var tr, source, fieldMenuItems = [];
      if (this._iCurrentSource >= 0) {
        source = this._config.sources[this._iCurrentSource];
        array.some(this._webmapFeatureLayers, lang.hitch(this, function (webmapLayer) {
          if (layerId === webmapLayer.layerId) {
            // Update source information
            source.name = webmapLayer.layerId;
            source.searchFields = [];
            source.displayField = webmapLayer.displayField;
            source.layerId = webmapLayer.layerId;
            source.url = webmapLayer.url;

            array.map(webmapLayer.fields, function (field) {
              fieldMenuItems.push({
                'label': field.alias || field.name,
                'value': field.name
              });
            });
            this._fieldListPicker.setFieldList(fieldMenuItems);
            this._fieldListPicker.setDisplay();
            this._displayFieldInput.setOptions(fieldMenuItems);

            // Update name of source in menu
            tr = this._inputControl.renameTableRow(this._iCurrentSource, webmapLayer.name);

            return true;
          }
          return false;
        }));
      }
    },

    _onChangeField: function (field) {
      var source;
      if (this._iCurrentSource >= 0) {
        source = this._config.sources[this._iCurrentSource];
        source.displayField = field;
      }
    },

    _onRowSelected: function (tr) {
      this._setDetails(tr.rowIndex);
    },

    _onRowMoved: function (tr, moveUp) {
      var formerRowIndex, movedMenuItemList, movedSourceList;

      // Remove any current details
      this._removeCurrentDetails();

      // Update the list of source items
      formerRowIndex = moveUp ? tr.rowIndex + 1 : tr.rowIndex - 1;
      movedMenuItemList = this._sourceMenuItems.splice(formerRowIndex, 1);
      movedSourceList = this._config.sources.splice(formerRowIndex, 1);

      this._sourceMenuItems.splice(tr.rowIndex, 0, movedMenuItemList[0]);
      this._config.sources.splice(tr.rowIndex, 0, movedSourceList[0]);

      // Activate the former row index because SimpleTable, when asked to activate the new row index, does the
      // activation but doesn't update the table highlighting
      this._inputControl.selectTableRow(tr.rowIndex);
    },

    _onRowDeleted: function (tr, deletedItemLabel, formerRowIndex) {
      /*jshint unused:false*/
      // Remove any current details
      this._removeCurrentDetails();

      // Update the list of source items to omit the deleted item
      this._sourceMenuItems.splice(formerRowIndex, 1);
      this._config.sources.splice(formerRowIndex, 1);

      // Pick the first item for showing the details
      if (this._sourceMenuItems.length > 0) {
        this._inputControl.selectTableRow(0);
      }
    },

    _removeCurrentDetails: function () {
      var source;

      // Remove any current details
      if (this._iCurrentSource >= 0) {
        domClass.add(this._detailsDiv, 'hidden');

        source = this._config.sources[this._iCurrentSource];
        this._sourceDisplay.getConfig(source);
        source.buffer.bufferUnitsMenu = this._convertLabelsToUnitCodes(source.buffer.bufferUnitsMenu);
        if (source.type === 'query') {
          source.name = this._convertLayerIdToLayerName(source.name);
        }

        domConstruct.empty(this._detailsDiv);
        this._sourceDisplay = null;
        this._iCurrentSource = -1;
      }
    },

    _convertUnitCodesToLabels: function (codeList) {
      var labelList = [], nls = jimuNls.units;
      array.forEach(codeList, function (code) {
        switch (code) {
        case 'CENTIMETERS':
          labelList.push(nls.centimeters);
          break;
        case 'INCHES':
          labelList.push(nls.inches);
          break;
        case 'FEET':
          labelList.push(nls.feet);
          break;
        case 'YARDS':
          labelList.push(nls.yards);
          break;
        case 'METERS':
          labelList.push(nls.meters);
          break;
        case 'KILOMETERS':
          labelList.push(nls.kilometers);
          break;
        case 'MILES':
          labelList.push(nls.miles);
          break;
        default:
          labelList.push(code);
        }
      });
      return labelList;
    },

    _convertLabelsToUnitCodes: function (labelList) {
      var codeList = [], nls = jimuNls.units;
      array.forEach(labelList, function (label) {
        switch (label) {
        case nls.centimeters:
          codeList.push('CENTIMETERS');
          break;
        case nls.inches:
          codeList.push('INCHES');
          break;
        case nls.feet:
          codeList.push('FEET');
          break;
        case nls.yards:
          codeList.push('YARDS');
          break;
        case nls.meters:
          codeList.push('METERS');
          break;
        case nls.kilometers:
          codeList.push('KILOMETERS');
          break;
        case nls.miles:
          codeList.push('MILES');
          break;
        default:
          codeList.push(label);
        }
      });
      return codeList;
    }

    //================================================================================================================//
  });
});
