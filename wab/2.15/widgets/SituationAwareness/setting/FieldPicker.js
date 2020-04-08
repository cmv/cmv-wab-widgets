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

define(['dojo/_base/declare',
  'dijit/_WidgetsInTemplateMixin',
  'dijit/form/Select',
  'dijit/form/ValidationTextBox',
  'dijit/registry',
  'dojo/dom-construct',
  'dojo/_base/array',
  'dojo/_base/lang',
  'dojo/_base/html',
  'dojo/dom-style',
  'dojo/dom-class',
  'dojo/Deferred',
  'dojo/on',
  'dojo/query',
  'jimu/BaseWidget',
  'jimu/dijit/Message',
  'jimu/utils',
  'jimu/dijit/Popup',
  'jimu/dijit/CheckBox',
  'esri/layers/FeatureLayer',
  'dojo/text!./FieldPicker.html',
  'dojo/Evented',
  'jimu/dijit/SimpleTable',
  './FieldOptions'],
function (declare,
  _WidgetsInTemplateMixin,
  Select,
  ValidationTextBox,
  registry,
  domConstruct,
  array,
  lang,
  html,
  domStyle,
  domClass,
  Deferred,
  on,
  query,
  BaseWidget,
  Message,
  utils,
  Popup,
  CheckBox,
  FeatureLayer,
  template,
  Evented,
  Table,
  FieldOptions) {
  return declare([BaseWidget, _WidgetsInTemplateMixin, Evented], {
    templateString: template,
    baseClass: 'jimu-widget-SAT-setting',
    advStat: {},
    fieldsList: null,
    callerLayer: null,
    callerTab: null,
    callerOpLayers: null,
    layerList: null,
    test: false,
    fields: null,
    hasFields: true,
    areaOptions: {},
    lengthOptions: {},

    constructor: function (/*Object*/args) {
      this.map = args.map;
      if (args.test) {
        this.test = args.test;
      }
    },

    postMixInProperties: function () {
      this.inherited(arguments);
      this.nls.common = window.jimuNls.common;
    },

    postCreate: function () {
      this.inherited(arguments);
      this.startup();
    },

    _initCheckBoxes: function () {
      //count only
      this.chk_count_only = this._initCheckBox(this.nls.count_checkBox, this.div_chkCountOnly);
      this.own(on(this.chk_count_only, 'change', lang.hitch(this, this.chkCountChanged)));

      //summary count
      this.chk_count = this._initCheckBox(this.nls.count_checkBox, this.div_chkCount);
      this.own(on(this.chk_count, 'change', lang.hitch(this, this.chkCountChanged)));

      //summary area
      this.chk_area = this._initCheckBox(this.nls.area_checkBox, this.div_chkArea);
      this.own(on(this.chk_area, 'change', lang.hitch(this, this.chkAreaChanged)));
      this.editAreaOptions = this._initValueOptions(this.div_chkArea);
      this.own(on(this.editAreaOptions, 'click', lang.hitch(this, this.showAreaOptions)));

      //summary length
      this.chk_length = this._initCheckBox(this.nls.length_checkBox, this.div_chkLength);
      this.own(on(this.chk_length, 'change', lang.hitch(this, this.chkLengthChanged)));
      this.editLengthOptions = this._initValueOptions(this.div_chkLength);
      this.own(on(this.editLengthOptions, 'click', lang.hitch(this, this.showLengthOptions)));

      //Report options
      this.chk_analysisSummary = this._initCheckBox(this.nls.analysisSummaryLabelForReport,
        this.div_chkAnalysisSummary);
      this.chk_analysisSummary.check();
      this.chk_PopUpSummary = this._initCheckBox(this.nls.popUpSummaryLabelForReport,
        this.div_chkPopUpSummary);
      this.chk_PopUpSummary.check();
    },

    _initCheckBox: function (nls, node) {
      var cb = new CheckBox();
      cb.setLabel(nls);
      cb.placeAt(node);
      return cb;
    },

    _initValueOptions: function (node) {
      var _opts = domConstruct.create('div', {
        className: 'float-right edit-options edit-fields'
      }, node);
      _opts.setStatus = this._setStatus;
      return _opts;
    },

    _setStatus: function (enabled) {
      var removeClass = enabled ? 'edit-fields-disabled' : 'edit-fields';
      var addClass = enabled ? 'edit-fields' : 'edit-fields-disabled';
      if (domClass.contains(this, removeClass)) {
        domClass.remove(this, removeClass);
      }
      domClass.add(this, addClass);
    },

    startup: function () {
      var fields = null;
      if (!this.test) {
        if (this.callerTab.type === "summary") {
          fields = [{
            name: "layer",
            title: this.nls.fieldTitle,
            "class": "label",
            type: "empty",
            width: "250px"
          }, {
            name: "label",
            title: this.nls.layerLabel,
            "class": "label",
            type: "empty",
            width: "200px"
          }, {
            name: "type",
            title: this.nls.typeTitle,
            "class": "sumlabel",
            type: "empty",
            width: "150px"
          }, {
            name: "actions",
            title: this.nls.actionsTitle,
            "class": "actions",
            type: "actions",
            actions: ["up", "down", "edit", "delete"]
          }];
        } else if (this.callerTab.type === "groupedSummary") {
          fields = [{
            name: "layer",
            title: this.nls.groupByField,
            "class": "label",
            type: "empty",
            width: "40%"
          }, {
            name: "label",
            title: this.nls.layerLabel,
            "class": "label",
            type: "empty",
            width: "20%"
          }, {
            name: "type",
            title: this.nls.labelType,
            "class": "label",
            type: "empty",
            width: "20%"
          }];
        } else {
          fields = [{
            name: "layer",
            title: this.nls.fieldTitle,
            "class": "label",
            type: "empty",
            width: "60%"
          }, {
            name: "label",
            title: this.nls.layerLabel,
            "class": "label",
            type: "empty",
            width: "200px"
          }, {
            name: "actions",
            title: this.nls.actionsTitle,
            "class": "actions",
            type: "actions",
            actions: ["up", "down", "edit", "delete"],
            width: "40%"
          }];
        }

        var args = {
          fields: fields
        };
        this.displayFieldsTable = new Table(args);
        this.displayFieldsTable.placeAt(this.fieldTable);
        html.setStyle(this.displayFieldsTable.domNode, {
          'height': '100%'
        });
        this.displayFieldsTable.startup();

        this.operationsList = [];
        if (this.callerTab.type === "summary") {
          this.operationsList.push({
            value: 'sum',
            label: this.nls.sum
          }, {
            value: 'avg',
            label: this.nls.avg
          }, {
            value: 'min',
            label: this.nls.min
          }, {
            value: 'max',
            label: this.nls.max
          });
        } else if (this.callerTab.type === "groupedSummary") {
          this.operationsList.push({
            value: 'pre',
            label: this.nls.prefix
          }, {
            value: 'suf',
            label: this.nls.suffix
          });
        }

        this._initCheckBoxes();

        // TO DO: change column label
        /*jshint unused: true*/
        if (this.callerTab.type === "summary") {
          domStyle.set(this.chk_summary, "display", "block");
          domStyle.set(this.chk_summaryLabels, "display", "block");
          domStyle.set(this.chk_countOnly, "display", "none");
          domStyle.set(this.editAreaOptions, "display", "block");
          domStyle.set(this.editLengthOptions, "display", "block");
        } else {
          domStyle.set(this.chk_countOnly, "display", "block");
          domStyle.set(this.chk_summary, "display", "none");
          domStyle.set(this.chk_summaryLabels, "display", "none");
          domStyle.set(this.editAreaOptions, "display", "none");
          domStyle.set(this.editLengthOptions, "display", "none");
        }

        this.btnCancel.innerText = this.nls.common.cancel;
        this.own(on(this.btnCancel, 'click', lang.hitch(this, function () {
          this.emit('cancel');
        })));

        this.btnOk.innerText = this.nls.common.ok;
        this.own(on(this.btnOk, 'click', lang.hitch(this, function () {
          if (!domClass.contains(this.btnOk, 'jimu-state-disabled')) {
            this.updateSummaryType();
            var ok = false;
            for (var key in this.advStat.stats) {
              if (this.advStat.stats.hasOwnProperty(key)) {
                ok = true;
              }
            }
            if (!ok) {
              this.advStat = null;
            }
            this._addFieldOrder();
            this._addReportOptions();
            this.emit('ok', this.advStat);
          }
        })));

        this.layerTables = [];
        this.summaryLayers = [];
        this.advStat = {};
        this._getAllValidLayers().then(lang.hitch(this, function () {
          if (this.callerTab.type === "groupedSummary") {
            //hide add field
            domStyle.set(this.btnAddField, "display", "none");
            if (this.hasFields) {
              this._addTabRow();
            }
          } else {
            if (this.hasFields) {
              this.addHandler = this.own(on(this.btnAddField, 'click', lang.hitch(this, this._addTabRow)));
              this.own(on(this.displayFieldsTable, 'row-delete', lang.hitch(this, this._rowDeleted)));
              this.own(on(this.displayFieldsTable, 'actions-edit', lang.hitch(this, this._rowEdit)));
            }
          }
        }));
      }
    },

    _addFieldOrder: function(){
      var fieldOrder = [];
      var rows = this.displayFieldsTable.getRows();
      array.forEach(rows, function(tr){
        if (tr.selectTypes) {
          fieldOrder.push({
            fieldName: tr.selectFields.value,
            fieldType: tr.selectTypes.value
          });
        } else {
          fieldOrder.push(tr.selectFields.value);
        }
      });
      if(fieldOrder.length > 1){
        this.advStat.fieldOrder = fieldOrder;
      }
    },

    _updateGeomOptions: function (geomType) {
      if (!geomType) {
        return;
      }
      this.chk_area.setStatus(geomType === "esriGeometryPolygon");
      this.editAreaOptions.setStatus(geomType === "esriGeometryPolygon" && this.chk_area.checked);

      this.chk_length.setStatus(geomType === "esriGeometryPolyline");
      this.editLengthOptions.setStatus(geomType === "esriGeometryPolyline" && this.chk_length.checked);
    },

    _getAllValidLayers: function (test) {
      var def = new Deferred();
      array.forEach(this.callerOpLayers, lang.hitch(this, function (OpLyr) {
        if (OpLyr.newSubLayers.length > 0) {
          this._recurseOpLayers(OpLyr.newSubLayers);
        } else {
          if (OpLyr.id === this.callerLayer) {
            this.layerList = OpLyr;
          }
        }
      }));
      if (this.layerList.layerObject.empty) {
        if (this.layerList.layerObject.url) {
          var tempFL = new FeatureLayer(this.layerList.layerObject.url);
          on(tempFL, "load", lang.hitch(this, function () {
            this._completeMapLayers(tempFL, test);
            def.resolve('sucess');
          }));
        }
      } else {
        this._completeMapLayers(this.layerList, test);
        def.resolve('sucess');
      }
      return def;
    },

    _recurseOpLayers: function (pNode) {
      var nodeGrp = pNode;
      array.forEach(nodeGrp, lang.hitch(this, function (Node) {
        if (Node.newSubLayers.length > 0) {
          this._recurseOpLayers(Node.newSubLayers);
        } else {
          if (Node.id === this.callerLayer) {
            this.layerList = Node;
          }
        }
      }));
    },

    //After the class has returned layers, push only Featurelayers and Layers into the layer list.
    /*jshint loopfunc: true */
    _completeMapLayers: function (args, test) {
      if (args) {
        var layer = typeof (args.layerObject) === 'undefined' ? args : args.layerObject;
        //get geom type and object id field
        var geomType = layer.geometryType;
        this.objectIdField = layer.objectIdField;
        var aStat = {
          "url": layer.url,
          "stats": {}
        };
        var _fields = lang.clone(layer.fields);
        var skipFields = this.getSkipFields(layer);
        var fields = [];
        array.forEach(_fields, function (f) {
          if (skipFields.indexOf(f.name) === -1) {
            fields.push(f);
          }
        });
        this.fields = fields;
        this.popUpFields = this._getPopupFields(layer);
        this.advStat = aStat;
        if (typeof (test) === 'undefined') {
          //update geom options
          this._updateGeomOptions(geomType);
          if (this.advStat.url) {
            if (typeof (this.callerTab.advStat) !== 'undefined' && this.callerTab.advStat) {
              if (this.callerTab.advStat.stats) {
                this._setFields(fields);
              } else {
                this._setFields(fields, true);
              }
              var statGroup = lang.clone(this.callerTab.advStat.stats);
              //added to support maintaining the field order across multiple analysis types
              // need to maintain the old way as well as older configs will not have the fieldOrder array
              if (this.callerTab.advStat.stats && this.callerTab.advStat.fieldOrder) {
                array.forEach(this.callerTab.advStat.fieldOrder, lang.hitch(this, function (orderInfo) {
                  var _fieldInfo = (orderInfo && orderInfo.hasOwnProperty('fieldName')) ?
                    this._initFieldsByFieldOrder(statGroup, orderInfo) : this._initFieldsByName(statGroup, orderInfo);
                  if (_fieldInfo) {
                    this._populateTabTableRow(_fieldInfo.key, _fieldInfo.element);
                    statGroup[_fieldInfo.key].splice(_fieldInfo.index, 1);
                    if (statGroup[_fieldInfo.key].length === 0) {
                      delete statGroup[_fieldInfo.key];
                    }
                  }
                }));
              }
              for (var key in statGroup) {
                if (key === "count") {
                  this.chk_count.setValue(true);
                  this.featureCountLabel.set('value', statGroup[key][0].label);
                } else if (key === "area") {
                  this.chk_area.setValue(true);
                  this.featureAreaLabel.set('value', statGroup[key][0].label);
                  this.areaOptions = statGroup[key][0];
                } else if (key === "length") {
                  this.chk_length.setValue(true);
                  this.featureLengthLabel.set('value', statGroup[key][0].label);
                  this.lengthOptions = statGroup[key][0];
                } else if (key === "tabCount") {
                  this.chk_count_only.setValue(statGroup[key]);
                } else {
                  if (typeof (this.callerTab.advStat.fieldOrder) === 'undefined') {
                    array.forEach(statGroup[key], lang.hitch(this, function (exp) {
                      this._populateTabTableRow(key, exp);
                    }));
                  }
                }
              }
            } else {
              this._setFields(fields, true);
            }
            var a = this.callerTab.advStat;
            if (!a || (typeof (a) !== 'undefined' && !a.hasOwnProperty('stats'))) {
              var hasPopupFields = this.popUpFields.length > 0;
              var fll = this.fieldsList.length;
              if (this.callerTab.type === 'groupedSummary') {
                fll = 1;
                if (!hasPopupFields) {
                  this._setFields(fields);
                }
              }
              if (fll > 0) {
                var maxCount = this.callerTab.type === 'summary' ? 21 : 4;
                var x = 0;
                field_loop:
                for (var i = 0; i < fll; i++) {
                  var add = false;
                  var f = this.fieldsList[i];
                  if (hasPopupFields) {
                    var popupField = this.popUpFields[i];
                    popup_field_loop:
                    for (var ii = 0; ii < this.fieldsList.length; ii++) {
                      f = this.fieldsList[ii];
                      if (f.value === popupField) {
                        add = true;
                        break popup_field_loop;
                      }
                    }
                  }
                  if (add) {
                    x += 1;
                    if (x < maxCount) {
                      this._addTabRow(f);
                    } else {
                      domClass.add(this.btnAddField, 'btn-add-disabled');
                      break field_loop;
                    }
                  }
                }
                if (x === 3) {
                  domClass.add(this.btnAddField, 'btn-add-disabled');
                }
              } else {
                domClass.add(this.btnAddField, 'btn-add-disabled');
                this.hasFields = false;
              }
            }
          }

          //set value of report options radio buttons
          if (this.callerTab.hasOwnProperty("advStat") &&
          (this.callerTab.advStat.hasOwnProperty("analysisSummaryForReport")) &&
          (this.callerTab.advStat.hasOwnProperty("PopUpSummaryForReport"))) {
            this.chk_analysisSummary.setValue(this.callerTab.advStat.analysisSummaryForReport);
            this.chk_PopUpSummary.setValue(this.callerTab.advStat.PopUpSummaryForReport);
          } else {
            this.chk_analysisSummary.setValue(true);
            this.chk_PopUpSummary.setValue(true);
          }

          if ((this.callerTab.type === 'groupedSummary' && this.popUpFields.length > 0) ||
            this.callerTab.type !== 'groupedSummary') {
            this._setFields(fields);
          }
        }
      }
    },

    _initFieldsByFieldOrder: function (stats, fieldOrder){
      return this._getFieldInfo(stats, fieldOrder.fieldType, fieldOrder.fieldName);
    },

    _initFieldsByName: function (stats, fieldName) {
      var skipKeys = ['count', 'area', 'length', 'tabCount'];
      for (var key in stats) {
        if (skipKeys.indexOf(key) === -1) {
          return this._getFieldInfo(stats, key, fieldName);
        }
      }
    },

    _getFieldInfo: function (stats, key, name) {
      var statGroup = stats[key];
      for (var i = 0; i < statGroup.length; i++) {
        var element = statGroup[i];
        if (element.expression && element.expression === name) {
          return {
            key: key,
            element: element,
            index: i,
            statGroup: statGroup
          };
        }
      }
    },

    _validatePopupFields: function () {
      var def = new Deferred();
      this._getAllValidLayers(true).then(lang.hitch(this, function () {
        var temp_fields = [];
        for (var i = 0; i < this.popUpFields.length; i++) {
          var pf = this.popUpFields[i];
          field_loop:
          for (var ii = 0; ii < this.fields.length; ii++) {
            var f = this.fields[ii];
            if (pf === f.name) {
              temp_fields.push(f);
              break field_loop;
            }
          }
        }

        //force summary type checks
        this.callerTab.type = 'summary';
        this._setFields(temp_fields, true);
        var validPopupFields = this.fieldsList.length > 0;
        this._setFields(this.fields);
        var validFields = this.fieldsList.length > 0;
        def.resolve({
          layer: this.callerLayer,
          hasPopupFields: temp_fields.length > 0,
          hasFields: this.fields.length > 0,
          hasSummaryPopupFields: validPopupFields,
          hasSummaryFields: validFields,
          popUpFields: temp_fields,
          validSummaryFields: this.fieldsList,
          advStat: this.advStat
        });
      }));
      return def;
    },

    _getPopupFields: function (layer) {
      var skipFields = this.getSkipFields(layer);
      var fldInfos;
      var fields = [];
      this.objectIdField = layer.objectIdField;
      if (layer.infoTemplate) {
        fldInfos = layer.infoTemplate.info.fieldInfos;
      } else if (layer.url && layer.url.indexOf("MapServer") > -1) {
        var lID = layer.url.split("MapServer/")[1];
        var mapLayers = this.map.itemInfo.itemData.operationalLayers;
        fldInfos = null;
        for (var ii = 0; ii < mapLayers.length; ii++) {
          var lyr = mapLayers[ii];
          if (lyr.layerObject && lyr.layerObject.infoTemplates) {
            var infoTemplate = lyr.layerObject.infoTemplates[lID];
            if (infoTemplate) {
              fldInfos = infoTemplate.infoTemplate.info.fieldInfos;
              break;
            }
          }
        }
      }
      if (fldInfos) {
        for (var j = 0; j < fldInfos.length; j++) {
          var _fi = fldInfos[j];
          if (_fi && _fi.visible && skipFields.indexOf(_fi.fieldName) === -1) {
            fields.push(_fi.fieldName);
          }
        }
      }
      return fields;
    },

    checkStringWidth: function (v) {
      var visSpan = domConstruct.create("div", {
        "class": "visDivLength",
        "id": "SA_VisDiv",
        "innerHTML": v
      }, this.domNode);

      var fitsWidth = visSpan.clientWidth < 220 ? true : false;

      domConstruct.destroy(visSpan);

      var allValid = fitsWidth;
      var id = registry.byNode(this.domNode).id;
      query('.validationBox').forEach(function (node) {
        var _dijit = registry.byNode(node);
        if (id !== _dijit.id) {
          allValid = allValid ? _dijit.state !== 'Error' : allValid;
        }
      });

      var s = query('.field-picker-footer')[0];
      if (s) {
        if (!allValid) {
          html.addClass(s.children[0], 'jimu-state-disabled');
        } else {
          html.removeClass(s.children[0], 'jimu-state-disabled');
        }
      }

      return fitsWidth;
    },

    _setFields: function (pFields, checkPopup) {
      var validFieldTypes = [
      'esriFieldTypeInteger',
      'esriFieldTypeSmallInteger',
      'esriFieldTypeDouble'
      ];
      if (this.callerTab.type !== "summary") {
        validFieldTypes.push('esriFieldTypeString');
        validFieldTypes.push('esriFieldTypeDate');
      }
      var options = [];
      var popupFieldsForType = [];
      array.forEach(pFields, lang.hitch(this, function (field) {
        if (validFieldTypes.indexOf(field.type) > -1) {
          if (checkPopup) {
            if (this.popUpFields && this.popUpFields.indexOf(field.name) > -1) {
              popupFieldsForType.push(field.name);
            }
          }
          options.push({
            'label': field.alias,
            'value': field.name
          });
        }
      }));
      if (options.length < 1) {
        domClass.add(this.btnAddField, 'btn-add-disabled');
        this.hasFields = false;
      } else {
        if ((!this.test)) {
          domStyle.set(this.displayFieldsTable.domNode, 'display', "block");
          domStyle.set(this.btnAddField, "display", "inline-block");
        }
      }
      if (popupFieldsForType.length !== this.popUpFields.length) {
        this.popUpFields = popupFieldsForType;
      }
      this.fieldsList = lang.clone(options);
    },

    _populateTabTableRow: function (pKey, pTab) {
      var result = this.displayFieldsTable.addRow({});
      if (result.success && result.tr) {
        var tr = result.tr;
        this._addTabFields(tr);
        this._addTabTypes(tr);
        this._addTabLabel(tr);
        tr.selectFields.set("value", pTab.expression);
        if (this.callerTab.type === "summary" || this.callerTab.type === "groupedSummary" || pTab.validLabel) {
          tr.labelText.set("value", pTab.label);
        }
        if (tr.selectTypes) {
          tr.selectTypes.set("value", pKey);
        }
        this._addFieldOptions(tr, pTab);
      }
      this._checkFields();
    },

    _addTabRow: function (field) {
      var numRows = this.displayFieldsTable.getRows().length;
      if (this.callerTab.type !== "summary" && numRows >= 3) {
        new Message({
          message: this.nls.max_records
        });
        return;
      }
      if (this.callerTab.type === "groupedSummary" && numRows > 0) {
        return;
      }
      var result = this.displayFieldsTable.addRow({});
      if (result.success && result.tr) {
        var tr = result.tr;
        this._addTabFields(tr);
        this._addTabTypes(tr);
        this._addTabLabel(tr);
        if (field) {
          tr.selectFields.set("value", field.value);
        }
        this._enableOk();
      }
      this._checkFields();
    },

    _checkFields: function () {
      if (this.callerTab.type !== "summary" && this.callerTab.type !== "groupedSummary") {
        if (this.displayFieldsTable.getRows().length === 3) {
          domClass.add(this.btnAddField, 'btn-add-disabled');
        }
      }
    },

    _addTabFields: function (tr) {
      var lyrOptions = lang.clone(this.fieldsList);
      var td = query('.simple-table-cell', tr)[0];
      if (td) {
        var className;
        if (this.callerTab.type === "summary") {
          className = "shortSelect";
        } else {
          className = "longSelect";
        }
        var tabLayers = new Select({
          style: {
            height: "24px",
            width: "100%"
          },
          "class": className,
          options: lyrOptions
        });
        tabLayers.placeAt(td);
        tabLayers.startup();
        tr.selectFields = tabLayers;
      }
    },

    _addTabLabel: function (tr) {
      var td = query('.simple-table-cell', tr)[1];
      var labelTextBox = new ValidationTextBox({
        style: {
          width: "100%",
          height: "24px"
        },
        "class": "validationBox"
      });

      labelTextBox.invalidMessage = this.nls.invalid_string_width;
      labelTextBox.placeAt(td);
      labelTextBox.startup();
      labelTextBox.validator = this.checkStringWidth;
      tr.labelText = labelTextBox;
    },

    _addTabTypes: function (tr) {
      if (this.callerTab.type !== "summary" && this.callerTab.type !== "groupedSummary") {
        return;
      }
      var typeOptions = lang.clone(this.operationsList);
      var td = query('.simple-table-cell', tr)[2];
      if (td) {
        var tabTypes = new Select({
          style: {
            width: "100%",
            height: "24px"
          },
          options: typeOptions
        });
        tabTypes.placeAt(td);
        tabTypes.startup();
        tr.selectTypes = tabTypes;
      }
    },

    _addFieldOptions: function (tr, pTab) {
      tr.modify = pTab.modify;
      tr.round = pTab.round;
      tr.truncate = pTab.truncate;
      tr.roundPlaces = pTab.roundPlaces;
      tr.truncatePlaces = pTab.truncatePlaces;
    },

    getSkipFields: function (layer) {
      var skipFields = [];
      if (layer.fields) {
        for (var i = 0; i < layer.fields.length; i++) {
          var f = layer.fields[i];
          if (f && f.type && f.name) {
            if (f.type === 'esriFieldTypeGeometry') {
              skipFields.push(f.name);
            }
          }
        }
      }

      if (layer.globalIdField && layer.globalIdField !== '') {
        skipFields.push(layer.globalIdField);
      }
      if (layer.objectIdField && layer.objectIdField !== '') {
        skipFields.push(layer.objectIdField);
      }
      return skipFields;
    },

    getDefaultFields: function (fields, summaryFields, type) {
      //similar to updateSummaryType
      // get the same fields that would be used as the default if
      // valid fields are found and the user never visits the field picker to explicitly define the fields
      var advStat = {
        stats: {
          fields: [],
          tabCount: false
        },
        analysisSummaryForReport: true,
        PopUpSummaryForReport: true
      };
      if (type !== "summary" && type !== "groupedSummary") {
        var flds = [];
        for (var i = 0; i < (fields.length < 3 ? fields.length : 3); i++) {
          var field = fields[i];
          flds.push({
            value: 0,
            expression: field.name,
            label: field.alias
          });
        }
        if (flds.length > 0) {
          advStat.stats.outFields = flds;
        }
      } else if (type === 'summary') {
        if (summaryFields && summaryFields.hasOwnProperty('length') && summaryFields.length > 0) {
          advStat.stats.sum = [];
          array.forEach(summaryFields, lang.hitch(this, function (field) {
            advStat.stats.sum.push({
              value: 0,
              expression: field.name || field.value,
              label: field.alias ? field.alias : field.label ? field.label : field.name || field.value
            });
          }));
        }
      }
      return advStat;
    },

    updateSummaryType: function () {
      var trs = this.displayFieldsTable.getRows();
      if (this.callerTab.type !== "summary" && this.callerTab.type !== "groupedSummary") {
        var flds = [];
        array.forEach(trs, function (tr) {
          flds.push({
            value: 0,
            expression: tr.selectFields.value,
            label: utils.stripHTML(tr.labelText.value),
            validLabel: true,
            modify: tr.modify,
            round: tr.round,
            truncate: tr.truncate,
            roundPlaces: tr.roundPlaces,
            truncatePlaces: tr.truncatePlaces
          });
        });
        if (flds.length > 0) {
          this.advStat.stats.outFields = flds;
        }
        this.advStat.stats.tabCount = this.chk_count_only.getValue();
      } else {
        // count
        if (this.callerTab.type === "groupedSummary") {
          this.advStat.stats.tabCount = this.chk_count_only.getValue();
        } else {
          this.advStat.stats.tabCount = this.chk_count.getValue();
        }
        if (this.chk_count.getValue()) {
          this.advStat.stats.count = [
            {
              value: 0,
              expression: this.objectIdField,
              label: utils.stripHTML(this.featureCountLabel.value ? this.featureCountLabel.value : this.nls.count)
            }
          ];
        }
        //area
        if (this.chk_area.getValue()) {
          this.advStat.stats.area = [
            {
              value: 0,
              expression: this.objectIdField,
              label: utils.stripHTML(this.featureAreaLabel.value ? this.featureAreaLabel.value : this.nls.area)
            }
          ];
          if (this.areaOptions) {
            lang.mixin(this.advStat.stats.area[0], this.areaOptions);
          }
        }
        //length
        if (this.chk_length.getValue()) {
          this.advStat.stats.length = [
            {
              value: 0,
              expression: this.objectIdField,
              label: utils.stripHTML(this.featureLengthLabel.value ? this.featureLengthLabel.value : this.nls.length)
            }
          ];
          if (this.lengthOptions) {
            lang.mixin(this.advStat.stats.length[0], this.lengthOptions);
          }
        }
        // sum, avg, min, max
        array.forEach(trs, lang.hitch(this, function (tr) {
          if (typeof (this.advStat.stats[tr.selectTypes.value]) === 'undefined') {
            this.advStat.stats[tr.selectTypes.value] = [];
          }
          var statBlock = {
            value: 0,
            expression: tr.selectFields.value,
            modify: tr.modify,
            round: tr.round,
            truncate: tr.truncate,
            roundPlaces: tr.roundPlaces,
            truncatePlaces: tr.truncatePlaces
          };
          //textDirNode.innerText was coming back undefined if the widget was configured in FF
          //Field names in "advanced" summary mode were not displaying correctly when the attributes were turned off in the corresponding popup configuration
          for (var i = 0; i < tr.selectFields.options.length; i++) {
            if (tr.selectFields.options[i].value === tr.selectFields.value) {
              if (this.callerTab.type !== "groupedSummary") {
                statBlock.label = tr.labelText.value ? tr.labelText.value : tr.selectFields.options[i].label;
              } else {
                statBlock.label = tr.labelText.value;
              }
              break;
            }
          }
          if (typeof (statBlock.label) === 'undefined') {
            statBlock.label = statBlock.expression;
          }
          this.advStat.stats[tr.selectTypes.value].push(statBlock);
        }));
      }
      console.log("ADVSTAT", this.advStat);
    },

    chkCountChanged: function (v) {
      if (this.callerTab.type === "summary") {
        this.updateLabel(this.featureCountLabel, v);
        if (!v) {
          var trs = this.displayFieldsTable.getRows();
          if (trs.length === 0) {
            this._disableOk();
          } else {
            this._enableOk();
          }
        } else {
          this._enableOk();
        }
      }
    },

    chkAreaChanged: function (v) {
      this.updateLabel(this.featureAreaLabel, v);
      this.updateEdit(this.editAreaOptions, v);
    },

    showAreaOptions: function () {
      if (!domClass.contains(this.editAreaOptions, 'edit-fields-disabled')) {
        this._showEditOptions('area');
      }
    },

    chkLengthChanged: function (v) {
      this.updateLabel(this.featureLengthLabel, v);
      this.updateEdit(this.editLengthOptions, v);
    },

    showLengthOptions: function () {
      if (!domClass.contains(this.editLengthOptions, 'edit-fields-disabled')) {
        this._showEditOptions('length');
      }
    },

    _showEditOptions: function (type) {
      //show options
      var obj = type === 'area' ? this.areaOptions : this.lengthOptions;
      this._initFieldOptions(obj, type);
    },

    _initFieldOptions: function (tr, type) {
      var sourceDijit = new FieldOptions({
        nls: this.nls,
        tr: type === 'area' ? this.areaOptions : type === 'length' ? this.lengthOptions : tr
      });

      var popup = new Popup({
        width: 445,
        autoHeight: true,
        content: sourceDijit,
        titleLabel: this.nls.fieldOptions,
        nls: this.nls
      });

      this.own(on(sourceDijit, 'ok', lang.hitch(this, function (options) {
        if (type === 'area') {
          this.areaOptions = options;
        } else if (type === 'length') {
          this.lengthOptions = options;
        } else {
          lang.mixin(tr, options);
        }
        sourceDijit.destroy();
        sourceDijit = null;
        popup.close();
      })));

      this.own(on(sourceDijit, 'cancel', lang.hitch(this, function () {
        sourceDijit.destroy();
        sourceDijit = null;
        popup.close();
      })));
    },

    updateLabel: function(c, v){
      c.set("disabled", !v);
      c.validator = this.checkStringWidth;
      c.invalidMessage = this.nls.invalid_string_width;
      if (v && c.value === '') {
        var l = '';
        if (c.id === this.featureCountLabel.id) {
          l = this.nls.count;
        } else if (c.id === this.featureAreaLabel.id) {
          l = this.nls.area;
        } else if (c.id === this.featureLengthLabel.id) {
          l = this.nls.length;
        }
        c.set("value", l);
      }
      this.validateAll();
    },

    updateEdit: function (c, v) {
      c.setStatus(v);
    },

    validateAll: function(){
      var allValid = true;
      query('.validationBox').forEach(function (node) {
        var _dijit = registry.byNode(node);
        allValid = allValid ? _dijit.state !== 'Error' : allValid;
      });

      var s = query('.field-picker-footer')[0];
      if (s) {
        if (!allValid) {
          html.addClass(s.children[0], 'jimu-state-disabled');
        } else {
          html.removeClass(s.children[0], 'jimu-state-disabled');
        }
      }
    },

    _rowDeleted: function () {
      this.validateAll();
      var trs = this.displayFieldsTable.getRows();
      if (trs.length === 0) {
        if (this.callerTab.type === "summary" && this.chk_count.getValue()) {
          this._enableOk();
        } else {
          this._disableOk();
        }
      } else {
        this._enableOk();
      }
      if (this.callerTab.type !== "summary" && this.callerTab.type !== "groupedSummary") {
        if (trs.length < 3 && domClass.contains(this.btnAddField,'btn-add-disabled')) {
          domClass.remove(this.btnAddField, 'btn-add-disabled');
        }
      }
    },

    _rowEdit: function (tr) {
      var validField = this._validateRowType(tr.selectFields.value);

      if (validField) {
        //show field options
        this._initFieldOptions(tr, '', false);
      } else {
        //show message that the field is not supported
        new Message({
          message: this.nls.onlyDouble
        });
      }
    },

    _validateRowType: function (fieldName) {
      //verify that this is a float or integer field
      // the only time integer will do anything is when the analysis type is average
      // otherwise this could have been limited to only double field types
      var nums = ['esriFieldTypeDouble', 'esriFieldTypeInteger', 'esriFieldTypeSmallInteger', 'esriFieldTypeSingle'];
      var _fields = this.fields.filter(function (_field) {
        return _field.name === fieldName && (nums.indexOf(_field.type) > -1);
      });
      return _fields && _fields.length > 0;
    },

    _disableOk: function () {
      var s = query('.field-picker-footer')[0];
      if (s) {
        html.addClass(s.children[0], 'jimu-state-disabled');
      }
    },

    _enableOk: function () {
      var s = query('.field-picker-footer')[0];
      if (s) {
        html.removeClass(s.children[0], 'jimu-state-disabled');
      }
    },

    destroy: function () {
      this.advStat = null;
    },

    /**
     * This function is used to get values of report options radio buttons
     */
    _addReportOptions: function () {
      this.advStat.analysisSummaryForReport = this.chk_analysisSummary.getValue();
      this.advStat.PopUpSummaryForReport = this.chk_PopUpSummary.getValue();
    }
  });
});
