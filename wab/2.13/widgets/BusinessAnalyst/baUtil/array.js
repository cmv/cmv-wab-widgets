define(["require", "exports"], function (require, exports) {
    "use strict";
    var arrProto = Array.prototype;
    /**
     * These methods are a higher-performance, drop-in replacement for dojo/_base/array.
     *
     * These are not to be preferred for new development, only for quickly replacing existing uses of dojo/array.
     *
     * This will improve performance of code over dojo/_base/array, while
     * still allowing array methods to be called on non-arrays, strings, null, undefined, etc.
     *
     * Note that if any code depends on other dojo/_base/array quirks,
     * such as full enumeration of sparse arrays or '==' evaluation instead
     * of '===', you must update the code manually or continue to use dojo/_base/array.
     *
     * Documentation adapted from TypeScript's lib.es5.d.ts
     */
    var ArrayMethods = {
        /**
         * Determines whether all the members of an array satisfy the specified test.
         * @param array The array to iterate over.
         * @param callbackfn A function that accepts up to three arguments. The every method calls the callbackfn function for each element in array1 until the callbackfn returns false, or until the end of the array.
         * @param thisArg An object to which the this keyword can refer in the callbackfn function. If thisArg is omitted, undefined is used as the this value.
         */
        every: function (array, callbackfn, thisArg) {
            if (array == null)
                return true;
            if (typeof array === "string") {
                return arrProto.every.call(array.split(""), callbackfn, thisArg);
            }
            return arrProto.every.call(array, callbackfn, thisArg);
        },
        /**
         * Determines whether the specified callback function returns true for any element of an array.
         * @param array The array to iterate over.
         * @param callbackfn A function that accepts up to three arguments. The some method calls the callbackfn function for each element in array1 until the callbackfn returns true, or until the end of the array.
         * @param thisArg An object to which the this keyword can refer in the callbackfn function. If thisArg is omitted, undefined is used as the this value.
         */
        some: function (array, callbackfn, thisArg) {
            if (array == null)
                return false;
            if (typeof array === "string") {
                return arrProto.some.call(array.split(""), callbackfn, thisArg);
            }
            return arrProto.some.call(array, callbackfn, thisArg);
        },
        /**
         * Performs the specified action for each element in an array.
         * @param array The array to iterate over.
         * @param callbackfn  A function that accepts up to three arguments. forEach calls the callbackfn function one time for each element in the array.
         * @param thisArg  An object to which the this keyword can refer in the callbackfn function. If thisArg is omitted, undefined is used as the this value.
         */
        forEach: function (array, callbackfn, thisArg) {
            if (array == null)
                return;
            if (typeof array === "string") {
                return arrProto.forEach.call(array.split(""), callbackfn, thisArg);
            }
            return arrProto.forEach.call(array, callbackfn, thisArg);
        },
        /**
         * Calls a defined callback function on each element of an array, and returns an array that contains the results.
         * @param array The array to iterate over.
         * @param callbackfn A function that accepts up to three arguments. The map method calls the callbackfn function one time for each element in the array.
         * @param thisArg An object to which the this keyword can refer in the callbackfn function. If thisArg is omitted, undefined is used as the this value.
         */
        map: function (array, callbackfn, thisArg) {
            if (array == null)
                return [];
            if (typeof array === "string") {
                return arrProto.map.call(array.split(""), callbackfn, thisArg);
            }
            return arrProto.map.call(array, callbackfn, thisArg);
        },
        /**
         * Returns the elements of an array (or characters of a string) that meet the condition specified in a callback function.
         * @param array The array to filter.
         * @param callbackfn A function that accepts up to three arguments. The filter method calls the callbackfn function one time for each element in the array.
         * @param thisArg An object to which the this keyword can refer in the callbackfn function. If thisArg is omitted, undefined is used as the this value.
         */
        filter: function (array, callbackfn, thisArg) {
            if (array == null)
                return [];
            if (typeof array === "string") {
                return arrProto.filter.call(array.split(""), callbackfn, thisArg);
            }
            return arrProto.filter.call(array, callbackfn, thisArg);
        },
        /**
         * Search an array (or string) for the given element and return its index, or -1 if it is not found.
         * @param array The array to search.
         * @param element The element to look for.
         * @returns the index of the element in the array, or -1 if it is not found.
         */
        indexOf: function (array, element) {
            if (array == null)
                return -1;
            if (typeof array === "string") {
                return arrProto.indexOf.call(array.split(""), element);
            }
            return arrProto.indexOf.call(array, element);
        },
        /**
         * Search an array (or string) for the given element, using loose equality (for dojo/_base/array quirks compatibility), and returns its index, or -1 if it is not found.
         * @param array The array to search.
         * @param element The element to look for.
         * @returns the index of the element in the array (using loose equality), or -1 if it is not found.
         */
        indexOfLoose: function (array, element) {
            if (array == null || array.length === undefined)
                return -1;
            if (typeof array === "string") {
                return ArrayMethods.indexOfLoose(array.split(""), element);
            }
            for (var i = 0, length_1 = array.length; i < length_1; i++) {
                //intentionally using loose equality (for dojo/_base/array quirks compatibility)
                if (array[i] == element)
                    return i;
            }
            return -1;
        },
        /**
         * Search an array (or string) for the given element (starting from the right side) and return its index, or -1 if it is not found.
         * @param array The array to search.
         * @param element The element to look for.
         * @returns the index of the element in the array, or -1 if it is not found.
         */
        lastIndexOf: function (array, element) {
            if (array == null)
                return -1;
            if (typeof array === "string") {
                return arrProto.lastIndexOf.call(array.split(""), element);
            }
            return arrProto.lastIndexOf.call(array, element);
        },
        /**
         * Search an array (or string) for the given element, starting from the right side, using loose equality (for dojo/_base/array quirks compatibility), and returns its index, or -1 if it is not found.
         * @param array The array to search.
         * @param element The element to look for.
         * @returns the index of the element in the array (using loose equality), or -1 if it is not found.
         */
        lastIndexOfLoose: function (array, element) {
            if (array == null || array.length === undefined)
                return -1;
            if (typeof array === "string") {
                return ArrayMethods.lastIndexOfLoose(array.split(""), element);
            }
            for (var i = array.length - 1; i >= 0; i--) {
                //intentionally using loose equality (for dojo/_base/array quirks compatibility)
                if (array[i] == element)
                    return i;
            }
            return -1;
        }
    };
    return ArrayMethods;
});
//# sourceMappingURL=array.js.map