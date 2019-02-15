define([
    'dojo/_base/lang',
    '../utils'
  ],
  function(lang, utils) {
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

      isNumberType: function(fieldName, definition, containOID) {
        var numberFieldTypes = lang.clone(mo.numberFieldTypes);
        if (containOID) {
          numberFieldTypes.push(mo.oidFieldType);
        }
        var fieldInfo = mo.getFieldInfo(fieldName, definition);
        if (fieldInfo) {
          return numberFieldTypes.indexOf(fieldInfo.type) > -1;
        }
        return false;
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
      }

    };
    lang.mixin(utils, mo);
    return utils;
  });