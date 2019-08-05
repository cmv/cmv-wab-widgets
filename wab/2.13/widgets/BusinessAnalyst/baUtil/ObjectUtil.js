define(["require", "exports"], function (require, exports) {
    "use strict";
    /**
     * Applies a callback to own properties of an object or
     * to array entries and creates a target object or array containing callback results.
     * @param objectOrArray An Object or Array containing values for keys or indices
     * @param callback A callback function with signature callback(value, key).
     * @param scope An object to be used as 'this' in the callback.
     * @return A new object or array containing callback results associated with respective keys
     * or indices.
     */
    function map(objectOrArray, callback, scope) {
        if (scope !== void 0)
            callback = callback.bind(scope);
        if (typeof objectOrArray !== "object")
            throw new Error("Object or array expected");
        if (Array.isArray(objectOrArray)) {
            var result_1 = [];
            for (var i = 0, len = objectOrArray.length; i < len; i++)
                result_1.push(callback(objectOrArray[i], i));
            return result_1;
        }
        var result = {};
        for (var _i = 0, _a = Object.keys(objectOrArray); _i < _a.length; _i++) {
            var key = _a[_i];
            if (Object.hasOwnProperty.call(objectOrArray, key))
                result[key] = callback(objectOrArray[key], key);
        }
        return result;
    }
    function assignObjects(obj, srcObj) {
        for (var _i = 0, _a = Object.keys(srcObj); _i < _a.length; _i++) {
            var key = _a[_i];
            if (typeof obj[key] !== "object" || obj[key] === null || typeof srcObj[key] !== "object" || srcObj[key] === null) {
                obj[key] = srcObj[key];
                continue;
            }
            if (Array.isArray(obj[key])) {
                if (!Array.isArray(srcObj[key])) {
                    obj[key] = srcObj[key];
                    continue;
                }
                obj[key].concat(srcObj[key]);
                continue;
            }
            if (Array.isArray(srcObj[key])) {
                obj[key] = srcObj[key];
                continue;
            }
            assignObjects(obj[key], srcObj[key]);
        }
    }
    function deepAssign(obj) {
        var objects = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            objects[_i - 1] = arguments[_i];
        }
        for (var _a = 0, objects_1 = objects; _a < objects_1.length; _a++) {
            var srcObj = objects_1[_a];
            assignObjects(obj, srcObj);
        }
        return obj;
    }
    ;
    return { map: map, deepAssign: deepAssign };
});
//# sourceMappingURL=ObjectUtil.js.map