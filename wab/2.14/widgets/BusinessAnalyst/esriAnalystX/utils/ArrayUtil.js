define(["require", "exports", "../../baUtil/array", "dojo/store/util/SimpleQueryEngine", "./ObjectUtil", "esri/dijit/geoenrichment/utils/ArrayUtil"], function (require, exports, arrayMethods, SimpleQueryEngine, ObjectUtil, esriArrayUtil) {
    "use strict";
    function _query(elements, query) {
        elements.some(function (element, index) {
            query.func(element, index, query, elements);
            if (query.stop)
                return true; // stop the cycle
        });
        return query;
    }
    function _parseQuery(specifiedQuery) {
        var parts = specifiedQuery.split(" ");
        var operation = parts[0];
        var queryParams = parts[1];
        var func;
        var query = {};
        switch (operation) {
            case "max":
                query.result = -Infinity;
                func = function (element, index, query) {
                    query.result = Math.max(query.result, ObjectUtil.getObject(element, queryParams));
                };
                break;
            case "min":
                query.result = Infinity;
                func = function (element, index, query) {
                    query.result = Math.min(query.result, ObjectUtil.getObject(element, queryParams));
                };
                break;
            case "sum":
                query.result = 0;
                func = function (element, index, query) {
                    query.result += ObjectUtil.getObject(element, queryParams);
                };
                break;
            case "random":
                query.result = undefined;
                func = function (element, index, query, array) {
                    query.result = array[Math.round((array.length - 1) * Math.random())];
                    query.stop = true;
                };
                break;
            default:
                throw new Error("Unsupported query.");
        }
        query.func = func;
        return query;
    }
    /**
     * Common utility methods for arrays.
     */
    var ArrayUtil = {
        //----------------------------------------------
        // Sorting
        //----------------------------------------------
        /**
         * Converts a sort set to a sorting function.
         * In the case of missing sortSet, the ObjectUtil.compare function is returned.
         *  @param sortSet: Object | Array | function
         *      A sort set can be a sorting function, an object { attribute:..., descending: true/false },
         *      or an array of such objects.
         *      The sort set can be also specified in the SimpleQueryEngine-compartible way as
         *      { sort: [...] }.
         *  @param compareMapping: String | String[] | Object
         *      A mapping of specially compared attributes to comparison functions.
         *      In the case of String or String[], enumerated attributes will be compared using ObjectUtil.compareNames method.
         *      In the case of Object, a key is an attribute name and a value is a comparison function to be applied.
         *      For example { myAttr: function (a, b) { ... } } applies the given comparison function when sorting by "myAttr"
         *      attribute.
         *
         *      The full specification of compare function passed in compareMapping is
         *        function (a, b, descending, missingDescending, objA, objB)
         *      Using last two parameters you can sort by any inner properties of objects.
         *
         *      The special case is the "*" key in the mapping object. It is used for sorting by any other attribute.
         *      In this case, the sorting function should have the following interface:
         *        function (attribute, a, b, descending, missingDescending, objA, objB)
         *      The attribute to sort is passed in the first parameter.
         * @returns the required sorting function.
         */
        getSorting: function (sortSet, compareMapping) {
            if (!sortSet)
                return ObjectUtil.compare;
            if (typeof sortSet === "function")
                return sortSet;
            var sortSetArr;
            if (!Array.isArray(sortSet))
                sortSetArr = sortSet.sort || [sortSet];
            else
                sortSetArr = sortSet;
            var mapping = {};
            if (typeof compareMapping === "string") {
                compareMapping = [compareMapping];
            }
            if (Array.isArray(compareMapping)) {
                compareMapping.forEach(function (field) {
                    mapping[field] = ObjectUtil.compareNames;
                });
            }
            else if (compareMapping) {
                mapping = compareMapping;
            }
            return function (a, b) {
                for (var sort = void 0, i = 0; sort = sortSetArr[i]; i++) {
                    var aValue = a[sort.attribute];
                    var bValue = b[sort.attribute];
                    var compare = mapping[sort.attribute] || (mapping["*"] ? mapping["*"].bind(null, sort.attribute) : ObjectUtil.compare);
                    var result = compare(aValue, bValue, false, false, a, b);
                    if (result) {
                        return sort.descending ? -result : result;
                    }
                }
                return 0;
            };
        },
        /**
         * Sorts an array using a sort set described in the getSorting method.
         */
        sort: function (array, sortSet, compareMapping) {
            return array.sort(ArrayUtil.getSorting(sortSet, compareMapping));
        },
        /**
         * Returns an array of indices after sorting is done. Does not modify the passed array.
         */
        sortIndices: function (array, sortSet, compareMapping) {
            var markedArray = arrayMethods.map(array, function (value, index) { return ({ value: value, index: index }); });
            var sortFn = ArrayUtil.getSorting(sortSet, compareMapping);
            markedArray.sort(function (obj1, obj2) { return sortFn(obj1.value, obj2.value); });
            return arrayMethods.map(markedArray, function (o) { return o.index; });
        },
        /**
         * Gets a query engine sorting data with the given mapping of comparison functions.
         * Sorting by attributes not mapped in the 'compareMapping' object is applied with ObjectUtil.compare function.
         */
        getQueryEngine: function (compareMapping, queryEngine) {
            return function (query, options) {
                if (options && options.sort) {
                    options = Object.assign({}, options);
                    options.sort = ArrayUtil.getSorting(options.sort, compareMapping);
                }
                var engine = queryEngine || SimpleQueryEngine;
                return engine(query, options);
            };
        },
        //----------------------------------------------
        // Array <--> Object conversions
        //----------------------------------------------
        /**
         * Converts object's property values or keys to an array.
         * Undefined values are not included.
         * @param object An object.
         * @param property Optional parameter to put specific property of values.
         */
        objectToArray: function (object, property) {
            if (property === void 0) { property = null; }
            var array = [];
            var getValue = property ?
                function (id) { return object[id] ? object[id][property] : undefined; } :
                function (id) { return object[id]; };
            for (var id in object) {
                var value = getValue(id);
                if (typeof value !== "undefined") {
                    array.push(value);
                }
            }
            return array;
        },
        // Converts an array to an object. Use with care, because some elements might be lost
        // if they have the same identity value.
        //  array: Array
        //      Input array of objects.
        //  identity: String | function(object):String | undefined
        //      Specifies how to identify objects of the input array
        //          String value specifies the property name;
        //          Function value specifies a function composing an identity for an object
        //          Missing value means the string object itself to be used as identity.
        // Returns a new object.
        arrayToObject: function (array, identity) {
            var obj = {};
            var identityFn = esriArrayUtil.composeIdentityFunction(identity);
            arrayMethods.forEach(array, function (element) {
                obj[identityFn(element)] = element;
            });
            return obj;
        },
        //----------------------------------------------
        // Other manipulations
        //----------------------------------------------
        composeIdentityFunction: esriArrayUtil.composeIdentityFunction,
        removeDuplicates: esriArrayUtil.removeDuplicates,
        splitArrayToBunches: esriArrayUtil.splitArrayToBunches,
        /**
         * Returns true if the array contains the given item
         */
        contains: function (array, item) {
            //using indexOfLoose because it matches elements via '==' instead of '==='
            //and lots of code has already been built with this assumption (inherited from quirks of dojo/_base/array)
            return arrayMethods.indexOfLoose(array, item) !== -1;
        },
        // Removes an item from the array.
        // Returns true if the operation was succesful and false otherwise.
        remove: function (array, item) {
            //using indexOfLoose because it matches elements via '==' instead of '==='
            //and lots of code has already been built with this assumption (inherited from quirks of dojo/_base/array)
            var i = arrayMethods.indexOfLoose(array, item);
            if (i !== -1) {
                array.splice(i, 1);
            }
            return i !== -1;
        },
        /**
         * Merges two arrays appending objects from the last array to the first array.
         */
        merge: function (baseArray, arrayToMerge) {
            baseArray = baseArray || [];
            if (arrayToMerge != null) {
                Array.prototype.push.apply(baseArray, arrayToMerge);
            }
            return baseArray;
        },
        /**
         * Converts a string list to a new array of trimmed string entries.
         *  @param stringList
         *      Array of values or a string list of values separated with the given delimiter.
         *  @param delimiter
         *      String values delimiter. Defaults to comma ','.
         * @returns a new array with trimmed string values.
         * In the case of null or undefined string list value, an empty array is returned.
         */
        listToArray: function (stringList, delimiter) {
            if (stringList == null) {
                return [];
            }
            if (delimiter === undefined) {
                delimiter = ",";
            }
            var array = typeof stringList === "string" ? stringList.split(delimiter) : stringList.slice();
            for (var i = 0; i < array.length; i++) {
                if (typeof array[i] === "string")
                    array[i] = array[i].trim();
            }
            return array;
        },
        /**
         * Reorders an array.
         * @param array Array to be reordered.
         * @param orderMap An object, where the 'key' is the old index of an object in the array and the 'value' is the new index.
         * @returns A new reordered array.
         */
        reorderArray: function (array, orderMap) {
            var count = array.length, mapCount = 0, reorderedArray = Array(count), mapFrom = {}, mapTo = {}, index;
            for (index in orderMap) {
                var fromIndex = Math.round(index);
                if (fromIndex >= 0 && fromIndex < count && !mapFrom[fromIndex]) {
                    var toIndex = Math.round(orderMap[index]);
                    if (toIndex >= 0 && toIndex < count && !mapTo[toIndex]) {
                        reorderedArray[toIndex] = array[fromIndex];
                        mapFrom[fromIndex] = 1;
                        mapTo[toIndex] = 1;
                        mapCount++;
                    }
                }
            }
            // Test that the mapping was correct. If not, we remove gaps in the reordered array
            // and append not mapped items to ensure that nothing is lost.
            if (mapCount !== count) {
                reorderedArray = reorderedArray.filter(function (item, index) { return mapTo[index]; });
                array.forEach(function (item, index) {
                    !mapFrom[index] && reorderedArray.push(item);
                });
            }
            return reorderedArray;
        },
        /**
         *  Uniformly maps indices from a smaller set to a bigger set and applies
         * callback(smallerIndex, biggerIndex) for every smallerIndex in the range
         * of [0, smallerCount - 1]. The following condition should be fullfilled:
         * 0 < smallerCount <= biggerCount.
         */
        mapIndices: function (smallerCount, biggerCount, callback, thisObject) {
            var scope = thisObject == null ? null : thisObject;
            if (smallerCount === 1) {
                callback.call(scope, 0, Math.floor(biggerCount / 2));
                return;
            }
            var step = (biggerCount - 1) / (smallerCount - 1);
            for (var i = 0; i < smallerCount; i++) {
                var index = Math.floor(0.5 + i * step);
                callback.call(scope, i, index);
            }
        },
        /**
         * Moves the first element (or a group of elements) relatively to the second element.
         * @param elements
         * @param elementOrArray An object or an array of adjacent objects.
         * @returns a new array
         */
        moveElement: function (elements, elementOrArray, refElement, position) {
            var arr = Array.isArray(elementOrArray) ? elementOrArray : [elementOrArray];
            // check if we can move at all
            if (arr.indexOf(refElement) !== -1)
                return elements.slice();
            var newArray = [];
            elements.forEach(function (item) {
                if (arr.indexOf(item) !== -1)
                    return;
                if (item == refElement) {
                    if (position === "before") {
                        arr.forEach(function (element) {
                            newArray.push(element);
                        });
                        newArray.push(refElement);
                    }
                    else if (position === "after") {
                        newArray.push(refElement);
                        arr.forEach(function (element) {
                            newArray.push(element);
                        });
                    }
                    return;
                }
                newArray.push(item);
            });
            return newArray;
        },
        /**
         * Returns an element with minimal value provided by selector function
         */
        min: function (sourceArray, selector) {
            var len = sourceArray.length;
            switch (len) {
                case 0:
                    return null;
                case 1:
                    return sourceArray[0];
                default:
                    var minElement = sourceArray[0];
                    var minValue = selector(minElement);
                    var index = 0;
                    for (var i = 1; i < len; i++) {
                        var selectedValue = selector(sourceArray[i]);
                        if (minValue > selectedValue) {
                            minElement = sourceArray[i];
                            minValue = selectedValue;
                            index = i;
                        }
                    }
                    return {
                        key: index,
                        value: minElement,
                        comparisonValue: minValue
                    };
            }
        },
        /**
         * Returns an element with maximal value provided by selector function
         */
        max: function (sourceArray, selector) {
            var len = sourceArray.length;
            switch (len) {
                case 0:
                    return null;
                case 1:
                    return sourceArray[0];
                default:
                    var maxElement = sourceArray[0];
                    var maxValue = selector(maxElement);
                    var index = 0;
                    for (var i = 1; i < len; i++) {
                        var selectedValue = selector(sourceArray[i]);
                        if (maxValue < selectedValue) {
                            maxElement = sourceArray[i];
                            maxValue = selectedValue;
                            index = i;
                        }
                    }
                    return {
                        key: index,
                        value: maxElement,
                        comparisonValue: maxValue
                    };
            }
        },
        //--------------------------------------------------------------------------
        //
        //  Query
        //
        //--------------------------------------------------------------------------
        /**
         * Examples of query:
         * Object:
         *      query.func(element, index, query, array)
         * Supported operations:
         * String:
         *      "max a.b.c"
         *      "max"
         *      "min a.b.c"
         *      "min"
         *      "sum a.b.c"
         *       "sum"
         *      "random" - picks a random element
         *
         * RT: not quite sure the typings are correct. Did my best.
         */
        query: function (elements, query) {
            if (typeof query === "object")
                return _query(elements, query);
            else if (typeof query === "string") {
                var parsedQuery = _parseQuery(query);
                return _query(elements, parsedQuery).result;
            }
        },
        everyEqualProperty: function (array, prop) {
            if (array.length < 2)
                return true;
            var firstValue;
            return !array.some(function (element, index) {
                if (index === 0)
                    firstValue = element[prop];
                // continue
                else if (firstValue !== element[prop])
                    return true; // stop => positive
            });
        }
    };
    return ArrayUtil;
});
//# sourceMappingURL=ArrayUtil.js.map