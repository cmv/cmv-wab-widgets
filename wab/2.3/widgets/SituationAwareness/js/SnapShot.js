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
  'dojo/_base/lang',
  'dojo/Deferred',
  'dojo/DeferredList',
  'dojo/_base/array',
  'esri/request',
  'esri/geometry/webMercatorUtils',
  'esri/geometry/Polygon',
  'esri/geometry/Point',
  'esri/geometry/Multipoint',
  'esri/geometry/Polyline',
  'jimu/utils',
  'jimu/portalUtils',
  'jimu/portalUrlUtils',
  'jimu/tokenUtils',
  'jimu/dijit/Message',
  './CSVUtils'
], function (
  declare,
  lang,
  Deferred,
  DeferredList,
  array,
  esriRequest,
  webMercatorUtils,
  Polygon,
  Point,
  Multipoint,
  Polyline,
  utils,
  portalUtils,
  portalUrlUtils,
  tokenUtils,
  Message,
  CSVUtils
) {

  //Create a 'Snap Shot' of the incident.
  // A feature collection is created for each configured tab layer.
  // The new layers are written to a newly created folder that is time stamped.
  // A web map is created that references each of the layers as well.
  var snapShot = declare('SnapShot', null, {
    portal: null,
    portalUrl: "",
    baseName: "",
    logo: "",
    originMapId: "",
    originAppId: "",
    credential: null,
    nls: null,
    layerArray: [],
    parent: null,
    downloadAll: false,
    time: null,

    constructor: function (parent) {
      this.parent = parent;
      this.mapItemInfo = this.parent.map.itemInfo;
      this.extent = this.parent.map.extent;
      this.nls = lang.mixin(this.parent.nls, window.jimuNls.drawBox);
      this.downloadAll = this.parent.config.csvAllFields;

      var appConfig = parent.appConfig;
      this.portalUrl = appConfig.portalUrl;
      this.portal = portalUtils.getPortal(this.portalUrl);
      this.selfUrl = portalUrlUtils.getPortalSelfInfoUrl(this.portalUrl);
      this.baseUrl = this.portalUrl + 'sharing/rest/';
      this.logo = appConfig.logo;
      this.originMapId = appConfig.map.itemId;
      this.originAppId = appConfig.appId;
    },

    createSnapShot: function (data) {
      var def = new Deferred();

      this.baseName = utils.stripHTML(data.name);
      this.layerArray = [];

      var date = new Date(data.time);
      var _off = date.getTimezoneOffset();
      this.time = utils.fieldFormatter.getFormattedDate(date, {
        dateFormat: 'shortDateShortTime'
      }) + " " + this.nls.utc + (_off < 0 ? "+" + (Math.abs(_off) / 60) : "-" + (_off / 60));

      this.portal.getUser().then(lang.hitch(this, function (user) {
        this.createFolder(user, this.time).then(lang.hitch(this, function (folder) {
          this.createLayerItems(user, folder, data).then(lang.hitch(this, function (items) {
            this.addLayers(user, folder, items).then(lang.hitch(this, function (layers) {
              this.createMap(user, folder, layers, this.mapItemInfo).then(lang.hitch(this, function (r) {
                var msg = r.success ? this.nls.snapshot_complete : this.nls.snapshot_failed;
                var url = this.portalUrl + 'home/webmap/viewer.html?webmap=' + r.id;
                new Message({
                  message: '<a href="' + url + '" target="_blank">' + msg + '</a>'
                });
                def.resolve('success');
              }), function (err) {
                def.reject(err);
              });
            }), function (err) {
              def.reject(err);
            });
          }), function (err) {
            def.reject(err);
          });
        }), function (err) {
          def.reject(err);
        });
      }), function (err) {
        def.reject(err);
      });
      return def;
    },

    createFolder: function (user, time) {
      var def = new Deferred();
      var args = {
        url: this.baseUrl + 'content/users/' + user.username + '/createFolder',
        content: {
          f: 'json',
          folderName: this.baseName + '_' + time,
          title: this.baseName + '_' + time,
          description: this.baseName + " " + this.nls.snapshot
        },
        handleAs: 'json',
        callbackParamName: 'callback'
      };
      if (this.isValidCredential()) {
        args.content.token = this.credential.token;
      }
      esriRequest(args, {
        usePost: true
      }).then(lang.hitch(this, function (response) {
        def.resolve(response);
      }), lang.hitch(this, function (err) {
        def.reject(err);
      }));
      return def;
    },

    /* jshint unused: true */
    createLayerItems: function (user, folder, data) {
      var def = new Deferred();

      var layers = data.layers;
      this.buffers = data.buffers;
      this.incidents = data.incidents;

      var defArray = [];
      for (var i = 0; i < layers.length; i++) {
        var push = true;
        if (layers[i].analysisObject && typeof (layers[i].analysisObject.featureCount) !== 'undefined' &&
          layers[i].analysisObject.featureCount === 0) {
          push = false;
        }
        if (layers[i].graphics && layers[i].graphics.length === 0) {
          push = false;
        }
        if (push) {
          defArray.push(this.createItem(layers[i], this.incidents, this.buffers, this.time, this.nls, this.baseName));
        }
      }

      var itemList = [];
      var defList = new DeferredList(defArray);
      defList.then(lang.hitch(this, function (defResults) {
        for (var r = 0; r < defResults.length; r++) {
          var featureSet = defResults[r][1];
          itemList.push(featureSet);
        }
        def.resolve(itemList);
      }), lang.hitch(this, function (err) {
        def.reject(err);
      }));
      return def;
    },

    addLayers: function (user, folder, items) {
      var def = new Deferred();
      var defArray = [];
      for (var i = 0; i < items.length; i++) {
        defArray.push(user.addItem(items[i], folder.folder.id));
      }

      var layerList = [];
      var defList = new DeferredList(defArray);
      defList.then(lang.hitch(this, function (defResults) {
        for (var r = 0; r < defResults.length; r++) {
          var featureSet = defResults[r][1];
          if (featureSet.success) {
            layerList.push(featureSet.id);
          }
        }
        def.resolve(layerList);
      }), lang.hitch(this, function (err) {
        def.reject(err);
      }));
      return def;
    },

    createItem: function (lo, incidents, buffers, time, nls, baseName) {
      var def = new Deferred();

      var layerDetails = {
        label: lo.label,
        title: lo.label + '_' + time,
        desc: nls.snapshot_append + " " + nls.of_append + " " + lo.type +
        " " + nls.layer_append + " " + lo.label + " (" + time + ")",
        name: lo.label + " (" + time + ")",
        tags: [baseName + "," + nls.snapshot_append]
      };

      //test if analysis layer or an incident/buffer layer
      if (lo.layerObject) {
        var layer = lo.layerObject;
        var ao = lo.analysisObject;
        this.layerArray.push({
          layer: {
            id: layerDetails.title,
            label: layerDetails.title,
            opacity: 1,
            visible: false
          },
          label: layerDetails.name
        });
        var pi;
        if (layer.infoTemplate && layer.infoTemplate.info) {
          pi = layer.infoTemplate.info;
        }
        layerDetails.popupInfo = pi;
        //TODO should consolidate these split due to grouped needing a num arg also
        //also spilt due to differences in the return object that should be consolidated also
        // for example Grouped returns both an array of graphics and the grouped analysis results
        //should standardize the name for both and return objects for both as well as ensure the args match
        if (lo.type === 'groupedSummary' || lo.type === 'summary') {
          ao.updateForIncident(incidents, buffers, null, null, true, true, true).then(
            lang.hitch(this, function (results) {
            var t = this.createAnalysisLayerJSON(results, layer, nls, time, layerDetails);
            def.resolve(t);
          }));
        } else {
          var dist = lo.type === 'closest' ? this.parent.config.maxDistance : buffers;
          ao.updateForIncident(incidents, dist, null, true, true, true).then(lang.hitch(this, function (results) {
            var t = this.createAnalysisLayerJSON(results, layer, nls, time, layerDetails);
            def.resolve(t);
          }));
        }
      } else {
        var t = this.createIncidentBufferLayerJSON(lo.graphics, nls, time, layerDetails);
        def.resolve(t);
      }
      return def;
    },

    createAnalysisLayerJSON: function (results, layer, nls, time, layerDetails) {
      var graphics = results.graphics;
      var fields = results.context._exportToCSV(graphics, true);
      if (fields) {
        fields.push({
          name: nls.snapshot_append,
          alias: nls.snapshot_append,
          type: "esriFieldTypeString"
        });
      }
      var fs = [];
      for (var i = 0; i < graphics.length; i++) {
        var f = graphics[i];
        f.attributes[nls.snapshot_append] = time;
        if (f.geometry.cache) {
          f.geometry.clearCache();
          delete (f.geometry.cahce);
        }
        fs.push({
          attributes: f.attributes,
          geometry: f.geometry
        });
      }
      return {
        title: layerDetails.title,
        type: "Feature Collection",
        tags: layerDetails.tags,
        description: layerDetails.desc,
        extent: layer.fullExtent,
        name: layerDetails.title,
        text: JSON.stringify({
          layers: [{
            layerDefinition: {
              capabilities: "Query",
              name: layerDetails.name,
              geometryType: layer.geometryType,
              objectIdField: layer.objectIdField,
              type: "Feature Layer",
              extent: layer.fullExtent,
              drawingInfo: {
                renderer: layer.renderer.toJson()
              },
              fields: fields
            },
            popupInfo: layerDetails.popupInfo,
            featureSet: {
              features: fs,
              geometryType: layer.geometryType
            }
          }]
        }),
        f: "json"
      };
    },

    /* jshint ignore:start */
    createIncidentBufferLayerJSON: function (graphics, nls, time, layerDetails) {
      var points = [];
      var lines = [];
      var polys = [];
      array.forEach(graphics, function (g) {
        switch (g.geometry.type) {
          case "point":
            points.push(g);
            break;
          case "polyline":
            lines.push(g);
            break;
          case "polygon":
            polys.push(g);
            break;
        }
      });
      var incidentLayers = [];
      if (points.length > 0) {
        incidentLayers.push(points);
      }
      if (lines.length > 0) {
        incidentLayers.push(lines);
      }
      if (polys.length > 0) {
        incidentLayers.push(polys);
      }
      var lyrs = [];
      var gl = {
        'point': "esriGeometryPoint",
        'polyline': "esriGeometryPolyline",
        'polygon': "esriGeometryPolygon"
      };
      var _gtName = {
        'point': this.nls.point,
        'polyline': this.nls.line,
        'polygon': this.nls.polygon
      };
      var extent = {
        xmin: this.extent.xmin,
        ymin: this.extent.ymin,
        xmax: this.extent.xmax,
        ymax: this.extent.ymax,
        spatialReference: this.extent.spatialReference
      };
      for (var j = 0; j < incidentLayers.length; j++) {
        var _graphics = incidentLayers[j];
        var _gt;
        if (_graphics.length > 0) {
          var g = _graphics[0];
          _gt = _gtName[typeof (g.geometry) !== 'undefined' ? g.geometry.type : g.type];
          var gt = gl[typeof (g.geometry) !== 'undefined' ? g.geometry.type : g.type];
          var symbol = g.symbol.toJson();
          var features = [];
          for (var i = 0; i < _graphics.length; i++) {
            g = _graphics[i];
            var _parts;
            switch (gt) {
              case "esriGeometryPolyline":
                _parts = g.geometry.paths;
                break;
              case "esriGeometryPolygon":
                _parts = g.geometry.rings;
                break;
              case "esriGeometryPoint":
                _parts = [g.geometry];
                break;
            }
            var _i = 0;
            var newGeom;
            array.forEach(_parts, function (p) {
              switch (gt) {
                case "esriGeometryPolyline":
                  newGeom = new Polyline(p);
                  newGeom.spatialReference = g.geometry.spatialReference;
                  break;
                case "esriGeometryPolygon":
                  newGeom = new Polygon(p);
                  newGeom.spatialReference = g.geometry.spatialReference;
                  break;
                case "esriGeometryPoint":
                  newGeom = p;
                  break;
              }

              var f = {
                attributes: {
                  ObjectID: i + _i
                },
                geometry: newGeom
              };
              f.attributes[nls.snapshot_append] = time;
              features.push(f);
              _i += 1;
            });
          }

          lyrs.push({
            layerDefinition: {
              capabilities: "Query",
              name: incidentLayers.length === 1 ? layerDetails.name : _gt,
              geometryType: gt,
              objectIdField: "ObjectID",
              type: "Feature Layer",
              extent: extent,
              drawingInfo: {
                renderer: {
                  type: "simple",
                  label: '',
                  description: '',
                  symbol: symbol
                }
              },
              fields: [{
                name: "ObjectID",
                alias: "ObjectID",
                type: "esriFieldTypeOID"
              }, {
                name: nls.snapshot_append,
                alias: nls.snapshot_append,
                type: "esriFieldTypeString"
              }]
            },
            featureSet: {
              features: features,
              geometryType: gt
            }
          });
        }
      }
      this.layerArray.push({
        layer: {
          id: layerDetails.title,
          label: layerDetails.title,
          opacity: 1,
          visible: true
        },
        label: layerDetails.name
      });
      return {
        title: layerDetails.title,
        type: "Feature Collection",
        tags: layerDetails.tags,
        description: layerDetails.desc,
        extent: extent,
        name: layerDetails.title,
        text: JSON.stringify({
          layers: lyrs
        }),
        f: "json"
      };
    },
    /* jshint ignore:end */

    createMap: function (user, folder, layers, mapItemInfo) {
      var itemData = mapItemInfo.itemData;
      var title = this.baseName + " (" + this.nls.snapshot_append + " " + this.time + ")";
      var sr;
      var baseMapLayers = [];
      for (var i = 0; i < itemData.baseMap.baseMapLayers.length; i++) {
        var bml = itemData.baseMap.baseMapLayers[i];
        baseMapLayers.push({
          "id": bml.id,
          "layerType": bml.layerType,
          "url": bml.url,
          "visibility": bml.visibility,
          "opacity": bml.opacity,
          "title": bml.title
        });
        sr = bml.resourceInfo.spatialReference;
      }
      var baseMap = {
        "baseMapLayers": baseMapLayers
      };
      var operationalLayers = [];
      for (var j = 0; j < this.layerArray.length; j++) {
        var l = this.layerArray[j];
        operationalLayers.push({
          id: l.layer.id,
          layerType: "ArcGISFeatureLayer",
          visibility: l.layer.visible,
          opacity: l.layer.opacity,
          title: l.label,
          type: "Feature Collection",
          itemId: layers[j]
        });
      }
      var ext1 = webMercatorUtils.webMercatorToGeographic(this.extent);
      var ext = ext1.xmin + "," + ext1.ymin + "," + ext1.xmax + "," + ext1.ymax;
      var webMap = {
        title: title,
        type: "Web Map",
        item: title,
        extent: ext,
        text: JSON.stringify({
          "operationalLayers": operationalLayers,
          "baseMap": baseMap,
          "spatialReference": sr,
          "authoringApp": "WebMapViewer",
          "authoringAppVersion": "4.1",
          "version": "2.4"
        }),
        tags: this.baseName + "," + this.nls.snapshot_append,
        wabType: "HTML"
      };
      return user.addItem(webMap, folder.folder.id);
    },

    _checkCredential: function () {
      var isValid = tokenUtils.isValidCredential(this.credential);
      if (!isValid) {
        this.clearCredentialAndUser();
      }
      return isValid;
    },

    isValidCredential: function () {
      this.updateCredential();
      return this._checkCredential();
    },

    updateCredential: function () {
      if (!this._checkCredential()) {
        this.credential = tokenUtils.getPortalCredential(this.portalUrl);
      }
    },

    clearCredentialAndUser: function () {
      this.credential = null;
      this.user = null;
    },

    createDownloadZip: function (analysisObjects, incidents, buffers) {
      var def = new Deferred();
      //TODO these are temp so I can remember what they are for while working through this
      var createSnapShot = false;
      var downloadAll = this.downloadAll;
      var calcResults = this.nls.calculated_results;
      this._performAnalysis(analysisObjects, incidents, buffers, downloadAll, createSnapShot).then(function (results) {
        var calculatedResults = [];
        for (var i = 0; i < results.length; i++) {
          var result = results[i];
          var calcResult = result.context._exportToCSV(result.graphics, false, true, result.analysisResults);
          if (calcResult) {
            calculatedResults.push(calcResult);
          }
        }

        //This will add them all to one sheet...would still need to maintain a seperate
        // instance of CSVUtils to support this as it's not a standard thing to do with CSVs
        if (calculatedResults.length > 0) {
          CSVUtils.exportCalculatedResultsCSV(calcResults, calculatedResults);
        }

        //I see jsZip in the node_modules folder but I'm still looking for anything else in WAB that may use it
        // need to check with the WAB team to ensure I can expect this to remain there
        //var zip = new JSZip();
        //zip.file("Hello.txt", "Hello World\n");
        //var img = zip.folder("images");
        //img.file("smile.gif", imgData, { base64: true });
        //zip.generateAsync({ type: "blob" })
        //.then(function (content) {
        //  // see FileSaver.js
        //  saveAs(content, "example.zip");
        //});

        //var zip = new JsZip();

        //from Session.js in node_modules
        //main other place I see it used is in server/utils.js
        //var JsZip = require('jszip');
        //zip.file(path.basename(filename), content);
        //var data = zip.generate({ type: 'base64' });
        //zip = null;

        //resolve(self._post('file', { file: data }));

        def.resolve('success');
      }, function (err) {
        def.reject(err);
      });
      return def;
    },

    _performAnalysis: function (analysisObjects, incidents, buffers, downloadAll, createSnapShot) {
      //TODO if createSnapshot is false we are downloading the CSV and need to honor the all fields setting if it is true
      var def = new Deferred();
      var defArray = [];
      for (var i = 0; i < analysisObjects.length; i++) {
        var ao = analysisObjects[i];
        console.log("AO: " + ao);
        //will set snapShot to true so it will create the defferd object..will just handle the results differently
        var isSnapShot = true;

        var push = true;
        if (ao.analysisObject && typeof (ao.analysisObject.featureCount) !== 'undefined' &&
          ao.analysisObject.featureCount === 0) {
          push = false;
        }
        if (push) {
          if (ao.type === 'groupedSummary' || ao.type === 'summary') {
            //TODO these have an extra num arg...can I do the same for prox so we don't have to check this?
            defArray.push(ao.analysisObject.updateForIncident(incidents, buffers, null, null,
              isSnapShot, createSnapShot, downloadAll));
          } else {
            var dist = ao.type === 'closest' ? this.parent.config.maxDistance : buffers;
            defArray.push(ao.analysisObject.updateForIncident(incidents, dist, null,
              isSnapShot, createSnapShot, downloadAll));
          }
        }
      }
      var results = [];
      var defList = new DeferredList(defArray);
      defList.then(lang.hitch(this, function (defResults) {
        for (var r = 0; r < defResults.length; r++) {
          var resultSet = defResults[r][1];
          results.push(resultSet);
        }
        def.resolve(results);
      }), lang.hitch(this, function (err) {
        console.error(err);
        def.reject(err);
      }));
      return def;
    }
  });

  return snapShot;

});
