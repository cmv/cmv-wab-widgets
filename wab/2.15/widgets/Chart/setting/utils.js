///////////////////////////////////////////////////////////////////////////
// Copyright © Esri. All Rights Reserved.
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
    'dojo/Deferred',
    'dojo/_base/lang',
    'esri/request',
    'jimu/utils'
  ],
  function(Deferred, lang, esriRequest, jimuUtils) {
    return {

      _cacheDefinition: {},

      getLayerDefinitionByLayerIdOrUrl: function(layerId, url) {
        var deferred = new Deferred();
        var catchDefinition = this._cacheDefinition[layerId] || this._cacheDefinition[url];
        if (catchDefinition) {
          deferred.resolve(catchDefinition);
          return deferred;
        }
        if (!layerId) {
          esriRequest({
            url: url,
            hanleAs: 'json',
            content: {
              f: 'json'
            },
            callbackParamName: 'callback'
          }).then(function(response) {
            this._cacheDefinition[url] = response;
            deferred.resolve(response);
          }.bind(this), function(error) {
            deferred.reject(error);
          });
          return deferred;
        }

        var layerInfo = this.layerInfosObj.getLayerInfoById(layerId);
        if (layerInfo) {
          var popupInfo = layerInfo.getPopupInfo();
          this._getServiceDefinitionByLayerInfo(layerInfo).then(function(definition) {
            this._addAliasForLayerDefinition(definition, popupInfo);
            this._cacheDefinition[layerId] = definition;
            deferred.resolve(definition);
          }.bind(this));
        } else {
          deferred.reject('Invaild layerInfo for layer id: ' + layerId);
        }
        return deferred;
      },

      _getServiceDefinitionByLayerInfo: function(layerInfo) {
        return layerInfo.getServiceDefinition().then(lang.hitch(this, function(definition) {
          if (definition) {
            return definition;
          } else {
            return layerInfo.getLayerObject().then(lang.hitch(this, function(layerObject) {
              if (layerObject) {
                return jimuUtils.getFeatureLayerDefinition(layerObject);
              } else {
                return null;
              }
            }));
          }
        }));
      },

      _addAliasForLayerDefinition: function(definition, popupInfo) {
        if (definition && definition.fields && definition.fields.length > 0) {
          definition.fields.forEach(lang.hitch(this, function(fieldInfo) {
            var alias = this.getFieldAliasByFieldInfo(fieldInfo, popupInfo);
            if (alias) {
              fieldInfo.alias = alias;
            }
          }));
        }
      },

      getFieldAliasByFieldInfo: function(fieldInfo, popupInfo) {
        var alias = '';
        if (!fieldInfo) {
          return alias;
        }
        var name = fieldInfo.name;
        alias = fieldInfo.alias || name;
        if (popupInfo) {
          alias = this.getAliasFromPopupInfo(name, popupInfo);
        }
        return alias;
      },

      getAliasFromPopupInfo: function(fieldName, popupInfo) {
        var alias = fieldName;
        if (!popupInfo) {
          return alias;
        }
        var fieldInfos = popupInfo.fieldInfos;
        if (fieldInfos && fieldInfos.length > 0) {
          fieldInfos.forEach(function(item) {
            if (item.fieldName === fieldName) {
              alias = item.label;
            }
          });
        }
        return alias;
      },

      getAliasByFieldName:function(fieldName, definition){
        if(!fieldName){
          return;
        }
        if(!definition || !definition.fields || !definition.fields.length){
          return;
        }
        var field = definition.fields.filter(function(item){
          return item.name === fieldName;
        })[0];
        return field && field.alias;
      },

      updateOptions: function(select, options, value, showTitle) {
        if (options) {
          options = lang.clone(options);
          select.removeOption(select.getOptions());
          select.addOption(options);
        } else {
          options = [];
        }
        if (!value && options.length > 0) {
          value = options[0].value;
        }
        if (value) {
          select.set('value', value);
          if (showTitle) {
            var option = select.getOptions(value);
            if (option && typeof option.label !== 'undefined') {
              select.set('title', option.label);
            }
          }
        }
      }
    };
  });