define([], function () {

    return {

        isDebug: true,

        mapOptions: {
            basemap: 'satellite',
            center: [-96.59179687497497, 39.09596293629694],
            zoom: 5,
            sliderStyle: 'small'
        },

        titles: {
            header: 'CMV WAB Widgets Test',
            subHeader: 'This is an example of using Web App Builder widgets with CMV',
            pageTitle: 'CMV WAB Widgets Test'
        },

        panes: {
            left: {
                splitter: true,
                style: 'width:360px;'
            }
        },
        collapseButtonsPane: 'center', //center or outer

        operationalLayers: [],

        widgets: {
            eMeasure: {
                include: true,
                id: 'eMeasure',
                type: 'titlePane',
                position: 0,
                title: 'Enhanced Measure',
                open: true,
                path: 'jimu/BaseWidgetPanel',
                options: {
                    widgetManager: true,
                    config: {
                        widgets: [
                            {
                                id: 'WABMeasure',
                                uri: 'widgets/Measure/Widget'
                            }
                        ]
                    }
                }
            },
            saveSession: {
                include: true,
                id: 'saveSession',
                type: 'titlePane',
                position: 0,
                title: 'Save Session',
                open: true,
                path: 'jimu/BaseWidgetPanel',
                options: {
                    widgetManager: true,
                    config: {
                        widgets: [
                            {
                                id: 'WABSaveSession',
                                uri: 'widgets/SaveSession/Widget',
                                config: {
                                    fileNameForAllSessions: 'cmvSessions.json',
                                    fileNameTplForSession: 'cmvSessions_${name}.json'
                                }
                            }
                        ]
                    }
                }
            }
        }
    };
});