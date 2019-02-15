define([
    'dojo/_base/declare',
    'dojo/_base/lang',
    'jimu/utils',
    '../../utils'
  ],
  function(declare, lang, jimuUtils, utils) {
    return declare(null, {
      oidFieldType: 'esriFieldTypeOID',
      stringFieldType: 'esriFieldTypeString',
      numberFieldTypes: ['esriFieldTypeSmallInteger',
        'esriFieldTypeInteger',
        'esriFieldTypeSingle',
        'esriFieldTypeDouble'
      ],
      _customColorDefaultNum: 5,
      dateFieldType: 'esriFieldTypeDate',

      //Public methods
      // setDataSource
      // setLayerDefinition
      // setPreModle
      // setCustomColor
      // setFeatures
      // getInitializationModle
      // getInitConfig
      // getRandomCustomColor
      // updateModleComputed
      // dynamicUpdateConfig
      // hasNumberFields
      // getClusterFieldOptions
      // getValueFieldOptions
      // isDSEqual

      constructor: function(options) {
        if (options) {
          lang.mixin(this, options);
        }

        this.others = [{
          text: this.nls.nullText,
          label: this.nls.nullText,
          id: 'null',
          color: '#808080'
        }, {
          text: this.nls.others,
          label: this.nls.others,
          id: 'others',
          color: '#808080'
        }];

        //series style custom color
        if (this.colors) {
          this.customColors = lang.clone(this.colors);
        }
      },

      setDataSource: function(dataSource) {
        if (dataSource) {
          this.dataSource = dataSource;
        }
      },

      setLayerDefinition: function(definition) {
        if (definition) {
          this.definition = definition;
        }
      },

      setLayerObject: function(layerObject) {
        if (layerObject) {
          this.layerObject = layerObject;
        }
      },

      setPreModle: function(preModle) {
        this.PRE_MODLE = preModle;
      },

      setCustomColor: function(colors) {
        this.customColors = lang.clone(colors);
      },

      setFeatures: function(features) {
        this.features = features;
      },

      getInitializationModle: function(config) {
        var computed = {
          sortComputed: null,
          definition: null,
          showDateOption: '',
          showUseLayerSymbology: false,
          //calcute by config
          valueFieldsAsMultipleMode: true,
          seriesStyleComputed: null,
          legendDisplay: true
        };
        var modle = {
          config: config,
          computed: computed
        };
        return lang.clone(modle);
      },

      getInitConfig: function(mode, keyProperties, field) {
        var type = keyProperties && keyProperties.type;
        var dataConfig = this._getInitDataConfig(mode, type, field);
        var displayConfig = this._getInitDisplayConfig(keyProperties);
        return lang.mixin(dataConfig, displayConfig);
      },

      getRandomCustomColor: function() {
        var color;
        var colorIndex = 0;
        if (this._lastCustomColor) {
          var lastIndex = this.customColors.indexOf(this._lastCustomColor);
          if (lastIndex > -1) {
            colorIndex = lastIndex + 1;
            if (colorIndex > this.customColors.length - 1) {
              colorIndex = 0;
            }
          }
        }
        color = this.customColors[colorIndex];
        this._lastCustomColor = color;
        return color;
      },

      updateModleComputed: function(modle) {
        var computed = modle.computed;
        var config = modle.config;
        computed.sortComputed = this._calcuteSortComputed(modle);
        computed.showUseLayerSymbology = this._shouldShowUseLayerSymbolDisplay(modle);
        computed.showDateOption = this._shouldShowDateOption(modle);

        computed.seriesStyleComputed = this._calcuteSeriesStyleComputed(modle);
        computed.valueFieldsAsMultipleMode = this._calcuteValueFieldsMode(config);
        computed.legendDisplay = this._calcuteLegendDisplay(config);
      },

      dynamicUpdateConfig: function(modle, isFirst) {
        var config = modle.config;
        var computed = modle.computed;
        this._dynamicUpdateDateConfig(config, computed);
        this._dynamicUpdateSeriesStyle(config, computed, isFirst);
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

      getClusterFieldOptions: function(fieldInfos, groupByField) {
        var clusterFieldTypes = [this.stringFieldType, this.dateFieldType, this.oidFieldType];
        clusterFieldTypes = clusterFieldTypes.concat(lang.clone(this.numberFieldTypes));
        var availableclusterFieldInfos = fieldInfos.filter(lang.hitch(this, function(fieldInfo) {
          return clusterFieldTypes.indexOf(fieldInfo.type) >= 0;
        }));

        var clusterFieldOptions = availableclusterFieldInfos.map(lang.hitch(this, function(fieldInfo) {
          return {
            label: fieldInfo.alias || fieldInfo.name,
            value: fieldInfo.name
          };
        }));
        if (groupByField) {
          clusterFieldOptions = clusterFieldOptions.filter(function(item) {
            return item.value === groupByField;
          });
        }
        return clusterFieldOptions;
      },

      getValueFieldOptions: function(fieldInfos, groupByField, clusterFieldOptions) {
        var valueFields = fieldInfos.filter(lang.hitch(this, function(fieldInfo) {
          return this.numberFieldTypes.indexOf(fieldInfo.type) >= 0;
        }));
        if (groupByField && clusterFieldOptions) {
          var clusterFieldNames = clusterFieldOptions.map(function(item) {
            return item.value;
          });
          valueFields = valueFields.filter(function(item) {
            return clusterFieldNames.indexOf(item.name) < 0;
          });
        }
        return valueFields;
      },

      isDSEqual: function(DS1, DS2) {
        if (!DS1 || !DS2) {
          return;
        }
        var formatedDS1 = this._cloneAndFormatDS(DS1);
        var formatedDS2 = this._cloneAndFormatDS(DS2);
        return utils.isEqual(formatedDS1, formatedDS2);
      },

      // ------------------------- Tool method -----------------------
      _calcuteSortComputed: function(modle) {
        var computed = {};
        var preConfig = this.PRE_MODLE.config;
        var config = modle.config;
        var sortOrder = config.sortOrder;
        var mode = config.mode;
        var preMode = preConfig.mode;
        computed.mode = mode;

        var fieldOption = this._getSortFields(modle);
        computed.fieldOption = fieldOption;

        if (!utils.isEqual(mode, preMode) && preMode) {
          if (mode === 'feature') {
            computed.sortArrowPosition = 'down';
          } else {
            computed.sortArrowPosition = 'top';
          }
        } else {
          if (mode === 'feature') {
            computed.sortArrowPosition = 'down';
          } else {
            computed.sortArrowPosition = sortOrder.isLabelAxis ? 'top' : 'mid';
          }
        }

        return computed;
      },

      _shouldShowUseLayerSymbolDisplay: function(modle) {
        var definition = this.definition;
        var show = false;
        var type = modle.config.type;
        var mode = modle.config.mode;
        if (type === 'line' || mode === 'field') {
          return show;
        }
        var layerId;
        var featureLayer = null;
        var dataSource = null;
        //get layerId
        if (this.dataSource) {
          dataSource = this.dataSource;
          if (dataSource.layerId) {
            layerId = dataSource.layerId;
          } else if (dataSource.frameWorkDsId) {
            var frameWorkDsId = dataSource.frameWorkDsId;
            var dsTypeInfo = utils.parseDataSourceId(frameWorkDsId);
            if (dsTypeInfo && dsTypeInfo.layerId !== 'undefined') {
              layerId = dsTypeInfo.layerId;
            }
          }
        }
        //feature layer
        if (layerId) {
          featureLayer = this._getFeatureLayer(layerId);
        }

        if (!layerId) {
          return show;
        }

        if (mode === 'feature') {
          show = true;
        } else if (mode === 'category' || mode === 'count') {
          var categoryField = modle.config.categoryField;
          if (!featureLayer) {
            return show;
          }
          if (featureLayer.renderer) {
            var renderer = featureLayer.renderer;
            if (renderer.declaredClass === 'esri.renderer.ClassBreaksRenderer' ||
              renderer.declaredClass === 'esri.renderer.UniqueValueRenderer') {
              if (renderer.attributeField === categoryField && !utils.isDateField(categoryField, definition)) {
                show = true;
              }
            }
          }
        }
        return show;
      },

      _shouldShowDateOption: function(modle) {
        var definition = this.definition;
        var categoryField = modle.config.categoryField;
        var isDateField = utils.isDateField(categoryField, definition);
        var chartMode = modle.config.mode;
        return (chartMode === 'category' || chartMode === 'count') && isDateField;
      },

      _calcuteValueFieldsMode: function(config) {
        var mode = config.mode;
        var valueFieldsAsMultipleMode = true;
        if (mode === 'feature' || mode === 'category') {
          if (config && config.type === 'pie') {
            valueFieldsAsMultipleMode = false;
          }
        }
        if (!valueFieldsAsMultipleMode) {
          if (config.valueFields && config.valueFields.length > 1) {
            config.valueFields = config.valueFields.slice(0, 1);
          }
        }
        return valueFieldsAsMultipleMode;
      },

      _calcuteLegendDisplay: function(config) {
        var mode = config.mode;
        var type = config.type;
        var legendDisplay;
        if (type === 'pie') {
          legendDisplay = true;
        } else {
          legendDisplay = true;
          if (mode === 'count' || mode === 'field') {
            legendDisplay = false;
          } else {
            if (config.seriesStyle) {
              legendDisplay = config.seriesStyle.type !== 'layerSymbol';
            }
          }
        }
        return legendDisplay;
      },

      //series style related
      _calcuteSeriesStyleComputed: function(modle) {
        var config = modle.config;
        var mode = config.mode;
        var type = config.type;
        var area = config.area;
        var valueFields = config.valueFields || [];
        var categoryField = config.categoryField;
        var modleComputed = modle.computed;
        var definition = this.definition;
        var showUseLayerSymbology = modleComputed.showUseLayerSymbology;

        var computed = {};

        var colorDisplayMode = 'single'; //single multiply none
        var showOpacity = false;
        var colorSingleMode = true;
        var otherRadio = 'none';
        //showRadioPanel
        var radios = [];
        if (!!showUseLayerSymbology) {
          radios.push('layerSymbol');
        }
        if (type === 'pie' && (mode === 'category' || mode === 'count') &&
          !utils.isDateField(categoryField, definition)) {
          radios.push('custom');
        }
        if (radios.length === 2) {
          otherRadio = 'all';
        }
        if (radios.length === 1) {
          otherRadio = radios[0];
        }
        //colorDisplayMode
        if (valueFields.length > 1) {
          colorDisplayMode = 'multiply';
        } else {
          colorDisplayMode = 'single';
        }
        if (type === 'line' && mode === 'field') {
          colorDisplayMode = 'single';
        }
        //showOpacity
        showOpacity = !!area;

        //colorSingleMode
        if (type === 'pie') {
          colorSingleMode = mode === 'field';
        }
        //mode and category field
        var inputCategoryField = '';
        if (mode === 'category' || mode === 'count') {
          inputCategoryField = config.categoryField;
        }

        computed.colorSingleMode = colorSingleMode;
        computed.colorDisplayMode = colorDisplayMode;
        computed.showOpacity = showOpacity;
        computed.otherRadio = otherRadio;
        computed.categoryField = inputCategoryField;
        if (otherRadio === 'custom' || otherRadio === 'all') {
          var isNumberType = utils.isNumberType(categoryField, definition, true);
          var codedValues = jimuUtils.getCodedValueListForCodedValueOrSubTypes(this.layerObject ||
            definition, categoryField);
          computed.categoryTypes = {
            isNumberType: isNumberType,
            isCodedValueType: !!codedValues
          };
          computed.customColorSelects = this._getCustomColorSelects(inputCategoryField, definition);
        }
        computed.chartType = type;
        return computed;
      },

      _createSeriesStyle: function(valueField, showOpacity, colorAsArray) {
        var style = {
          name: valueField,
          style: {
            color: this._getRandomColor()
          }
        };
        if (showOpacity) {
          style.style.opacity = 6;
        }
        if (colorAsArray) {
          style.style.color = ['#68D2E0', '#087E92', '#47BCF5', '#FBE66A', '#F29157', '#C8501D'];
        }
        return style;
      },

      _dynamicUpdateDateConfig: function(config, computed) {
        var showDateOption = computed.showDateOption;
        if (showDateOption) {
          if (!config.dateConfig) {
            config.dateConfig = {
              isNeedFilled: true,
              minPeriod: 'automatic'
            };
          }
        } else {
          config.dateConfig = null;
        }
      },

      //config.seriesStyle need dynamic updated by config.valueFields
      //update modle.config.seriesStyle by computed.showUseLayerSymbology
      //and new config.valueFields and config.mode
      _dynamicUpdateSeriesStyle: function(config, computed, isFirst) {

        var mode = config.mode;
        var type = config.type;
        var area = config.area;
        var categoryField = config.categoryField;
        var valueFields = config.valueFields || [];

        var definition = this.definition;
        var seriesStyle = lang.clone(config.seriesStyle);
        if (!seriesStyle) {
          seriesStyle = {};
        }
        var hasOpacity = false;
        if (type === 'line' && area) {
          hasOpacity = true;
        }

        var showUseLayerSymbology = computed.showUseLayerSymbology;

        //dynamic update seriesStyle.type
        if (typeof seriesStyle.type === 'undefined') {
          seriesStyle.type = 'series';
        }

        if (!showUseLayerSymbology) {
          if (seriesStyle.type === 'layerSymbol') {
            seriesStyle.type = 'series';
          }
        }

        if (mode === 'field') {
          seriesStyle.type = 'series';
        }

        if (mode === 'feature' && seriesStyle.type === 'custom') {
          seriesStyle.type = 'series';
        }

        if (categoryField && utils.isDateField(categoryField, definition) &&
          seriesStyle.type === 'custom') {
          seriesStyle.type = 'series';
        }

        var styles = seriesStyle.styles || [];
        var existingFields = [],
          obsoleteFields = [],
          notAddedFields = [];

        existingFields = styles.map(function(item) {
          return item.name;
        });

        obsoleteFields = existingFields.filter(function(item) {
          return valueFields.indexOf(item) < 0;
        });

        notAddedFields = valueFields.filter(function(vf) {
          return existingFields.indexOf(vf) < 0;
        });
        var colorAsArray = false;
        if (type === 'column' || type === 'bar' || type === 'line') {
          if (type === 'line' && mode === 'field') {
            if (existingFields[0] === 'line~field') {
              obsoleteFields = [];
              notAddedFields = [];
            } else {
              obsoleteFields = existingFields;
              notAddedFields = ['line~field'];
            }
          } else {
            if (mode === 'count') {
              if (existingFields[0] === 'count~count') {
                obsoleteFields = [];
                notAddedFields = [];
              } else {
                obsoleteFields = existingFields;
                notAddedFields = ['count~count'];
              }
            }
          }
        } else if (type === 'pie') {
          if (mode !== 'field') {
            if (existingFields[0] === 'pie~not-field') {
              obsoleteFields = [];
              notAddedFields = [];
            } else {
              colorAsArray = true;
              obsoleteFields = existingFields;
              notAddedFields = ['pie~not-field'];
            }
          }
        }
        styles = styles.filter(function(item) {
          return obsoleteFields.indexOf(item.name) < 0;
        });
        var newStyles = notAddedFields.map(function(item) {
          return this._createSeriesStyle(item, hasOpacity, colorAsArray);
        }.bind(this));
        styles = styles.concat(newStyles);
        seriesStyle.styles = null;
        seriesStyle.styles = styles;
        styles.forEach(function(style) {
          if (valueFields.indexOf(style.name) > -1) {
            style.label = utils.getFieldAlias(style.name, definition, this.popupInfo);
          } else {
            style.label = style.name;
          }
        }.bind(this));
        //dynamic updaye series style custom color
        this._dynamicUpdateSeriesStyleCustomColor(seriesStyle, config, isFirst);
      },

      _dynamicUpdateSeriesStyleCustomColor: function(seriesStyle, config, isFirst) {
        var dataSource = this.dataSource;
        var definition = this.definition;
        var categoryField = config.categoryField;
        var preConfig = this.PRE_MODLE.config;
        var updateCustomType; //remove, update, keep

        if (config.type !== 'pie' || !(config.mode === 'category' || config.mode === 'count')) {
          updateCustomType = 'remove'; //Delete seriesStyle.customColor
        } else if (seriesStyle.customColor) {
          if (isFirst) {
            updateCustomType = 'keep';
          } else {
            updateCustomType = categoryField === preConfig.categoryField ? 'keep' : 'update';
          }
        } else {
          updateCustomType = 'update';
        }
        var ccCategories = null;
        if (updateCustomType === 'remove') {
          if (typeof seriesStyle.customColor !== 'undefined') {
            delete seriesStyle.customColor;
          }
        } else if (updateCustomType === 'update') {
          if (dataSource && categoryField) {
            ccCategories = this._getCustomColorCategories(categoryField, definition);
            if (!seriesStyle.customColor) {
              seriesStyle.customColor = {};
            }
            if (ccCategories) {
              seriesStyle.customColor.categories = ccCategories; //set new custom color config tp series style
            }
            if (!seriesStyle.customColor.others || !seriesStyle.customColor.others.length) {
              seriesStyle.customColor.others = lang.clone(this.others);
            }
          }
        }
        if (config) {
          config.seriesStyle = seriesStyle;
        }
      },

      _getCustomColorSelects: function(categoryField, definition) {
        var categories = this._getCategoriesByFeatures(categoryField);
        if (!categories || !categories.length) {
          return;
        }
        categories = categories.filter(function(category) {
          return !!category || category === 0;
        });
        var selects = [];
        var codedValues = jimuUtils.getCodedValueListForCodedValueOrSubTypes(this.layerObject ||
          definition, categoryField);
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
        return selects;
      },

      _getCustomColorCategories: function(categoryField, definition) {
        var categories = this._getCategoriesByFeatures(categoryField);
        if (!categories || !categories.length) {
          return;
        }
        categories = categories.filter(function(category) {
          return !!category || category === 0;
        });
        if (categories.length > this._customColorDefaultNum) {
          categories = categories.slice(0, this._customColorDefaultNum);
        }

        var displayValue;
        var ccCategories = categories.map(function(category) {
          var attributes = {};
          attributes[categoryField] = category;
          var res = jimuUtils.getDisplayValueForCodedValueOrSubtype(this.layerObject ||
            definition, categoryField, attributes);
          if (res.isCodedValueOrSubtype) {
            displayValue = res.displayValue;
          } else {
            displayValue = category;
          }
          return {
            id: category,
            text: displayValue,
            label: displayValue,
            color: this.getRandomCustomColor()
          };
        }.bind(this));

        return ccCategories;
      },

      _getCategoriesByFeatures: function(categoryField) {
        var categories = [];
        if (!this.features || !this.features.length) {
          return categories;
        }
        this.features.forEach(lang.hitch(this, function(feature) {
          var attributes = feature.attributes;
          var category = attributes[categoryField];
          if (categories.indexOf(category) < 0) {
            categories.push(category);
          }
        }));
        return this._sortOrderCategories(categories);
      },

      _getSortFields: function(modle) {
        if (!modle) {
          return;
        }
        var definition = this.definition;
        var config = modle.config;
        var mode = config.mode;
        if (!definition || !config) {
          return;
        }
        if (mode !== 'feature' && (!config.valueFields || !config.valueFields[0])) {
          return;
        }
        var fields = [];
        if (mode === 'feature') {
          fields = lang.clone(definition.fields);
          fields = utils.getNotGeometryFields(fields);
        } else if (config.valueFields) {
          fields = utils.getFieldInfosByFieldName(config.valueFields, this.definition);
        }
        var fieldOption = fields.map(function(field) {
          return {
            value: field.name,
            label: field.alias || field.name
          };
        });
        return fieldOption;
      },

      _cloneAndFormatDS: function(DS) {
        var cloneDS = lang.clone(DS);
        var formatDS = {};
        if (cloneDS.name) {
          formatDS.name = cloneDS.name;
        }
        if (cloneDS.dataSourceType) {
          formatDS.dataSourceType = cloneDS.dataSourceType;
        }
        if (cloneDS.layerId) {
          formatDS.layerId = cloneDS.layerId;
        }
        if (cloneDS.frameWorkDsId) {
          formatDS.frameWorkDsId = cloneDS.frameWorkDsId;
        }
        cloneDS = null;
        return formatDS;
      },

      _sortOrderCategories: function(categories) {
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

      _getDominDisplayValue: function(fieldName, value, definition) {
        var displayValue = value;
        var fieldInfo = utils.getFieldInfo(fieldName, definition);
        if (fieldInfo) {
          if (fieldInfo.domain) {
            var codedValues = fieldInfo.domain.codedValues;
            if (codedValues && codedValues.length > 0) {
              codedValues.some(function(item) {
                if (item.code === value) {
                  displayValue = item.name;
                  return true;
                } else {
                  return false;
                }
              });
            }
          }
        }
        return displayValue;
      },

      _getRandomColor: function() {
        var color;
        var colorIndex = 0;
        if (this._lastColor) {
          var lastIndex = this.colors.indexOf(this._lastColor);
          if (lastIndex > -1) {
            colorIndex = lastIndex + 1;
            if (colorIndex > this.colors.length - 1) {
              colorIndex = 0;
            }
          }
        }
        color = this.colors[colorIndex];
        this._lastColor = color;
        return color;
      },

      _getFeatureLayer: function(layerId) {
        var featureLayer = null;
        if (this.map && typeof layerId !== 'undefined') {
          featureLayer = this.map.getLayer(layerId);
        }
        return featureLayer;
      },

      _getInitDisplayConfig: function(keyProperties) {
        var type, area, stack, innerRadius;
        if (keyProperties) {
          type = keyProperties.type;
          area = keyProperties.area;
          stack = keyProperties.stack;
          innerRadius = keyProperties.innerRadius;
        }

        var colors = this.getDefaultColorOfTheme();
        var textColor = colors.textColor;
        var bgColor = colors.bgColor;
        var defaultTextSize = 12;
        var config = {};

        var displayKeys = ["backgroundColor", "seriesStyle", "legend", "highLightColor"];

        switch (type) {
          case 'column':
          case 'bar':
          case 'line':
            displayKeys = displayKeys.concat([
              "xAxis",
              "yAxis",
              "stack",
              "area",
              "marks"
            ]);
            break;
          case 'pie':
            displayKeys = displayKeys.concat(["dataLabel", "innerRadius"]);
            break;
          default:
        }

        var testStyle = {
          color: textColor,
          fontSize: defaultTextSize
        };

        displayKeys.forEach(function(key) {
          switch (key) {
            case 'backgroundColor':
              config.backgroundColor = bgColor;
              break;
            case 'seriesStyle':
              config.seriesStyle = {
                styles: []
              };
              break;
            case 'legend':
              config.legend = {
                show: false,
                textStyle: lang.clone(testStyle)
              };
              break;
            case 'highLightColor':
              config.highLightColor = undefined;
              break;
            case 'xAxis':
              config.xAxis = {
                show: true,
                textStyle: lang.clone(testStyle),
                nameTextStyle: {
                  color: textColor
                }
              };
              break;
            case 'yAxis':
              config.yAxis = {
                show: true,
                textStyle: lang.clone(testStyle),
                nameTextStyle: {
                  color: textColor
                }
              };
              break;
            case 'dataLabel':
              config.dataLabel = {
                show: false,
                textStyle: lang.clone(testStyle)
              };
              break;
            case 'innerRadius':
              config.innerRadius = innerRadius;
              break;
            case 'stack':
              config.stack = stack;
              break;
            case 'area':
              config.area = area;
              break;
            case 'marks':
              config.marks = {};
              break;
            default:
          }
        }.bind(this));
        return config;
      },

      _getInitDataConfig: function(mode, type, field) {
        var config = {
          mode: mode,
          type: type
        };

        var dataKeys = ['sortOrder', 'maxLabels'];
        switch (mode) {
          case 'feature':
            dataKeys.push('labelField', 'valueFields');
            break;
          case 'count':
            dataKeys.push('categoryField');
            break;
          case 'category':
            dataKeys.push('categoryField', 'valueFields', 'operation', 'nullValue');
            break;
          case 'field':
            dataKeys = dataKeys.concat(['operation', 'nullValue', 'valueFields']);
            break;
          default:
        }

        if ((mode === 'category' || mode === 'count') &&
          utils.isDateField(field, this.definition)) {
          dataKeys.push('dateConfig');
        }

        dataKeys.forEach(function(key) {
          switch (key) {
            case 'labelField':
              config.labelField = field;
              break;
            case 'categoryField':
              config.categoryField = field;
              break;
            case 'valueFields':
              config.valueFields = [];
              break;
            case 'sortOrder':
              config.sortOrder = this._getInitSortOrderByMode(mode);
              break;
            case 'operation':
              config.operation = 'sum';
              break;
            case 'nullValue':
              config.nullValue = true;
              break;
            case 'dateConfig':
              config.dateConfig = this._getInitDateConfigByType(type);
              break;
            case 'maxLabels':
              config.maxLabels = type === 'pie' ? 100 : '';
              break;
            default:
          }
        }.bind(this));
        return config;
      },

      _getInitDateConfigByType: function(type) {
        var dateConfig = {
          isNeedFilled: true,
          minPeriod: 'automatic'
        };

        if (type === 'pie') {
          dateConfig.isNeedFilled = false;
        }
        return;
      },

      _getInitSortOrderByMode: function(mode) {
        var sortConfig = {};
        sortConfig.isAsc = true;
        if (mode === 'feature') {
          var fieldOption = this._getFieldsByDefinition();
          if (fieldOption && fieldOption[0]) {
            sortConfig.field = fieldOption[0].value;
          }
        } else {
          sortConfig.isLabelAxis = true;
        }
        return sortConfig;
      },

      _getFieldsByDefinition: function(definition) {
        definition = definition || this.definition;
        if (!definition) {
          return;
        }
        var fields = lang.clone(definition.fields);
        return fields;
      },

      getDefaultColorOfTheme: function() {
        var colors = {
          bgColor: '#fff',
          textColor: '#000'
        };
        if (!this.appConfig) {
          return colors;
        }
        if (this.appConfig.theme.name === 'DashboardTheme' &&
          (this.appConfig.theme.styles[0] === 'default' || this.appConfig.theme.styles[0] === 'style3')) {
          colors.bgColor = '#222222';
          colors.textColor = '#fff';
        } else if (this.appConfig.theme.name === 'DartTheme') {
          colors.bgColor = '#4c4c4c';
          colors.textColor = '#fff';
        }
        return colors;
      }

    });
  });