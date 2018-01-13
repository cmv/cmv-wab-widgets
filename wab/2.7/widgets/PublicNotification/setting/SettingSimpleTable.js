/*
 | Copyright 2017 Esri
 |
 | Licensed under the Apache License, Version 2.0 (the "License");
 | you may not use this file except in compliance with the License.
 | You may obtain a copy of the License at
 |
 |    http://www.apache.org/licenses/LICENSE-2.0
 |
 | Unless required by applicable law or agreed to in writing, software
 | distributed under the License is distributed on an "AS IS" BASIS,
 | WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 | See the License for the specific language governing permissions and
 | limitations under the License.
 */
//====================================================================================================================//
define([
  'dojo/_base/declare',
  'dojo/_base/html',
  'jimu/dijit/SimpleTable'
], function (
  declare,
  html,
  SimpleTable
) {
  return declare(SimpleTable, {
    _onRowMoved: null,

    //================================================================================================================//

    /**
     * Constructor for class.
     * @param {object} config App configuration object; see subclass for required parameter(s)
     * @memberOf SettingSimpleTable#
     * @constructor
     */
    constructor: function (definition) {
      /*jshint unused : false*/
    },

    deleteRow: function (tr) {
      var rowData, formerRowIndex;
      if (tr) {
        rowData = this.getRowData(tr);
        formerRowIndex = tr.rowIndex;
        html.destroy(tr);
        this.updateUI();
        this._onDeleteRow(tr, rowData, formerRowIndex);
      }
    },

    _onDeleteRow: function(tr, rowData, formerRowIndex){
      this.emit('row-delete', tr, rowData, formerRowIndex);
    }

    //================================================================================================================//
  });
});
