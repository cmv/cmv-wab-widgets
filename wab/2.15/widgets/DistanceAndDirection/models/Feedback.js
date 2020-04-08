///////////////////////////////////////////////////////////////////////////
// Copyright © Esri. All Rights Reserved.
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
//
///////////////////////////////////////////////////////////////////////////

define([
  'dojo/_base/declare',
  'dojo/Stateful',
  'dojo/_base/lang',
  'dojo/Deferred',
  'esri/toolbars/draw',
  'esri/geometry/Point',
  'esri/graphic',
  'esri/geometry/geometryEngineAsync',
  'esri/units',
  'esri/tasks/GeometryService',
  'esri/SpatialReference',
  'esri/request',
  'esri/tasks/ProjectParameters',
  'esri/geometry/webMercatorUtils'
], function (
  dojoDeclare,
  dojoStateful,
  dojoLang,
  dojoDeferred,
  esriDraw,
  EsriPoint,
  EsriGraphic,
  esriGeoDUtils,
  EsriUnits,
  EsriGeometryService,
  EsriSpatialReference,
  EsriRequest,
  EsriProjectParameters,
  EsriWMUtils
) {
  var w = dojoDeclare([esriDraw, dojoStateful], {
    startPoint: null,
    _setStartPoint: function (p) {
      this._set('startPoint', p);
    },

    endPoint: null,
    _setEndPoint: function (p) {
      this._set('endPoint', p);
    },

    lengthUnit: 'meters',
    _setLengthUnit: function (u) {
      this._set('lengthUnit', u);
    },

    angleUnit: 'degrees',
    _setAngle: function (a) {
      this._set('angleUnit', a);
    },

    isDiameter: true,

    canProjectLocally: false,

    /**
     * On load forcefully load geometryEngine
     **/
    constructor: function () {
      // force loading of the geometryEngine
      // prevents lag in feedback when used in mousedrag
      esriGeoDUtils.isSimple(new EsriPoint({
        'x': -122.65,
        'y': 45.53,
        'spatialReference': {
          'wkid': 4326
        }
      }));
    },

    /**
     * Init Geometry service and check if geometries from map spatial ref can be projected locally
     */
    initGeometryService: function () {
      var gs = this.appConfig.geometryService;
      if (!gs) {
        gs = '//utility.arcgisonline.com/arcgis/rest/services/Geometry/GeometryServer';

      }
      //initiate geometry service
      this.geomService = new EsriGeometryService(gs);

      //code to check if geometries can be projected locally or not
      var tempPointInMapSR = new EsriPoint({
        'x': 0,
        'y': 0,
        'spatialReference': this.map.spatialReference
      });
      if (EsriWMUtils.canProject(tempPointInMapSR, new EsriSpatialReference(3857))) {
        this.canProjectLocally = true;
      }
    },

    /**
     * returns unit in ESRI format
     **/
    getRadiusUnitType: function () {
      var selectedUnit = EsriUnits.METERS;
      switch (this.lengthUnit) {
        case 'meters':
          selectedUnit = EsriUnits.METERS;
          break;
        case 'feet':
          selectedUnit = EsriUnits.FEET;
          break;
        case 'kilometers':
          selectedUnit = EsriUnits.KILOMETERS;
          break;
        case 'miles':
          selectedUnit = EsriUnits.MILES;
          break;
        case 'nautical-miles':
          selectedUnit = EsriUnits.NAUTICAL_MILES;
          break;
        case 'yards':
          selectedUnit = EsriUnits.YARDS;
          break;
      }
      return selectedUnit;
    },

    /**
     * Add a temporary start point graphic to the map
     */
    addStartGraphic: function (fromGeometry, withSym) {
      this.removeStartGraphic();
      this.startGraphic = new EsriGraphic(fromGeometry, withSym);
      this.map.graphics.add(this.startGraphic);
    },

    /**
     * Removes temporary start point graphic from map
     */
    removeStartGraphic: function () {
      if (this.startGraphic) {
        this.map.graphics.remove(this.startGraphic);
      }
      this.startGraphic = null;
    },

    /**
     * on map click projects the mapPoint to 4326 spatial ref
     */
    _processAfterMapClick: function (mapPoint) {
      var def = new dojoDeferred();
      if (mapPoint.spatialReference.wkid !== 4326) {
        this.getDDPoint(mapPoint).then(dojoLang.hitch(this, function (projectedMapPoint) {
          def.resolve(projectedMapPoint);
        }), function (err) {
          def.reject(err);
        });
      } else {
        def.resolve(mapPoint);
      }
      return def;
    },

    /**
     * Projects map point to 4326 spatial ref
     **/
    getDDPoint: function (fromPoint) {
      var def = new dojoDeferred();
      var webMerc = new EsriSpatialReference(3857);
      if (EsriWMUtils.canProject(fromPoint, webMerc)) {
        // if the point is in geographics or can be projected to geographics do so
        def.resolve(EsriWMUtils.webMercatorToGeographic(EsriWMUtils.project(fromPoint, webMerc)));
      } else {
        // if the point is NOT geographics and can NOT be projected to geographics
        // Find the most appropriate geo transformation and project the point to geographic
        var args = {
          url: this.geomService.url + '/findTransformations',
          content: {
            f: 'json',
            inSR: fromPoint.spatialReference.wkid,
            outSR: 4326
          },
          handleAs: 'json',
          callbackParamName: 'callback'
        };
        new EsriRequest(args, {
          usePost: false
        }).then(dojoLang.hitch(this, function (response) {
          var transformations = response && response.transformations ?
            response.transformations : undefined;
          var wkid = transformations && transformations.length > 0 ?
            transformations[0].wkid : undefined;
          this.projectPointForDD(def, fromPoint, 4326, wkid);
        }), dojoLang.hitch(this, function () {
          this.projectPointForDD(def, fromPoint, 4326, null);
        }));
      }
      return def;
    },

    projectPointForDD: function (def, fromPoint, wkid, transformationWKID) {
      var pp = new EsriProjectParameters();
      pp.outSR = new EsriSpatialReference(wkid);
      pp.geometries = [fromPoint];
      if (transformationWKID) {
        pp.transformForward = true;
        pp.transformation = transformationWKID;
      }
      this.geomService.project(pp, dojoLang.hitch(this, function (r) {
        def.resolve(r[0]);
      }), function (err) {
        def.reject(err);
      });
    },

    getProjectedGeometry: function (geometry, outSR) {
      var deferred, result;
      deferred = new dojoDeferred();
      if (EsriWMUtils.canProject(geometry, outSR)) {
        result = EsriWMUtils.project(geometry, outSR);
        deferred.resolve(result);
      } else {
        this.geomService.project([geometry], outSR, function (projectedGeometries) {
          result = projectedGeometries[0];
          deferred.resolve(result);
        });
      }
      return deferred.promise;
    }
  });
  return w;
});