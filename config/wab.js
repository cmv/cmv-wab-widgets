define([
    'esri/units',
    'dojo/sniff'
], function (esriUnits, has) {

    return {

        isDebug: true,

        mapOptions: {
            basemap: 'hybrid',
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
                splitter: !has('touch'),
                style: 'width:340px;'
            }
        },
        collapseButtonsPane: 'center', //center or outer

        operationalLayers: [
            {
                type: 'dynamic',
                url: 'https://sampleserver6.arcgisonline.com/arcgis/rest/services/DamageAssessment/MapServer',
                title: 'Damage Assessment',
                options: {
                    id: 'DamageAssessment',
                    opacity: 1.0,
                    visible: true
                }
            }
        ],

        widgets: {
            coordinates: {
                include: true,
                id: 'coordinates',
                type: 'domNode',
                srcNodeRef: 'mapInfoDijit',
                path: 'jimu/BaseWidgetPanel',
                options: {
                    widgetManager: true,
                    config: {
                        widgets: [
                            {
                                id: 'WABCoordinate',
                                uri: 'wabwidgets/Coordinate/Widget'
                            }
                        ]
                    }
                }
            },
            mapButtons: {
                include: true,
                id: 'mapButtons',
                type: 'domNode',
                srcNodeRef: 'homeButton',
                path: 'jimu/BaseWidgetPanel',
                options: {
                    widgetManager: true,
                    config: {
                        // a BaseWidgetPanel can have multiple widgets
                        widgets: [
                            {
                                id: 'WABHome',
                                uri: 'wabwidgets/HomeButton/Widget'
                            },
                            {
                                id: 'WABMyLocation',
                                uri: 'wabwidgets/MyLocation/Widget'
                            }
                        ]
                    }
                }
            },
            basemapGallery: {
                include: true,
                id: 'basemapGallery',
                type: 'titlePane',
                position: 0,
                title: 'Basemap Gallery',
                iconClass: 'fa-map',
                open: false,
                path: 'jimu/BaseWidgetPanel',
                options: {
                    widgetManager: true,
                    config: {
                        widgets: [
                            {
                                id: 'WABBasemapGallery',
                                uri: 'wabwidgets/BasemapGallery/Widget'
                            }
                        ]
                    }
                }
            },
            bookmarks: {
                include: true,
                id: 'bookmark',
                type: 'titlePane',
                position: 0,
                title: 'Bookmarks',
                iconClass: 'fa-bookmark',
                open: false,
                path: 'jimu/BaseWidgetPanel',
                options: {
                    widgetManager: true,
                    config: {
                        widgets: [
                            {
                                id: 'WABBookmarks',
                                uri: 'wabwidgets/Bookmark/Widget'
                            }
                        ]
                    }
                }
            },
            chart: {
                include: true,
                id: 'chart',
                type: 'titlePane',
                position: 1,
                title: 'Charts',
                iconClass: 'fa-bar-chart',
                open: false,
                canFloat: true,
                resizable: true,
                path: 'jimu/BaseWidgetPanel',
                options: {
                    widgetManager: true,
                    style: 'min-height: 400px;',
                    config: {
                        widgets: [
                            {
                                id: 'WABChart',
                                uri: 'wabwidgets/Chart/Widget',
                                version: '2.1',
                                config: 'config/chart.json'
                            }
                        ]
                    }
                }
            },
            directions: {
                include: true,
                id: 'direction',
                type: 'titlePane',
                position: 2,
                title: 'Directions',
                iconClass: 'fa-map-signs',
                open: false,
                path: 'jimu/BaseWidgetPanel',
                options: {
                    widgetManager: true,
                    config: {
                        widgets: [
                            {
                                id: 'WABdirections',
                                uri: 'wabwidgets/Directions/Widget',
                                config: {
                                    routeTaskUrl: 'https://sampleserver3.arcgisonline.com/ArcGIS/rest/services/Network/USA/NAServer/Route',
                                    routeParams: {
                                        directionsLanguage: 'en-US',
                                        directionsLengthUnits: esriUnits.MILES
                                    },
                                    geocoderOptions: {
                                        geocoders: [
                                            {
                                                url: 'https://geocode.arcgis.com/arcgis/rest/services/World/GeocodeServer'
                                            }
                                        ]
                                    }
                                }
                            }
                        ]
                    }
                }
            },
            draw: {
                include: true,
                id: 'draw',
                type: 'titlePane',
                position: 3,
                title: 'Draw',
                iconClass: 'fa-paint-brush',
                open: false,
                path: 'jimu/BaseWidgetPanel',
                options: {
                    widgetManager: true,
                    config: {
                        widgets: [
                            {
                                id: 'WABDraw',
                                uri: 'wabwidgets/Draw/Widget'
                            }
                        ]
                    }
                }
            },
            layerList: {
                include: true,
                id: 'layerList',
                type: 'titlePane',
                position: 4,
                title: 'LayerList',
                iconClass: 'fa-th-list',
                open: false,
                path: 'jimu/BaseWidgetPanel',
                options: {
                    widgetManager: true,
                    style: 'min-height: 200px;',
                    config: {
                        widgets: [
                            {
                                id: 'WABLayerList',
                                uri: 'wabwidgets/LayerList/Widget'
                            }
                        ]
                    }
                }
            },
            legend: {
                include: true,
                id: 'legend',
                type: 'titlePane',
                position: 5,
                title: 'Legend',
                iconClass: 'fa-picture-o',
                open: false,
                path: 'jimu/BaseWidgetPanel',
                options: {
                    widgetManager: true,
                    config: {
                        widgets: [
                            {
                                id: 'WABLegend',
                                uri: 'wabwidgets/Legend/Widget',
                                config: {
                                    legend: {
                                        arrangement: 0,
                                        autoUpdate: true,
                                        respectCurrentMapScale: true
                                    }
                                }
                            }
                        ]
                    }
                }
            },
            measurement: {
                include: true,
                id: 'measurement',
                type: 'titlePane',
                position: 6,
                title: 'Measurement',
                iconClass: 'fa-expand',
                open: false,
                path: 'jimu/BaseWidgetPanel',
                options: {
                    widgetManager: true,
                    config: {
                        widgets: [
                            {
                                id: 'WABMeasurement',
                                uri: 'wabwidgets/Measurement/Widget',
                                config: {
                                    measurement: {
                                        defaultLengthUnit: esriUnits.FEET,
                                        defaultAreaUnit: esriUnits.ACRES
                                    }
                                }
                            }
                        ]
                    }
                }
            },
            print: {
                include: true,
                id: 'print',
                type: 'titlePane',
                position: 7,
                title: 'Print',
                iconClass: 'fa-print',
                open: false,
                path: 'jimu/BaseWidgetPanel',
                options: {
                    widgetManager: true,
                    config: {
                        widgets: [
                            {
                                id: 'WABPrint',
                                uri: 'wabwidgets/Print/Widget',
                                config: {
                                    serviceURL: '//utility.arcgisonline.com/arcgis/rest/services/Utilities/PrintingTools/GPServer/Export%20Web%20Map%20Task',
                                    defaultTitle: 'ArcGIS WebMap',
                                    defaultAuthor: '',
                                    defaultCopyright: '',
                                    defaultFormat: 'PDF',
                                    defaultLayout: 'Letter ANSI A Landscape'
                                }
                            }
                        ]
                    }
                }
            },
            query: {
                include: true,
                id: 'query',
                type: 'titlePane',
                position: 8,
                title: 'Query',
                iconClass: 'fa-search',
                open: false,
                path: 'jimu/BaseWidgetPanel',
                options: {
                    widgetManager: true,
                    config: {
                        widgets: [
                            {
                                id: 'WABQuery',
                                uri: 'wabwidgets/Query/Widget',
                                config: {
                                    queries: [
                                        {
                                            name: 'Cities',
                                            url: 'https://sampleserver6.arcgisonline.com/arcgis/rest/services/SampleWorldCities/MapServer/0',
                                            filter: {
                                                logicalOperator: 'AND',
                                                parts: [
                                                    {
                                                        fieldObj: {
                                                            name: 'POP_RANK',
                                                            label: 'POP_RANK',
                                                            shortType: 'number',
                                                            type: 'esriFieldTypeInteger'
                                                        },
                                                        operator: 'numberOperatorIs',
                                                        valueObj: {
                                                            isValid: true,
                                                            type: 'value',
                                                            value: 3
                                                        },
                                                        interactiveObj: '',
                                                        caseSensitive: false,
                                                        expr: 'POP_RANK = 3'
                                                    }
                                                ],
                                                expr: 'POP_RANK = 3'
                                            },
                                            popup: {
                                                title: '${CITY_NAME}',
                                                fields: [
                                                    {
                                                        name: 'CITY_NAME',
                                                        alias: 'CITY_NAME',
                                                        specialType: 'none'
                                                    }
                                                ]
                                            },
                                            resultsSymbol: {
                                                color: [
                                                    0,
                                                    0,
                                                    128,
                                                    128
                                                ],
                                                size: 18,
                                                angle: 0,
                                                xoffset: 0,
                                                yoffset: 0,
                                                type: 'esriSMS',
                                                style: 'esriSMSCircle',
                                                outline: {
                                                    color: [
                                                        0,
                                                        0,
                                                        128,
                                                        255
                                                    ],
                                                    width: 0.75,
                                                    type: 'esriSLS',
                                                    style: 'esriSLSSolid'
                                                }
                                            },
                                            objectIdField: 'OBJECTID',
                                            orderByFields: []
                                        }
                                    ]
                                }
                            }
                        ]
                    }
                }
            }
        }
    };
});