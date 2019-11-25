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
///////////////////////////////////////////////////////////////////////////


define([
  'dojo/_base/lang',
  'dojo/Deferred',
  'esri/geometry/webMercatorUtils',
  'esri/SpatialReference'
],
  function (
    lang,
    Deferred,
    webMercatorUtils,
    SpatialReference
  ) {

    var mo = {};

    mo.getProjectedGeometry = function (geometry, outSR, geometryService) {
      var deferred, result;
      deferred = new Deferred();
      //if can be projected using webMercatorUtil do it else use geometry service
      if (webMercatorUtils.canProject(geometry, outSR)) {
        result = webMercatorUtils.project(geometry, outSR);
        deferred.resolve(result);
      } else {
        geometryService.project([geometry], outSR, function (projectedGeometries) {
          result = projectedGeometries[0];
          deferred.resolve(result);
        });
      }
      return deferred.promise;
    };

    mo.getMapCoordinates = function (geometry) {
      var mapCoordinate;
      switch (geometry.type) {
        case "polygon":
          //get centroid of the polygon as x and y
          mapCoordinate = geometry.getCentroid();
          break;
        case "polyline":
          //get first point of the polyline as x and y
          mapCoordinate = geometry.getPoint(0, 0);
          break;
        case "point":
          //use the point itself
          mapCoordinate = geometry;
          break;
      }
      return mapCoordinate;
    };

    mo.getCoordinatesData = function (geometry, geometryService) {
      var def, coordinatesInfo = {}, latLongSpatialRef;
      def = new Deferred();
      latLongSpatialRef = new SpatialReference(4326);
      coordinatesInfo.MapSpatialReference = mo.getMapCoordinates(geometry);
      mo.getProjectedGeometry(
        coordinatesInfo.MapSpatialReference, latLongSpatialRef, geometryService).then(
        lang.hitch(this, function (latLongCoordinates) {
          coordinatesInfo.LatLong = latLongCoordinates;
          def.resolve(coordinatesInfo);
        }));
      return def.promise;
    };

    return mo;
  });
