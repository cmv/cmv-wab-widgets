define([
    "dojo/_base/declare"
], function (
    declare
) {
    return declare(null, {

        supportSelectedDnd: true,

        _isChildSelected: function (child) {
            var rowData = this.row(child).data;
            return this.getSelectedRowNodes().some(function (node) {
                return node === rowData;
            });
        },

        _getSelectedChildren: function () {
            return this._getSelectedNodesRows().rows;
        },

        // override
        _startDnd: function (children, createTooltip) {
            !this._isDragging && this.unselectAllRows();
            this.inherited(arguments);
        }
    });
});
