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
    "dojo/_base/lang",
    'dojo/on',
    'dojo/_base/html',
    'dojo/query',
    //'dojo/keys',
    //'esri/lang',
    "dojo/_base/array",
    "dojo/Evented",
    //'./ColorPickerEditor',
    //'esri/tasks/locator',
    'dijit/_WidgetBase',
    'dijit/_TemplatedMixin',
    'dijit/_WidgetsInTemplateMixin',
    'dojo/text!./SearchConfig.html',
    "./QuerySourceSetting",
    "./LocatorSourceSetting",
    "jimu/LayerInfos/LayerInfos",
    "jimu/dijit/LoadingShelter",
    'dojo/Deferred',
    //'jimu/utils',
    "../../searchUtil",
    "dojo/when",
    //'esri/dijit/Search',
    //"jimu/dijit/CheckBox",
    "jimu/dijit/Message",
    "jimu/dijit/SimpleTable",
    'jimu/dijit/RadioBtn'
  ],
  function(declare, lang, on, html, query, /*keys,esriLang,*/ array, Evented,
           /*Locator,*/_WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin, template,
           QuerySourceSetting, LocatorSourceSetting, LayerInfos, LoadingShelter, Deferred,
           /*jimuUtils, */utils, when,/*Search, CheckBox,*/ Message, SimpleTable) {
    return declare([_WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin, Evented], {
      templateString: template,
      //constructor: function(options) {
      // if (!options) {
      //   return;
      // }
      // this._defaultLocations = options.defaultLocations;
      // this.nls = options.nls;
      //},
      postMixInProperties: function(){
        this.inherited(arguments);
        lang.mixin(this.nls, window.jimuNls.common);
      },
      postCreate: function() {
        this.inherited(arguments);

        this.sourceList = new SimpleTable({
          autoHeight: false,
          selectable: true,
          fields: [{
            name: "name",
            title: this.nls.name,
            width: "auto",
            type: "text",
            editable: false
          }, {
            name: "type",
            hidden: true,
            type: "text",
            editable: false
          }, {
            name: "actions",
            title: "",
            width: "70px",
            type: "actions",
            actions: ["up", "down", "delete"]
          }]
        }, this.sourceList);
        html.setStyle(this.sourceList.domNode, 'height', '100%');
        this.sourceList.startup();
        this.own(on(this.sourceList, 'row-select', lang.hitch(this, this._onSourceItemSelected)));
        this.own(on(this.sourceList, 'row-delete', lang.hitch(this, this._onSourceItemRemoved)));
        this.own(on(this.sourceList, 'row-edit', lang.hitch(this, this._onSourceItemChanged)));
        // this.showInfoWindowOnSelect = new CheckBox({
        //   checked: true,
        //   label: this.nls.showInfoWindowOnSelect2
        // }, this.showInfoWindowOnSelect);
        this.shelter = new LoadingShelter({
          hidden: true
        });
      },
      startup: function () {
        this.inherited(arguments);
        this.shelter.show();
        //this.config = this.config;
        LayerInfos.getInstance(this.map, this.map.itemInfo)
          .then(lang.hitch(this, function (layerInfosObj) {
            this.layerInfosObj = layerInfosObj;
            utils.setMap(this.map);
            utils.setLayerInfosObj(this.layerInfosObj);
            utils.setAppConfig(this.appConfig);
            ////////////////////////////////////////////
            ////////////////////////////////////////////
            this._upgradeConfig().then(lang.hitch(this, function () {
              when(utils.getConfigInfo(this.config.searchOptions)).then(lang.hitch(this, function (res) {
                if (!this.domNode) {
                  return;
                }
                this.setConfig(res);
                this.shelter.hide();
              }));
            }));
            ////////////////////////////////////////////
            ////////////////////////////////////////////
          }));
      },

      setConfig: function(res) {
        //this.config = config;
        var sources = res.sources;
        //this.allPlaceholder.set('value', jimuUtils.stripHTML(this.config.allPlaceholder));
        // this.showInfoWindowOnSelect.setValue(
        //   esriLang.isDefined(this.config.showInfoWindowOnSelect) ?
        //   !!this.config.showInfoWindowOnSelect : true);
        array.forEach(sources, lang.hitch(this, function(source, index) {
          var addResult = this.sourceList.addRow({
            name: source.name || "",
            type: source.type
          });

          if (addResult && addResult.success) {
            this._setRelatedConfig(addResult.tr, source);

            if (index === 0) {
              var firstTr = addResult.tr;
              setTimeout(lang.hitch(this, function() {
                this.sourceList.selectRow(addResult.tr);
                firstTr = null;
              }), 100);
            }
          } else {
            console.error("add row failed ", addResult);
          }
        }));
      },

      getConfig: function (isDestory) {
        if (this._currentSourceSetting) {
          var _isDestory = (true === isDestory ? true : false);
          this._closeSourceSetting(_isDestory); //only true need Destory
        }
        var config = {
          //allPlaceholder: jimuUtils.stripHTML(this.allPlaceholder.get('value')),
          //showInfoWindowOnSelect: this.showInfoWindowOnSelect.checked
        };
        var trs = this.sourceList.getRows();
        var sources = [];
        array.forEach(trs, lang.hitch(this, function (tr) {
          var source = this._getRelatedConfig(tr);
          if (isDestory) {
            delete source._definition;
            this._removeRelatedConfig(tr);
          }

          sources.push(source);
        }));

        config.sources = sources;
        return config;
      },

      destroy: function() {
        utils.setMap(null);
        utils.setLayerInfosObj(null);
        utils.setAppConfig(null);

        this.inherited(arguments);
      },

      validate: function() {
        // var isSearchLoading = false;
        // query(".searchLoading", this.domNode).forEach(lang.hitch(this, function() {
        //   isSearchLoading = true;
        //   return;
        // }));

        // if (false === isSearchLoading &&
        //   !html.hasClass(this.startSearch, this._ERROR_CLASS) &&
        //   !html.hasClass(this.endSearch, this._ERROR_CLASS)) {
        //   return true;
        // } else {
        //   return false;
        // }
        return true;
      },
      // _onAllPlaceholderBlur: function() {
      //   this.allPlaceholder.set('value', jimuUtils.stripHTML(this.allPlaceholder.get('value')));
      // },
      _onMenuItemClick: function(evt) {
        // check fields
        if (this._currentSourceSetting && !this._currentSourceSetting.isValidConfig()) {
          this._currentSourceSetting.showValidationTip();
          return;
        }

        var itemType = evt && evt.target && html.getAttr(evt.target, "type");
        if (itemType === "locator") {
          this._addNewLocator();
        } else if (itemType === "query") {
          this._addNewQuerySource();
        }
      },
      _addNewLocator: function() {
        this._createNewLocatorSourceSettingFromMenuItem({}, {});
      },

      _addNewQuerySource: function() {
        this._createNewQuerySourceSettingFromMenuItem({}, {});
      },
      _setRelatedConfig: function(tr, source) {
        query(tr).data('config', lang.clone(source));
      },

      _getRelatedConfig: function(tr) {
        return query(tr).data('config')[0];
      },

      _removeRelatedConfig: function(tr) {
        return query(tr).removeData('config');
      },

      _createNewLocatorSourceSettingFromMenuItem: function(setting, definition) {
        var locatorSetting = new LocatorSourceSetting({
          nls: this.nls,
          map: this.map
        });
        locatorSetting.setDefinition(definition);
        var config = {
          url: setting.url || "",
          name: setting.name || "",
          singleLineFieldName: setting.singleLineFieldName || "",
          placeholder: setting.placeholder || "",
          countryCode: setting.countryCode || "",
          maxSuggestions: setting.maxSuggestions,
          searchInCurrentMapExtent: !!setting.searchInCurrentMapExtent,
          type: "locator",
          maxLocations: setting.maxLocations,
          autoComplete: setting.autoComplete,
          searchDelay: setting.searchDelay,
          minCharacters: setting.minCharacters,
          _isUpgrade: setting._isUpgrade
        };
        this._upgradeGeocoderConfig(config);
        locatorSetting.setConfig(config);
        locatorSetting._openLocatorChooser();

        locatorSetting.own(
          on(locatorSetting, 'select-locator-url-ok', lang.hitch(this, function(item) {
            var addResult = this.sourceList.addRow({
              name: item.name || "New Geocoder",
              type: "locator"
            }, this.sourceList.getRows().length);
            if (addResult && addResult.success) {
              if (this._currentSourceSetting) {
                this._closeSourceSetting();
              }
              locatorSetting.setRelatedTr(addResult.tr);
              locatorSetting.placeAt(this.sourceSettingNode);
              this.sourceList.selectRow(addResult.tr);

              this._currentSourceSetting = locatorSetting;

              this._checkConfig();
            }
          }))
        );
        locatorSetting.own(
          on(locatorSetting, 'reselect-locator-url-ok', lang.hitch(this, function(item) {
            var tr = this._currentSourceSetting.getRelatedTr();
            this.sourceList.editRow(tr, {
              name: item.name,
              type: "locator"
            });

            this._checkConfig();
          }))
        );
        locatorSetting.own(
          on(locatorSetting, 'select-locator-url-cancel', lang.hitch(this, function() {
            if (this._currentSourceSetting !== locatorSetting) {// locator doesn't display in UI
              locatorSetting.destroy();
              locatorSetting = null;
            }
          }))
        );
      },

      _createNewLocatorSourceSettingFromSourceList: function(setting, definition, relatedTr) {
        if (this._currentSourceSetting) {
          this._closeSourceSetting();
        }

        this._currentSourceSetting = new LocatorSourceSetting({
          nls: this.nls,
          map: this.map
        });
        this._currentSourceSetting.setDefinition(definition);
        var config = {
          url: setting.url || "",
          name: setting.name || "",
          singleLineFieldName: setting.singleLineFieldName || "",
          placeholder: setting.placeholder || "",
          countryCode: setting.countryCode || "",
          maxSuggestions: setting.maxSuggestions,
          searchInCurrentMapExtent: !!setting.searchInCurrentMapExtent,
          enableLocalSearch: !!setting.enableLocalSearch,
          localSearchMinScale: setting.localSearchMinScale,
          localSearchDistance: setting.localSearchDistance,
          type: "locator",
          maxLocations: setting.maxLocations,
          autoComplete: setting.autoComplete,
          searchDelay: setting.searchDelay,
          minCharacters: setting.minCharacters,
          _isUpgrade: setting._isUpgrade
        };
        this._upgradeGeocoderConfig(config);
        this._currentSourceSetting.setConfig(config);
        this._currentSourceSetting.setRelatedTr(relatedTr);
        this._currentSourceSetting.placeAt(this.sourceSettingNode);
        this._currentSourceSetting._processlocalSearchTable(!!setting.enableLocalSearch);

        this._currentSourceSetting.own(
          on(this._currentSourceSetting,
            'reselect-locator-url-ok',
            lang.hitch(this, function(item) {
              var tr = this._currentSourceSetting.getRelatedTr();
              this.sourceList.editRow(tr, {
                name: item.name,
                type: "locator"
              });

              this._checkConfig();
            }))
        );
      },

      _closeSourceSetting: function(isDestory) {
        var tr = this._currentSourceSetting.getRelatedTr();
        var source = this._currentSourceSetting.getConfig();
        source._definition = this._currentSourceSetting.getDefinition();
        this._setRelatedConfig(tr, source);
        this.sourceList.editRow(tr, {
          name: source.name
        });

        if ("undefined" === typeof isDestory || true === isDestory) {
          this._currentSourceSetting.destroy();
        }
      },

      _createNewQuerySourceSettingFromMenuItem: function(setting, definition) {
        var querySetting = new QuerySourceSetting({
          nls: this.nls,
          map: this.map,
          appConfig: this.appConfig
        });
        querySetting.setDefinition(definition);
        var config = {
          url: setting.url,
          name: setting.name || "",
          layerId: setting.layerId,
          placeholder: setting.placeholder || "",
          searchFields: setting.searchFields || [],
          displayField: setting.displayField || definition.displayField || "",
          exactMatch: !!setting.exactMatch,
          maxSuggestions: setting.maxSuggestions,
          searchInCurrentMapExtent: !!setting.searchInCurrentMapExtent,
          type: "query",
          maxLocations: setting.maxLocations,
          autoComplete: setting.autoComplete,
          searchDelay: setting.searchDelay,
          minCharacters: setting.minCharacters,
          _isUpgrade: setting._isUpgrade
        };
        this._upgradeGeocoderConfig(config);
        querySetting.setConfig(config);
        querySetting._openQuerySourceChooser();

        querySetting.own(
          on(querySetting, 'select-query-source-ok', lang.hitch(this, function(item) {
            var addResult = this.sourceList.addRow({
              name: item.name,
              type: "query"
            }, 0);
            if (addResult && addResult.success) {
              if (this._currentSourceSetting) {
                this._closeSourceSetting();
              }
              querySetting.setRelatedTr(addResult.tr);
              querySetting.placeAt(this.sourceSettingNode);
              this.sourceList.selectRow(addResult.tr);

              this._currentSourceSetting = querySetting;
            }
          }))
        );
        querySetting.own(
          on(querySetting, 'reselect-query-source-ok', lang.hitch(this, function(item) {
            var tr = this._currentSourceSetting.getRelatedTr();
            this.sourceList.editRow(tr, {
              name: item.name
            });
          }))
        );
        querySetting.own(
          on(querySetting, 'select-query-source-cancel', lang.hitch(this, function() {
            if (this._currentSourceSetting !== querySetting) {// query source doesn't display in UI
              querySetting.destroy();
              querySetting = null;
            }
          }))
        );
      },

      _createNewQuerySourceSettingFromSourceList: function(setting, definition, relatedTr) {
        if (this._currentSourceSetting) {
          this._closeSourceSetting();
        }

        this._currentSourceSetting = new QuerySourceSetting({
          nls: this.nls,
          map: this.map,
          appConfig: this.appConfig
        });
        this._currentSourceSetting.placeAt(this.sourceSettingNode);
        this._currentSourceSetting.setDefinition(definition);
        var config = {
          url: setting.url,
          name: setting.name || "",
          layerId: setting.layerId,
          placeholder: setting.placeholder || "",
          searchFields: setting.searchFields || [],
          displayField: setting.displayField || definition.displayField || "",
          exactMatch: !!setting.exactMatch,
          maxSuggestions: setting.maxSuggestions,
          searchInCurrentMapExtent: !!setting.searchInCurrentMapExtent,
          type: "query",
          maxLocations: setting.maxLocations,
          autoComplete: setting.autoComplete,
          searchDelay: setting.searchDelay,
          minCharacters: setting.minCharacters,
          _isUpgrade: setting._isUpgrade
        };
        this._upgradeGeocoderConfig(config);
        this._currentSourceSetting.setConfig(config);
        this._currentSourceSetting.setRelatedTr(relatedTr);

        this._currentSourceSetting.own(
          on(this._currentSourceSetting, 'reselect-query-source', lang.hitch(this, function(item) {
            var tr = this._currentSourceSetting.getRelatedTr();
            this.sourceList.editRow(tr, {
              name: item.name
            });
          }))
        );
      },

      _onSourceItemRemoved: function(tr) {
        this._checkConfig();
        if (!this._currentSourceSetting) {
          return;
        }

        var currentTr = this._currentSourceSetting.getRelatedTr();
        if (currentTr === tr) {
          this._currentSourceSetting.destroy();
          this._currentSourceSetting = null;
        }
      },

      _onSourceItemChanged: function (/*tr*/){
        this._checkConfig();
      },

      //at last 1 geo locator
      _checkConfig: function (){
        if(false === this._hasGeoLocator()){
          this.emit('isConfigValid', "false");
        } else {
          this.emit('isConfigValid', "true");
        }
      },
      _hasGeoLocator: function (){
        var hasGeoLocator = false;
        var datas = this.sourceList.getData();
        array.some(datas, lang.hitch(this, function (data) {
          if(data && "locator" === data.type){
            hasGeoLocator = true;
            return true;
          }
        }));

        return hasGeoLocator;
      },

      _onSourceItemSelected: function(tr) {
        var config = this._getRelatedConfig(tr);
        var currentTr = this._currentSourceSetting && this._currentSourceSetting.tr;
        if (!config || tr === currentTr) {
          return;
        }

        // check fields
        if (this._currentSourceSetting && !this._currentSourceSetting.isValidConfig()) {
          this._currentSourceSetting.showValidationTip();
          this.sourceList.selectRow(currentTr);
          return;
        }

        if (config.type === "query") {
          this._createNewQuerySourceSettingFromSourceList(config, config._definition || {}, tr);
        } else if (config.type === "locator") {
          this._createNewLocatorSourceSettingFromSourceList(config, config._definition || {}, tr);
        }
      },

      /////////////////////////////////////////////////////////////
      /////////////////////////////////////////////////////////////
      _upgradeConfig: function(){
        var def = new Deferred();
        //turn oldConfig.GeocoderURL to newConfig.searchOptions
        var isOldConfig = utils.version.isConfigBefore63(this.config);
        var geocoders = [];
        var url = "";
        if (isOldConfig) {
          geocoders = (this.config.geocoderOptions && this.config.geocoderOptions.geocoders);
          if(geocoders && geocoders.length > 0){
            var s = geocoders[0];//only 1 in old config
            if (s && s.url) {
              url = s.url;
            }
          }
        }

        if (url) {
          utils.getSingleLineAddressName(url).then(lang.hitch(this, function (res) {
            if (res) {
              var sourcesArray = [];
              sourcesArray.push({
                type: "locator",
                url: url,
                name: utils.getGeocoderName(url),
                placeholder: s.placeholder || "",
                singleLineFieldName: res
              });

              this.config.searchOptions = {};
              this.config.searchOptions.sources = sourcesArray;

              def.resolve();
            } else if (null === res) {
              def.resolve(null);
              new Message({
                'message': this.nls.locatorWarning//unsupport geocoding service < 10.1
              });
            }
          }), lang.hitch(this, function(/*err*/){
            def.resolve(null);
          }));
        } else {
          def.resolve(null);
        }

        return def;
      },
      _upgradeGeocoderConfig: function (config) {
        if (this.config.geocoderOptions) {
          config._oldConfig = {};
          if(this.config.geocoderOptions.geocoders[0]){
            config._oldConfig.placeholder = this.config.geocoderOptions.geocoders[0].placeholder || "";
          }
          config._oldConfig.autoComplete = this.config.geocoderOptions.autoComplete;
          config._oldConfig.maxLocations = this.config.geocoderOptions.maxLocations;
          config._oldConfig.minCharacters = this.config.geocoderOptions.minCharacters;
          config._oldConfig.searchDelay = this.config.geocoderOptions.searchDelay;
        }
      }
    });
  });