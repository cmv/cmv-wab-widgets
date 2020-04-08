/**
Modifies dijit/_TemplatedMixin to not escape html tags as it is made in dojo prior version 1.10.4.
TODO: Need to use the save escaping as in dojo 1.10.4, but do not escape simple HTML markup tags such as <br/>, <b>, <i>, <p>, etc.
*/
define(["dojo/_base/declare"], function (declare) {
    "use strict";
    return declare(null, {
        _escapeValue: function (val) {
            return val.replace(/"/g, "&quot;");
        }
    });
});
