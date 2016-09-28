define([
    'dojo/_base/declare',
    'dojo/_base/lang',
    'dojo/_base/array',

    'jimu/WidgetManager',
    'jimu/ConfigManager',
    'jimu/MapManager',
    'jimu/LayerInfos/LayerInfos',

    'dojo/i18n!jimu/nls/main',

    'config/wabapp-config'

], function (
    declare,
    lang,
    array,

    WidgetManager,
    ConfigManager,
    MapManager,
    LayerInfos,

    mainBundle,

    wabConfig
) {

    return declare(null, {

        wabWidgetManager: null,

        configureWAB: function () {
            //minimal configuration of global vars
            // polluting the global namespace is bad! ;)
            window.jimuConfig = {
                layoutId: this.config.layout.map || 'mapCenter',
                breakPoints: [0]
            };
            window.jimuNls = mainBundle;
            window.isRTL = wabConfig.isRTL;

            var pathparts = window.location.pathname.split('/');
            pathparts.pop();
            window.appInfo = {
                appPath: pathparts.join('/') + '/'
            };

            // make the map look like a "webmap"
            if (!this.map.itemInfo) {
                this.createMapItemInfo();
            }
            LayerInfos.getInstance(this.map, this.map.itemInfo);

            // create a minimal configuration
            var cm = new ConfigManager();
            //wabConfig.map.layers = this.getOperationalLayers();
            wabConfig.map.mapOptions = this.config.mapOptions;
            cm.appConfig = cm._addDefaultValues(wabConfig);

            var mm = MapManager.getInstance({
                appConfig: cm.getAppConfig()
            });
            mm.map = this.map;

            this.wabWidgetManager = WidgetManager.getInstance();
            this.wabWidgetManager.map = this.map;
            this.wabWidgetManager.appConfig = cm.getAppConfig();
        },

        createMapItemInfo: function () {
            var basemap = this.map.getBasemap();
            this.map.itemInfo = {
                item: {
                    title: '',
                    description: ''
                },
                itemData: {
                    baseMap: {
                        baseMapLayers: this.getBaseMapLayers(),
                        title: basemap
                    },
                    operationLayers: this.getOperationalLayers(),
                    bookmarks: []
                }
            };
        },

        // get all the operational layers
        getOperationalLayers: function () {
            var layers = [], layer;
            array.forEach(this.config.operationalLayers, lang.hitch(this, function (opLayer) {
                layer = this.map.getLayer(opLayer.options.id);
                if (layer) {
                    layers.push({
                        id: layer.id,
                        opacity: layer.opacity,
                        title: opLayer.title,
                        url: layer.url,
                        visibility: layer.visibility
                    });
                }
            }));
            return layers;
        },

        // get the basemap layer(s)
        getBaseMapLayers: function () {
            var layers = [], layer;
            array.forEach(this.map.basemapLayerIds, lang.hitch(this, function (layerId) {
                layer = this.map.getLayer(layerId);
                if (layer) {
                    layers.push({
                        id: layer.id,
                        opacity: layer.opacity,
                        url: layer.url,
                        visibility: layer.visibility
                    });
                }
            }));
            return layers;
        }
    });
});