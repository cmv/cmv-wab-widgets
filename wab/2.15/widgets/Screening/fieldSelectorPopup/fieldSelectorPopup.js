///////////////////////////////////////////////////////////////////////////
// Copyright © Esri. All Rights Reserved.
//
// Licensed under the Apache License Version 2.0 (the 'License');
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//    http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an 'AS IS' BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.
///////////////////////////////////////////////////////////////////////////

define([
  'dojo/_base/declare',
  'dijit/_WidgetBase',
  'dojo/_base/lang',
  'dojo/Evented',
  'dojo/dom-construct',
  'dojo/_base/html',
  'dojo/_base/array',
  'dojo/query',
  'dojo/on',
  'dojo/dom-style',
  'jimu/dijit/Popup',
  'jimu/dijit/CheckBox',
  'dojo/NodeList-data'
], function (
  declare,
  _WidgetBase,
  lang,
  Evented,
  domConstruct,
  html,
  array,
  query,
  on,
  domStyle,
  Popup,
  CheckBox
) {
  return declare([_WidgetBase, Evented], {
    baseClass: 'jimu-widget-screening',

    selectedFields: [],
    fieldsPopup: null,
    _selectAllCheckBox: null, // to store the select all checkbox object
    _selectAllCheckBoxHandle: null, // to store change event of select all checkbox
    _fieldsCheckBoxChangeHandle: [], // to store all the change event handle of field checkbox

    constructor: function (options) {
      this.selectedFields = [];
      this.fieldsPopup = null;
      this._selectAllCheckBox = null;
      this._selectAllCheckBoxHandle = null;
      this._fieldsCheckBoxChangeHandle = [];
      lang.mixin(this, options);
    },

    startup: function () {
      this._populateConfiguredFields();
      this._populateSelectedFields();
      this.onFieldsSelectorClick();
      on(window, "resize", lang.hitch(this, function () {
        this._setFieldPopupDimensions();
      }));
    },

    /**
     * Populate all the fields on widget load
     * @memberOf fieldSelectorPopup/fieldSelectorPopup
     */
    _populateConfiguredFields: function () {
      var fieldName;
      for (fieldName in this.outFields) {
        this.selectedFields.push(fieldName);
      }
    },

    /**
     * This function is used to populate the existing selected fields to retain it
     * @memberOf fieldSelectorPopup/fieldSelectorPopup
     */
    _populateSelectedFields: function () {
      if (this.retainSelectedFieldsArr !== null) {
        this.selectedFields = this.retainSelectedFieldsArr;
      }
    },
    /**
     * This function is used to check/uncheck the checkbox of select all
     * depending upon the status of field checkboxes
     * @memberOf fieldSelectorPopup/fieldSelectorPopup
     */
    _resetSelectAllCheckboxStatus: function () {
      var checkAll;
      checkAll = true;
      this._fieldsCheckBox.forEach(function (checkBoxObj) {
        if (!checkBoxObj.checked) {
          checkAll = false;
        }
      });
      if (checkAll) {
        this._selectAllCheckBoxHandle[0].pause();
        this._selectAllCheckBox.check();
        this._selectAllCheckBoxHandle[0].resume();
      } else {
        this._selectAllCheckBoxHandle[0].pause();
        this._selectAllCheckBox.uncheck(true);
        this._selectAllCheckBoxHandle[0].resume();
      }
    },

    /**
     * This function is used to attach the change event to the select all checkbox
     * @memberOf fieldSelectorPopup/fieldSelectorPopup
     */
    _attachFieldCheckBoxChangeEvent: function (chk) {
      this._fieldsCheckBoxChangeHandle.push(this.own(on.pausable(chk, "change",
        lang.hitch(this, function () {
          this._resetSelectAllCheckboxStatus();
        }))));
    },

    /**
     * This function is used to pause all the change event of field check box
     * @memberOf fieldSelectorPopup/fieldSelectorPopup
     */
    _pauseFieldCheckBoxEvent: function () {
      this._fieldsCheckBoxChangeHandle.forEach(function (fieldsCheckBoxChangeHandle) {
        fieldsCheckBoxChangeHandle[0].pause();
      });
    },

    /**
     * This function is used to resume all the change event of field check box
     * @memberOf fieldSelectorPopup/fieldSelectorPopup
     */
    _resumeFieldCheckBoxEvent: function () {
      this._fieldsCheckBoxChangeHandle.forEach(function (fieldsCheckBoxChangeHandle) {
        fieldsCheckBoxChangeHandle[0].resume();
      });
    },

    /**
     * Show field selector popup with selected options
     * @memberOf fieldSelectorPopup/fieldSelectorPopup
     */
    onFieldsSelectorClick: function () {
      var fieldName, parentContainer, contentDom, count = 0, selectAllContainer;
      parentContainer = html.create('div', {});
      //Create label to add dialog header instruction text
      domConstruct.create("div", {
        "class": "esriCTSelectFieldReportLabel",
        "innerHTML": this.fieldTitle
      }, parentContainer);

      // Select all container
      selectAllContainer = domConstruct.create("div", {
        "class": "esriCTSelectAllReportLabel"
      }, parentContainer);
      // Select all checkbox
      this._selectAllCheckBox = new CheckBox({
        checked: false,
        label: this.nls.reportsTab.selectAllLabel
      });
      this._selectAllCheckBoxHandle =
        this.own(on.pausable(this._selectAllCheckBox, "change", lang.hitch(this, function (evt) {
          this._pauseFieldCheckBoxEvent();
          if (evt) {
            // check all the checkbox
            this._fieldsCheckBox.forEach(function (checkBoxObj) {
              checkBoxObj.check();
            });
          } else {
            // un-check all the checkbox
            this._fieldsCheckBox.forEach(function (checkBoxObj) {
              checkBoxObj.uncheck(true);
            });
          }
          this._resumeFieldCheckBoxEvent();
        })));
      this._selectAllCheckBox.placeAt(selectAllContainer);

      contentDom = html.create('div', {
        "class": "esriCTSelectFieldParentContainer",
        style: {
          maxHeight: '350px'
        }
      }, parentContainer);

      this._fieldsCheckBox = [];
      for (fieldName in this.outFields) {
        var chk = new CheckBox({
          checked: this._isSearchable(this.outFields[fieldName]),
          label: this.outFields[fieldName].label ||
            this.outFields[fieldName].alias || fieldName
        });
        this._attachFieldCheckBoxChangeEvent(chk);
        html.addClass(chk.domNode, 'esriCTLayerFieldCheckbox');
        html.addClass(chk.labelNode, 'jimu-ellipsis');
        html.setAttr(chk.domNode, {
          'title': this.outFields[fieldName].label ||
            this.outFields[fieldName].alias || fieldName
        });
        //Add background color to checkbox in Dart Theme
        //This will resolve the issue of checkbox not showing checked images
        if (this.appConfig.theme.name === "DartTheme") {
          domStyle.set(chk.domNode.children[0], "backgroundColor", "#4c4c4c");
        }
        if (count % 3 === 0) {
          if (window.isRTL) {
            html.setStyle(chk.domNode, 'marginRight', 0);
          } else {
            html.setStyle(chk.domNode, 'marginLeft', 0);
          }
        }
        chk.placeAt(contentDom);
        query(chk.domNode).data('fieldName', fieldName);
        this._fieldsCheckBox.push(chk);
        count++;
      }

      this.fieldsPopup = new Popup({
        titleLabel: this.popupTitle,
        autoHeight: true,
        content: parentContainer,
        container: window.jimuConfig.layoutId,
        width: 640,
        maxHeight: 600,
        buttons: [{
          label: this.nls.common.ok,
          onClick: lang.hitch(this, '_onSearchFieldsOk')
        }, {
          label: this.nls.common.cancel,
          onClick: lang.hitch(this, '_onCancelClick')
        }],
        onClose: lang.hitch(this, function () {
          this.fieldsPopup = null;
          this.emit("onClose");
        })
      });
      html.addClass(this.fieldsPopup.domNode, this.appConfig.theme.name + "  " + this.baseClass);
      this._setFieldPopupDimensions();
      this._resetSelectAllCheckboxStatus();
    },

    /**
     * Set popup fields dimensions
     * @memberOf fieldSelectorPopup/fieldSelectorPopup
     */
    _setFieldPopupDimensions: function () {
      if (this.fieldsPopup) {
        //If app is running in mobile mode, change the field selector popup dimensions
        if (window.appInfo.isRunInMobile) {
          this.fieldsPopup.set("width", window.innerWidth - 100);
          query(".esriCTLayerFieldCheckbox").addClass("esriCTLayerFieldWithoutMargin");
          domStyle.set(query(".esriCTSelectFieldParentContainer")[0], "height", "200px");
        } else {
          //Reset the field selector popup dimensions to default
          this.fieldsPopup.set("width", 640);
          this.fieldsPopup.set("maxHeight", 600);
          query(".esriCTLayerFieldCheckbox").removeClass("esriCTLayerFieldWithoutMargin");
        }
      }
    },

    /**
     * Set previously selected fields checkbox to true
     * @memberOf fieldSelectorPopup/fieldSelectorPopup
     */
    _isSearchable: function (field) {
      return array.some(this.selectedFields, lang.hitch(this, function (sf) {
        if (field.hasOwnProperty("name")) {
          return field.name === sf;
        } else if (field.hasOwnProperty("fieldName")) {
          return field.fieldName === sf;
        }
        return false;
      }));
    },

    /**
     * Store selected checkbox values
     * @memberOf fieldSelectorPopup/fieldSelectorPopup
     */
    _onSearchFieldsOk: function () {
      var _fields = [];
      array.forEach(this._fieldsCheckBox, function (chk) {
        if (chk.getValue()) {
          var _data = query(chk.domNode).data('fieldName');
          _fields.push(_data[0]);
          query(chk.domNode).removeData();
        }
      });
      this.setSearchFields(_fields);
      this.fieldsPopup.close();
      this.emit("onFieldSelectComplete", this.selectedFields);
    },

    /**
     * This function is used fire event of cancel button.
     * It is used to retain the report changes consistency
     * @memberOf fieldSelectorPopup/fieldSelectorPopup
     */
    _onCancelClick: function () {
      this.fieldsPopup.close();
      this.emit("onCancel");
    },

    /**
     * Get selected fields
     * @memberOf fieldSelectorPopup/fieldSelectorPopup
     */
    _getSearchFields: function () {
      return this.selectedFields;
    },

    /**
     * Set selected fields
     * @memberOf fieldSelectorPopup/fieldSelectorPopup
     */
    setSearchFields: function (fields) {
      this.selectedFields = fields;
    }
  });
});