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
  'esri/geometry/Point',
  'esri/geometry/Polyline',
  'esri/geometry/webMercatorUtils',
  'dojo/Deferred',
  'dojo/_base/array',
  'dojo/_base/lang',
  'esri/SpatialReference'
],
  function (
    Point,
    Polyline,
    webMercatorUtils,
    Deferred,
    array,
    lang,
    SpatialReference) {
    var mo = {};

    /**
    * Returns the projected geometry in outSR
    **/
    mo.getProjectedGeometry = function (geometry, outSR, geometryService) {
      var deferred, result;
      deferred = new Deferred();
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

    /*---------------------------------------------------------------------------------------------
    * Vincenty Direct and Inverse Solution of Geodesics on the Ellipsoid (c) Chris Veness 2002-2016
    *                                                                                   MIT Licence
    *
    * www.movable-type.co.uk/scripts/latlong-vincenty.html
    * www.movable-type.co.uk/scripts/geodesy/docs/module-latlon-vincenty.html
    *---------------------------------------------------------------------------------------------
    * Returns the destination mapPoint using Vincenty direct solution.
    **/
    mo.getDestinationPoint = function (startPoint, initialBearing, distance) {
      var a = 6378137;
      var b = 6356752.314245;
      var f = (a - b) / a;

      var φ1 = startPoint.y * Math.PI / 180, λ1 = startPoint.x * Math.PI / 180;
      var α1 = initialBearing * Math.PI / 180;
      var s = distance;

      var sinα1 = Math.sin(α1);
      var cosα1 = Math.cos(α1);

      var tanU1 = (1 - f) * Math.tan(φ1),
        cosU1 = 1 / Math.sqrt((1 + tanU1 * tanU1)), sinU1 = tanU1 * cosU1;
      var σ1 = Math.atan2(tanU1, cosα1);
      var sinα = cosU1 * sinα1;
      var cosSqα = 1 - sinα * sinα;
      var uSq = cosSqα * (a * a - b * b) / (b * b);
      var A = 1 + uSq / 16384 * (4096 + uSq * (-768 + uSq * (320 - 175 * uSq)));
      var B = uSq / 1024 * (256 + uSq * (-128 + uSq * (74 - 47 * uSq)));

      var cos2σM, sinσ, cosσ, Δσ;

      var σ = s / (b * A), σʹ, iterations = 0;
      do {
        cos2σM = Math.cos(2 * σ1 + σ);
        sinσ = Math.sin(σ);
        cosσ = Math.cos(σ);
        Δσ = B * sinσ * (cos2σM + B / 4 * (cosσ * (-1 + 2 * cos2σM * cos2σM) -
          B / 6 * cos2σM * (-3 + 4 * sinσ * sinσ) * (-3 + 4 * cos2σM * cos2σM)));
        σʹ = σ;
        σ = s / (b * A) + Δσ;
      } while (Math.abs(σ - σʹ) > 1e-12 && ++iterations < 200);
      if (iterations >= 200) {
        console.log('Formula failed to converge'); // not possible?
        return null;
      }

      var x = sinU1 * sinσ - cosU1 * cosσ * cosα1;
      var φ2 = Math.atan2(sinU1 * cosσ + cosU1 * sinσ * cosα1,
        (1 - f) * Math.sqrt(sinα * sinα + x * x));
      var λ = Math.atan2(sinσ * sinα1, cosU1 * cosσ - sinU1 * sinσ * cosα1);
      var C = f / 16 * cosSqα * (4 + f * (4 - 3 * cosSqα));
      var L = λ - (1 - C) * f * sinα *
        (σ + C * sinσ * (cos2σM + C * cosσ * (-1 + 2 * cos2σM * cos2σM)));
      var λ2 = (λ1 + L + 3 * Math.PI) % (2 * Math.PI) - Math.PI;  // normalize to -180..+180

      var α2 = Math.atan2(sinα, -x);
      α2 = (α2 + 2 * Math.PI) % (2 * Math.PI); // normalize to 0..360

      φ2 = φ2 * 180 / Math.PI;
      λ2 = λ2 * 180 / Math.PI;
      α2 = α2 * 180 / Math.PI;
      return new Point(λ2, φ2, new SpatialReference(4326));
    };

    /*---------------------------------------------------------------------------------------------
    * Vincenty Direct and Inverse Solution of Geodesics on the Ellipsoid (c) Chris Veness 2002-2016
    *                                                                                   MIT Licence
    *
    * www.movable-type.co.uk/scripts/latlong-vincenty.html
    * www.movable-type.co.uk/scripts/geodesy/docs/module-latlon-vincenty.html
    *---------------------------------------------------------------------------------------------
    * Returns the Info (Distance, initialBearing, finalBearing) using Vincenty inverse solution.
    **/
    mo.getInverseCalculations = function (startPoint, endPoint) {
      var φ1 = startPoint.y * Math.PI / 180, λ1 = startPoint.x * Math.PI / 180;
      var φ2 = endPoint.y * Math.PI / 180, λ2 = endPoint.x * Math.PI / 180;

      var a = 6378137; var b = 6356752.314245; var f = (a - b) / a;

      var L = λ2 - λ1;
      var tanU1 = (1 - f) * Math.tan(φ1),
        cosU1 = 1 / Math.sqrt((1 + tanU1 * tanU1)), sinU1 = tanU1 * cosU1;
      var tanU2 = (1 - f) * Math.tan(φ2),
        cosU2 = 1 / Math.sqrt((1 + tanU2 * tanU2)), sinU2 = tanU2 * cosU2;

      var sinλ, cosλ, sinSqσ, sinσ, cosσ, σ, sinα, cosSqα, cos2σM, C;

      var λ = L, λʹ, iterations = 0;
      do {
        sinλ = Math.sin(λ);
        cosλ = Math.cos(λ);
        sinSqσ = (cosU2 * sinλ) * (cosU2 * sinλ) +
          (cosU1 * sinU2 - sinU1 * cosU2 * cosλ) * (cosU1 * sinU2 - sinU1 * cosU2 * cosλ);
        sinσ = Math.sqrt(sinSqσ);
        if (sinσ == 0) { // jshint ignore:line
          return { distance: 0, initialBearing: 0, finalBearing: 0 };  // co-incident points
        }
        cosσ = sinU1 * sinU2 + cosU1 * cosU2 * cosλ;
        σ = Math.atan2(sinσ, cosσ);
        sinα = cosU1 * cosU2 * sinλ / sinσ;
        cosSqα = 1 - sinα * sinα;
        cos2σM = cosσ - 2 * sinU1 * sinU2 / cosSqα;
        if (isNaN(cos2σM)) {
          cos2σM = 0;  // equatorial line: cosSqα=0 (§6)
        }
        C = f / 16 * cosSqα * (4 + f * (4 - 3 * cosSqα));
        λʹ = λ;
        λ = L + (1 - C) * f * sinα *
          (σ + C * sinσ * (cos2σM + C * cosσ * (-1 + 2 * cos2σM * cos2σM)));
      } while (Math.abs(λ - λʹ) > 1e-12 && ++iterations < 200);
      if (iterations >= 200) {
        return null;
      }

      var uSq = cosSqα * (a * a - b * b) / (b * b);
      var A = 1 + uSq / 16384 * (4096 + uSq * (-768 + uSq * (320 - 175 * uSq)));
      var B = uSq / 1024 * (256 + uSq * (-128 + uSq * (74 - 47 * uSq)));
      var Δσ = B * sinσ * (cos2σM + B / 4 * (cosσ * (-1 + 2 * cos2σM * cos2σM) -
        B / 6 * cos2σM * (-3 + 4 * sinσ * sinσ) * (-3 + 4 * cos2σM * cos2σM)));

      var s = b * A * (σ - Δσ);

      var α1 = Math.atan2(cosU2 * sinλ, cosU1 * sinU2 - sinU1 * cosU2 * cosλ);
      var α2 = Math.atan2(cosU1 * sinλ, -sinU1 * cosU2 + cosU1 * sinU2 * cosλ);

      α1 = (α1 + 2 * Math.PI) % (2 * Math.PI); // normalize to 0..360
      α2 = (α2 + 2 * Math.PI) % (2 * Math.PI); // normalize to 0..360

      s = Number(s.toFixed(3)); // round to 1mm precision
      α1 = α1 * 180 / Math.PI;
      α2 = α2 * 180 / Math.PI;
      return { distance: s, initialBearing: α1, finalBearing: α2 };
    };

    /**
    * Returns the polyline geometry between point
    **/
    mo.getLineBetweenPoints = function (pointsArray) {
      var polyline, pathsArray = [];
      //iterate through all the points and create paths array
      array.forEach(pointsArray, lang.hitch(this, function (point) {
        pathsArray.push([mo.removeNegativeExponents(point.x), mo.removeNegativeExponents(point.y)]);
      }));
      //check if paths exist and create polyline object from it
      if (pathsArray.length > 0) {
        polyline = new Polyline({
          "paths": [
            pathsArray
          ], "spatialReference": {
            "wkid": 4326
          }
        });
      }
      return polyline;
    };

    /**
    * Returns angle between to points
    **/
    mo.getAngleBetweenPoints = function (originPoint, chordPoint) {
      var angle;
      var inverseInfo = mo.getInverseCalculations(originPoint, chordPoint);
      if (inverseInfo === null) {
        angle = 0;
      } else {
        angle = inverseInfo.initialBearing;
      }
      return angle;
    };

    /**
    * Returns distance between two point in meters using geometry engine
    **/
    mo.getDistanceBetweenPoints = function (startPoint, endPoint) {
      var distance;
      var inverseInfo = mo.getInverseCalculations(startPoint, endPoint);
      if (inverseInfo === null) {
        distance = 0;
      } else {
        distance = inverseInfo.distance;
      }
      return distance;
    };

    /**
    * Returns the pointArray for an arc
    **/
    mo.getPointsForArc = function (startAngle, endAngle, centerPoint, radius) {
      var i, pointArray = [], angleOfArc, segments, unitAngle, bearingForEachPoint, point;
      angleOfArc = endAngle - startAngle;
      segments = parseInt(angleOfArc, 10);
      //in case if angle is in between 0 to 1, segments parseInt value will be 0,
      //but we would require at least 1 segment to draw arc
      if (segments <= 0) {
        segments = 1;
      }
      unitAngle = Math.abs(angleOfArc) / Math.abs(segments);
      //unit angle is zero then we cannot calculate points of arc
      if (unitAngle > 0) {
        for (i = 0; i < Math.abs(segments) + 1; i++) {
          bearingForEachPoint = startAngle + (unitAngle * i);
          point = mo.getDestinationPoint(centerPoint, bearingForEachPoint, Math.abs(radius));
          if (point) {
            pointArray.push(point);
          }
        }
      }
      return pointArray;
    };

    /**
    * Returns the value after removing negative exponents from it
    **/
    mo.removeNegativeExponents = function (num) {
      var returnValue;
      if (num.toString().toLowerCase().split('e-').length > 1) {
        returnValue = 0;
      } else {
        returnValue = num;
      }
      return returnValue;
    };

    return mo;
  });