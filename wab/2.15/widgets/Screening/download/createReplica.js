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
  'dojo/_base/lang',
  'dojo/_base/array',
  'dojo/string',
  'dojo/Evented',
  'jimu/BaseWidget',
  'esri/request',
  'dojo/Deferred',
  'dojo/promise/all',
  "esri/geometry/projection",
  'esri/SpatialReference'
], function (
  declare,
  lang,
  array,
  string,
  Evented,
  BaseWidget,
  esriRequest,
  Deferred,
  all,
  projection,
  SpatialReference
) {
  return declare([BaseWidget, Evented], {
    // Set base class for custom widget
    baseClass: 'jimu-widget-screening-create-replica',

    _extractDataTaskGPService: null, // To store extract data task gp service url
    errMessageString: "",
    responseArray: [], // To store deferred responses of create replica operation
    layerDetailsObj: {},

    constructor: function (options) {
      this._extractDataTaskGPService = null;
      this.errMessageString = "";
      this.responseArray = [];
      this.layerDetailsObj = {};
      lang.mixin(this, options);
    },

    startup: function () {
      this.responseArray = [];
      this.layerDetailsObj = {};
      this._loadProjection();
    },

    /**
     * Initialize createReplica widget functionality
     * @memberOf Screening/download/createReplica
     */
    _init: function () {
      var layerURL, layerIndex, baseLayerURL;
      array.forEach(this.config.downloadSettings.layers,
        lang.hitch(this, function (currentLayer) {
          var layerURLKeyAdded, layerURLKey;
          //Check if configured layer has at least one feature,
          //and layer supports the "filegdb" format
          if (this.downloadFeatureDetailsObj[currentLayer.id] &&
            this.downloadFeatureDetailsObj[currentLayer.id].length > 0 &&
            currentLayer.downloadingFileOption.indexOf(this.fileFormat) > -1 &&
            currentLayer.allowDownload) {
            layerURL = currentLayer.url.split("/");
            layerIndex = parseInt(layerURL.pop(), 10);
            layerURL = layerURL.join("/");
            layerURLKeyAdded = false;
            for (layerURLKey in this.layerDetailsObj) {
              if (layerURLKey.toLowerCase() === layerURL.toLowerCase()) {
                layerURLKeyAdded = true;
                layerURL = layerURLKey;
              }
            }
            if (!layerURLKeyAdded) {
              this.layerDetailsObj[layerURL] = {
                "layerInstance": currentLayer,
                "layerIndexes": [],
                "layerDetails": {},
                "layerNames": [],
                "wkid": this.filterLayerObj[currentLayer.id].spatialReference.wkid
              };
            }
            this.layerDetailsObj[layerURL].layerIndexes.push(layerIndex);
            this.layerDetailsObj[layerURL].layerNames.push(currentLayer.layerName);
            this.layerDetailsObj[layerURL].layerDetails[layerIndex] = {
              "queryOption": "useFilter",
              "useGeometry": true,
              "where": this.filterLayerObj[currentLayer.id].getDefinitionExpression() || ""
            };
          }
        }));
      this.errMessageString = "";
      //Loop through all the layers and perform create replica operation
      for (baseLayerURL in this.layerDetailsObj) {
        this.responseArray.push(this._exportFileUsingCreateReplica(baseLayerURL,
          this.layerDetailsObj[baseLayerURL]));
      }
      //After getting response for all the layers, do further processing
      all(this.responseArray).then(lang.hitch(this, function () {
        if (this.errMessageString) {
          this.errMessageString = string.substitute
            (this.nls.reportsTab.createReplicaFailedMessage,
            { layerNames: this.errMessageString });
          this.emit("createReplicaComplete", this.errMessageString);
        } else {
          this.emit("createReplicaComplete");
        }
      }));
    },

    /**
     * Initialize extract data process based in configuration settings
     * @memberOf Screening/download/createReplica
     */
    _exportFileUsingCreateReplica: function (parentLayerURL, currentLayer) {
      var data, requestHandle, createReplicaDef, distinctLayerIndexes, projectedGeometry,
        outSpatialReference;
      //Remove duplicate layer ids from the array
      distinctLayerIndexes = this._removeDuplicateLayerIds(currentLayer.layerIndexes);
      createReplicaDef = new Deferred();
      if (this.fileFormat === "shapefile") {
        outSpatialReference = new SpatialReference({
          wkid: currentLayer.wkid
        });
        projectedGeometry = projection.project(this.aoi.geometry, outSpatialReference);
      } else {
        projectedGeometry = this.aoi.geometry;
      }
      data = {
        f: "json",
        replicaName: currentLayer.layerInstance.layerName,
        layers: distinctLayerIndexes.join(),
        layerQueries: JSON.stringify(currentLayer.layerDetails),
        inSR: JSON.stringify(this.aoi.geometry.spatialReference),
        geometry: JSON.stringify(projectedGeometry),
        geometryType: "esriGeometryPolygon",
        transportType: 'esriTransportTypeUrl',
        returnAttachments: false,
        returnAttachmentsDataByUrl: false,
        async: false,
        syncModel: 'none',
        dataFormat: this.fileFormat
      };
      requestHandle = esriRequest({
        url: parentLayerURL + "/createReplica",
        content: data,
        handleAs: "json",
        callbackParamName: "callback"
      }, {
        usePost: true
      });
      requestHandle.then(lang.hitch(this, function (response) {
          this.onRequestSucceeded(createReplicaDef, response);
        }),
        lang.hitch(this, function (response) {
          if (this.errMessageString) {
            this.errMessageString += ", ";
          }
          this.errMessageString += currentLayer.layerNames.join(", ");
          this.onRequestFailed(createReplicaDef, response);
        }));
      return createReplicaDef.promise;
    },

    /**
     * Remove duplicate layer ids from array
     * @memberOf Screening/download/createReplica
     */
    _removeDuplicateLayerIds: function (layerIds) {
      var uniqueIds;
      uniqueIds = layerIds.filter(function (elem, index, self) {
        return index === self.indexOf(elem);
      });
      return uniqueIds;
    },

    /**
     * Success callback
     * @memberOf Screening/download/createReplica
     */
    onRequestSucceeded: function (createReplicaDef, response) {
      var url;
      createReplicaDef.resolve();
      if (response.responseUrl) {
        url = response.responseUrl;
      } else if (response.URL) {
        url = response.URL;
      } else if (response.resultUrl) {
        url = response.resultUrl;
      }
      //Emit event only if valid url is obtained
      if (url) {
        this.emit("onRequestSucceeded", url);
      }
    },

    /**
     * Failure callback
     * @memberOf Screening/download/createReplica
     */
    onRequestFailed: function (createReplicaDef, err) {
      createReplicaDef.resolve();
      this.emit("onRequestFailed", err);
    },

    /**
     * Load projection module's dependencies which is needed to execute the
     * project operation. If not loaded, it will throw console error
     * g is undefined.
     */
    _loadProjection: function () {
      if (this.fileFormat === "shapefile") {
        projection.load().then(lang.hitch(this, function () {
          this._init();
        }), lang.hitch(this, function () {
          this.loadingIndicator.hide();
          this.emit("showMessage", this.nls.reportsTab.errorInLoadingProjectionModule);
        }));
      } else {
        this._init();
      }
    }
  });
});