///////////////////////////////////////////////////////////////////////////
// Copyright © 2015 Esri. All Rights Reserved.
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
  'dojo/on',
  'dojo/query',
  'jimu/BaseWidget',
  'jimu/dijit/Message',
  'jimu/utils',
  'esri/layers/FeatureLayer',
  'dojo/text!./FieldPicker.html',
  'dojo/Evented',
  'jimu/dijit/SimpleTable'],
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
  on,
  query,
  BaseWidget,
  Message,
  utils,
  FeatureLayer,
  template,
  Evented,
  Table) {
  return declare([BaseWidget, _WidgetsInTemplateMixin, Evented], {
    templateString: template,
    baseClass: 'jimu-widget-SAT-setting',
    advStat: {},
    fieldsList: null,
    callerLayer: null,
    callerTab: null,
    callerOpLayers: null,
    layerList: null,

    constructor: function (/*Object*/args) {
      this.map = args.map;
    },

    postMixInProperties: function () {
      this.inherited(arguments);
      this.nls.common = window.jimuNls.common;
    },

    postCreate: function () {
      this.inherited(arguments);
      this.startup();
    },

    startup: function () {
      var fields = null;
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
          type: "empty"
        }, {
          name: "actions",
          title: this.nls.actionsTitle,
          "class": "actions",
          type: "actions",
          actions: ["up", "down", "delete"]
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
          name: "actions",
          title: this.nls.actionsTitle,
          "class": "actions",
          type: "actions",
          actions: ["up", "down", "delete"],
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

      // TO DO: change column label
      /*jshint unused: true*/
      if (this.callerTab.type === "summary") {
        domStyle.set(this.chk_summary, "display", "block");
        domStyle.set(this.chk_summaryLabels, "display", "block");
      } else {
        domStyle.set(this.chk_summary, "display", "none");
        domStyle.set(this.chk_summaryLabels, "display", "none");
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
          this.emit('ok', this.advStat);
        }
      })));

      this.layerTables = [];
      this.summaryLayers = [];
      this.advStat = {};
      this._getAllValidLayers();

      if (this.callerTab.type === "groupedSummary") {
        //hide add field
        domStyle.set(this.btnAddField, "display", "none");
      } else {
        this.own(on(this.btnAddField, 'click', lang.hitch(this, this._addTabRow)));
        this.own(on(this.displayFieldsTable, 'row-delete', lang.hitch(this, this._rowDeleted)));
      }
    },

    _updateGeomOptions: function (geomType) {
      if (!geomType) {
        return;
      }
      this.chk_area.set("disabled", (geomType !== "esriGeometryPolygon"));
      this.chk_length.set("disabled", (geomType !== "esriGeometryPolyline"));
    },

    _getAllValidLayers: function () {
      array.forEach(this.callerOpLayers, lang.hitch(this, function (OpLyr) {
        if (OpLyr.newSubLayers.length > 0) {
          this._recurseOpLayers(OpLyr.newSubLayers);
        } else {
          if (OpLyr.title === this.callerLayer) {
            this.layerList = OpLyr;
          }
        }
      }));
      if (this.layerList.layerObject.empty) {
        var tempFL = new FeatureLayer(this.layerList.layerObject.url);
        on(tempFL, "load", lang.hitch(this, function () {
          this._completeMapLayers(tempFL);
        }));
      } else {
        this._completeMapLayers(this.layerList);
      }
    },

    _recurseOpLayers: function (pNode) {
      var nodeGrp = pNode;
      array.forEach(nodeGrp, lang.hitch(this, function (Node) {
        if (Node.newSubLayers.length > 0) {
          this._recurseOpLayers(Node.newSubLayers);
        } else {
          if (Node.title === this.callerLayer) {
            this.layerList = Node;
          }
        }
      }));
    },

    //After the class has returned layers, push only Featurelayers and Layers into the layer list.
    /*jshint loopfunc: true */
    _completeMapLayers: function (args) {
      if (args) {
        var layer = args;
        var fields;
        var aStat;
        var geomType;
        if (typeof (layer.layerObject) === 'undefined') {
          // ST: get geom type and object id field
          geomType = layer.geometryType;
          this.objectIdField = layer.objectIdField;
          aStat = {
            "url": layer.url,
            "stats": {}
          };
          fields = lang.clone(layer.fields);
        } else {
          // ST: get geom type and object id field
          geomType = layer.layerObject.geometryType;
          this.objectIdField = layer.layerObject.objectIdField;
          aStat = {
            "url": layer.layerObject.url,
            "stats": {}
          };
          fields = lang.clone(layer.layerObject.fields);
        }

        this.advStat = aStat;
        // ST: update geom options
        this._updateGeomOptions(geomType);

        if (this.advStat.url) {
          this._setFields(fields);
          if (typeof (this.callerTab.advStat) !== 'undefined' && this.callerTab.advStat) {
            var statGroup = this.callerTab.advStat.stats;
            for (var key in statGroup) {
              if (key === "count") {
                this.chk_count.set('value', true);
                this.featureCountLabel.set('value', statGroup[key][0].label);
              } else if (key === "area") {
                this.chk_area.set('value', true);
                this.featureAreaLabel.set('value', statGroup[key][0].label);
              } else if (key === "length") {
                this.chk_length.set('value', true);
                this.featureLengthLabel.set('value', statGroup[key][0].label);
              } else {
                array.forEach(statGroup[key], lang.hitch(this, function (exp) {
                  this._populateTabTableRow(key, exp);
                }));
              }
            }
          }
          var a = this.callerTab.advStat;
          if (!a || (typeof(a) !== 'undefined' && !a.hasOwnProperty('stats'))) {
            if (this.fieldsList.length > 0) {
              this._addTabRow();
            } else {
              domStyle.set(this.displayFieldsTable.domNode, 'display', "none");
              domStyle.set(this.btnAddField, "display", "none");
            }
          }
        }
      }
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

    _setFields: function (pFields) {
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
      array.forEach(pFields, lang.hitch(this, function (field) {
        if (validFieldTypes.indexOf(field.type) > -1) {
          options.push({
            'label': field.alias,
            'value': field.name
          });
        }
      }));
      if (options.length < 1) {
        domStyle.set(this.btnAddField, "display", "none");
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
        if (this.callerTab.type === "summary" || this.callerTab.type === "groupedSummary") {
          tr.labelText.set("value", pTab.label);
          tr.selectTypes.set("value", pKey);
        }
      }
    },

    _addTabRow: function () {
      if (this.callerTab.type !== "summary" && this.displayFieldsTable.getRows().length >= 3) {
        new Message({
          message: this.nls.max_records
        });
        return;
      }
      var result = this.displayFieldsTable.addRow({});
      if (result.success && result.tr) {
        var tr = result.tr;
        this._addTabFields(tr);
        this._addTabTypes(tr);
        this._addTabLabel(tr);
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
            height: "26px",
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
      if (this.callerTab.type !== "summary" && this.callerTab.type !== "groupedSummary") {
        return;
      }
      var td = query('.simple-table-cell', tr)[1];
      var labelTextBox = new ValidationTextBox({
        style: {
          width: "100%",
          height: "26px"
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
            height: "26px"
          },
          options: typeOptions
        });
        tabTypes.placeAt(td);
        tabTypes.startup();
        tr.selectTypes = tabTypes;
      }
    },

    updateSummaryType: function () {
      var trs = this.displayFieldsTable.getRows();
      if (this.callerTab.type !== "summary" && this.callerTab.type !== "groupedSummary") {
        var flds = [];
        array.forEach(trs, function (tr) {
          flds.push({
            value: 0,
            expression: tr.selectFields.value,
            label: tr.selectFields.value
          });
        });
        if (flds.length > 0) {
          this.advStat.stats.outFields = flds;
        }
      } else {
        // count
        if (this.chk_count.checked) {
          //this.summaryLayers[0].stats.count = [
          this.advStat.stats.count = [
            {
              value: 0,
              expression: this.objectIdField,
              label: utils.stripHTML(this.featureCountLabel.value ? this.featureCountLabel.value : this.nls.count)
            }
          ];
        }
        //area
        if (this.chk_area.checked) {
          //this.summaryLayers[0].stats.area = [
          this.advStat.stats.area = [
            {
              value: 0,
              expression: this.objectIdField,
              label: utils.stripHTML(this.featureAreaLabel.value ? this.featureAreaLabel.value : this.nls.area)
            }
          ];
        }
        //length
        if (this.chk_length.checked) {
          //this.summaryLayers[0].stats.length = [
          this.advStat.stats.length = [
            {
              value: 0,
              expression: this.objectIdField,
              label: utils.stripHTML(this.featureLengthLabel.value ? this.featureLengthLabel.value : this.nls.length)
            }
          ];
        }
        // sum, avg, min, max
        array.forEach(trs, lang.hitch(this, function (tr) {
          if (typeof (this.advStat.stats[tr.selectTypes.value]) === 'undefined') {
            this.advStat.stats[tr.selectTypes.value] = [];
          }
          var statBlock = {};
          statBlock.value = 0;
          statBlock.expression = tr.selectFields.value;
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
      this.updateLabel(this.featureCountLabel, v);
    },

    chkAreaChanged: function (v) {
      this.updateLabel(this.featureAreaLabel, v);
    },

    chkLengthChanged: function (v) {
      this.updateLabel(this.featureLengthLabel, v);
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
    },

    destroy: function () {
      this.advStat = null;
    }
  });
});
