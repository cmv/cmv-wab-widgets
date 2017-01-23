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
  'dojo/aspect',
  'dojo/Deferred',
  'dojo/_base/lang',
  'dojo/_base/html',
  'dojo/_base/array',
  'dojo/_base/declare',
  './ValueProvider',
  'dijit/_TemplatedMixin',
  'dijit/_WidgetsInTemplateMixin',
  'dojo/text!./ListValueProvider.html',
  'dojo/store/Memory',
  'jimu/utils',
  'dijit/form/FilteringSelect'
],
  function(aspect, Deferred, lang, html, array, declare, ValueProvider, _TemplatedMixin, _WidgetsInTemplateMixin,
    template, Memory, jimuUtils) {

    return declare([ValueProvider, _TemplatedMixin, _WidgetsInTemplateMixin], {
      templateString: template,
      codedValues: null,//[{name,code}] name is description and code is value
      showNullValues: false,//show null values

      postCreate: function(){
        this.inherited(arguments);
        html.addClass(this.domNode, 'jimu-filter-list-value-provider');

        this._uniqueValueCache = {};

        //[{id,value,label}]
        var store = new Memory({idProperty:'id', data: []});
        this.valuesSelect.set('store', store);

        if(!this.codedValues && typeof this.valuesSelect._onDropDownMouseDown === 'function'){
          this.own(
            aspect.before(this.valuesSelect, "_onDropDownMouseDown", lang.hitch(this, this._onBeforeDropDownMouseDown))
          );
        }
      },

      _onBeforeDropDownMouseDown: function(){
        this._tryUpdatingUniqueValues(undefined, true);
        return arguments;
      },

      getDijits: function(){
        return [this.valuesSelect];
      },

      //maybe return a deferred
      setValueObject: function(valueObj){
        if(this.codedValues){
          return this._setValueForCodedValues(valueObj.value);
        }else{
          return this._tryUpdatingUniqueValues(valueObj.value, false);
        }
      },

      getValueObject: function(){
        if(this.isValidValue()){
          var item = this.valuesSelect.get('item');
          var value = item.value;
          //value maybe '<Null>'
          /*if(value === null || isNaN(value)){
            value = '<Null>';
          }*/
          return {
            "isValid": true,
            "type": "unique",
            "value": value
          };
        }
        return null;
      },

      /*disable: function(){
        this.inherited(arguments);
        this.valuesSelect.closeDropDown(true);
        this.valuesSelect.set('disabled', true);
      },

      enable: function(){
        this.inherited(arguments);
        this.valuesSelect.set('disabled', false);
      },*/

      _setValueForCodedValues: function(selectedValue){
        var data = null;
        var selectedId = -1;
        var selectedItem = null;
        if(this.codedValues){
          data = array.map(this.codedValues, lang.hitch(this, function(item, index){
            var dataItem = {
              id: index,
              value: item.code,
              label: item.name
            };
            if(dataItem.value === selectedValue){
              selectedId = index;
            }
            return dataItem;
          }));
          this.valuesSelect.store.setData(data);
          if(selectedId >= 0){
            selectedItem = this.valuesSelect.store.get(selectedId);
            if(selectedItem){
              this.valuesSelect.set('item', selectedItem);
            }
          }
        }
      },

      _uniqueValueLoadingDef: null,
      _uniqueValueLoadingExpr: '',
      _uniqueValueCache: null,//{expr1:values1,expr2:values2}

      _tryUpdatingUniqueValues: function(selectedValue, showDropDownAfterValueUpdate){
        var def = new Deferred();
        if(!this.valuesSelect._opened){
          var newExpr = this.getFilterExpr();
          if(newExpr !== this._uniqueValueLoadingExpr){
            //expr changed
            this.valuesSelect.readOnly = true;
            if(this._uniqueValueLoadingDef){
              this._uniqueValueLoadingDef.reject();
              this._uniqueValueLoadingDef = null;
            }
            this._uniqueValueLoadingExpr = newExpr;
            this._uniqueValueLoadingDef = this._getUniqueValues(newExpr);
            this._uniqueValueLoadingDef.then(lang.hitch(this, function(values){
              if(!this.domNode){
                return;
              }
              this._uniqueValueLoadingDef = null;
              this.valuesSelect.readOnly = false;
              this._setValueForUniqueValues(selectedValue, values);
              this._hideLoadingIcon();
              if(showDropDownAfterValueUpdate){
                this.valuesSelect.toggleDropDown();
              }
              def.resolve();
            }), lang.hitch(this, function(err){
              if(!this.domNode){
                return;
              }
              this._uniqueValueLoadingDef = null;
              this.valuesSelect.readOnly = false;
              this._hideLoadingIcon();
              def.reject(err);
            }));
          }else{
            def.resolve();
          }
        }else{
          def.resolve();
        }
        return def;
      },

      //return a deferred
      _setValueForUniqueValues: function(selectedValue, values){
        if(!this.showNullValues){
          values = array.filter(values, lang.hitch(this, function(value){
            return value !== '<Null>' && value !== null;
          }));
        }
        if(selectedValue === undefined){
          var currentValueObj = this.getValueObject();
          if(currentValueObj){
            selectedValue = currentValueObj.value;
          }
        }
        var selectedId = -1;
        var selectedItem = null;
        var data = array.map(values, lang.hitch(this, function(value, index) {
          var label = value;

          if (this.shortType === 'number') {
            if(value !== '<Null>'){
              value = parseFloat(value);
              label = this.tryLocaleNumber(value);
            }
          }

          var dataItem = {
            id: index,
            value: value,
            label: label
          };

          if (value === selectedValue) {
            selectedId = index;
          }

          return dataItem;
        }));

        this.valuesSelect.store.setData(data);

        if (selectedId >= 0) {
          selectedItem = this.valuesSelect.store.get(selectedId);
        }

        //selectedItem maybe null
        //we need to set item to null to clear the previous invlaid value
        this.valuesSelect.set('item', selectedItem);
      },

      _showLoadingIcon: function(){
        html.addClass(this.valuesSelect.domNode, 'loading');
      },

      _hideLoadingIcon: function(){
        html.removeClass(this.valuesSelect.domNode, 'loading');
      },

      _getUniqueValues: function(where){
        var def = new Deferred();
        if(this._uniqueValueCache[where]){
          def.resolve(this._uniqueValueCache[where]);
        }else{
          this._showLoadingIcon();
          jimuUtils.getUniqueValues(this.url, this.fieldName, where).then(lang.hitch(this, function(values){
            if(!this.domNode){
              return;
            }
            this._uniqueValueCache[where] = values;
            def.resolve(values);
            this._hideLoadingIcon();
          }), lang.hitch(this, function(err){
            if(!this.domNode){
              return;
            }
            def.reject(err);
            this._hideLoadingIcon();
          }));
        }
        return def;
      }

    });
  });