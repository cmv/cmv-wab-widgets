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
  'dojo/_base/array',
  'dojo/_base/declare',
  'dojo/on',
  'dojo/query',
  './settingComponents',
  './SettingObject'
], function (
  array,
  declare,
  on,
  query,
  settingComponents,
  SettingObject
) {
  return declare(SettingObject, {
    _inputControl: null,
    _isFlagged: true,

    //================================================================================================================//

    /**
     * Constructor for class.
     * @param {object} config App configuration object; see subclass for required parameter(s)
     * @memberOf SettingOptionsTable#
     * @constructor
     */
    constructor: function (name, widthClass, tableClasses, columnTitle, tableItems, hint,
      onRowSelected, onRowDeleted, onRowMoved) {
      /*jshint unused:false*/
      var tableFields, valueItems = [], subcomponent;

      tableFields = [{
        name: 'selected',
        title: '',
        width: '32px',
        type: 'checkbox',
        editable: false
      }, {
        name: 'item',
        title: columnTitle,
        width: 'auto',
        type: 'text',
        editable: false
      }, {
        name: 'actions',
        title: '',
        width: '40px',
        type: 'actions',
        actions: ['up', 'down']
      }];
      if (typeof onRowDeleted === 'function') {
        this._isFlagged = false;
        tableFields = tableFields.slice(1);
        tableFields[1].width = '60px';
        tableFields[1].actions.push('delete');
      }

      subcomponent = settingComponents.tableCtl(tableClasses, {
        autoHeight: true,
        selectable: typeof onRowSelected === 'function',
        fields: tableFields
      }, tableItems);
      valueItems.push(subcomponent.div);
      this._inputControl = subcomponent.ctl;

      if (onRowSelected) {
        this.own(on(this._inputControl, 'row-select', onRowSelected));
      }
      if (onRowDeleted) {
        this.own(on(this._inputControl, 'row-delete', onRowDeleted));
      }
      if (onRowMoved) {
        this.own(on(this._inputControl, 'row-up', function (tr) {
          onRowMoved(tr, true);
        }));
        this.own(on(this._inputControl, 'row-down', function (tr) {
          onRowMoved(tr, false);
        }));
      }

      if (hint) {
        valueItems.push(settingComponents.text('hint', hint));
      }

      // Assemble label/value pair
      this._mainDiv = settingComponents.container(widthClass || '', 'minorTrailingVertGap', valueItems);
    },

    addRowToTable: function (value) {
      if (this._inputControl) {
        this._inputControl.addRow(value);
      }
    },

    selectTableRow: function (iRow) {
      var tr = this._getRowTR(iRow);
      if (tr) {
        this._inputControl.selectRow(tr);
      }
    },

    renameTableRow: function (iRow, newValue) {
      var tr = this._getRowTR(iRow);
      if (tr) {
        this._inputControl.editRow(tr, {item: newValue});
      }
    },

    setValue: function (value) {
      if (this._inputControl) {
        this._inputControl.addRows(this._isFlagged ? this._convertTableConfigToTableLines(value) : value);
        this.selectTableRow(0);
      }
    },

    getValue: function () {
      var tableData;
      if (this._inputControl) {
        tableData = this._inputControl.getData();
        return this._isFlagged ? this._convertTableLinesToTableConfig(tableData) : tableData;
      }
      return null;
    },

    setConfig: function () {
      if (this._inputControl && this._config) {
        this.setValue(this._config);
      }
    },

    getConfig: function () {
      if (this._inputControl) {
        this._config = this.getValue();
      }
    },

    _getRowTR: function (iRow) {
      var tableRows;
      if (this._inputControl && iRow >= 0) {
        tableRows = query('.simple-table-row', this._inputControl.domNode);
        return iRow < tableRows.length ? tableRows[iRow] : null;
      } else {
        return null;
      }
    },

    _convertTableConfigToTableLines: function (tableConfig) {
      var flags = tableConfig[0], tableLines;

      tableLines = array.map(tableConfig.slice(1), function (config, i) {
        return {
          item: config,
          selected: flags[i] === '1'
        };
      });

      return tableLines;
    },

    _convertTableLinesToTableConfig: function (tableLines) {
      var flags = '', tableConfig;

      tableConfig = array.map(tableLines, function (line) {
        flags += line.selected ? '1' : '0';
        return line.item;
      });
      tableConfig = [flags].concat(tableConfig);

      return tableConfig;
    }

    //================================================================================================================//
  });
});
