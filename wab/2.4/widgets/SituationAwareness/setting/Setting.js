///////////////////////////////////////////////////////////////////////////
// Copyright © 2016 Esri. All Rights Reserved.
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
    'dojo/_base/array',
    'dojo/_base/lang',
    'dojo/dom-style',
    'dojo/on',
    'dojo/query',
    'dijit/form/Select',
    'dijit/form/ValidationTextBox',
    'dijit/_WidgetsInTemplateMixin',
    'dijit/focus',
    './FeaturelayerSource',
    './FieldPicker',
    'jimu/BaseWidgetSetting',
    'jimu/dijit/Message',
    'jimu/dijit/Popup',
    'jimu/LayerInfos/LayerInfos',
    'dojo/dom-class',
    'dojo/dom-construct',
    'dijit/registry',
    'jimu/dijit/SimpleTable',
    'jimu/dijit/RadioBtn'
],
  function(
    declare, array, lang, domStyle, on, query,
    Select, ValidationTextBox, _WidgetsInTemplateMixin, focusUtil,
    FeaturelayerSource, FieldPicker, BaseWidgetSetting, Message, Popup,
    LayerInfos, domClass, domConstruct, registry
  ) {
    return declare([BaseWidgetSetting, _WidgetsInTemplateMixin], {

      baseClass: 'jimu-widget-SAT-setting',
      opLayers: [],
      curRow: null,
      validFields: [],
      saveValid: true,
      textValid: true,

      postCreate: function() {
        this.inherited(arguments);
        this.nls = lang.mixin(lang.mixin(this.nls, window.jimuNls.units), window.jimuNls.temperature);
        this.chk_celsius.set('title', this.nls.celsius + "-" + this.nls.kilometers);
        this.chk_celsius_label.innerHTML = this.nls.celsius + "-" + this.nls.kilometers;
        this.addSelectUnitOptions();
        this._getAllLayers();
        this.own(on(this.btnAddTab, 'click', lang.hitch(this, this._addTabRow)));
        this.own(on(this.tabTable, 'actions-edit', lang.hitch(this, function(tr) {
          this._onEditLayerClicked(tr);
        })));
        this.own(on(this.tabTable, 'row-delete', lang.hitch(this, this._rowDeleted)));

        this.incident_label.invalidMessage = this.nls.invalid_string_width;
        this.incident_label.validator = lang.hitch(this, this.checkSmallString, this.incident_label);

        this.locate_incident_label.invalidMessage = this.nls.invalid_string_width;
        this.locate_incident_label.validator = lang.hitch(this, this.checkLargeString, this.locate_incident_label);

        this.buffer_lbl.invalidMessage = this.nls.invalid_string_width;
        this.buffer_lbl.validator = lang.hitch(this, this.checkLargeString, this.buffer_lbl);
      },

      addSelectUnitOptions: function () {
        this.selectUnits.addOption([{
          label: this.nls.miles,
          value: "miles",
          selected: true
        }, {
          label: this.nls.kilometers,
          value: "kilometers",
          selected: false
        }, {
          label: this.nls.feet,
          value: "feet",
          selected: false
        }, {
          label: this.nls.meters,
          value: "meters",
          selected: false
        }, {
          label: this.nls.yards,
          value: "yards",
          selected: false
        }, {
          label: this.nls.nauticalMiles,
          value: "nauticalMiles",
          selected: false
        }]);
      },

      startup: function() {
        this.inherited(arguments);
      },

      setConfig: function(config) {
        this.config = config;

        if (this.config.distanceUnits) {
          this.selectUnits.set("value", this.config.distanceUnits);
        }

        if (this.config.maxDistance) {
          this.txt_maximumDistance.set("value", this.config.maxDistance);
        }

        if (this.config.enableRouting) {
          this.chk_routing.set('value', true);
        }

        this.tabTable.clear();
        for (var i = 0; i < this.config.tabs.length; i++) {
          var aTab = this.config.tabs[i];
          if (aTab.type === this.config.special_layer.value) {
            this.chk_weather.set('value', true);
            this.weatherTabAdditionalLayers = aTab.layers;
            this.currentlySelectedLayer.innerHTML = this.weatherTabAdditionalLayers;
          } else {
            this._populateTabTableRow(aTab);
          }
        }

        if (this.config.celsius) {
          this.chk_celsius.set('value', true);
        }

        this.incident_label.set("value", this.config.incidentLabel ?
          this.config.incidentLabel : this.nls.incident);

        this.locate_incident_label.set("value", this.config.locateIncidentLabel ?
          this.config.locateIncidentLabel : this.nls.locate_incident);

        this.buffer_lbl.set("value", this.config.bufferLabel ?
          this.config.bufferLabel : this.nls.buffer_value);

        this.buffer_max.set("value", this.config.bufferRange.maximum);
        this.buffer_min.set("value", this.config.bufferRange.minimum);

        if (this.config.saveEnabled && typeof (this.config.savePolys) === 'undefined' &&
          typeof (this.config.saveLines) === 'undefined' && typeof (this.config.savePoints) === 'undefined') {
          this.config.savePolys = true;
          this.config.polyEditLayer = this.config.editLayer;
        }

        var hasEditableLayers = false;

        var hasEditablePointLayers = this._updateEditUI(this.save_point_layers, this.chk_point_save,
          this.div_selectPointSaveLayer, this.config.savePoints, this.selectPointSaveLayer,
          this.config.pointEditLayer);
        hasEditableLayers = hasEditablePointLayers ? true : hasEditableLayers;

        var hasEditableLineLayers = this._updateEditUI(this.save_line_layers, this.chk_line_save,
          this.div_selectLineSaveLayer, this.config.saveLines, this.selectLineSaveLayer,
          this.config.lineEditLayer);
        hasEditableLayers = hasEditableLineLayers ? true : hasEditableLayers;

        var hasEditablePolyLayers = this._updateEditUI(this.save_poly_layers, this.chk_poly_save,
          this.div_selectPolySaveLayer, this.config.savePolys, this.selectPolySaveLayer,
          this.config.polyEditLayer);
        hasEditableLayers = hasEditablePolyLayers ? true : hasEditableLayers;

        if (!hasEditableLayers) {
          this.chk_save.set("disabled", 'disabled');
          this._updateDisplay(this.editOptions, false);
        } else {
          this.chk_save.onChange = lang.hitch(this, function (v) {
            this._updateDisplay(this.editOptions, v);
          });
          this.chk_save.set("checked", this.config.saveEnabled);
          this._updateDisplay(this.editOptions, this.config.saveEnabled);
          if (this.config.saveEnabled && this.config.editTemplate) {
            //checking this to persist saved template for backwards compatability
            // after November we will no longer be persisting these details in the config
            this.selectedTemplate = this.config.editTemplate;
            if (typeof (this.config.selectedTemplateIndex) !== 'undefined') {
              this.selectedTemplateIndex = this.config.selectedTemplateIndex;
            }
          }
        }

        this.chk_csv.set("checked", this.config.csvAllFields);
        this.chk_display.set("checked", this.config.summaryDisplayEnabled);

        if (typeof (this.config.snapshotEnabled) !== 'undefined') {
          this.chk_snapshot.set("checked", this.config.snapshotEnabled);
        } else {
          this.chk_snapshot.set("checked", false);
        }
      },

      _updateEditUI: function (editLayers, cb, div, configOpt, select, configLayer) {
        var hasEditableLayers = false;
        if (typeof (editLayers) !== 'undefined' && editLayers.length > 0) {
          hasEditableLayers = true;
          cb.onChange = lang.hitch(this, function (v) {
            this._updateDisplay(div, v);
          });
          select.addOption(editLayers);
          var saveEnabled = false;
          if (typeof (configOpt) !== 'undefined') {
            saveEnabled = configOpt;
            if (saveEnabled) {
              select.set("value", configLayer);
            }
          }
          cb.set('checked', saveEnabled);
          this._updateDisplay(div, saveEnabled);
        } else {
          cb.set('disabled', true);
          cb.set('checked', false);
          this._updateDisplay(div, false);
        }
        return hasEditableLayers;
      },

      _updateDisplay: function (attachPoint, v) {
        if (domClass.contains(attachPoint, v ? 'display-off' : 'display-on')) {
          domClass.remove(attachPoint, v ? 'display-off' : 'display-on');
        }
        domClass.add(attachPoint, v ? 'display-on' : 'display-off');
        this.saveValid = this._validateSave();
        if (this.saveValid && this._validateRows() && this.textValid) {
          this._enableOk();
        } else {
          this._disableOk();
        }
      },

      _validateRows: function () {
        var isValid = true;
        var rows = this.tabTable.getRows();
        for (var i = 0; i < rows.length; i++) {
          var row = rows[i];
          if (row.isValid === false) {
            isValid = false;
          }
        }
        return isValid;
      },

      _validateSave: function(){
        var valid = false;
        if(this.chk_save.checked){
          if(this.chk_point_save.checked || this.chk_line_save.checked || this.chk_poly_save.checked){
            valid = true;
          }
        }else{
          valid = true;
        }
        return valid;
      },

      getConfig: function() {
        this.config.distanceUnits = this.selectUnits.value;

        if (this.txt_maximumDistance.value) {
          this.config.maxDistance = this.txt_maximumDistance.value;
        }

        if (this.chk_routing.checked) {
          this.config.enableRouting = true;
        } else {
          this.config.enableRouting = false;
        }

        var tabs = [];

        var aTab = {};
        if (this.chk_weather.checked) {
          aTab.label = this.config.special_layer.label;
          aTab.type = this.config.special_layer.value;
          aTab.layers = this.weatherTabAdditionalLayers;
          aTab.url = this.config.special_layer.url;
          tabs.push(aTab);
        }

        if (this.chk_celsius.checked) {
          this.config.celsius = true;
        } else {
          this.config.celsius = false;
        }

        var trs = this.tabTable.getRows();
        array.forEach(trs, lang.hitch(this, function(tr) {
          var selectLayers = tr.selectLayers;
          var selectTypes = tr.selectTypes;
          var labelText = tr.labelText;
          aTab = {};
          aTab.label = labelText.value;
          aTab.type = selectTypes.value;
          aTab.layers = selectLayers.value;
          //new prop for title/id switch
          aTab.layerTitle = selectLayers._getSelectedOptionsAttr().label;
          if(tr.tabInfo && tr.tabInfo.advStat) {
            aTab.advStat = tr.tabInfo.advStat;
          }
          tabs.push(aTab);
        }));

        this.config.tabs = tabs;


        this.config.incidentLabel = this.incident_label.value;
        this.config.locateIncidentLabel = this.locate_incident_label.value;
        this.config.bufferLabel = this.buffer_lbl.value;
        this.config.bufferRange.maximum = this.buffer_max.value;
        this.config.bufferRange.minimum = this.buffer_min.value;

        this.config.saveEnabled = this.chk_save.checked;
        this.config.savePoints = this.chk_point_save.checked;
        if (this.config.savePoints) {
          this.config.pointEditLayer = this.selectPointSaveLayer.value;
        }
        this.config.saveLines = this.chk_line_save.checked;
        if (this.config.saveLines) {
          this.config.lineEditLayer = this.selectLineSaveLayer.value;
        }
        this.config.savePolys = this.chk_poly_save.checked;
        if (this.config.savePolys) {
          this.config.polyEditLayer = this.selectPolySaveLayer.value;
        }

        this.config.csvAllFields = this.chk_csv.checked;
        this.config.summaryDisplayEnabled = this.chk_display.checked;
        this.config.snapshotEnabled = this.chk_snapshot.checked;

        return this.config;
      },

      _getAllLayers: function() {
        if (this.map.itemId) {
          LayerInfos.getInstance(this.map, this.map.itemInfo)
            .then(lang.hitch(this, function(operLayerInfos) {
              this.opLayers = operLayerInfos;
              this._setLayers();
              this._setTypes();
              this.setConfig(this.config);
            }));
        }
      },

      _setLayers: function () {
        var supportedLayerTypes = ["ArcGISFeatureLayer", "ArcGISMapServiceLayer", "CSV",
                           "KML", "GeoRSS", "Feature Layer", "FeatureCollection"];
        var options = [];
        var pointSaveOptions = [];
        var lineSaveOptions = [];
        var polySaveOptions = [];
        array.forEach(this.opLayers._layerInfos, lang.hitch(this, function (OpLyr) {
          var skipLayer = false;
          if (OpLyr.layerObject && OpLyr.layerObject.hasOwnProperty('tileInfo')) {
            skipLayer = true;
          } else if (OpLyr.newSubLayers.length > 0) {
            this._recurseOpLayers(OpLyr.newSubLayers, options, pointSaveOptions, lineSaveOptions, polySaveOptions);
          } else {
            if (OpLyr.layerObject) {
              if (OpLyr.layerObject.url && (OpLyr.layerObject.url.indexOf('ImageServer') > -1)) {
                skipLayer = true;
              }
              if (OpLyr.layerObject.type && supportedLayerTypes.indexOf(OpLyr.layerObject.type) === -1) {
                skipLayer = true;
              }
            }
            if (skipLayer) {
              new Message({
                message: this.nls.layer_type_not_supported + OpLyr.title
              });
            }
            if (!skipLayer) {
              options.push({
                label: OpLyr.title,
                value: OpLyr.id
              });

              if (OpLyr.layerObject) {
                this._updateEditOptions(OpLyr, pointSaveOptions, lineSaveOptions, polySaveOptions);
              }
            }
          }
        }));

        if (options.length === 0) {
          domStyle.set(this.btnAddTab, "display", "none");
          new Message({
            message: this.nls.missingLayerInWebMap
          });
          return;
        }

        this.layer_options = lang.clone(options);
        this.checkFields();
        //save_layer_options becomes:
        this.save_point_layers = lang.clone(pointSaveOptions);
        this.save_line_layers = lang.clone(lineSaveOptions);
        this.save_poly_layers = lang.clone(polySaveOptions);
      },

      checkFields: function () {
        this.validFields = [];
        var fp;
        for (var i = 0; i < this.layer_options.length; i++) {
          var l = this.layer_options[i];
          fp = new FieldPicker({
            nls: this.nls,
            callerLayer: l.value,
            callerOpLayers: this.opLayers._layerInfos,
            map: this.map,
            test: true,
            callerTab: {
              type: 'closest'
            }
          });
          fp._validatePopupFields().then(lang.hitch(this, function (validFields) {
            this.validFields.push(validFields);
          }));
        }
      },

      _recurseOpLayers: function (opLyrs, options, pointSaveOptions, lineSaveOptions, polySaveOptions) {
        array.forEach(opLyrs, lang.hitch(this, function (opLyr) {
          if (opLyr.newSubLayers.length > 0) {
            this._recurseOpLayers(opLyr.newSubLayers, options, pointSaveOptions, lineSaveOptions, polySaveOptions);
          } else {
            options.push({
              label: opLyr.title,
              value: opLyr.id
            });

            if (opLyr.layerObject) {
              this._updateEditOptions(opLyr, pointSaveOptions, lineSaveOptions, polySaveOptions);
            }
          }
        }));
      },

      _updateEditOptions: function (opLyr, pointSaveOptions, lineSaveOptions, polySaveOptions) {
        var lo = opLyr.layerObject;
        var cb = lo.capabilities;
        var sa;
        if (cb && cb.indexOf("Edit") > 0 || cb && cb.indexOf("Create") > 0) {
          if (opLyr.controlPopupInfo && opLyr.controlPopupInfo.enablePopup) {
            if (lo.geometryType === 'esriGeometryPoint') {
              sa = pointSaveOptions;
            } else if (lo.geometryType === 'esriGeometryPolyline') {
              sa = lineSaveOptions;
            } else if (lo.geometryType === 'esriGeometryPolygon') {
              sa = polySaveOptions;
            }
            if (typeof (sa) !== 'undefined') {
              sa.push({
                label: opLyr.title,
                value: opLyr.id,
                selected: false
              });
            }
          }
        }
      },

      _setTypes: function() {
        this.analysis_options = [{
          value: 'closest',
          label: this.nls.closest
        }, {
          value: 'proximity',
          label: this.nls.proximity
        }, {
          value: 'summary',
          label: this.nls.summary
        }, {
          value: 'groupedSummary',
          label: this.nls.groupedSummary
        }];
      },

      _populateTabTableRow: function(tabInfo) {
        var result = this.tabTable.addRow({});
        if (result.success && result.tr) {
          var tr = result.tr;
          tr.tabInfo = tabInfo;
          this._addTabLayers(tr);
          this._addTabTypes(tr);
          this._addTabLabel(tr);
          //for BC after the title/id switch
          //layerTitle is only set for configs after this change...old configs will not have it
          var id = typeof (tabInfo.layerTitle) !== 'undefined' ? tabInfo.layers : this.getLayerID(tabInfo.layers);
          tr.selectLayers.set("value", id);
          tr.selectTypes.set("value", tabInfo.type, false);
          tr.labelText.set("value", tabInfo.label);
        }
      },

      getLayerID: function(title){
        for (var i = 0; i < this.layer_options.length; i++) {
          var lo = this.layer_options[i];
          if (title === lo.label || title === lo.value) {
            return lo.value;
          }
        }
      },

      _rowDeleted: function () {
        var trs = this.tabTable.getRows();
        var allValid = true;
        for (var i = 0; i < trs.length; i++) {
          if (!trs[i].isValid) {
            allValid = false;
            break;
          }
        }
        var s = query(".button-container")[0];
        domStyle.set(s.children[2], "display", allValid ? "inline-block" : "none");
        domStyle.set(s.children[3], "display", allValid ? "none" : "inline-block");
      },

      _addTabRow: function() {
        var result = this.tabTable.addRow({});
        if (result.success && result.tr) {
          var tr = result.tr;
          this._addTabLayers(tr);
          this._addTabTypes(tr);
          this._addTabLabel(tr);
        }
      },

      _addTabLayers: function(tr) {
        var lyrOptions = lang.clone(this.layer_options);
        var td = query('.simple-table-cell', tr)[0];
        if (td) {
          var tabLayers = new Select({
            style: {
              width: "100%",
              height: "26px"
            },
            "class": "medSelect",
            options: lyrOptions
          });
          tabLayers.placeAt(td);
          tabLayers.startup();
          tr.selectLayers = tabLayers;
          tabLayers.on("change", function () {
            var p = this.domNode.parentNode;
            p.parentNode.selectTypes.validate();
            focusUtil.focus(p.parentNode.selectTypes.domNode);
            p.parentNode.selectTypes.domNode.blur();
            var table = query(".jimu-simple-table")[0];
            focusUtil.focus(table);
            focusUtil.focus(this.domNode);
          });
        }
      },

      _addTabTypes: function(tr) {
        var typeOptions = lang.clone(this.analysis_options);
        var td = query('.simple-table-cell', tr)[1];
        if (td) {
          var tabTypes = new Select({
            style: {
              width: "100%",
              height: "26px"
            },
            required: true,
            isValid: this.validateType,
            validFields: this.validFields,
            options: typeOptions,
            row: tr,
            parent: this,
            parentTable: this.tabTable,
            nls: this.nls,
            'class': 'shortTypeSelect'
          });
          tabTypes.placeAt(td);
          tabTypes.startup();
          tabTypes._missingMsg = this.nls.need_group_field;
          tabTypes.on("change", function () {
            this.domNode.blur();
            var table = query(".jimu-simple-table")[0];
            focusUtil.focus(table);
          });
          tr.selectTypes = tabTypes;
          focusUtil.focus(tabTypes.domNode);
          tabTypes.domNode.blur();
          var table = query(".jimu-simple-table")[0];
          focusUtil.focus(table);
        }
      },

      validateType: function () {
        //This is the validFields object we get
        //{
        //  layer: this.callerLayer,
        //  hasPopupFields: temp_fields.length > 0,
        //  hasFields: this.fields.length > 0,
        //  hasSummaryPopupFields: validPopupFields,
        //  hasSummaryFields: validFields
        //}
        var row = this.row;
        var analysisType = this.value;
        var isValid = true;
        var isEditable = true;
        var tabInfo = row.tabInfo;
        var hasStats = true;
        var stats;
        if (tabInfo && tabInfo.advStat && tabInfo.advStat.stats) {
          //user defined values
          stats = tabInfo.advStat.stats;
        } else {
          hasStats = false;
        }
        for (var i = 0; i < this.validFields.length; i++) {
          var vf = this.validFields[i];
          if (vf.layer === row.selectLayers.value) {
            row.validFields = vf;
            if (analysisType === 'summary') {
              if (stats) {
                if (!stats.hasOwnProperty('min') && !stats.hasOwnProperty('max') &&
                  !stats.hasOwnProperty('avg') && !stats.hasOwnProperty('sum') &&
                  !stats.hasOwnProperty('count') && !stats.hasOwnProperty('area') &&
                    !stats.hasOwnProperty('length')) {
                  hasStats = false;
                }
              }
              if (!hasStats) {
                //if no numeric popup fields but it does have other numeric fields
                if (!vf.hasSummaryPopupFields && vf.hasSummaryFields) {
                  this._missingMsg = this.nls.no_valid_popup_fields;
                  isValid = false;
                } else if (!vf.hasSummaryPopupFields && !vf.hasSummaryFields) {
                  this._missingMsg = this.nls.no_valid_fields;
                  isValid = false;
                }
              }
            } else if (analysisType === 'groupedSummary') {
              this._missingMsg = this.nls.need_group_field;
              if (stats && !stats.hasOwnProperty('pre') && !stats.hasOwnProperty('suf') || !hasStats) {
                isValid = false;
              }
            } else {
              if (stats && stats.outFields) {
                hasStats = stats.outFields.length > 0;
              }
              if(!hasStats){
                if (!vf.hasPopupFields) {
                  this._missingMsg = this.nls.no_valid_popup_fields;
                  isValid = false;
                }
              }
            }
            //}
            break;
          }
        }
        row.isValid = isValid;
        row.isEditable = isEditable;

        var editIcon = row.querySelectorAll('.jimu-icon-edit')[0];
        if (!isEditable) {
          domClass.add(editIcon, 'jimu-state-disabled');
        } else {
          if (domClass.contains(editIcon, 'jimu-state-disabled')) {
            domClass.remove(editIcon, 'jimu-state-disabled');
          }
        }

        //check all rows
        var rows = this.parentTable.getRows();
        var allValid = true;
        for (var ii = 0; ii < rows.length; ii++) {
          if (!rows[ii].isValid) {
            allValid = false;
            break;
          }
        }
        var p = this.parent;
        var s = query(".button-container")[0];
        domStyle.set(s.children[2], "display", allValid && p.saveValid && p.textValid ? "inline-block" : "none");
        domStyle.set(s.children[3], "display", allValid && p.saveValid && p.textValid ? "none" : "inline-block");

        return isValid;
      },

      checkSmallString: function (d, v) {
        return this.checkString(d, v, 180);
      },

      checkLargeString: function (d, v) {
        return this.checkString(d, v, 260);
      },

      checkString: function (d, v, size) {
        var visSpan = domConstruct.create("div", {
          "class": "visDivLength",
          "id": "SA_VisDiv",
          "innerHTML": v
        }, d.domNode);

        var fitsWidth = visSpan.clientWidth < size ? true : false;

        domConstruct.destroy(visSpan);

        this.textValid = fitsWidth;
        var id = registry.byNode(d.domNode).id;
        query('.validationBox2').forEach(lang.hitch(this, function (node) {
          var _dijit = registry.byNode(node);
          if (id !== _dijit.id) {
            this.textValid = this.textValid ? _dijit.state !== 'Error' : this.textValid;
          }
        }));

        if (this.textValid && this.saveValid && this._validateRows()) {
          this._enableOk();
        } else {
          this._disableOk();
        }

        return fitsWidth;
      },

      _addTabLabel: function(tr) {
        var td = query('.simple-table-cell', tr)[2];
        var labelTextBox = new ValidationTextBox({
          style: {
            width: "100%",
            height: "26px"
          }
        });
        labelTextBox.placeAt(td);
        labelTextBox.startup();
        tr.labelText = labelTextBox;
      },

      _onBtnSelectLayersClicked: function() {
        var args = {
          nls: this.nls,
          map: this.map,
          config: this.config,
          weatherTabAdditionalLayers: this.weatherTabAdditionalLayers,
          appConfig: this.appConfig
        };

        var sourceDijit = new FeaturelayerSource(args);

        var popup = new Popup({
          width: 830,
          height: 560,
          content: sourceDijit,
          titleLabel: this.nls.selectLayers
        });

        this.own(on(sourceDijit, 'ok', lang.hitch(this, function(items) {
          this.weatherTabAdditionalLayers = items;
          this.currentlySelectedLayer.innerHTML = this.weatherTabAdditionalLayers;
          sourceDijit.destroy();
          sourceDijit = null;
          popup.close();
        })));

        this.own(on(sourceDijit, 'cancel', lang.hitch(this, function() {
          sourceDijit.destroy();
          sourceDijit = null;
          popup.close();
        })));
      },

      _onEditLayerClicked: function(tr) {
        this.curRow = tr;
        if (tr.isEditable) {
          var aTab = tr.tabInfo;
          if (!aTab) {
            aTab = {};
            aTab.label = tr.labelText.value;
            aTab.type = tr.selectTypes.value;
            aTab.layers = tr.selectLayers.value;
            aTab.advStat = {};
            tr.tabInfo = aTab;
          }
          var id = typeof (aTab.layerTitle) !== 'undefined' ? aTab.layers : this.getLayerID(aTab.layers);
          if (aTab.type !== tr.selectTypes.value || id !== tr.selectLayers.value) {
            aTab.type = tr.selectTypes.value;
            aTab.layers = tr.selectLayers.value;
            aTab.advStat = {};
          }

          var args = {
            nls: this.nls,
            callerLayer: tr.selectLayers.value,
            callerTab: aTab,
            callerOpLayers: this.opLayers._layerInfos,
            map: this.map
          };

          var sourceDijit = new FieldPicker(args);

          var popup = new Popup({
            width: 830,
            height: 560,
            content: sourceDijit,
            titleLabel: this.nls.selectFields + ": " + tr.selectLayers._getSelectedOptionsAttr().label
          });

          this.own(on(sourceDijit, 'ok', lang.hitch(this, function (items) {
            this.curRow.tabInfo.advStat = items;
            var n = this.curRow.selectTypes.domNode;
            this.curRow.selectTypes.validate();
            focusUtil.focus(n);
            focusUtil.focus(n.parentNode.offsetParent);
            this.curRow = null;
            //this.summaryFields.push(items);
            sourceDijit.destroy();
            sourceDijit = null;
            popup.close();
          })));

          this.own(on(sourceDijit, 'cancel', lang.hitch(this, function () {
            this.curRow = null;
            sourceDijit.destroy();
            sourceDijit = null;
            popup.close();
          })));
        }
      },

      _disableOk: function () {
        var s = query(".button-container")[0];
        domStyle.set(s.children[2], "display", "none");
        domStyle.set(s.children[3], "display", "inline-block");
      },

      _enableOk: function () {
        var s = query(".button-container")[0];
        domStyle.set(s.children[2], "display", "inline-block");
        domStyle.set(s.children[3], "display", "none");
      }
    });
  });
