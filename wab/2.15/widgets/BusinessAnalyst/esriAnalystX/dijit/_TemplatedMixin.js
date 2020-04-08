/**
esriAnalystX version of dijit/_TemplatedMixin.
See also _EscapeValueMixin.
*/
define([
    "dojo/_base/declare",
    "dijit/_TemplatedMixin",
    "./_EscapeValueMixin"
], function (
    declare,
    dijit_TemplatedMixin,
    _EscapeValueMixin
) {
    "use strict";
    return declare([dijit_TemplatedMixin, _EscapeValueMixin], {});
});
