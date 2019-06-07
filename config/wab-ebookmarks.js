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
            header: 'eBookmarks WAB Widget',
            subHeader: 'This is an example of using Web App Builder widgets with CMV',
            pageTitle: 'eBookmarks WAB Widget'
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
                title: 'Enhanced Bookmarks',
                iconClass: 'fas fa-bookmark',
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
                                uri: 'widgets/eBookmark/Widget'
                            }
                        ]
                    }
                }
            }
        }
    };
});