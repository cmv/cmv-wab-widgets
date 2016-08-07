define([
  'dojo/_base/declare',
  'dojo/Evented',
  'dojo/_base/array',
  'dojo/_base/lang',
  'dojo/_base/Color',
  'dojo/dom',
  'dojo/dom-class',
  'dojo/dom-construct',
  'dojo/dom-style',
  'dojo/number',
  'dojo/on',
  'dojo/has',
  'dijit/form/Button',
  'jimu/dijit/Popup',
  'jimu/CSVUtils',
  'jimu/utils',
  'esri/config',
  'esri/geometry/geometryEngine',
  'esri/geometry/mathUtils',
  'esri/geometry/Point',
  'esri/geometry/webMercatorUtils',
  'esri/graphic',
  'esri/layers/FeatureLayer',
  'esri/symbols/SimpleMarkerSymbol',
  'esri/symbols/SimpleLineSymbol',
  'esri/symbols/Font',
  'esri/symbols/TextSymbol',
  'esri/tasks/query'
], function (
  declare,
  Evented,
  array,
  lang,
  Color,
  dom,
  domClass,
  domConstruct,
  domStyle,
  number,
  on,
  has,
  Button,
  Popup,
  CSVUtils,
  utils,
  esriConfig,
  geometryEngine,
  mathUtils,
  Point,
  webMercatorUtils,
  Graphic,
  FeatureLayer,
  SimpleMarkerSymbol,
  SimpleLineSymbol,
  Font,
  TextSymbol,
  Query
) {

  var summaryInfo = declare('GroupedCountInfo', [Evented], {

    summaryLayer: null,
    summaryFields: [],
    summaryIds: [],
    summaryFeatures: [],
    summaryGeom: null,
    tabNum: null,

    popupFields: [],

    groupedResults: {},

    symbolField: null,
    graphicsLayer: null,
    lyrRenderer: null,
    lyrSymbol: null,
    constructor: function (tab, container, parent) {
      this.tab = tab;
      this.container = container;
      this.parent = parent;
      this.config = parent.config;
      this.graphicsLayer = null;
    },

    /* jshint unused: true */
    // update for incident
    updateForIncident: function (incident, buffer, graphicsLayer, num) {
      this.tabNum = num;
      this.container.innerHTML = "";
      domClass.add(this.container, "loading");
      this.summaryIds = [];
      this.summaryFeatures = [];
      this.groupedResults = {};
      this.summaryGeom = buffer.geometry;
      if (this.tab.tabLayers.length > 0) {
        var tempFL;
        if (typeof (this.tab.tabLayers[0].infoTemplate) !== 'undefined') {
          this.summaryLayer = this.tab.tabLayers[0];
          tempFL = new FeatureLayer(this.summaryLayer.url);
          tempFL.infoTemplate = this.tab.tabLayers[0].infoTemplate;
          this.tab.tabLayers[1] = tempFL;
          this._initGraphicsLayer(graphicsLayer);
          this.summaryFields = this._getFields();
          lang.hitch(this, this._queryFeatures(buffer.geometry));
        } else {
          tempFL = new FeatureLayer(this.tab.tabLayers[0].url);
          on(tempFL, "load", lang.hitch(this, function () {
            this.summaryLayer = tempFL;
            if (this.tab.tabLayers[0].url.indexOf("MapServer") > -1) {
              var lID = this.tab.tabLayers[0].url.split("MapServer/")[1];
              var mapLayers = this.parent.map.itemInfo.itemData.operationalLayers;
              for (var i = 0; i < mapLayers.length; i++) {
                var lyr = mapLayers[i];
                if (typeof (lyr.layerObject) !== 'undefined') {
                  if (lyr.layerObject.infoTemplates) {
                    var infoTemplate = lyr.layerObject.infoTemplates[lID];
                    if (infoTemplate) {
                      tempFL.infoTemplate = infoTemplate.infoTemplate;
                      break;
                    }
                  }
                }
              }
            }
            this.tab.tabLayers[1] = tempFL;
            this._initGraphicsLayer(graphicsLayer);
            this.summaryFields = this._getFields();
            lang.hitch(this, this._queryFeatures(buffer.geometry));
          }));
        }
      }
    },

    _initGraphicsLayer: function (gl) {
      if (gl !== null) {
        this.graphicsLayer = gl;
        this.graphicsLayer.clear();
        if (this.summaryLayer) {
          if (this.summaryLayer.renderer) {
            this.lyrRenderer = this.summaryLayer.renderer;
            this.graphicsLayer.renderer = this.lyrRenderer;
            if (typeof (this.summaryLayer.renderer.attributeField) !== 'undefined') {
              this.symbolField = this.summaryLayer.renderer.attributeField;
            } else {
              this.lyrSymbol = this.lyrRenderer.symbol;
            }
          }
        }
      }
    },

    // query features
    _queryFeatures: function (geom) {
      var query = new Query();
      query.geometry = geom;
      this.summaryLayer.queryIds(query, lang.hitch(this, function (objectIds) {
        if (objectIds) {
          this.summaryIds = objectIds;
          if (this.summaryIds.length > 0) {
            this._queryFeaturesByIds();
          } else {
            this._processResults();
          }
        } else {
          this._processResults();
        }
      }));
    },

    // query features by ids
    _queryFeaturesByIds: function () {
      var max = this.summaryLayer.maxRecordCount || 1000;
      var ids = this.summaryIds.slice(0, max);
      this.summaryIds.splice(0, max);
      var query = new Query();
      var includeGeom = false;
      array.some(this.summaryFields, lang.hitch(this, function (obj) {
        if (obj.type === "area" || obj.type === "length" || this.graphicsLayer) {
          includeGeom = true;
          return true;
        }
      }));
      query.returnGeometry = includeGeom;
      var outFields = [];
      array.forEach(this.summaryFields, function (f) {
        outFields.push(f.field);
      });

      if (this.symbolField) {
        outFields.push(this.symbolField);
      }
      if (this.config.csvAllFields === true || this.config.csvAllFields === "true") {
        query.outFields = ['*'];
      } else {
        if (this.popupFields.length > 0) {
          for (var i = 0; i < this.popupFields.length; i++) {
            var f = this.popupFields[i];
            if (outFields.indexOf(f) === -1) {
              outFields.push(f);
            }
          }
        }
        query.outFields = outFields;
      }

      query.objectIds = ids;
      this.summaryLayer.queryFeatures(query, lang.hitch(this, function (featureSet) {
        if (featureSet.features) {
          this.summaryFeatures = this.summaryFeatures.concat(featureSet.features);
        }
        this._processResults();
        if (this.summaryIds.length > 0) {
          if (this.SA_SAT_download) {
            domClass.replace(this.SA_SAT_download, "processing", "download");
          }
          this._queryFeaturesByIds();
        } else {
          if (this.SA_SAT_download) {
            domClass.replace(this.SA_SAT_download, "download", "processing");
          }
        }
      }));
    },

    _prepGroupedResults: function () {
      for (var i = 0; i < this.summaryFeatures.length; i++) {
        var feat = this.summaryFeatures[i];
        if (typeof (this.summaryFields) !== 'undefined' && this.summaryFields.length > 0) {
          var val = feat.attributes[this.summaryFields[0].field];
          if (!(val in this.groupedResults)) {
            this.groupedResults[val] = { features: [feat] };
          } else {
            this.groupedResults[val].features.push(feat);
          }
        }
      }
    },

    // prep results
    _prepResults: function () {
      for (var key in this.groupedResults) {
        var groupedResult = this.groupedResults[key];
        var obj = this.summaryFields[0];
        obj.total = groupedResult.features.length;
        this.groupedResults[key].total = obj.total;
        this.groupedResults[key].type = obj.type;
        this.groupedResults[key].label = obj.alias;
      }
    },

    // process results
    //Solutions: added a string search looking for area or length to not round up.
    _processResults: function () {
      this._prepGroupedResults();
      this._prepResults();
      this.container.innerHTML = "";
      domClass.remove(this.container, "loading");
      var results = this.groupedResults;
      if (Object.keys(this.groupedResults).length === 0) {
        this.container.innerHTML = this.parent.nls.noFeaturesFound;
        return;
      }
      var numberOfDivs = Object.keys(this.groupedResults).length + 1;
      var total = 0;
      var tpc = domConstruct.create("div", {
        style: "width:" + (numberOfDivs * 220) + "px;"
      }, this.container);
      domClass.add(tpc, "SAT_tabPanelContent");

      var div_results_extra = domConstruct.create("div", {}, tpc);
      domClass.add(div_results_extra, "SATcol");

      var div_exp = domConstruct.create("div", {
        'data-dojo-attach-point': 'SA_SAT_download',
        innerHTML: this.parent.nls.downloadCSV
      }, div_results_extra);
      domClass.add(div_exp, ['btnExport', 'download']);
      on(div_exp, "click", lang.hitch(this, this._exportToCSV));

      var i = 0;
      var sortedResults = Object.keys(results).sort();
      for (var k in sortedResults) {
        var v = sortedResults[k];
        var f = results[v];
        var info = utils.sanitizeHTML(v);
        if (v === this.parent.nls.area || v === this.parent.nls.length) {
          total = f.total;
        } else {
          total = Math.round(f.total);
        }
        if (isNaN(total)) {
          total = 0;
        }
        var div = domConstruct.create("div", { 'class': 'SATcol' }, tpc);
        var topDiv = domConstruct.create("div", {
          style: 'max-height: 45px;'
        }, div);
        domConstruct.create("div", {
          'class': 'SATcolWrap',
          style: 'max-height: 30px; overflow: hidden;',
          innerHTML: f.type === 'pre' ? f.label.trim() : info
        }, topDiv);
        domConstruct.create("div", {
          'class': 'SATcolWrap',
          style: 'max-height: 30px; overflow: hidden;',
          innerHTML: f.type === 'pre' ? info : f.label.trim()
        }, topDiv);
        domConstruct.create("div", {
          'class': f.label !== "" ? 'colGroupedSummary' : 'colSummary',
          innerHTML: number.format(total)
        }, div);
        i += 1;
      }

      if (this.graphicsLayer !== null) {
        this.graphicsLayer.clear();
        this.tab.tabLayers[1].clear();
        if (this.summaryFeatures) {
          for (var ii = 0; ii < this.summaryFeatures.length; ii++) {
            var gra = this.summaryFeatures[ii];
            if (this.lyrSymbol) {
              gra.symbol = this.lyrSymbol;
            }
            else {
              if (this.graphicsLayer.renderer) {
                var sym = this.graphicsLayer.renderer.getSymbol(gra);
                gra.symbol = sym;
              }
            }
            this.graphicsLayer.add(gra);
            this.tab.tabLayers[1].add(gra);
          }
        }
        this.graphicsLayer.setVisibility(true);
        //this.graphicsLayer.visible = true;
        this.parent._toggleTabLayersNew(this.tabNum);

        if (this.tab.retsore) {
          this.emit("summary-complete", {
            bubbles: true,
            cancelable: true,
            tab: this.tabNum
          });
        }
      }
    },

    _exportToCSV: function () {
      if (this.summaryFeatures.length === 0) {
        return false;
      }
      var name;
      if (this.tab.label) {
        name = this.tab.label;
      } else {
        name = this.tab.layers;
      }
      var data = [];
      var cols = [];
      array.forEach(this.summaryFeatures, function (gra) {
        data.push(gra.attributes);
      });
      if (this.config.csvAllFields === true || this.config.csvAllFields === "true") {
        for (var prop in data[0]) {
          cols.push(prop);
        }
      } else {
        for (var i = 0; i < this.summaryFields.length; i++) {
          cols.push(this.summaryFields[i].field);
        }
      }
      CSVUtils.exportCSV(name, data, cols);
    },

    // Solutions: Added case to handle fields structure coming from a map service.
    // also added a small integer into summary types.
    /*jshint loopfunc: true */
    _getFields: function () {
      var fields = [];
      if (typeof (this.tab.advStat) !== 'undefined') {
        var stats = this.tab.advStat.stats;
        for (var key in stats) {
          var txt = "";
          if (stats[key].length > 0) {
            array.forEach(stats[key], function (pStat) {
              var obj = {
                field: pStat.expression,
                alias: pStat.label + txt,
                type: key,
                total: 0
              };
              fields.push(obj);
            });
          }
        }
      }
      return fields;
    }
  });

  return summaryInfo;
});