define([
    'esri/config'
], function (esriConfig) {

    // url to your proxy page, must be on same machine hosting you app. See proxy folder for readme.
    esriConfig.defaults.io.proxyUrl = '/proxy/proxy.ashx';

    return {

        isDebug: true,

        mapOptions: {
            basemap: 'topo',
            center: [35, 30],
            zoom: 3,
            sliderStyle: 'small'
        },

        titles: {
            header: 'Add Layer WAB Widget',
            subHeader: 'This is an example of using Web App Builder widgets with CMV',
            pageTitle: 'Add Layer WAB Widget'
        },

        panes: {
            left: {
                splitter: true,
                style: 'width:380px;'
            }
        },
        collapseButtonsPane: 'center', //center or outer

        operationalLayers: [],

        widgets: {
            widget: {
                include: true,
                id: 'widget',
                type: 'titlePane',
                position: 0,
                title: 'Add Layer',
                canFloat: true,
                resizable: true,
                open: true,
                path: 'jimu/BaseWidgetPanel',
                options: {
                    widgetManager: true,
                    config: {
                        widgets: [
                            {
                                id: 'WABWidget',
                                uri: 'widgets/AddLayer/Widget'
                            }
                        ]
                    }
                }
            }
        }
    };
});