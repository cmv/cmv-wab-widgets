(function () {
    var path = location.pathname.replace(/[^\/]+$/, '');
    window.dojoConfig = {
        locale: 'en-us',
        async: true,
        packages: [{
            name: 'viewer',
            location: 'https://cdn.rawgit.com/cmv/cmv-app/v2.0.0-beta.1/viewer/js/viewer'
        }, {
            name: 'gis',
            location: 'https://cdn.rawgit.com/cmv/cmv-app/v2.0.0-beta.1/viewer/js/gis'
        }, {
            name: 'proj4js',
            location: '//cdnjs.cloudflare.com/ajax/libs/proj4js/2.3.15'
        }, {
            name: 'flag-icon-css',
            location: '//cdnjs.cloudflare.com/ajax/libs/flag-icon-css/2.8.0'
        }, {
            name: 'widgets',
            location: path + 'widgets'
        /* customizations for WAB widgets */
        }, {
            name: 'jimu',
            location: path + 'wab/2.4/jimu.js'
        }, {
            name: 'libs',
            location: path + 'wab/2.4/libs'
        }, {
            name: 'wabwidgets',
            location: path + 'wab/2.4/widgets'
        /* end customizations for WAB widgets */
        }, {
            name: 'config',
            location: path + 'config'
        }]
    };

    require(window.dojoConfig, [
        'dojo/_base/declare',

        // minimal Base Controller
        'viewer/_ControllerBase',

        // *** Controller Mixins
        // Use the core mixins, add custom mixins
        // or replace core mixins with your own
        'viewer/_ConfigMixin', // manage the Configuration
        'viewer/_LayoutMixin', // build and manage the Page Layout and User Interface
        'viewer/_MapMixin', // build and manage the Map
        'viewer/_WidgetsMixin', // build and manage the Widgets

        'config/_WABMixin' // cusom mix-in to use WAB widgets

    ], function (
        declare,

        _ControllerBase,
        _ConfigMixin,
        _LayoutMixin,
        _MapMixin,
        _WidgetsMixin,

        _WABMixin

    ) {
        var App = declare([
            _LayoutMixin,
            _WidgetsMixin,
            _MapMixin,

            _WABMixin,

            _ConfigMixin,

            _ControllerBase

        ]);
        var app = new App();
        app.startup();
    });
})();