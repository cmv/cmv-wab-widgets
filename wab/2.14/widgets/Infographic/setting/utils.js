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
    'dojo/_base/lang',
    '../utils',
    'jimu/utils'
  ],
  function(lang, utils, jimuUtils) {
    var mo = {
      stringFieldType: 'esriFieldTypeString',
      oidFieldType: 'esriFieldTypeOID',
      dateFieldType: 'esriFieldTypeDate',
      numberFieldTypes: [
        'esriFieldTypeSmallInteger',
        'esriFieldTypeInteger',
        'esriFieldTypeSingle',
        'esriFieldTypeDouble'
      ],
      geometryFieldType: 'esriFieldTypeGeometry',

      getFieldInfo: function(fieldName, definition) {
        var fieldInfo = null;
        var fieldInfos = definition.fields;
        for (var i = 0; i < fieldInfos.length; i++) {
          if (fieldInfos[i].name === fieldName) {
            fieldInfo = fieldInfos[i];
          }
        }
        return fieldInfo;
      },

      isGeometryType: function(fieldName, definition) {
        var fieldInfo = mo.getFieldInfo(fieldName, definition);
        if (fieldInfo) {
          return fieldInfo.type === mo.geometryFieldType;
        }
        return false;
      },

      isStringType: function(fieldName, definition) {
        var fieldInfo = mo.getFieldInfo(fieldName, definition);
        if (fieldInfo) {
          return fieldInfo.type === mo.stringFieldType;
        }
        return false;
      },

      isNumberType: function (fieldName, definition, containOID) {
        if (!fieldName || !definition) {
          return false;
        }
        var numberFieldTypes = lang.clone(mo.numberFieldTypes);
        if (containOID) {
          numberFieldTypes.push(mo.oidFieldType);
        }
        var fieldInfo = mo.getFieldInfo(fieldName, definition);
        if (!fieldInfo || fieldInfo.domain) {
          return false;
        }
        return numberFieldTypes.indexOf(fieldInfo.type) > -1;
      },

      isDateField: function(fieldName, definition) {
        var fieldInfo = mo.getFieldInfo(fieldName, definition);
        if (fieldInfo) {
          return fieldInfo.type === mo.dateFieldType;
        }
        return false;
      },

      getNotGeometryFields: function(fields) {
        if (fields && fields.length) {
          return fields.filter(function(field) {
            return field.type !== mo.geometryFieldType;
          });
        }
      },

      getFieldAlias: function(fieldName, definition, popupInfo) {
        var fieldInfo = mo.getFieldInfo(fieldName, definition);
        var alias = this.getFieldAliasByFieldInfo(fieldInfo, popupInfo);
        return alias;
      },

      getFieldInfosByFieldName: function(fieldNames, definition) {
        return fieldNames.map(function(fieldName) {
          var field = mo.getFieldInfo(fieldName, definition);
          return lang.clone(field);
        }.bind(this));
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
      },

      getNumberFields: function(fields) {
        if (!fields) {
          return;
        }
        return fields.filter(function(f) {
          return this.numberFieldTypes.indexOf(f.type) > -1;
        }.bind(this));
      },

      getFieldSelectOptions: function(fields) {
        if (!fields) {
          return;
        }
        return fields.map(lang.hitch(this, function(fieldInfo) {
          return {
            label: fieldInfo.alias || fieldInfo.name,
            value: fieldInfo.name
          };
        }));
      },

      preProcessDefinition: function(definition) {

        if (!definition || definition.type !== 'Table') {
          return definition;
        }

        var fields = definition.fields;

        if (!fields || !fields.length) {
          return;
        }

        fields = fields.filter(function(f) {
          var isSTC = f.name === "STAT_COUNT" &&
            f.alias === "STAT_COUNT" &&
            f.type === 'esriFieldTypeInteger';
          return !isSTC;
        });
        definition.fields = null;
        definition.fields = fields;
        return definition;
      },

      getTemplateNameByMainDijitJson: function(mainDijitJson) {
        if (!mainDijitJson) {
          return;
        }
        var templateName;
        if (mainDijitJson.type === 'gauge') {
          templateName = this._getTempNameForGaugeType(mainDijitJson);
        } else if (mainDijitJson.type === 'chart') {
          templateName = this._getTempNameForChartType(mainDijitJson);
        } else if (mainDijitJson.type === 'number') {
          templateName = 'number';
        }
        return templateName;
      },

      _getTempNameForGaugeType: function(dijitJson) {
        var templateName;
        var gaugeConfig = dijitJson.config;
        var shape = gaugeConfig.shape;
        if (!shape) {
          return;
        }
        if (shape === 'curved') {
          templateName = 'gauge';
        } else if (shape === 'vertical') {
          templateName = 'vertical_gauge';
        } else if (shape === 'horizontal') {
          templateName = 'horizontal_gauge';
        }
        return templateName;
      },

      _getTempNameForChartType: function(dijitJson) {
        var chartConfig = dijitJson.config;
        var type = chartConfig.type;
        if (!type) {
          return;
        }
        var templateName;

        var stack = chartConfig.stack;
        var area = chartConfig.area;
        var innerRadius = chartConfig.innerRadius;

        if (type === 'pie') {
          templateName = innerRadius ? 'donut' : 'pie';
        } else if (type === 'bar' || type === 'column') {
          templateName = type;
          if (stack === 'normal') {
            templateName = 'stacked_' + templateName;
          } else if (stack === 'percent') {
            templateName = 'percentage_stacked_' + templateName;
          }
        } else if (type === 'line') {
          if (!area) {
            templateName = 'line';
          } else {
            templateName = 'area';
            if (stack === 'normal') {
              templateName = 'stacked_' + templateName;
            } else if (stack === 'percent') {
              templateName = 'percentage_stacked_' + templateName;
            }
          }
        }
        return templateName;
      },

      hasNumberFields: function(definition) {
        var result = false;
        var fieldInfos = definition.fields;
        if (fieldInfos && fieldInfos.length > 0) {
          result = fieldInfos.some(lang.hitch(this, function(fieldInfo) {
            return this.numberFieldTypes.indexOf(fieldInfo.type) >= 0;
          }));
        }
        return result;
      },

      getClusterFields: function(fields, gbFields) {
        if (gbFields && gbFields.length) {
          return fields.filter(function(item) {
            return gbFields.indexOf(item.name) > -1;
          });
        }

        var fieldTypes = [this.stringFieldType, this.dateFieldType, this.oidFieldType];
        fieldTypes = fieldTypes.concat(lang.clone(this.numberFieldTypes));

        return fields.filter(function(field) {
          return fieldTypes.indexOf(field.type) >= 0;
        });
      },

      getValueFields: function(fields, gbFields, clusterFields) {
        var valueFields = fields.filter(lang.hitch(this, function(fieldInfo) {
          return this.numberFieldTypes.indexOf(fieldInfo.type) >= 0;
        }));
        if (gbFields && gbFields.length && clusterFields && clusterFields.length) {
          valueFields = valueFields.filter(function(item) {
            return clusterFields.indexOf(item.name) < 0;
          });
        }
        return valueFields;
      },

      //theme {name:'', styles:[]}
      getDefaultColorOfTheme: function(theme) {
        if (!theme) {
          return;
        }
        var colors = {
          bgColor: '#fff',
          textColor: '#000'
        };
        if (!this.appConfig) {
          return colors;
        }
        if (theme.name === 'DashboardTheme' &&
          (theme.styles[0] === 'default' || theme.styles[0] === 'style3')) {
          colors.bgColor = '#222222';
          colors.textColor = '#fff';
        } else if (theme.name === 'DartTheme') {
          colors.bgColor = '#4c4c4c';
          colors.textColor = '#fff';
        }
        return colors;
      },

      getLayerFromMap: function(layerId, map) {
        var featureLayer = null;
        if (map && typeof layerId !== 'undefined') {
          featureLayer = map.getLayer(layerId);
        }
        return featureLayer;
      },

      getCustomColorSelects: function(clusterField, definition, feature) {
        var categories = this.getCategoriesByFeatures(clusterField, feature);
        if (!categories || !categories.length) {
          return;
        }
        categories = categories.filter(function(category) {
          return !!category || category === 0;
        });
        var numberType = this.isNumberType(clusterField, definition, true);
        var selects = [];
        var codedValues = jimuUtils.getCodedValueListForCodedValueOrSubTypes(definition, clusterField);
        if (codedValues) {
          selects = lang.clone(codedValues);
        } else {
          selects = categories.map(function(ac) {
            return {
              label: ac,
              value: ac
            };
          });
        }
        return {selects:selects, isCodedValue:!!codedValues, numberType:numberType};
      },

      getCategoriesByFeatures: function(clusterField, features) {
        var categories = [];
        if (!features || !features.length) {
          return categories;
        }
        features.forEach(lang.hitch(this, function(feature) {
          var attributes = feature.attributes;
          var category = attributes[clusterField];
          if (categories.indexOf(category) < 0) {
            categories.push(category);
          }
        }));
        return this.sortOrderCategories(categories);
      },

      sortOrderCategories: function(categories) {
        if (Array.isArray(categories)) {
          categories.sort(function(a, b) {

            if (typeof s === 'string') {
              a = a.toLowerCase();
            }
            if (typeof t === 'string') {
              b = b.toLowerCase();
            }

            if (jimuUtils.isNumberOrNumberString(a)) {
              a = Number(a);
            }
            if (jimuUtils.isNumberOrNumberString(b)) {
              b = Number(b);
            }

            if (a < b) {
              return -1;
            }
            if (a > b) {
              return 1;
            }
            return 0;
          }.bind(this));

        }
        return categories;
      },

      getNextColor: function(colors, color) {
        if (!colors || !colors.length) {
          return;
        }
        var index = 0;
        if (color) {
          var lastIndex = colors.indexOf(color);
          if (lastIndex > -1) {
            index = lastIndex + 1;
            if (index > colors.length - 1) {
              index = 0;
            }
          }
        }
        return colors[index];
      }

    };
    lang.mixin(utils, mo);
    return utils;
  });