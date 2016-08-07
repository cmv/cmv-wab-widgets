define([
  'dojo/_base/declare',
  'dijit/_WidgetsInTemplateMixin',
  'jimu/BaseWidget',
  'dijit',
  'jimu/dijit/FilterParameters',
  'dojo/dom',
  'dojo/dom-construct',
  'dojo/dom-class',
  'dojo/dom-attr',
  'dojo/dom-style',
  'dojo/on',
  'dojo/query',
  'dojo/string',
  'dojo/_base/lang',
  'dojo/_base/array',
  'dojo/date/locale',
  'dijit/form/Select',
  'dijit/form/TextBox',
  'dijit/form/DateTextBox',
  'dijit/form/NumberTextBox',
  'dijit/registry',
  'jimu/LayerInfos/LayerInfos',
  'jimu/utils',
  'jimu/FilterManager',
  './SaveJSON',
  './ReadJSON',
  'dojox/html/entities',
  'dijit/form/CheckBox'
],
function(declare, _WidgetsInTemplateMixin, BaseWidget, dijit, FilterParameters, dom,
  domConstruct, domClass, domAttr, domStyle, on, query, string, lang, array, locale, Select, TextBox,
  DateTextBox, NumberTextBox, registry, LayerInfos, utils, FilterManager, saveJson, readJson, entities) {
  //To create a widget, you need to derive from BaseWidget.
  return declare([BaseWidget, _WidgetsInTemplateMixin], {

    baseClass: 'jimu-widget-map-filter',

    layerList: null,
    grpSelect: null,
    groupCounter: 0,
    defaultDef: null,
    runTimeConfig: null,
    useDomain: null,
    useDate: null,
    useValue: null,
    runInitial: false,

    postCreate: function() {
      this.inherited(arguments);
      this.defaultDef = [];
    },

    startup: function() {
      this.inherited(arguments);
      if(this.config.optionsMode) {
        domClass.add(this.optionsIcon, "hide-items");
      }

      if(this.config.groups[0].defaultVal !== "" && this.config.groups[0].operator !== "") {
        this.runInitial = true;
      }

      this.createMapLayerList();

    },

    btnNewRowAction: function() {
      this.createNewRow({operator:"=", value:"", conjunc:"OR", state:"new"});
    },

    createMapLayerList: function() {
      LayerInfos.getInstance(this.map, this.map.itemInfo)
        .then(lang.hitch(this, function(operLayerInfos) {
          if(operLayerInfos._layerInfos && operLayerInfos._layerInfos.length > 0) {
            this.layerList = operLayerInfos._layerInfos;

            array.forEach(this.layerList, lang.hitch(this, function(layer) {
              if(layer.originOperLayer.layerType !== "ArcGISTiledMapServiceLayer" &&
                typeof(layer.originOperLayer.featureCollection) === 'undefined') {

                if(typeof(layer.layerObject._defnExpr) !== 'undefined') {
                  this.defaultDef.push({
                    layer: layer.id,
                    definition: layer.layerObject._defnExpr,
                    visible: layer.layerObject.visible
                  });
                }
                else if(typeof(layer.layerObject.defaultDefinitionExpression) !== 'undefined' &&
                  typeof(layer.layerObject.getDefinitionExpression()) === 'function' ) {
                  this.defaultDef.push({
                    layer: layer.id,
                    definition: layer.layerObject.getDefinitionExpression(),
                    visible: layer.layerObject.visible
                  });
                }
                else if(typeof(layer.layerObject.layerDefinitions) !== 'undefined') {
                  this.defaultDef.push({
                    layer: layer.id,
                    definition: layer.layerObject.layerDefinitions,
                    visible: layer._visible
                  });
                }
                else {
                  this.defaultDef.push({layer: layer.id, definition: "1=1", visible: layer.layerObject.visible});
                }
              }

            }));
            this.createGroupSelection();
          }
        }));
    },

    checkDomainUse: function(pParam) {
      this.useDomain = null;
      this.useValue = null;
      array.forEach(this.config.groups, lang.hitch(this, function(group) {
        if(group.name === pParam.group) {
          array.forEach(group.layers, lang.hitch(this, function(grpLayer) {
            array.forEach(this.layerList, lang.hitch(this, function(layer) {
              if(grpLayer.layer === layer.id) {
                array.forEach(layer.layerObject.fields, lang.hitch(this, function(field) {
                  if(field.name === grpLayer.field) {
                    if(grpLayer.useDomain !== "") {
                      this.useValue = grpLayer.useDomain;
                      if(typeof(field.domain) !== 'undefined') {
                        this.useDomain = field.domain;
                      }
                    }
                  }
                }));
              }
            }));
          }));
        }
      }));
    },

    checkDateUse: function(pParam) {
      this.useDate = null;
      array.forEach(this.config.groups, lang.hitch(this, function(group) {
        if(group.name === pParam.group) {
          array.forEach(group.layers, lang.hitch(this, function(grpLayer) {
            array.forEach(this.layerList, lang.hitch(this, function(layer) {
              if(grpLayer.layer === layer.id) {
                array.forEach(layer.layerObject.fields, lang.hitch(this, function(field) {
                  if(field.name === grpLayer.field) {
                    if((field.type).indexOf("Date") >= 0) {
                      this.useDate = true;
                    }
                  }
                }));
              }
            }));
          }));
        }
      }));
    },

    createGroupSelection: function() {
      var ObjList = [];
      var descLabel = '';
      array.forEach(this.config.groups, lang.hitch(this, function(group) {
        var grpObj = {};
        grpObj.value = group.name;
        grpObj.label = group.name;
        grpObj.selected = false;
        ObjList.push(grpObj);
      }));

      this.grpSelect = new Select({
        options: ObjList
      }).placeAt(this.groupPicker);

      this.grpSelect.startup();
      this.own(on(this.grpSelect, "change", lang.hitch(this, function(val) {
        this.resetLayerDef();
        this.removeAllRows();
        this.checkDomainUse({group: val});
        this.checkDateUse({group: val});
        this.reconstructRows(val);
        this.updateGroupDesc(val);
        setTimeout(lang.hitch(this, this.setFilterLayerDef), 500);
      })));
      this.checkDomainUse({group: this.grpSelect.value});
      this.checkDateUse({group: this.grpSelect.value});

      if(typeof(this.config.groups[0]) !== 'undefined') {
        descLabel = this.config.groups[0].desc;
        this.groupDesc.innerHTML = descLabel;
      }

      var defaultVal = this.checkDefaultValue(this.config.groups[0]);
      var defaultOp = this.checkDefaultOperator(this.config.groups[0]);
      this.createNewRow({operator:defaultOp, value:defaultVal, conjunc:"OR", state:"new"});
    },

    createNewRow: function(pValue) {
      var table = dom.byId("tblPredicates");

      var prevRowConjunTable;
      var prevRowConjunCell;

      if(pValue.state === "new") {
        if(table.rows.length > 1) {
          prevRowConjunTable = table.rows[(table.rows.length - 1)].cells[0].firstChild;
          prevRowConjunCell = prevRowConjunTable.rows[2].cells[0];
          this.createConditionSelection(prevRowConjunCell, pValue);
        } else {
          if(table.rows.length === 1) {
            prevRowConjunTable = table.rows[(table.rows.length - 1)].cells[0].firstChild;
            prevRowConjunCell = prevRowConjunTable.rows[2].cells[0];
            this.createConditionSelection(prevRowConjunCell, pValue);
          }
        }
      }

      var row = table.insertRow(-1);
      var subTableNode = row.insertCell(0);
      var deleteNode = row.insertCell(1);
      domClass.add(subTableNode, "criteriaCellSize");
      domClass.add(deleteNode, "deleteCellSize");

      var subTable = domConstruct.create("table", {border: "0", width: "100%"}, subTableNode);

      var rowOperator = subTable.insertRow(-1);
      var cell_operator = rowOperator.insertCell(0);

      var rowValue = subTable.insertRow(-1);
      var cell_value = rowValue.insertCell(0);

      var rowConjunc = subTable.insertRow(-1);
      var cell_conjunc = rowConjunc.insertCell(0);

      domStyle.set(cell_conjunc, {paddingLeft: "3px", paddingRight: "3px"});
      domClass.add(rowOperator, "operator-class");

      this.colorRows();

      this.createOperatorSelection(cell_operator, pValue);
      this.removeTableRow(deleteNode, row, table.rows.length);
      this.createInputFilter(cell_value, pValue);

      this.resize();

      //check simple mode
      if(this.config.simpleMode) {
        domClass.add(this.btnCriteria, "hide-items");
        domClass.add(rowOperator, "hide-items");
        query(".container").style("borderTop", "0px");
        domStyle.set(cell_value, {paddingLeft: "0px", paddingRight: "0px"});
      }

      if(pValue.state === "reload") {
        if(pValue.conjunc !== "") {
          prevRowConjunTable = table.rows[(table.rows.length - 1)].cells[0].firstChild;
          prevRowConjunCell = prevRowConjunTable.rows[2].cells[0];
          this.createConditionSelection(prevRowConjunCell, pValue);
        }
      } else {
        if(this.runInitial) {
          this.runInitial = false;
          setTimeout(lang.hitch(this, this.setFilterLayerDef), 500);
        }
      }

    },

    colorRows: function() {
      var table = dom.byId("tblPredicates");
      var rows = table.rows;
      array.forEach(rows, function(row, i) {
        if(i % 2 === 0) {
          domClass.remove(row, "tableRow");

        } else {
          domClass.add(row, "tableRow");
        }
      });
    },

    createOperatorSelection: function(pCell, pValue) {
      var ObjList = [
        {'value': '=', 'label': this.nls.inputs.optionEQUAL},
        {'value': '<>', 'label': this.nls.inputs.optionNOTEQUAL},
        {'value': '>', 'label': this.nls.inputs.optionGREATERTHAN},
        {'value': '>=', 'label': this.nls.inputs.optionGREATERTHANEQUAL},
        {'value': '<', 'label': this.nls.inputs.optionLESSTHAN},
        {'value': '<=', 'label': this.nls.inputs.optionLESSTHANEQUAL},
        {'value': 'START', 'label': this.nls.inputs.optionSTART},
        {'value': 'END', 'label': this.nls.inputs.optionEND},
        {'value': 'LIKE', 'label': this.nls.inputs.optionLIKE},
        {'value': 'NOT LIKE', 'label': this.nls.inputs.optionNOTLIKE}
      ];
      var opSelect = new Select({
        options: ObjList,
        "class": "operatorSelect"
      }).placeAt(pCell);
      opSelect.startup();
      opSelect.set('value', entities.decode(pValue.operator));
      this.own(on(opSelect, "click", lang.hitch(this, function() {

      })));
      this.own(on(opSelect, "change", lang.hitch(this, function() {

      })));

    },

    createInputFilter: function(pCell, pValue) {
      domConstruct.empty(pCell);
      if(this.useDomain !== null) {
        if(typeof(this.useDomain.codedValues) !== 'undefined') {
          /*
          var ObjList = [];
          array.forEach(this.useDomain.codedValues, lang.hitch(this, function(codedVal) {
            ObjList.push({'value': codedVal.code, 'label': codedVal.name});
          }));
          var domainSelect = new Select({
            options: ObjList,
            "class": "userInputNormal"
          }).placeAt(pCell);
          domainSelect.startup();
          domainSelect.set('value', pValue.value);
          */
          var domainSelect = new FilterParameters();
          domainSelect.placeAt(pCell);
          domainSelect.startup();
          this.createValueList(pValue, domainSelect);
        } else {
          var defaultNum = "";
          if(pValue.value !== "") {
            defaultNum = Number(pValue.value);
          }
          var txtRange = new NumberTextBox({
            value: defaultNum,
            placeHolder: string.substitute(this.nls.inputs.textboxNumber, {
              0 : this.useDomain.minValue,
              1 : this.useDomain.maxValue
            }),
            "class": "userInputNormal",
            constraints: {min:this.useDomain.minValue, max:this.useDomain.maxValue}
          }).placeAt(pCell);
          txtRange.startup();
          this.formatSpacing(pCell);
        }
      } else if(this.useDate === true) {
        var d = new Date();
        var defaultDate = (d.getMonth() + 1)  + "-" + d.getDate() + "-" + d.getFullYear();
        if(pValue.value !== "") {
          defaultDate = pValue.value;
        }
        var txtDate = new DateTextBox({
          value: defaultDate,
          placeHolder: defaultDate,
          "class": "userInputNormal"
        }).placeAt(pCell);
        txtDate.startup();
        this.formatSpacing(pCell);
      } else if(this.useValue === true) {
        var paramsDijit = new FilterParameters();
        paramsDijit.placeAt(pCell);
        paramsDijit.startup();
        this.createValueList(pValue, paramsDijit);
      } else {
        var txtFilterParam = new TextBox({
          value: pValue.value /* no or empty value! */,
          placeHolder: this.nls.inputs.textboxText,
          "class": "userInputNormal"
        }).placeAt(pCell);
        txtFilterParam.startup();
        this.formatSpacing(pCell);
      }
    },

    createValueList: function(pValue, pDijit) {
      var filter = {};
      var parts = [];
      array.forEach(this.config.groups, lang.hitch(this, function(group) {
        if(group.name === this.grpSelect.value) {
          array.forEach(group.layers, lang.hitch(this, function(grpLayer) {
            array.forEach(this.layerList, lang.hitch(this, function(layer) {
              if(grpLayer.layer === layer.id) {
                if(grpLayer.useDomain === true) {
                  var partsObj = {};
                  partsObj.fieldObj = {};
                  partsObj.fieldObj.name = grpLayer.field;
                  partsObj.fieldObj.label = grpLayer.field;
                  partsObj.fieldObj.shortType = ((grpLayer.dataType).replace("esriFieldType", "")).toLowerCase();
                  if(partsObj.fieldObj.shortType !== "guid" || partsObj.fieldObj.shortType !== "globalid") {
                    partsObj.fieldObj.shortType = "string";
                  }
                  if(partsObj.fieldObj.shortType !== "date" && partsObj.fieldObj.shortType !== "string") {
                    partsObj.fieldObj.shortType = "number";
                  }
                  partsObj.fieldObj.type = grpLayer.dataType;
                  partsObj.operator = partsObj.fieldObj.shortType + "OperatorIs";
                  partsObj.valueObj = {};
                  partsObj.valueObj.isValid = true;
                  partsObj.valueObj.type = "unique";
                  partsObj.valueObj.value = pValue.value;
                  partsObj.interactiveObj = {};
                  partsObj.interactiveObj.prompt = "";
                  partsObj.interactiveObj.hint = "";
                  partsObj.caseSensitive = false;
                  parts.push(partsObj);
                  filter.logicalOperator = "OR";
                  filter.expr = "";
                  filter.parts = parts;
                  pDijit.build(layer.layerObject.url, layer.layerObject, filter);

                  var nodes = query(".jimu-single-filter-parameter");
                  array.forEach(nodes, function(node) {
                    var tableNode = query("table", node);
                    array.forEach(tableNode, function(table) {
                      domAttr.set(table, "cellpadding", "1");
                      domAttr.set(table, "cellspacing", "1");
                    });
                    var hintNode = query("colgroup", node);
                    if(hintNode.length > 0) {
                      domAttr.set(hintNode[0].childNodes[1], "width", "0px");
                    }
                  });
                }
              }
            }));
          }));
        }
      }));
    },

    formatSpacing: function(pCell) {
      domStyle.set(pCell, {paddingLeft: "2px", paddingRight: "2px"});
    },

    createConditionSelection: function(pCell, pValue) {
      domConstruct.empty(pCell);
      var ObjList = [
        {'value': 'OR', 'label': this.nls.inputs.optionOR},
        {'value': 'AND', 'label': this.nls.inputs.optionAND}
      ];
      var grpSelect = new Select({
        options: ObjList,
        "class": "conjuncSelect"
      }).placeAt(pCell);
      grpSelect.startup();
      grpSelect.set('value', pValue.conjunc);
    },

    removeTableRow: function(pCell, pRow, pCount) {
      if(pCount > 1) {
        var dsNode = domConstruct.create("div", {
          'class': 'deleteCell',
          innerHTML: ''
        });
        this.own(on(dsNode, 'click', lang.hitch(this, function() {
          domConstruct.destroy(pRow);
          var table = dom.byId("tblPredicates");
          if(table.rows.length >= 1) {
            var prevRowConjunTable = table.rows[(table.rows.length - 1)].cells[0].firstChild;
            var prevRowConjunCell = prevRowConjunTable.rows[2].cells[0];
            domConstruct.empty(prevRowConjunCell);
          }
          this.colorRows();
        })));
        domConstruct.place(dsNode, pCell);
      }
    },

    removeAllRows: function() {
      var table = dom.byId("tblPredicates");
      if(table.rows.length >= 1) {
        var subTable = table.rows[0].cells[0].firstChild;
        var isDijit = registry.byNode(subTable.rows[1].cells[0].childNodes[0]);
        if(typeof isDijit !== 'undefined') {
          dijit.byId(isDijit.id).destroyRecursive(true);
        }
        domConstruct.destroy(table.rows[0]);
        this.removeAllRows();
      }
    },

    reconstructRows: function(pValue) {
      if(pValue !== "") {
        array.forEach(this.config.groups, lang.hitch(this, function(group) {
          if (group.name === pValue) {
            var defaultVal = "";
            var defaultOp = "=";
            if(typeof(group.def) !== 'undefined') {
              if(group.def.length > 0) {
                array.forEach(group.def, lang.hitch(this, function(def) {
                  this.createNewRow({value: def.value, operator: def.operator, conjunc: def.conjunc, state:"reload"});
                }));
              } else {
                defaultVal = this.checkDefaultValue(group);
                defaultOp = this.checkDefaultOperator(group);

                this.createNewRow({operator:defaultOp, value:defaultVal, conjunc:"OR", state:"new"});
              }
            } else {
              defaultVal = this.checkDefaultValue(group);
              defaultOp = this.checkDefaultOperator(group);

              this.createNewRow({operator:defaultOp, value:defaultVal, conjunc:"OR", state:"new"});
            }
          }
        }));
      } else {
        this.createNewRow({operator:"=", value:"", conjunc:"OR", state:"new"});
      }
    },

    checkDefaultValue: function(pGroup) {
      var defaultVal = "";
      if(pGroup.defaultVal !== "") {
        defaultVal = pGroup.defaultVal;
      }
      return defaultVal;
    },

    checkDefaultOperator: function(pGroup) {
      var defaultOp = "=";
      if(pGroup.operator !== "") {
        defaultOp = pGroup.operator;
      }
      return defaultOp;
    },

    parseTable: function() {
      var sqlParams = [];
      var rows = dom.byId("tblPredicates").rows;
      array.forEach(rows, lang.hitch(this, function(row, i){
        if(i >= 0) {
          var subTable = row.cells[0].firstChild;
          var cell_operator = registry.byNode(subTable.rows[0].cells[0].childNodes[0]);
          var cell_value = registry.byNode(subTable.rows[1].cells[0].childNodes[0]);
          var cell_conjunc = {};
          if(typeof(subTable.rows[2].cells[0].childNodes[0]) !== 'undefined') {
            cell_conjunc = registry.byNode(subTable.rows[2].cells[0].childNodes[0]);
          } else {
            cell_conjunc.value = '';
          }
          var userInput = "";
          if(typeof cell_value.partsObj !== "undefined") {
            if(cell_value.getFilterExpr() !== null) {
              userInput = cell_value.partsObj.parts[0].valueObj.value;
            }
          }
          else {
            userInput = cell_value.value;
          }
          sqlParams.push({
            operator: cell_operator.value,
            userValue: userInput,
            conjunc: cell_conjunc.value
          });
        }
      }));
      return sqlParams;
    },



    setFilterLayerDef: function() {
      var createQuery = function(isNum, field, op, value, junc) {
        // escape all single quotes
        // decode sanitized input
        value = entities.decode(value.replace(/'/g, "''"));
        // special case of empty value
        if (value === '') {
          if(op === '<>' || op === 'NOT LIKE') {
            return [field, "<> '' OR", field, "IS NOT NULL", junc].join(" ") + " ";
          } else {
            return [field, "= '' OR", field, "IS NULL", junc].join(" ") + " ";
          }
        }
        if (op === 'LIKE' || op === 'NOT LIKE') {
          value = "UPPER('%" + value + "%')";
          field = "UPPER(" + field + ")";
        } else if (op === 'START') {
          op = 'LIKE';
          value = "UPPER('" + value + "%')";
          field = "UPPER(" + field + ")";
        } else if (op === 'END') {
          op = 'LIKE';
          value = "UPPER('%" + value + "')";
          field = "UPPER(" + field + ")";
        } else if (isNum === false) { // wrap string fields if not already
          var dateObj=Date.parse(value);
          if (isNaN(dateObj)===true)
          {
            value = "UPPER('" + value + "')";
            field = "UPPER(" + field + ")";
          } else {
            value = "'" + value + "'";
          }
        } else {

        }

        return [field, op, value, junc].join(" ") + " ";
      };
      var sqlParams = this.parseTable();
      array.forEach(this.layerList, lang.hitch(this, function(layer) {
        array.forEach(this.config.groups, lang.hitch(this, function(group) {
          if(this.grpSelect.value === group.name) {
            var msExpr = [];
            array.forEach(group.layers, lang.hitch(this, function(grpLayer) {
              var expr = '';
              var filterType = "";
              if(layer.id === grpLayer.layer) {
                group.def = [];
                filterType = "FeatureLayer";
                array.forEach(sqlParams, lang.hitch(this, function(p) {
                  array.forEach(layer.layerObject.fields, lang.hitch(this, function(field) {
                    if(field.name === grpLayer.field) {
                      if(((field.type).indexOf("Integer") > -1) || (field.type).indexOf("Double") > -1) {
                        expr = expr + createQuery(
                          true,
                          grpLayer.field,
                          p.operator,
                          utils.sanitizeHTML(p.userValue),
                          p.conjunc
                        );
                      }
                      else if ((field.type).indexOf("Date") > -1) {
                        if(p.userValue !== "") {
                          var newDate = new Date(utils.sanitizeHTML(p.userValue));
                          expr = expr + createQuery(
                            false,
                            grpLayer.field,
                            p.operator,
                            locale.format(newDate, {datePattern: "MMMM d, yyyy", selector: "date"}),
                            p.conjunc
                          );
                        }
                        else {
                          expr = expr + createQuery(
                            false,
                            grpLayer.field, p.operator,
                            utils.sanitizeHTML(p.userValue),
                            p.conjunc
                          );
                        }
                      }
                      else {
                        expr = expr + createQuery(
                          false,
                          grpLayer.field,
                          p.operator,
                          utils.sanitizeHTML(p.userValue),
                          p.conjunc
                        );
                      }
                      group.def.push({
                        value: utils.sanitizeHTML(p.userValue),
                        operator: p.operator,
                        conjunc: p.conjunc
                      });
                    }
                  }));
                }));
              }
              else if(grpLayer.layer.indexOf(layer.id) >= 0) {  //if it's a map service, sublayers .x is appended. so check if the root layerID is there
                group.def = [];
                filterType = "MapService";
                var msSubs = (grpLayer.layer).split(".");
                array.forEach(sqlParams, lang.hitch(this, function(p) {
                  if(p.userValue !== "") {
                    if(((grpLayer.dataType).indexOf("Integer") > -1) || (grpLayer.dataType).indexOf("Double") > -1) {
                      expr = expr + createQuery(
                        true,
                        grpLayer.field,
                        p.operator,
                        utils.sanitizeHTML(p.userValue),
                        p.conjunc
                      );
                    }
                    else if ((grpLayer.dataType).indexOf("Date") > -1) {
                      if(p.userValue !== "") {
                        var newDate = new Date(utils.sanitizeHTML(p.userValue));
                        expr = expr + createQuery(
                          false,
                          grpLayer.field,
                          p.operator,
                          locale.format(newDate, {datePattern: "MMMM d, yyyy", selector: "date"}),
                          p.conjunc
                        );
                      } else {
                        expr = expr + createQuery(
                          false,
                          grpLayer.field,
                          p.operator,
                          utils.sanitizeHTML(p.userValue),
                          p.conjunc
                        );
                      }
                    }
                    else {
                      expr = expr + createQuery(
                        false,
                        grpLayer.field,
                        p.operator,
                        utils.sanitizeHTML(p.userValue),
                        p.conjunc
                      );
                    }
                    group.def.push({value: utils.sanitizeHTML(p.userValue), operator: p.operator, conjunc: p.conjunc});
                  }
                  else {
                    expr = expr + createQuery(
                      false,
                      grpLayer.field,
                      p.operator,
                      utils.sanitizeHTML(p.userValue),
                      p.conjunc
                    );
                    group.def.push({value: utils.sanitizeHTML(p.userValue), operator: p.operator, conjunc: p.conjunc});
                  }
                }));
                if(expr !== "") {
                  msExpr[msSubs[1]] = expr.trim();
                }
              }
              else {

              }

              if(filterType === "FeatureLayer") {
                console.log(expr);
                if(expr !== "") {
                  if(this.chkAppendToDef.checked) {
                    array.forEach(this.defaultDef, lang.hitch(this, function(def) {
                      if(def.layer === layer.id ) {
                        var compositeDef = def.definition + " "  + this.slAppendChoice.value +  " " + expr.trim();
                        // layer.layerObject.setDefinitionExpression(compositeDef);
                        this._applyFilter(layer.layerObject, compositeDef);
                      }
                    }));
                  }
                  else {
                    // layer.layerObject.setDefinitionExpression(expr.trim());
                    this._applyFilter(layer.layerObject, expr.trim());
                  }
                  layer.layerObject.setVisibility(true);
                }
              } else if(filterType === "MapService") {
                console.log(msExpr);
                if(msExpr.length > 0) {
                  if(this.chkAppendToDef.checked) {
                    array.forEach(this.defaultDef, lang.hitch(this, function(def) {
                      if(def.layer === layer.id ) {
                        array.forEach(msExpr, lang.hitch(this, function(expr, i) {
                          for(var key in def.definition) {
                            if(def.definition[key] !== 'undefined') {
                              if(msExpr[i.toString()]) {
                                msExpr[i.toString()] = def.definition[key] + " "  +
                                this.slAppendChoice.value +  " " + expr;
                                console.log(expr);
                              }
                            }
                          }
                        }));
                        console.log(msExpr);
                        layer.layerObject.setLayerDefinitions(msExpr);
                      }
                    }));
                  } else {
                    layer.layerObject.setLayerDefinitions(msExpr);
                  }
                  layer.layerObject.setVisibility(true);
                }
              } else {
                //do nothing, not a valid service
              }
            }));
            this._publishData(group);
          }
        }));
      }));
    },

    resetLayerDef: function() {
      array.forEach(this.layerList, lang.hitch(this, function(layer) {
        array.forEach(this.defaultDef, lang.hitch(this, function(def) {
          if(def.layer === layer.id ) {

            if(typeof(layer.layerObject.defaultDefinitionExpression) !== 'undefined'){
              // layer.layerObject.setDefinitionExpression(def.definition);

              this._applyFilter(layer.layerObject, def.definition);
            }
            else if(typeof(layer.layerObject.layerDefinitions) !== 'undefined') {
              //layer.layerObject.setDefaultLayerDefinitions();
              layer.layerObject.setLayerDefinitions(def.definition);
            }
            else {
              // layer.layerObject.setDefinitionExpression(def.definition);

              this._applyFilter(layer.layerObject, def.definition);
            }

            layer.layerObject.setVisibility(def.visible);
            //this.defaultDef.push({layer: layer.id, definition: layer.layerObject.defaultDefinitionExpression});
          }
        }));
      }));
    },

    updateGroupDesc: function(pParam) {
      array.forEach(this.config.groups, lang.hitch(this, function(group) {
        if(group.name === pParam) {
          this.groupDesc.innerHTML = group.desc;
        }
      }));
    },

    //START: saving/reading functions
    toggleSaveFilter: function() {
      var containerNode;
      var saveNode = query(".saveTD");
      if(saveNode.length > 0) {
        containerNode = query(".container");
        if(containerNode.length > 0) {
          domClass.replace(dom.byId("saveTD"), "saveTDClose", "saveTD");
          containerNode.style("display", "none");
          query(".saveContainer").style("display", "block");
          query(".groupContainer").style("display", "none");
          query(".buttonContainer").style("display", "none");
        }
      } else {
        var basicNode = query(".saveTDClose");
        if(basicNode.length > 0) {
          domClass.replace(basicNode[0], "saveTD", "saveTDClose");
          containerNode = query(".container");
          if(containerNode.length > 0) {
            domClass.replace(dom.byId("saveTD"), "saveTD", "saveTDClose");
            containerNode.style("display", "block");
            query(".saveContainer").style("display", "none");
            query(".groupContainer").style("display", "block");
            query(".buttonContainer").style("display", "block");
          }
        }
      }
    },

    saveJsonToFile: function() {
      var saveDef = new saveJson({
        "config" : this.config
      });
      this.own(on(saveDef, "complete", lang.hitch(this, function() {
        console.log("save done");
      })));
      saveDef.exportsJson(this.nls.files.jsonFile + ".json", this.config);
    },

    readJsonToConfig: function() {
      query(".loadProgressHeader").style("display", "block");
      query(".loadProgressShow").style("display", "block");

      var readDef =  new readJson({
        "config": this.config,
        "jsonFile": this.jsonFileInput.files
      });
      this.own(on(readDef, "complete", lang.hitch(this, function(results) {
        this.config = JSON.parse(results.UserSettings);
        this.resetLayerDef();
        this.removeAllRows();
        this.checkDomainUse({group: this.grpSelect.value});
        this.checkDateUse({group: this.grpSelect.value});
        this.reconstructRows(this.grpSelect.value);
        this.updateGroupDesc(this.grpSelect.value);
        setTimeout(lang.hitch(this, this.setFilterLayerDef), 500);
        query(".loadProgressHeader").style("display", "none");
        query(".loadProgressShow").style("display", "none");
        this.jsonFileInput.value = null;
        this.toggleSaveFilter();
      })));
      this.own(on(readDef, "error", lang.hitch(this, function() {
        this.jsonFileInput.value = null;
        query(".loadProgressHeader").style("display", "none");
        query(".loadProgressShow").style("display", "none");
      })));
      readDef.checkFileReader();
    },
    //END: saving/reading functions

    //BEGIN: W2W communication
    _publishData: function(pValue) {
      this.publishData({
        message: pValue
      });
    },
    //END: W2W communication

    resize: function() {
      var node = query(".jimu-single-filter-parameter");
      if(node.length > 0) {
        array.forEach(node, lang.hitch(this, function(domEl) {
          var hintNode = query("colgroup", domEl);
          if(hintNode.length > 0) {
            domAttr.set(hintNode[0].childNodes[1], "width", "0px");
          }
        }));
      }
      if(window.innerWidth <= 320) {
        //if it's small form factor, auto switch to simple mode
        domClass.add(this.btnCriteria, "hide-items");
        query(".operator-class").style("display", "none");
        query(".container").style("borderTop", "0px");
        query(".value-class").style("paddingTop", "-10px");
      } else {
        if(!this.config.simpleMode) {
          domClass.remove(this.btnCriteria, "hide-items");
          query(".operator-class").style("display", "block");
          query(".container").style("borderTop", "3px solid");
          query(".value-class").style("paddingTop", "0px");
        }
      }
    },

    _applyFilter: function(layer, exp){
      FilterManager.getInstance().applyWidgetFilter(layer.id, this.id, exp);
    },

    onOpen: function(){
      console.log('onOpen');
    },

    onClose: function(){
      if(!this.chkPersistDef.checked) {
        this.resetLayerDef();
        this.removeAllRows();
        this.reconstructRows("");
      }
    },

    onMinimize: function(){
      console.log('onMinimize');
    },

    onMaximize: function(){
      console.log('onMaximize');
    },

    onSignIn: function(credential){
      /* jshint unused:false*/
      console.log('onSignIn');
    },

    onSignOut: function(){
      console.log('onSignOut');
    }
  });
});