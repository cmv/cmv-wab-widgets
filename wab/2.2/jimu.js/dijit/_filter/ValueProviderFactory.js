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
  'dojo/_base/lang',
  'dojo/_base/declare',
  './SimpleValueProvider',
  './TwoNumbersValueProvider',
  './TwoDatesValueProvider',
  './ListValueProvider',
  'jimu/LayerInfos/LayerInfos'
],
  function(lang, declare, SimpleValueProvider, TwoNumbersValueProvider, TwoDatesValueProvider, ListValueProvider,
    LayerInfos) {

    var SIMPLE_VALUE_PROVIDER = "SIMPLE_VALUE_PROVIDER";
    var TWO_NUMBERS_VALUE_PROVIDER = "TWO_NUMBERS_VALUE_PROVIDER";
    var TWO_DATES_VALUE_PROVIDER = "TWO_DATES_VALUE_PROVIDER";
    var LIST_VALUE_PROVIDER = "LIST_VALUE_PROVIDER";

    //operator + type => value provider
    var relationship = {
      //string
      stringOperatorIs: {
        value: {
          normal: SIMPLE_VALUE_PROVIDER,
          codedValue: LIST_VALUE_PROVIDER
        },
        unique: {
          normal: LIST_VALUE_PROVIDER
        }
      },
      stringOperatorIsNot: {
        value: {
          normal: SIMPLE_VALUE_PROVIDER
        },
        unique: {
          normal: LIST_VALUE_PROVIDER
        }
      },
      stringOperatorStartsWith: {
        value: {
          normal: SIMPLE_VALUE_PROVIDER
        }
      },
      stringOperatorEndsWith: {
        value: {
          normal: SIMPLE_VALUE_PROVIDER
        }
      },
      stringOperatorContains: {
        value: {
          normal: SIMPLE_VALUE_PROVIDER
        }
      },
      stringOperatorDoesNotContain: {
        value: {
          normal: SIMPLE_VALUE_PROVIDER
        }
      },
      stringOperatorIsBlank: null,
      stringOperatorIsNotBlank: null,

      //number
      numberOperatorIs: {
        value: {
          normal: SIMPLE_VALUE_PROVIDER,
          codedValue: LIST_VALUE_PROVIDER
        },
        unique: {
          normal: LIST_VALUE_PROVIDER
        }
      },
      numberOperatorIsNot: {
        value: {
          normal: SIMPLE_VALUE_PROVIDER
        },
        unique: {
          normal: LIST_VALUE_PROVIDER
        }
      },
      numberOperatorIsAtLeast: {
        value: {
          normal: SIMPLE_VALUE_PROVIDER
        },
        unique: {
          normal: LIST_VALUE_PROVIDER
        }
      },
      numberOperatorIsLessThan: {
        value: {
          normal: SIMPLE_VALUE_PROVIDER
        },
        unique: {
          normal: LIST_VALUE_PROVIDER
        }
      },
      numberOperatorIsAtMost: {
        value: {
          normal: SIMPLE_VALUE_PROVIDER
        },
        unique: {
          normal: LIST_VALUE_PROVIDER
        }
      },
      numberOperatorIsGreaterThan: {
        value: {
          normal: SIMPLE_VALUE_PROVIDER
        },
        unique: {
          normal: LIST_VALUE_PROVIDER
        }
      },
      numberOperatorIsBetween: {
        value: {
          normal: TWO_NUMBERS_VALUE_PROVIDER
        }
      },
      numberOperatorIsNotBetween: {
        value: {
          normal: TWO_NUMBERS_VALUE_PROVIDER
        }
      },
      numberOperatorIsBlank: null,
      numberOperatorIsNotBlank: null,

      //date
      dateOperatorIsOn: {
        value: {
          normal: SIMPLE_VALUE_PROVIDER
        }
      },
      dateOperatorIsNotOn: {
        value: {
          normal: SIMPLE_VALUE_PROVIDER
        }
      },
      dateOperatorIsBefore: {
        value: {
          normal: SIMPLE_VALUE_PROVIDER
        }
      },
      dateOperatorIsAfter: {
        value: {
          normal: SIMPLE_VALUE_PROVIDER
        }
      },
      dateOperatorIsBetween: {
        value: {
          normal: TWO_DATES_VALUE_PROVIDER
        }
      },
      dateOperatorIsNotBetween: {
        value: {
          normal: TWO_DATES_VALUE_PROVIDER
        }
      },
      dateOperatorIsBlank: null,
      dateOperatorIsNotBlank: null
    };

    return declare([], {
      nls: null,
      url: null,
      layerDefinition: null,
      layerInfo: null,//jimu/LayerInfos/LayerInfo
      featureLayerId: null,//optional

      constructor: function(options){
        //{nls,url,layerDefinition}
        lang.mixin(this, options);
        var layerInfosObj = LayerInfos.getInstanceSync();
        if(this.featureLayerId){
          this.layerInfo = layerInfosObj.getLayerOrTableInfoById(this.featureLayerId);
        }
      },

      getValueProvider: function(partObj){
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
        var valueProvider = null;
        var operator = partObj.operator;
        var operatorInfo = relationship[operator];
        if(operatorInfo){
          var valueType = partObj.valueObj.type;
          var fieldName = partObj.fieldObj.name;
          var fieldInfo = this._getFieldInfo(this.layerDefinition, fieldName);
          var codedValues = this._getCodedValues(fieldInfo);
          var a = operatorInfo[valueType];
          var valueProviderType = a.normal;
          if(codedValues && a.codedValue){
            valueProviderType = a.codedValue;
          }
          var args = {
            nls: this.nls,
            url: this.url,
            layerDefinition: this.layerDefinition,
            partObj: partObj,
            fieldInfo: fieldInfo,
            codedValues: codedValues,
            layerInfo: this.layerInfo
          };
          if(valueProviderType === SIMPLE_VALUE_PROVIDER){
            valueProvider = new SimpleValueProvider(args);
          }else if(valueProviderType === TWO_NUMBERS_VALUE_PROVIDER){
            valueProvider = new TwoNumbersValueProvider(args);
          }else if(valueProviderType === TWO_DATES_VALUE_PROVIDER){
            valueProvider = new TwoDatesValueProvider(args);
          }else if(valueProviderType === LIST_VALUE_PROVIDER){
            if(operator === "stringOperatorIs" ||
               operator === "stringOperatorIsNot" ||
               operator === "numberOperatorIs" ||
               operator === "numberOperatorIsNot"){
              args.showNullValues = true;
            }else{
              args.showNullValues = false;
            }
            valueProvider = new ListValueProvider(args);
          }
        }else{
          console.error("Invalid operator: " + operator);
        }
        return valueProvider;
      },

      _getFieldInfo: function(layerDefinition, fieldName){
        var fieldInfos = layerDefinition.fields;
        for(var i = 0;i < fieldInfos.length; i++){
          var fieldInfo = fieldInfos[i];
          if(fieldName === fieldInfo.name){
            return fieldInfo;
          }
        }
        return null;
      },

      _getCodedValues:function(fieldInfo){
        var codedValues = null;
        var domain = fieldInfo.domain;
        if(domain && domain.type === 'codedValue'){
          if(domain.codedValues && domain.codedValues.length > 0){
            codedValues = domain.codedValues;
          }
        }
        return codedValues;
      }

    });
  });