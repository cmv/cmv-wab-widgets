/**
 A collection of utility methods providing sorting and formatting functions and other common
 functions to work with objects.
*/
define([
    "../../baUtil/ObjectUtil",
    "esri/dijit/geoenrichment/utils/ObjectUtil",
    "esri/dijit/geoenrichment/utils/SortUtil"
], function (
    baseObjectUtil,
    ObjectUtil,
    SortUtil
) {

    var util = Object.assign({}, baseObjectUtil, ObjectUtil, SortUtil);

    // Gets a prototype for the given object.
    util.getPrototypeOf = function (object) {
        try {
            return Object.getPrototypeOf ? Object.getPrototypeOf(object) :
                object.__proto__ || object.constructor && object.constructor.prototype;
        }
        catch (e) {
            return null;
        }
    }

    // Determines whether the prototype of value is Object, i.e. the value is a result
    // of conversion to JSON.
    util.isJson = function (value) {
        // TODO: Do we need to validate object properties to be JSON convertible?

        return typeof value === 'object' && util.getPrototypeOf(value) === Object.prototype;
    };

    // Creates a deep copy of JSON object using JSON stringify and parse utilities.
    util.copyJson = function (object) {
        return object === undefined || object === null ? null :
            JSON.parse(JSON.stringify({ object: object })).object;
    };

    // Converts an object by recursively applying the given converter to it and to its properties.
    // @param object An object or array to be converted.
    // @param converter A function with signature
    //        converter(object)
    // The function should return either conversion result or undefined value. 
    // The last case means that it can't convert the object right now and deeper object
    // inspection is required. 
    // @param convertNames True value means that the converter will be applied to
    // property names also.
    // @return A new object after conversion.
    util.convert = function (object, _converter, convertNames) {
        var converter = _converter || function () { };
        var convResult = converter(object);
        if (typeof convResult !== "undefined")
            return convResult;

        if (Array.isArray(object)) {
            var arrayResult = [];
            object.forEach(function (item) {
                arrayResult.push(util.convert(item, converter, convertNames));
            }, this);
            return arrayResult;
        }

        if (!util.isJson(object))
            return object;

        var objResult = {};
        for (var key in object) {
            var item = object[key];
            var itemKey = convertNames ? converter(key) : key;
            if (typeof itemKey === "undefined")
                itemKey = key;
            objResult[itemKey] = util.convert(item, converter, convertNames);
        }
        return objResult;
    };

    util.getDeepCopy = function (object) {
        return util.convert(object);
    };

    // Gets the range of values from a source object.
    // @param source An array or an object containing objects whose values are collected.
    // @param getValue An optional callback function calculating a value by object with signature
    // getValue(object, key).
    // @param scope An object to be used as 'this' in the callback.
    // @return An object { min: min, max: max }. If the collection of values extracted from the
    // source is empty, an empty object is returned.
    util.getRange = function (source, getValue, scope) {
        var getValueFn = typeof getValue === "function" ?
            getValue.bind(scope==null ? null : scope) : null;

        var min, max;
        for (var key in source) {
            var value = source[key];
            value = Number(getValueFn === null ? value : getValueFn(value, key));
            if (isNaN(value)) continue;
            if (min === undefined)
                min = max = value;
            else {
                min = Math.min(min, value);
                max = Math.max(max, value);
            }
        }
        return min === undefined ? {} : { min: min, max: max };
    };

    // removes all empty objects in the given object (deep).
    // Arrays are not removed.
    util.removeEmptyObjects = function (obj) {

        function removeEmptyObjects(obj) {
            if (obj && typeof obj === "object") {
                Object.keys(obj).forEach(function (key) {
                    var value = obj[key];
                    if (value && typeof value === "object" && !Array.isArray(value) && !Object.keys(value).length) {
                        keepGoing = true;
                        delete obj[key];
                    }
                    else
                        removeEmptyObjects(value);
                });
            }
        };

        // support multiple levels of removal (example: { i: 1, a: { b: { c: {} } } })

        var keepGoing = true;
        while (keepGoing) {
            keepGoing = false;
            removeEmptyObjects(obj);
        }

        return obj;
    };

    // removes all values in the given object (deep) that don't pass the check function. checkFunc(prop, value)
    //
    // returns the passed object.
    util.removeValues = function (obj, checkFunc) {
        function removeUndefined(obj) {
            if (obj && typeof obj === "object") {
                Object.keys(obj).forEach(function (key) {
                    if (!checkFunc(key, obj[key]))
                        delete obj[key]
                    else
                        removeUndefined(obj[key]);
                });
            }
        };

        removeUndefined(obj);
        return obj;
    };

    // compares the two given objects to have the same properties (deep)
    util.isEqual = function (obj1, obj2) {
        if (obj1 === null || typeof obj1 !== "object" || obj2 === null || typeof obj2 !== "object")
            return obj1 === obj2;

        if (Object.keys(obj1).length !== Object.keys(obj2).length)
            return false;

        var pc = {};
        for (var id in obj1)
            pc[id] = true;

        for (id in obj2)
            if (pc[id] !== undefined)
                delete pc[id]
            else
                return false;

        for (id in obj1)
            if (!util.isEqual(obj1[id], obj2[id]))
                return false;

        return true;
    };

    // path can be specified as "a.b.c", if not specified object is returned.
    util.getObject = function (object, path) {
        if (!path)
            return object;

        var props = path.split(".");
        for (var i = 0; i < props.length; i++)
            object = object && object[props[i]];
        return object;
    };

    //--------------------------------------------------------------------------
    //
    //  Methods: work with numbers
    //
    //--------------------------------------------------------------------------

    // Formats the number with auto-calculation of the number of places after the fractional separator
    // if it is unknown (a negative or missing value).
    //  value: Number   Value to format
    //  params: *       Formatting parameters.
    // The params object can also contain the "maxPlaces" property specifying the maximum number of
    // places after the decimal point if it is unknown.
    util.formatNumber = function (value, params) {
        params = typeof params === "number" ? { places: params } : params || {};
        if (params.places == null/*null or undefined*/ || params.places < 0) {
            params.places = util.getPlaces(value, true);
            if (params.maxPlaces && params.places > params.maxPlaces)
                params.places = params.maxPlaces;
        }

        return ObjectUtil.formatNumber(value, params);
    };

    // Get the number of places after the decimal point for the given numeric value.
    //  value: Number
    //      A numeric value.
    //  ignoreInsignificantDigits: Boolean
    //      If true, the method tries to recognize insignificant digits in the fractional part and reduce the number of places.
    // Returns the number of places recognized or -1 if the input value is not a number.
    util.getPlaces = function (value, ignoreInsignificantDigits) {
        value = +value;
        if (isNaN(value))
            return -1;

        value = value + "";
        var placesIndex = value.indexOf('.') + 1;
        var places = !placesIndex ? 0 : value.length - placesIndex;
        if (places <= 2 || !ignoreInsignificantDigits)
            return places;

        // Specially test the case when a value has a zero entire part.
        // In this case we find the first significant digit after the decimal point
        // and adjust search for insignificant digits from it.
        var placesAdjust = 0;
        if (!+value.substr(0, placesIndex - 1))
            while (value.charAt(placesIndex) === "0") {
                placesIndex++;
                placesAdjust++;
                places--;
            }

        // Try round the insignificant digits for a long fractional part.
        function testPattern(pattern, digits) {
            var patternIndex = value.indexOf(pattern, placesIndex);
            if (patternIndex < 0)
                return places;
            var nextChar = value.charAt(patternIndex + pattern.length);
            return !nextChar || digits.indexOf(nextChar) < 0 ? places : patternIndex - placesIndex;
        }

        // Ensure that at least 2 zero or nine values are available at the end
        for (var testDigits = places - 1; testDigits >= 2; testDigits--) {
            var testPlaces = Math.min(testPattern("000000000000000".substr(0, testDigits), "01234"),
                testPattern("999999999999999".substr(0, testDigits), "56789"));
            if (testPlaces !== places) {
                places = testPlaces;
                break;
            }
        }

        return places + placesAdjust;
    };

    return util;
});
