///////////////////////////////////////////////////////////////////////////
// Copyright © 2014 - 2018 Esri. All Rights Reserved.
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
    'dojo/_base/declare',
    'dojo/Evented',
    'dojo/on',
    'dijit/_WidgetBase',
    'dijit/_TemplatedMixin',
    'dijit/_WidgetsInTemplateMixin',
    './FieldStatistics',
    './StatisticDataSourceSelector',
    'dijit/form/RadioButton',
    "dijit/form/Select",
    'dijit/form/NumberTextBox'
  ],
  function(declare, Evented, on, _WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin,
    FieldStatistics, StatisticDataSourceSelector) {
    return declare([_WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin, Evented], {
      baseClass: 'infograpgic-stat-range',
      templateString: '<div></div>',

      // config
      //   sourceID: string
      //   statistic: field statistic config

      postCreate: function() {
        this.inherited(arguments);
        this._initUI();
      },

      reset: function() {
        if (this.fieldStat) {
          this.fieldStat.reset();
        }
        if (this.statDataSource) {
          this.statDataSource.reset();
        }
      },

      setConfig: function(config) {
        var statistic = config.statistic;
        var sourceID = config && config.sourceID;
        if (sourceID) {
          this.statDataSource.setCurrentSourceID(sourceID);
        } else {
          this.statDataSource.initCurrentSourceID(sourceID);
        }
        if (this.fieldStat && statistic) {
          this.fieldStat.setConfig(statistic);
        }
      },

      getConfig: function() {
        if (!this.isValid()) {
          return false;
        }

        var config = {};
        config.sourceID = this.statDataSource.getCurrentSourceID();
        config.sourceLabel = this.statDataSource.getCurrentSourceLabel();
        config.statistic = this.fieldStat.getConfig();
        return config;
      },

      isValid: function() {
        return this.statDataSource.isValid() && this.fieldStat.isValid();
      },

      _initUI: function() {
        this.statDataSource = new StatisticDataSourceSelector({
          nls: this.nls,
          appConfig: this.appConfig
        });
        this.statDataSource.placeAt(this.domNode);

        this.own(on(this.statDataSource, 'change', function(source) {
          this._onDataSourceChanged(source);
        }.bind(this)));
        this.fieldStat = new FieldStatistics({
          nls: this.nls
        });
        this.fieldStat.placeAt(this.domNode);
        this.own(on(this.fieldStat, 'change', function() {
          this._onChange();
        }.bind(this)));
      },

      setLayerDefinition: function(definition) {
        if (!definition) {
          return;
        }
        if (this.fieldStat) {
          this.fieldStat.setLayerDefinition(definition);
        }
      },

      _onDataSourceChanged: function(source) {
        var definition = source.definition;
        var sourceID = source.sourceID;
        if (this.fieldStat) {
          this.fieldStat.reset();
          this.fieldStat.setLayerDefinition(definition);
        }
        this.emit('ds-change', sourceID);
      },

      _onChange: function() {
        if (this.isValid()) {
          this.emit('change');
        }
      }

    });
  });