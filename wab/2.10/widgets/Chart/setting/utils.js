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
        var popupInfo = layerInfo.getPopupInfo();
        if (layerInfo) {
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
      }
    };
  });