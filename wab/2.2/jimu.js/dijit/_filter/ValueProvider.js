///////////////////////////////////////////////////////////////////////////
// Copyright © 2014 - 2016 Esri. All Rights Reserved.
//
// Licensed under the Apache License Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//    http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.
///////////////////////////////////////////////////////////////////////////

define([
  'dojo/on',
  'dojo/Evented',
  'dojo/_base/lang',
  'dojo/_base/html',
  'dojo/_base/array',
  'dojo/_base/declare',
  'dijit/_WidgetBase',
  'dijit/_TemplatedMixin',
  'jimu/utils'
],
  function(on, Evented, lang, html, array, declare, _WidgetBase, _TemplatedMixin, jimuUtils) {

    return declare([_WidgetBase, _TemplatedMixin, Evented], {
      baseClass: 'jimu-filter-value-provider',
      codedValues: null,
      fieldName: null,
      shortType: null,
      _enabled: false,
      cascade: false,

      //options
      nls: null,
      url: null,
      layerDefinition: null,
      fieldInfo: null,
      partObj: null,
      layerInfo: null,//optional, jimu/LayerInfos/LayerInfo

      //partObj
      /*{
            "fieldObj": {
              "name": "OBJECTID",
              "label": "OBJECTID",
              "shortType": "number",
              "type": "esriFieldTypeOID"
            },
            "operator": "numberOperatorIs",
            "valueObj": {
              "isValid": true,
              "type": "value",
              "value": 123
            },
            "interactiveObj": "",
            "caseSensitive": false,
            "expr": "OBJECTID = 123"
          }*/
      //codedValues
      /*
      [{
        name: "Excellent",
        code: 0
      },{
        name: "Good",
        code: 1
      },{
        name: "Fair",
        code: 2
      },{
        name: "Poor",
        code: 3
      }]
      */

      //methods needs to override:
      //setValueObject
      //getValueObject

      postMixInProperties: function(){
        this.inherited(arguments);
        this.shortType = this.partObj.fieldObj.shortType;
        this.fieldName = this.partObj.fieldObj.name;
        this.cascade = this.partObj.interactiveObj && this.partObj.interactiveObj.cascade;
      },

      getDijits: function(){
        return [];
      },

      //bind change event
      bindChangeEvents: function() {
        //var classNames = ["dijit.form.FilteringSelect", "dijit.form.ValidationTextBox",
        //  "dijit.form.DateTextBox", "dijit.form.NumberTextBox"];
        var dijits = this.getDijits();

        array.forEach(dijits, lang.hitch(this, function(dijit) {
          if(dijit.declaredClass && dijit.declaredClass.indexOf("dijit.") === 0){
            //dijit.form.FilteringSelect -> dijit-form-FilteringSelect
            html.addClass(dijit.domNode, dijit.declaredClass.replace(/\./g, '-'));
          }
          this.own(on(dijit, 'change', lang.hitch(this, this._onChanged)));
        }));
      },

      _onChanged: function(){
        this.emit('change');
      },

      tryLocaleNumber: function(value) {
        var result = jimuUtils.localizeNumber(value);
        if (result === null || result === undefined) {
          result = value;
        }
        return result;
      },

      getPartObject: function(){
        var valueObj = this.getValueObject();
        if(!valueObj){
          return null;
        }
        var partObj = lang.clone(this.partObj);
        partObj.valueObj = valueObj;
        return partObj;
      },

      //maybe return a deferred object
      setValueObject: function(){},

      getValueObject: function(){},

      //-1 means invalid value type
      //0 means empty value, this ValueProvider should be ignored
      //1 means valid value
      getStatus: function(){
        var status = 1;
        var dijits = this.getDijits();
        if(dijits.length > 0){
          var statusArr = array.map(dijits, lang.hitch(this, function(dijit){
            return this.getStatusForDijit(dijit);
          }));
          status = Math.min.apply(statusArr, statusArr);
        }
        return status;
      },

      //return -1 means input a wrong value
      //return 0 means empty value
      //return 1 means valid value
      getStatusForDijit: function(dijit){
        if(dijit.validate()){
          if(dijit.get("DisplayedValue")){
            return 1;
          }else{
            return 0;
          }
        }else{
          return -1;
        }
      },

      isInvalidValue: function(){
        return this.getStatus() < 0;
      },

      isEmptyValue: function(){
        return this.getStatus() === 0;
      },

      isValidValue: function(){
        return this.getStatus() > 0;
      },

      getFilterExpr: function(){
        var expr = "1=1";
        var expr1 = this.getLayerFilterExpr();
        if(this.cascade){
          var expr2 = this.getCascadeFilterExpr();
          expr = "(" + expr1 + ") AND (" + expr2 + ")";
        }else{
          expr = expr1;
        }
        return expr;
      },

      getLayerFilterExpr: function(){
        var expr = "1=1";
        if(this.layerInfo){
          expr = this.layerInfo.getFilter();
        }
        if(!expr){
          expr = "1=1";
        }
        return expr;
      },

      getCascadeFilterExpr: function(){
        return "1=1";
      },

      disable: function(){
        this._enabled = false;
      },

      enable: function(){
        this._enabled = true;
      },

      isEnabled: function(){
        return this._enabled;
      }

    });
  });