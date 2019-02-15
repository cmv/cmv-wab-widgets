define([
    'dojo/_base/declare',
    'dojo/_base/lang',
    'dojo/Evented',
    'dijit/_WidgetBase',
    'dijit/_TemplatedMixin',
    'dijit/_WidgetsInTemplateMixin',
    'dojo/text!./StatisticDataSourceSelector.html',
    'jimu/LayerInfos/LayerInfos',
    'jimu/utils',
    '../../../utils',
    "dijit/form/RadioButton",
    "dijit/form/Select"
  ],
  function(declare, lang, Evented, _WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin,
    template, LayerInfos, jimuUtils, utils) {
    return declare([_WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin, Evented], {
      baseClass: 'jimu-statistic-data-source-selector',
      templateString: template,

      postMixInProperties: function() {
        this.layerInfosObj = LayerInfos.getInstanceSync();
        this._statSourceIDs = null; //Statistic data source ids
        this._currentSourceID = -1;
      },

      postCreate: function() {
        this.inherited(arguments);
        var appConfig = this.appConfig;
        if (appConfig) {
          this._onAppConfigLoaded(appConfig);
        }
      },

      setDataSource: function(acds) {
        var statSourceIDs = this._getStatSourceIDs(acds);
        if (jimuUtils.isEqual(statSourceIDs, this._statSourceIDs)) {
          return;
        }
        this._reset();
        this._statSourceIDs = statSourceIDs;

        var _ops = this._genarateSelectOption(statSourceIDs);
        this._initSourceSelect(_ops);
      },

      isValid: function() {
        return this._statSourceIDs && this._statSourceIDs.length;
      },

      _reset: function() {
        this._currentSourceID = -1;
        this._statSourceIDs = null;
        this.sourceSelect.removeOption(this.sourceSelect.getOptions());
        this.sourceSelect.addOption([]);
        this.sourceSelect.reset();
      },

      reset: function() {
        this._reset();
        this._onAppConfigLoaded(this.appConfig);
        this.initCurrentSourceID();
      },

      _onSourceSelectChanged: function(sourceID) {
        if (sourceID === this._currentSourceID) {
          return;
        }
        this._currentSourceID = sourceID;
        this._isCurrentSourceIDValid();
        var result = this._tryGetLayerIdDataSchema(sourceID);
        var layerId = result.layerId;
        var dataSchema = result.dataSchema;
        var definition = this._getLayerDefinition(dataSchema, layerId);

        this.emit('change', {
          definition: definition,
          sourceID: sourceID
        });
      },

      _getLayerDefinition: function(dataSchema, layerId) {
        var popupInfo;
        if (layerId) {
          var layerInfo = this.layerInfosObj.getLayerInfoById(layerId);
          popupInfo = layerInfo.getPopupInfo();
        }
        var definition = {
          type: 'Table',
          fields: []
        };
        definition.fields = lang.clone(dataSchema.fields);
        if (dataSchema.groupByFields && dataSchema.groupByFields[0]) {
          definition.groupByFields = lang.clone(dataSchema.groupByFields);
        }
        utils.addAliasForLayerDefinition(definition, popupInfo);
        return definition;
      },

      _tryGetLayerIdDataSchema: function(sourceID) {
        var result = {
          layerId: '',
          dataSchema: null
        };

        var dsInfo = utils.getDsTypeInfoMeta(sourceID, this.appConfig);
        var dsMeta = dsInfo && dsInfo.dsMeta;
        if (!dsMeta) {
          return result;
        }
        result.dataSchema = dsMeta.dataSchema;
        var dsTypeInfo = utils.parseDataSourceId(dsMeta.id);
        result.layerId = dsTypeInfo && dsTypeInfo.layerId;
        return result;
      },

      getSelectedDataSource: function() {
        var sourceID = this.sourceSelect.get('value');
        if (sourceID) {
          var result = this._tryGetLayerIdDataSchema(sourceID);
          var layerId = result.layerId;
          var dataSchema = result.dataSchema;
          var definition = this._getLayerDefinition(dataSchema, layerId);
          if (definition) {
            return definition;
          }
        }
      },

      getCurrentSourceID: function() {
        return this._currentSourceID;
      },

      getCurrentSourceLabel: function() {
        var label = this._currentSourceID;
        if (this._currentSourceID) {
          var acds = this._getAppConfigDataSource();
          var source = acds[this._currentSourceID];
          if (source) {
            label = source.label;
          }
        }
        return label;
      },

      setCurrentSourceID: function(sourceID) {
        if (this._currentSourceID === sourceID) {
          return;
        }
        this._currentSourceID = sourceID;
        var valid = this._isCurrentSourceIDValid();
        if (!valid) {
          return false;
        }
        this.sourceSelect.set('value', this._currentSourceID);
        return true;
      },

      _isCurrentSourceIDValid: function() {
        var acds = this._getAppConfigDataSource();
        return !!acds[this._currentSourceID];
      },

      _getAppConfigDataSource: function() {
        var dataSources = this.appConfig && this.appConfig.dataSource &&
          this.appConfig.dataSource.dataSources;
        return dataSources || {};
      },

      //get statistic type data source from the data source of appConfig
      _getStatSourceIDs: function(acds) {
        var statSourceIDs = [];
        var sourceIDs = Object.keys(acds);
        if (!sourceIDs || !sourceIDs.length) {
          return statSourceIDs;
        }
        sourceIDs.forEach(function(sourceID) {
          var source = acds[sourceID];
          if (source && source.type === 'FeatureStatistics') {
            statSourceIDs.push(sourceID);
          }
        }.bind(this));
        return statSourceIDs;
      },

      //genarate select option by statistic data source
      _genarateSelectOption: function(sourceIDs) {
        var options = [];
        if (!sourceIDs || !sourceIDs.length) {
          return options;
        }
        var acds = this._getAppConfigDataSource();

        sourceIDs.forEach(function(sourceID) {
          var source = acds[sourceID];
          options.push({
            label: source.label,
            value: sourceID
          });
        }.bind(this));
        return options;
      },

      initCurrentSourceID: function() {
        var statSourceIDs = this._statSourceIDs;
        if (!statSourceIDs) {
          return;
        }
        this._currentSourceID = statSourceIDs[0];
      },

      _initSourceSelect: function(ops) {
        if (!ops || !ops.length) {
          return;
        }
        this.sourceSelect.removeOption(this.sourceSelect.getOptions());
        this.sourceSelect.addOption(ops);
      },

      _onAppConfigLoaded: function(_appConfig) {
        if (!_appConfig) {
          return;
        }
        this.appConfig = lang.clone(_appConfig);
        var acds = this._getAppConfigDataSource();
        this.setDataSource(acds);
      }

    });
  });