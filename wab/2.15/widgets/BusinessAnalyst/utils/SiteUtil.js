define([
  "esri/units",
  "dojo/_base/array"
], function(Units, array) {
  var util = {};

  var HOURS = "Hours";
  var MINUTES = "Minutes";
  var SECONDS = "Seconds";

  // Tests the units to be time units.
  util.testTimeUnits = function (units) {
    return units === HOURS || units === SECONDS || units === MINUTES;
  }

  var measureUnits = {};

  // Linear units multiples
  measureUnits[Units.FEET] = 0.3048;
  measureUnits[Units.YARDS] = 0.9144;
  measureUnits[Units.METERS] = 1;
  measureUnits[Units.KILOMETERS] = 1000;
  measureUnits[Units.MILES] = 1609.3472186944374;
  measureUnits[Units.NAUTICAL_MILES] = 1852;

  // Drive time units multiples (average drive time speed is 60 km per hour)
  measureUnits[HOURS] = 60000;
  measureUnits[SECONDS] = 16.66666666666667;
  measureUnits[MINUTES] = 1000;

  // Square units multiples
  measureUnits[Units.SQUARE_FEET] = measureUnits[Units.FEET] * measureUnits[Units.FEET];
  measureUnits[Units.SQUARE_YARDS] = measureUnits[Units.YARDS] * measureUnits[Units.YARDS];
  measureUnits[Units.SQUARE_METERS] = 1;
  measureUnits[Units.SQUARE_KILOMETERS] = measureUnits[Units.KILOMETERS] * measureUnits[Units.KILOMETERS];
  measureUnits[Units.SQUARE_MILES] = measureUnits[Units.MILES] * measureUnits[Units.MILES];
  measureUnits[Units.ACRES] = 4046.8564224;
  measureUnits[Units.HECTARES] = 10000;

  // Gets a value of linear unit in meters.
  //  value: Number
  //      A value to convert.
  //  sourceUnits: String
  //      ArcGIS units or time units 'Seconds', 'Minutes', or 'Hours'. 
  //  targetUnits: String
  //      Optional ArcGIS units or time units 'Seconds', 'Minutes', or 'Hours'.
  //      If missing, the meters or square meters are used as target units.
  // The source and target units should be both linear units or square units.
  // Time units are considered as linear units. The time to distance conversion is applied for the average speed of 90 km in hour.
  // Returns a value in converted units or 0 if source units were wrong.
  util.convertUnits = function (value, sourceUnits, targetUnits) {
      var multiple = measureUnits[sourceUnits] || 0;
      var divider = targetUnits && measureUnits[targetUnits] || 1;
      return value * multiple / divider;
  };

  var WALK_TIME = "WalkTime";


  // Calculates the max radius of site buffer in kilometers.
  // The supported units are kilometers, miles, and minutes.
  // In the case of minutes, we calculate the max radius using an average drive time speed of 60 km per hour
  // and walk time speed of 5 km per hour.
  //  options: Object
  //      Site or buffer area parameters.
  util.getMaxRadiusInKilometers = function(options, isWalkTime) {
    var maxRadius = 0;
    if (options && options.bufferRadii) {
      array.forEach(options.bufferRadii, function (radius) { if (radius > maxRadius) maxRadius = radius });
      maxRadius = util.convertUnits(maxRadius, options.bufferUnits || Units.MILES, Units.KILOMETERS);
      if (isWalkTime && util.testTimeUnits(options.bufferUnits))
        maxRadius /= 12;
    }
    return maxRadius;
  };

  return util;

});
