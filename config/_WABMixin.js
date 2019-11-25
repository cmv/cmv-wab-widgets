define([
    'dojo/_base/declare',
    'dojo/_base/lang',
    'dojo/_base/array',
    'dojo/topic',
    'dojo/aspect',

    'jimu/WidgetManager',
    'jimu/ConfigManager',
    'jimu/MapManager',
    'jimu/utils',
    'jimu/LayerInfos/LayerInfos',

    'jimu/DataSourceManager',
    'jimu/FeatureActionManager',
    'jimu/FilterManager',
    'jimu/PopupManager',
    'jimu/SelectionManager',
    'jimu/SyncManager',

    'dojo/i18n!jimu/nls/main',
    'esri/main',

    'config/wabapp-config'

], function (
    declare,
    lang,
    array,
    topic,
    aspect,

    WidgetManager,
    ConfigManager,
    MapManager,
    jimuUtils,
    LayerInfos,

    DataSourceManager,
    FilterManager,
    FeatureActionManager,
    PopupManager,
    SelectionManager,
    SyncManager,

    mainBundle,
    esriMain,

    wabConfig
) {

    return declare(null, {

        wabWidgetManager: null,

        startup: function () {
            this.inherited(arguments);

            var themeLinkIid = 'theme_' + wabConfig.theme.name + '_style_common';
            if (!document.getElementById(themeLinkIid)) {
                throw new Error('WAB Widgets require the cmv app.css file to have an id of "' + themeLinkIid + '"');
            }

            if (this.mapDeferred) {
                this.mapDeferred.then(lang.hitch(this, '_configureWAB'));
            }
            aspect.after(this, '_setWidgetOptions', function (options) {
                if (options.widgetManager && this.wabWidgetManager) {
                    options.widgetManager = this.wabWidgetManager;

                    /*
                        needed to support generic 'BaseWidgetPanel'
                        which broke at WAB version 2.13
                    */
                    if (options.config && options.config.widgets && options.config.widgets.length > 1) {
                        options._addTagToGroupPanel = function () {};
                    }

                    if (options.parentWidget && options.parentWidget.toggleable) {
                        aspect.after(options.parentWidget, 'toggle', lang.hitch(this, function () {
                            this._toggleWABChildWidgets(options);
                        }));
                    }
                }
                return options;
            });
        },

        _configureWAB: function () {
            //minimal configuration of global vars
            // polluting the global namespace is bad! ;)
            window.jimuConfig = window.jimuConfig || {
                layoutId: this.config.layout.map || 'mapCenter',
                breakPoints: [0]
            };
            window.jimuNls = window.jimuNls || mainBundle;
            window.apiNls = window.apiNls || esriMain.bundle;
            window.isRTL = window.isRTL || wabConfig.isRTL;
            window.wabVersion = wabConfig.wabVersion;
            window.deployVersion = wabConfig.wabVersion;

            var pathparts = window.location.pathname.split('/');
            pathparts.pop();
            window.appInfo = {
                appPath: pathparts.join('/') + '/'
            };

            window.queryObject = window.queryObject || {
                ismain: true
            };

            // make the map look like a "webmap"
            if (!this.map.itemInfo) {
                this._createMapItemInfo();
            }
            LayerInfos.getInstance(this.map, this.map.itemInfo);

            //wabConfig.map.layers = this.getOperationalLayers();
            wabConfig.map.mapOptions = this.config.mapOptions;
            if (!window.portalUrl && wabConfig.map.portalUrl) {
                window.portalUrl = wabConfig.map.portalUrl;
            }

            // create a minimal configuration
            var appConfig = this._createAppConfig();
            window.appConfig = appConfig;

            var mm = MapManager.getInstance({
                appConfig: appConfig
            });
            mm.map = this.map;
            mm.resetInfoWindow(true);

            this.wabWidgetManager = WidgetManager.getInstance();
            this.wabWidgetManager._onAppConfigLoaded(appConfig);
            this.wabWidgetManager._onMapLoaded(this.map);

            // Initialize all the jimu "Managers"
            var managers = [DataSourceManager, FeatureActionManager, FilterManager, PopupManager, SelectionManager, SyncManager];
            array.forEach(managers, lang.hitch(this, function (manager) {
                var mgr = manager.getInstance();
                if (mgr._onAppConfigLoaded) {
                    mgr._onAppConfigLoaded(appConfig);
                }
                if (mgr._onMapLoaded) {
                    mgr._onMapLoaded(this.map);
                } else if (mgr.onMapLoadedOrChanged) { // For PopupManager
                    mgr.onMapLoadedOrChanged(this.map);
                }
            }));

            // tap into the map's infoWindowOnClick method
            if (this.mapClickMode.defaultMode === 'identify') {
                aspect.after(this.map, 'setInfoWindowOnClick', lang.hitch(this, function () {
                    var enabled = this.map._params.showInfoWindowOnClick;
                    if (enabled) {
                        topic.publish('mapClickMode/setDefault');
                    } else {
                        topic.publish('mapClickMode/setCurrent', 'none');
                    }
                }));
            }
        },

        _createAppConfig: function () {
            var cm = new ConfigManager();
            var appConfig = cm._addDefaultValues(wabConfig);
            appConfig.getConfigElementById = lang.hitch(cm, function (id) {
                return jimuUtils.getConfigElementById(this, id);
            });

            appConfig.getConfigElementsByName = lang.hitch(cm, function (name) {
                return jimuUtils.getConfigElementsByName(this, name);
            });

            appConfig.visitElement = lang.hitch(cm, function (cb) {
                jimuUtils.visitElement(this, cb);
            });
            appConfig.dataSource = {
                dataSources: []
            };

            cm.appConfig = appConfig;

            return appConfig;
        },

        _createMapItemInfo: function () {
            var basemap = this.map.getBasemap();
            this.map.itemInfo = {
                item: {
                    title: '',
                    description: ''
                },
                itemData: {
                    baseMap: {
                        baseMapLayers: this._getBaseMapLayers(),
                        title: basemap
                    },
                    operationalLayers: this._getOperationalLayers(),
                    bookmarks: []
                }
            };
        },

        // get all the operational layers
        _getOperationalLayers: function () {
            var layers = [], layer = null;
            array.forEach(this.config.operationalLayers, lang.hitch(this, function (opLayer) {
                layer = this.map.getLayer(opLayer.options.id);
                if (layer) {
                    layers.push({
                        id: layer.id,
                        layerObject: layer,
                        opacity: layer.opacity,
                        title: opLayer.title,
                        url: layer.url,
                        visibility: layer.visible
                    });
                }
            }));
            return layers;
        },

        // get the basemap layer(s)
        _getBaseMapLayers: function () {
            var layers = [], layer = null;
            array.forEach(this.map.basemapLayerIds, lang.hitch(this, function (layerId) {
                layer = this.map.getLayer(layerId);
                if (layer) {
                    layers.push({
                        id: layer.id,
                        layerObject: layer,
                        opacity: layer.opacity,
                        url: layer.url,
                        visibility: layer.visibility
                    });
                }
            }));
            return layers;
        },

        _toggleWABChildWidgets: function (options) {
            var widgets = (options.config && options.config.widgets) ? options.config.widgets : [];
            array.forEach(widgets, lang.hitch(this, function (widget) {
                if (options.parentWidget.open) {
                    options.widgetManager.openWidget(widget.id);
                } else {
                    options.widgetManager.closeWidget(widget.id);
                }
            }));
        }
    });
});
