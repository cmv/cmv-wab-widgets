define([], function () {

    return {

        isDebug: true,

        mapOptions: {
            basemap: 'topo',
            center: [35, 30],
            zoom: 3,
            sliderStyle: 'small'
        },

        titles: {
            header: 'Aloha Threat Zone Widget Preview',
            subHeader: 'This is an example of using Web App Builder widgets with CMV',
            pageTitle: 'Aloha Threat Zone Widget Preview'
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
                title: 'Aloha Threat Zone',
                canFloat: true,
                resizable: true,
                open: true,
                path: 'jimu/BaseWidgetPanel',
                options: {
                    widgetManager: true,
                    style: 'height:400px;',
                    config: {
                        widgets: [
                            {
                                id: 'WABWidget',
                                uri: 'widgets/AlohaThreatZone/Widget'
                            }
                        ]
                    }
                }
            }
        }
    };
});