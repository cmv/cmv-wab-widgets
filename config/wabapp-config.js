define({
    'wabVersion': '2.15',
    'theme': {
        'name': 'cmv'
    },
    'isRTL': false,
    'httpProxy': {
        'useProxy': false,
        'alwaysUseProxy': false,
        'url': '',
        'rules': [{
            'urlPrefix': '',
            'proxyUrl': ''
        }]
    },
    'geometryService': 'https://utility.arcgisonline.com/arcgis/rest/services/Geometry/GeometryServer',
    'map': {
        'id': 'map',
        '2D': true,
        '3D': false,
        'itemId': '8bf7167d20924cbf8e25e7b11c7c502c', // ESRI Streets Basemap
        'portalUrl': 'https://www.arcgis.com/'
    },
    'portalUrl': 'https://www.arcgis.com/'
});