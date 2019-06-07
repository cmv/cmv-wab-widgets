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
            header: 'Enhanced Query WAB Widget',
            subHeader: 'This is an example of using Web App Builder widgets with CMV',
            pageTitle: 'Enhanced Query WAB Widget'
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
                title: 'Enhanced Query',
                iconClass: 'fas fa-search',
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
                                uri: 'widgets/EnhancedQuery/Widget'
                            }
                        ]
                    }
                }
            }
        }
    };
});