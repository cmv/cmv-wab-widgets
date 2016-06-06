define([
    'dojo/_base/declare',
    'dojo/_base/lang',
    'dojo/_base/array',
    'dojo/topic',
    'dojo/aspect',
    'put-selector',
    'dijit/Menu',

    'jimu/WidgetManager',
    'jimu/ConfigManager',
    'dojo/i18n!jimu/nls/main'

], function (
    declare,
    lang,
    array,
    topic,
    aspect,
    put,
    Menu,

    WidgetManager,
    ConfigManager,
    mainBundle
) {

    return declare(null, {

        createWidget: function (widgetConfig, options, WidgetClass) {
            // set any additional options
            if (widgetConfig.id) {
                options.id = widgetConfig.id + '_widget';
            }
            options.parentWidget = widgetConfig.parentWidget;

            //replace config map, layerInfos arrays, etc
            if (options.map) {
                options.map = this.map;
            }
            if (options.mapRightClickMenu) {
                // create right-click menu
                if (!this.mapRightClickMenu) {
                    this.mapRightClickMenu = new Menu({
                        targetNodeIds: [this.map.root],
                        selector: '.esriMapLayers' // restrict to map only
                    });
                    this.mapRightClickMenu.startup();
                }
                options.mapRightClickMenu = this.mapRightClickMenu;
            }
            if (options.mapClickMode) {
                options.mapClickMode = this.mapClickMode.current;
            }
            if (options.legendLayerInfos) {
                options.layerInfos = this.legendLayerInfos;
            }
            if (options.layerControlLayerInfos) {
                options.layerInfos = this.layerControlLayerInfos;
            }
            if (options.editorLayerInfos) {
                options.layerInfos = this.editorLayerInfos;
            }
            if (options.identifyLayerInfos) {
                options.layerInfos = this.identifyLayerInfos;
            }

            /* customizations for WAB widgets */
            if (options.widgetManager) {
                if (!this.widgetManager) {
                    this.createWidgetManager();
                }
                options.widgetManager = this.widgetManager;
            }
            /* end customizations for WAB widgets */

            // create the widget
            var pnl = options.parentWidget;
            if ((widgetConfig.type === 'titlePane' || widgetConfig.type === 'contentPane' || widgetConfig.type === 'floating')) {
                this[widgetConfig.id] = new WidgetClass(options, put('div')).placeAt(pnl.containerNode);
            } else if (widgetConfig.type === 'domNode') {
                this[widgetConfig.id] = new WidgetClass(options, widgetConfig.srcNodeRef);
            } else {
                this[widgetConfig.id] = new WidgetClass(options);
            }

            // start up the widget
            if (this[widgetConfig.id] && this[widgetConfig.id].startup && !this[widgetConfig.id]._started) {
                this[widgetConfig.id].startup();
            }
        },

        createWidgetManager: function () {
            //minimal configuration of global vars
            // polluting the global namespace is bad! ;)
            window.jimuConfig = {
                layoutId: this.config.layout.map || 'mapCenter',
                breakPoints: [0]
            };
            window.jimuNls = mainBundle;
            window.isRTL = false;
            window.appInfo = {};

            this.widgetManager = WidgetManager.getInstance();
            this.widgetManager.map = this.map;

            // create a minimal configuration
            var cm = new ConfigManager();
            cm.appConfig = {
                theme: {
                    name: 'cmv'
                },
                map: {},
                portalUrl: 'https://www.arcgis.com/'
            };
            this.widgetManager.appConfig = cm.getAppConfig();

            // make the map look like a "webmap"
            if (!this.map.itemInfo) {
                this.createMapItemInfo();
            }

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

        createMapItemInfo: function () {
            var layers = [], basemapLayers = [], layer;

            // add all the operational layers
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

            // add the basemap layer(s)
            var basemap = this.map.getBasemap();
            array.forEach(this.map.basemapLayerIds, lang.hitch(this, function (layerId) {
                layer = this.map.getLayer(layerId);
                if (layer) {
                    basemapLayers.push({
                        id: layer.id,
                        opacity: layer.opacity,
                        url: layer.url,
                        visibility: layer.visibility
                    });
                }
            }));

            this.map.itemInfo = {
                item: {
                    title: '',
                    description: ''
                },
                itemData: {
                    baseMap: {
                        baseMapLayers: basemapLayers,
                        title: basemap
                    },
                    operationLayers: layers,
                    bookmarks: []
                }
            };
        }

    });
});